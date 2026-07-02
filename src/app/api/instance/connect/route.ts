import { NextRequest, NextResponse } from "next/server";
import { connectInstance } from "@/lib/uazapi";

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-instance-token");
  if (!token) {
    return NextResponse.json({ error: "missing x-instance-token" }, { status: 400 });
  }
  try {
    const data = await connectInstance(token);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
