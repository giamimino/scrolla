import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { search } = await req.json()
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        }
      },
      select: {
        name: true
      }
    })
    
    if(!tags) {
      return NextResponse.json({
        success: false,
        message: "tag not found"
      })
    }

    return NextResponse.json({
      succee: false,
      tags: tags,
    })
  } catch(err) {
    console.log("error fetching tags", err);
    return NextResponse.json({
      success: false,
      message: "Something went wrong"
    })
  }
}