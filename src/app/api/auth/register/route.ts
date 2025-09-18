export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { registerUser, login } from "@/lib/auth";
export async function POST(req: NextRequest){
  try{
    const { email, password, name, handle } = await req.json();
    if (!email || !password || !name || !handle) return NextResponse.json({ error: "All fields required" }, { status: 400 });
    await registerUser({ email, password, name, handle });
    await login(email, password);
    return NextResponse.json({ ok: true });
  }catch(e:any){
    return NextResponse.json({ error: e?.message || "Error" }, { status: 400 });
  }
}
