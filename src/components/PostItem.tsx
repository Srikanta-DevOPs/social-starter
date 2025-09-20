"use client";
import { useState } from "react";

type Author = { id: string; name: string; handle: string };
type Comment = { id: string; content: string; createdAt: string; author: Author };
type Post = {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  likes: number;
  commentsCount: number;
  likedByMe: boolean;
  imageUrl?: string | null;
  comments?: Comment[];
};

export default function PostItem({ post, onChanged }: { post: Post; onChanged?: () => void }) {
  const [liking, setLiking] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);

  async function toggleLike() {
    setLiking(true);
    const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
    setLiking(false);
    if (res.ok) onChanged?.();
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommenting(true);
    const res = await fetch(`/api/posts/${post.id}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentText }),
    });
    setCommenting(false);
    if (res.ok) {
      setCommentText("");
      onChanged?.();
    }
  }

  const date = new Date(post.createdAt).toLocaleString();

  return (
    <div className="border rounded p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium">
          {post.author.name} <span className="text-slate-500">@{post.author.handle}</span>
        </div>
        <div className="text-slate-500 text-sm">{date}</div>
      </div>
      <div className="whitespace-pre-wrap">{post.content}</div>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="post image" className="rounded border max-h-96 w-auto" />
      )}
      <div className="flex items-center gap-4 text-sm">
        <button onClick={toggleLike} disabled={liking} className="underline">
          {post.likedByMe ? "Unlike" : "Like"} ({post.likes})
        </button>
        <span>{post.commentsCount} comments</span>
      </div>
      <form onSubmit={addComment} className="flex gap-2">
        <input className="flex-1 border rounded p-2" placeholder="Write a comment"
               value={commentText} onChange={(e)=>setCommentText(e.target.value)} maxLength={300}/>
        <button className="bg-slate-800 text-white px-3 py-1 rounded" disabled={commenting || !commentText.trim()}>
          {commenting ? "..." : "Reply"}
        </button>
      </form>
      {post.comments && post.comments.length > 0 && (
        <div className="pl-3 border-l space-y-2">
          {post.comments.map(c => (
            <div key={c.id} className="text-sm">
              <span className="font-medium">{c.author.name}</span>{" "}
              <span className="text-slate-500">@{c.author.handle}</span>: {c.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
