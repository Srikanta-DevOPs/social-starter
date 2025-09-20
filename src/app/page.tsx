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
    </div>
  );
}
