import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { curParam, user_id }: { curParam: string, user_id: string } = await req.json()

    if(curParam === 'posts') {
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

      return NextResponse.json({ posts })
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