import { NextRequest, NextResponse } from "next/server";
import { getInstanceStatus } from "@/lib/uazapi";

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-instance-token");
  if (!token) {
    return NextResponse.json({ error: "missing x-instance-token" }, { status: 400 });
  }
  try {
    const data = await getInstanceStatus(token);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
