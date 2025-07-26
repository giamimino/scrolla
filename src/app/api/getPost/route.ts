import { NextResponse } from "next/server";


export async function GET(req: Request) {
  try {
    const { id } = await req.json()

    fetch('../../../data/json/posts.json')
    const 
  }
}