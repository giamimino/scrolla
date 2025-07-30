import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

function errorResponse(message: string) {
  return NextResponse.json({ success: false, error: message });
}

export async function GET() {
  try {
    const cookiesStore = await cookies();
    const sessionId = cookiesStore.get("sessionId")?.value;
    if (!sessionId) return errorResponse("No sessionId found");

    const sessionCacheKey = `session:${sessionId}`;

    const cachedUser = await redis.get(sessionCacheKey);
    if (cachedUser) {
      return NextResponse.json({ success: true, user: cachedUser });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        expiresAt: true,
        user_id: true,
      },
    });

    if (!session) return errorResponse("Session not found");

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      return errorResponse("Session expired");
    }

    const userId = session.user_id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        profileImage: true,
        likedPosts: { select: { id: true } },
        following: { select: { id: true } },
        followers: { select: { id: true } },
      },
    });

    if (!user) return errorResponse("User not found");

    const cacheUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      profileImage: user.profileImage,
      likedPostIds: user.likedPosts.map(p => p.id),
      followingIds: user.following.map(u => u.id),
      followerIds: user.followers.map(u => u.id),
    };

    await redis.set(sessionCacheKey, cacheUser, { ex: 1800 });

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error("error fetching data:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
