<<<<<<< HEAD
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
=======
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookie } from "@/lib/auth";
import { extractHashtags } from "@/lib/hashtag";
import fs from "fs"; import path from "path";

export async function POST(req: Request){
  try{
    const uid = getUserIdFromCookie();
    if (!uid) return NextResponse.redirect(new URL("/login", process.env.APP_URL || "http://localhost:3000"));
    const form = await req.formData();
    const content = String(form.get("content") || "").trim();
    if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });
    let imageUrl: string | undefined;
    const file = form.get("image") as File | null;
    if (file && file.size > 0){
      const bytes = Buffer.from(await file.arrayBuffer());
      const ext = (file.type.split("/")[1] || "png").replace(/[^a-z0-9]/gi,"");
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      fs.mkdirSync(uploadsDir, { recursive: true });
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      fs.writeFileSync(path.join(uploadsDir, filename), bytes);
      imageUrl = `/uploads/${filename}`;
    }
    const post = await prisma.post.create({ data: { authorId: uid, content, imageUrl } });
    const tags = extractHashtags(content);
    for (const tag of tags){
      const ht = await prisma.hashtag.upsert({ where: { tag }, update: {}, create: { tag } });
      await prisma.postHashtag.create({ data: { postId: post.id, hashtagId: ht.id } });
    }
    return NextResponse.redirect(new URL("/", process.env.APP_URL || "http://localhost:3000"));
  }catch(e:any){
    console.error(e);
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
>>>>>>> 1e78a84ba37c5432150f9a5c011193a42dc406a5
}
