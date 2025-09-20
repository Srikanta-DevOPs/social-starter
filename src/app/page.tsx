<<<<<<< HEAD
import Link from "next/link";
import { getUserId } from "@/lib/session";
import PostComposer from "@/components/PostComposer";
import Feed from "@/components/Feed";

export default async function Home() {
  const uid = await getUserId();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nova Social</h1>
        <div className="space-x-3">
          {uid ? (
            <form action="/api/auth/login" method="POST">
              <button formMethod="DELETE" className="underline">Logout</button>
            </form>
          ) : (
            <>
              <Link className="underline" href="/login">Login</Link>
              <Link className="underline" href="/register">Register</Link>
            </>
          )}
        </div>
      </div>

      {uid ? (
        <PostComposer onPosted={() => { /* feed refresh via button below */ }} />
      ) : (
        <div className="border p-3 rounded text-slate-600">Sign in to post.</div>
      )}

      <Feed />
=======
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import Link from "next/link";

export default async function Home(){
  const user = await requireUser();
  if (!user) {
    return (
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">Welcome to Social</h1>
        <p className="text-slate-600 mb-4">Sign in to see your feed.</p>
        <div className="flex gap-2">
          <Link className="btn" href="/login">Login</Link>
          <Link className="btn btn-primary" href="/register">Create account</Link>
        </div>
      </div>
    );
  }

  const following = await prisma.follow.findMany({ where: { followerId: user.id } });
  const ids = [user.id, ...following.map(f=>f.followingId)];
  const posts = await prisma.post.findMany({
    where: { authorId: { in: ids } },
    include: { author: true, likes: true, comments: true },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <div className="space-y-4">
      {posts.length===0 && <div className="card">Your feed is empty. <Link className="underline" href="/explore">Explore</Link></div>}
      {posts.map(p=> (
        <div key={p.id} className="post">
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/u/${p.author.handle}`} className="font-semibold">@{p.author.handle}</Link>
            <span className="text-slate-500 text-xs">{p.createdAt.toDateString()}</span>
          </div>
          <p className="whitespace-pre-wrap">{p.content}</p>
          {p.imageUrl && <img src={p.imageUrl} className="mt-3 rounded-lg max-h-96 object-cover" />}
        </div>
      ))}
>>>>>>> 1e78a84ba37c5432150f9a5c011193a42dc406a5
    </div>
  );
}
