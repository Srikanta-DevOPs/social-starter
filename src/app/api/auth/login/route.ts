export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";
export async function POST(req: NextRequest){
  try{
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email & password required" }, { status: 400 });
    await login(email, password);
    return NextResponse.json({ ok: true });
  }catch(e:any){
    return NextResponse.json({ error: e?.message || "Invalid credentials" }, { status: 400 });
  }
}
