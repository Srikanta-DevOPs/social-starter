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
}
