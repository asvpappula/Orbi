import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { stitchContext } from "@/lib/ai/contextStitch";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { user } = await getAuthenticatedContext();
    const body = (await request.json()) as {
      itemId?: string;
      itemType?: "canvas" | "gmail";
    };
    if (!body.itemId || !["canvas", "gmail"].includes(body.itemType ?? "")) {
      return Response.json({ error: "Valid itemId and itemType are required" }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(
          encoder.encode(`${JSON.stringify({ type: "status", message: "Finding related context" })}\n`),
        );
        try {
          const result = await stitchContext(user.id, body.itemId!, body.itemType!);
          controller.enqueue(
            encoder.encode(`${JSON.stringify({ type: "result", data: result })}\n`),
          );
          controller.close();
        } catch (error) {
          controller.enqueue(
            encoder.encode(
              `${JSON.stringify({ type: "error", error: error instanceof Error ? error.message : "Context stitching failed" })}\n`,
            ),
          );
          controller.close();
        }
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "application/x-ndjson; charset=utf-8" },
    });
  } catch (error) {
    return apiError(error);
  }
}
