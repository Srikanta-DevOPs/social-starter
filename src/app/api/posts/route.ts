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
}
