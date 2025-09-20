import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE_NAME = "social_token";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function registerUser({ email, password, name, handle }:{ email:string; password:string; name:string; handle:string; }){
  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { handle }] } });
  if (existing) throw new Error("Email or handle already taken");
  const passwordHash = bcrypt.hashSync(password, 10);
  const user = await prisma.user.create({ data: { email, name, handle, passwordHash } });
  return user;
}

export async function login(email:string, password:string){
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) throw new Error("Invalid credentials");
  const token = jwt.sign({ uid: user.id }, JWT_SECRET, { expiresIn: "7d" });
  cookies().set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV==='production', sameSite: 'lax', path: '/' });
  return user;
}

export function logout(){
  cookies().set(COOKIE_NAME, "", { httpOnly: true, secure: process.env.NODE_ENV==='production', maxAge: 0, path: '/' });
}

export function getUserIdFromCookie(): string | null {
  const c = cookies().get(COOKIE_NAME)?.value;
  if (!c) return null;
  try { return (jwt.verify(c, JWT_SECRET) as any).uid as string; } catch { return null; }
}
