<<<<<<< HEAD
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password } = await req.json().catch(() => ({}));
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 400 });

  const passwordHash = await bcrypt.hash(password, 10);
  const handle = email.split("@")[0];

  const user = await prisma.user.create({
    data: { name, email, handle, passwordHash },
  });

  await setSession(user.id);
  return NextResponse.json({ ok: true });
=======
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
>>>>>>> 1e78a84ba37c5432150f9a5c011193a42dc406a5
}
