import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const ids = await prisma.posts.findMany({
      select: { id: true }
    });

    const idArray = ids.map(p => p.id);
    const randomId = idArray[Math.floor(Math.random() * idArray.length)];

    const post = await prisma.posts.findUnique({
      where: { id: randomId },
      select: {
        title: true,
        description: true,
        image: true,
        likes: { select: { id: true } },
        id: true,
        savedBy: { select: { id: true } }
      }
    });




    if(!post) {
      return NextResponse.json({
        success: false,
        message: "Something went wrong to this post."
      })
    }

    return NextResponse.json({
      success: true,
      post: post
    })
  } catch(err) {
    console.log("error get post", err);
    return NextResponse.json({
      success: false,
      message: "Something went wrong to this post."
    })
  }
}