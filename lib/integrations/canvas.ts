import { assertUserId } from "@/lib/auth/server";
import { decryptSecret, encryptSecret } from "@/lib/security/encryption";

type CanvasCourse = {
  id: number;
  name: string;
  course_code?: string;
};

type CanvasAssignment = {
  id: number;
  name: string;
  description?: string | null;
  due_at?: string | null;
  points_possible?: number | null;
  html_url?: string;
  submission?: { workflow_state?: string };
};

type CanvasAssignmentWithCourse = CanvasAssignment & {
  course_id: number;
  course_name: string;
};

function normalizeCanvasDomain(domain: string) {
  const value = domain.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
  const url = new URL(`https://${value}`);
  const hostname = url.hostname.toLowerCase();

  if (
    url.protocol !== "https:" ||
    hostname === "localhost" ||
    hostname.endsWith(".local") ||
    /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)
  ) {
    throw new Error("Enter a valid public Canvas domain");
  }

  return hostname;
}

function nextLink(header: string | null) {
  if (!header) return null;
  for (const part of header.split(",")) {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match?.[2] === "next") return match[1];
  }
  return null;
}

async function fetchPaginated<T>(url: string, token: string) {
  const items: T[] = [];
  let next: string | null = url;
  let pages = 0;

  while (next && pages < 50) {
    const response: Response = await fetch(next, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Canvas request failed (${response.status})`);
    }

    items.push(...((await response.json()) as T[]));
    next = nextLink(response.headers.get("link"));
    pages += 1;
  }

  return items;
}

async function canvasCredentials(userId: string) {
  const { supabase } = await assertUserId(userId);
  const { data, error } = await supabase
    .from("user_integrations")
    .select("canvas_domain, access_token")
    .eq("user_id", userId)
    .eq("integration_name", "canvas")
    .single();

  if (error || !data?.canvas_domain || !data.access_token) {
    throw new Error("Canvas is not connected");
  }

  const token = decryptSecret(data.access_token);
  if (!token) throw new Error("Canvas credentials are unavailable");

  return { domain: normalizeCanvasDomain(data.canvas_domain), token };
}

export async function saveCanvasCredentials(
  userId: string,
  domain: string,
  token: string,
) {
  const { supabase } = await assertUserId(userId);
  const canvasDomain = normalizeCanvasDomain(domain);

  if (!token.trim()) throw new Error("Canvas token is required");

  const response = await fetch(`https://${canvasDomain}/api/v1/users/self`, {
    headers: { Authorization: `Bearer ${token.trim()}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Canvas rejected those credentials");

  const { error } = await supabase.from("user_integrations").upsert(
    {
      user_id: userId,
      integration_name: "canvas",
      access_token: encryptSecret(token.trim()),
      canvas_domain: canvasDomain,
      connected_at: new Date().toISOString(),
    },
    { onConflict: "user_id,integration_name" },
  );

  if (error) throw new Error(error.message);
}

export async function fetchCourses(userId: string) {
  const { domain, token } = await canvasCredentials(userId);
  return fetchPaginated<CanvasCourse>(
    `https://${domain}/api/v1/courses?enrollment_state=active&per_page=100`,
    token,
  );
}

export async function fetchAssignments(userId: string) {
  const { domain, token } = await canvasCredentials(userId);
  const courses = await fetchPaginated<CanvasCourse>(
    `https://${domain}/api/v1/courses?enrollment_state=active&per_page=100`,
    token,
  );

  const assignments = await Promise.all(
    courses.map(async (course) => {
      const values = await fetchPaginated<CanvasAssignment>(
        `https://${domain}/api/v1/courses/${course.id}/assignments?per_page=100&include[]=submission`,
        token,
      );
      return values.map(
        (assignment): CanvasAssignmentWithCourse => ({
          ...assignment,
          course_id: course.id,
          course_name: course.name,
        }),
      );
    }),
  );

  return assignments.flat();
}

export async function syncCanvas(userId: string) {
  const { supabase } = await assertUserId(userId);
  const assignments = await fetchAssignments(userId);
  const fetchedAt = new Date().toISOString();

  if (assignments.length) {
    const { error } = await supabase.from("canvas_items").upsert(
      assignments.map((assignment) => ({
        user_id: userId,
        canvas_id: String(assignment.id),
        type: "assignment",
        title: assignment.name,
        course_name: assignment.course_name,
        due_date: assignment.due_at,
        points: assignment.points_possible,
        description: assignment.description ?? "",
        status: assignment.submission?.workflow_state ?? "todo",
        fetched_at: fetchedAt,
      })),
      { onConflict: "user_id,canvas_id" },
    );

    if (error) throw new Error(error.message);
  }

  return { synced: assignments.length, fetchedAt };
}
