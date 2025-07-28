import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const sessionId = (await cookies()).get('sessionID')?.value
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        expiresAt: true,
        user: {
          select: {id: true}
        }
      }
    })

    if(!session || session.expiresAt < new Date()) {
      return NextResponse.json({
        success: false,
        message: "User cant be found or session expired."
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        likedPosts: {
          select: {
            postId: true
          }
        }
      }
    }) 

    if(!user) {
      return NextResponse.json({
        success: false,
        message: "Can't be found user."
      })
    }

    return NextResponse.json({
      success: false,
      user
    })
  } catch(err) {
    console.log("error find user", err);
    return NextResponse.json({
      success: false,
      message: "Something went wrong."
    })
  }
}