import prisma from "@/lib/prisma"
import { redis } from "@/lib/redis"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { curParam, user_id }: { curParam: string, user_id: string } = await req.json()

    if(curParam === 'posts') {
      const profilePostKey = `porfilePost:${user_id}`
      
      const cachedPost = await redis.get(profilePostKey)
      if (cachedPost) {
        return NextResponse.json({ success: true, posts: cachedPost });
      }
      
      const posts = await prisma.user.findUnique({
        where: { id: user_id },
        select: {
          posts: {
            select: {
              image: true,
              _count: {
                select: { likes: true },
              },
              id: true
            }
          },
          id: true
        }
      })

      await redis.set(profilePostKey, posts, { ex: 1800 });

      return NextResponse.json({ posts: posts })
    } else {
      return NextResponse.json({
        success: false,
        message: "still in development"
      })
    }
  } catch(err) {
    console.log("error", err);

  }
}