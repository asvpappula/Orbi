import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getAuthenticatedContext } from "@/lib/auth/server";
import { sendEmail } from "@/lib/integrations/gmail";

export async function POST(request: Request) {
  try {
    const { user } = await getAuthenticatedContext();
    const body = (await request.json()) as {
      to?: string;
      subject?: string;
      body?: string;
      threadId?: string;
    };

    if (!body.to || !body.subject || !body.body) {
      return NextResponse.json(
        { error: "To, subject, and body are required" },
        { status: 400 },
      );
    }

    const message = await sendEmail(
      user.id,
      body.to,
      body.subject,
      body.body,
      body.threadId,
    );
    return NextResponse.json({ ok: true, messageId: message.id });
  } catch (error) {
    return apiError(error);
  }
}
