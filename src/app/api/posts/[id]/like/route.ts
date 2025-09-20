import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const uid = await getUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const postId = params.id;
  const existing = await prisma.like.findFirst({ where: { postId, userId: uid } });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({ data: { postId, userId: uid } });
  }

  const likes = await prisma.like.count({ where: { postId } });
  const likedByMe = !existing;

  return NextResponse.json({ ok: true, likes, likedByMe });
}
