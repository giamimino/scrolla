import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const userCache = new Map<string, { data: any, expiresAt: number }>();

function errorResponse(message: string) {
  return NextResponse.json({ success: false, error: message });
}

export async function GET() {
  try {
    const cookiesStore = await cookies();
    const sessionId = cookiesStore.get("sessionId")?.value;
    if (!sessionId) return errorResponse("No sessionId found");

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        expiresAt: true,
        user_id: true
      }
    });
    if (!session) return errorResponse("Session not found");

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      return errorResponse("Session expired");
    }

    const userId = session.user_id;

    const cached = userCache.get(userId);
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json({ success: true, user: cached.data });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        likedPosts: true,
        following: true,
        followers: true,
        likedComments: true,
      }
    });

    if (!user) return errorResponse("User not found");

    userCache.set(userId, {
      data: user,
      expiresAt: Date.now() + 30 * 60 * 1000,
    });

    return NextResponse.json({ success: true, user });

  } catch (err: any) {
    console.error("error fetching data:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
