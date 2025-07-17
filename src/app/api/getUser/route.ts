import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const cookiesStore = await cookies()
    const sessionId = cookiesStore.get("sessionId")?.value

    const session = await prisma.session.findFirst({
      where: {id: sessionId},
      select: {
        expiresAt: true,
        user_id: true
      }
    })

    if(!session) {
      return NextResponse.json({success: false})
    }

    if(session?.expiresAt < new Date()) {
      return NextResponse.json({success: false})
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user_id
      }
    })

    if(!user) {
      return NextResponse.json({success: false})
    }

    return NextResponse.json({ user })
  } catch(err: any) {
    console.log("error fetching data:", err);
    return NextResponse.json({success:false, error: err.message})
  }
}