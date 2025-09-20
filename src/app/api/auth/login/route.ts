<<<<<<< HEAD
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession, clearSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) return NextResponse.json({ error: "Missing" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  await setSession(user.id);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ ok: true });
=======
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
>>>>>>> 1e78a84ba37c5432150f9a5c011193a42dc406a5
}
