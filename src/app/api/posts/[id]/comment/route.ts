import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { CommentCreateSchema } from "@/lib/validators";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const uid = await getUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = CommentCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid content" }, { status: 400 });

  const comment = await prisma.comment.create({
    data: { postId: params.id, authorId: uid, content: parsed.data.content },
    include: { author: { select: { id: true, name: true, handle: true } } },
  });

  return NextResponse.json({ ok: true, comment });
}
