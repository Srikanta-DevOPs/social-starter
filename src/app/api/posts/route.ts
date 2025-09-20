import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { PostCreateSchema } from "@/lib/validators";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") || undefined;
  const take = Math.min(parseInt(searchParams.get("take") || "10", 10) || 10, 25);
  const uid = await getUserId();

  const posts = await prisma.post.findMany({
    take,
    skip: cursor ? 1 : 0,
    ...(cursor ? { cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, handle: true } },
      _count: { select: { likes: true, comments: true } },
      likes: uid ? { where: { userId: uid }, select: { id: true } } : false,
      comments: {
        take: 2,
        orderBy: { createdAt: "desc" },
        include: { author: { select: { id: true, name: true, handle: true } } },
      },
    },
  });

  const nextCursor = posts.length === take ? posts[posts.length - 1].id : null;

  const data = posts.map((p: any) => ({
    ...p,
    likedByMe: Array.isArray(p.likes) ? p.likes.length > 0 : false,
    likes: p._count.likes,
    commentsCount: p._count.comments,
  }));

  return NextResponse.json({ items: data, nextCursor });
}

export async function POST(req: Request) {
  const uid = await getUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = PostCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid content" }, { status: 400 });

  const post = await prisma.post.create({
    data: { authorId: uid, content: parsed.data.content, imageUrl: parsed.data.imageUrl },
    include: { author: { select: { id: true, name: true, handle: true } } },
  });

  return NextResponse.json({ ok: true, post });
}
