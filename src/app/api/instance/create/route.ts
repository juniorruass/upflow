import { NextRequest, NextResponse } from "next/server";
import { createInstance } from "@/lib/uazapi";

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  try {
    const data = await createInstance(name);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
