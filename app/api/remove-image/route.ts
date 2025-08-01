import { UTApi } from "uploadthing/server";
import { NextResponse } from "next/server";

const utapi = new UTApi();

export async function POST(req: Request) {
  const { key } = await req.json();
  await utapi.deleteFiles(key);
  return NextResponse.json({ success: true });
}
