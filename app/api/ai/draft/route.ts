import { apiError } from "@/lib/api";
import { createReplyDraftStream } from "@/lib/ai/replyDraft";
import { getAuthenticatedContext } from "@/lib/auth/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { user } = await getAuthenticatedContext();
    const body = (await request.json()) as {
      message?: string;
      subject?: string;
      recipient?: string;
      tone?: "casual" | "professional" | "short" | "detailed";
    };
    if (!body.message || !body.subject) {
      return Response.json({ error: "Message and subject are required" }, { status: 400 });
    }
    const tone = body.tone ?? "casual";
    if (!["casual", "professional", "short", "detailed"].includes(tone)) {
      return Response.json({ error: "Invalid tone" }, { status: 400 });
    }

    const stream = await createReplyDraftStream(user.id, {
      message: body.message,
      subject: body.subject,
      recipient: body.recipient ?? "",
      tone,
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
