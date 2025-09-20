import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;

export async function setSession(userId: string) {
  const token = jwt.sign({ uid: userId }, secret, { expiresIn: "7d" });
  const jar = await cookies();
  jar.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.set("session", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
}

export async function getUserId(): Promise<string | null> {
  const jar = await cookies();
  const c = jar.get("session")?.value;
  if (!c) return null;
  try {
    const p = jwt.verify(c, secret) as any;
    return (p.uid as string) ?? null;
  } catch {
    return null;
  }
}
