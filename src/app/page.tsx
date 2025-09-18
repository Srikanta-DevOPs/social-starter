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
    </div>
  );
}
