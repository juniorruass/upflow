import { NextResponse } from "next/server";
import { getInstanceStatus } from "@/lib/uazapi";
import { resolveInstanceToken, InstanceResolutionError } from "@/lib/instance";

export async function GET() {
  try {
    const { token } = await resolveInstanceToken();
    const data = await getInstanceStatus(token);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof InstanceResolutionError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
