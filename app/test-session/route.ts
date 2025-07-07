// app/test-session/route.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)
  console.log("🚨 TEST SESSION:", session)

  return NextResponse.json({ session })
}
