"use client";
import { useState } from "react";

export default function PostComposer({ onPosted }: { onPosted?: () => void }) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function uploadImage(f: File): Promise<string | undefined> {
    const fd = new FormData();
    fd.append("file", f);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) { alert("Upload failed"); return; }
    const j = await res.json();
    return j.url as string;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() && !file) return;

    setSubmitting(true);
    let imageUrl: string | undefined;
    if (file) imageUrl = await uploadImage(file);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, imageUrl }),
    });

    setSubmitting(false);
    if (res.ok) {
      setContent("");
      setFile(null);
      onPosted?.();
    } else {
      alert("Failed to post");
    }
  }

  return (
    <form onSubmit={submit} className="border rounded p-3 space-y-2">
      <textarea
        className="w-full border rounded p-2"
        placeholder="What's happening?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={500}
      />
      <div className="flex items-center gap-3 text-sm">
        <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
        <span className="text-slate-500">{content.length}/500</span>
        <div className="ml-auto" />
        <button disabled={submitting || (!content.trim() && !file)} className="bg-black text-white px-3 py-1 rounded">
          {submitting ? "Posting..." : "Post"}
        </button>
      </div>
      {file && (
        <div className="pt-2">
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="max-h-60 rounded border"
          />
        </div>
      )}
    </form>
  );
}
