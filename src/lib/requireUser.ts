import { prisma } from "./prisma";
import { getUserIdFromCookie } from "./auth";

export async function requireUser(){
  const uid = getUserIdFromCookie();
  if (!uid) return null;
  return prisma.user.findUnique({ where: { id: uid } });
}
