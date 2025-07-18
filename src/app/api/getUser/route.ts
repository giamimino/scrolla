import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const cookiesStore = await cookies()
    const sessionId = cookiesStore.get("sessionId")?.value

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "No sessionId found" });
    }

    const session = await prisma.session.findUnique({
      where: {id: sessionId},
      select: {
        expiresAt: true,
        user_id: true
      }
    })

    if(!session) {
      return NextResponse.json({success: false, error: "Session not found"})
    }

    const expiresAt = new Date(session.expiresAt);

    if(expiresAt < new Date()) {
      return NextResponse.json({success: false, error: "Session expired"})
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user_id
      }
    })

    if(!user) {
      return NextResponse.json({success: false, error: "User not found" })
    }

    return NextResponse.json({ success: true, user })
  } catch(err: any) {
    console.log("error fetching data:", err);
    return NextResponse.json({success:false, error: err.message})
  }
}