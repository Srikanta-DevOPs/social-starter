"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import PostItem from "./PostItem";

type FeedResponse = { items: any[]; nextCursor: string | null };

export default function Feed() {
  const [items, setItems] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async (initial = false) => {
    if (loading) return;
    setLoading(true);
    const qs = new URLSearchParams();
    if (!initial && cursor) qs.set("cursor", cursor);
    const res = await fetch(`/api/posts?${qs.toString()}`, { cache: "no-store" });
    const data: FeedResponse = await res.json();
    setItems(prev => (initial ? data.items : [...prev, ...data.items]));
    setCursor(data.nextCursor);
    setLoading(false);
  }, [cursor, loading]);

  useEffect(() => { load(true); }, []); // initial

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && cursor) {
        load(false);
      }
    }, { rootMargin: "400px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [cursor, load]);

  return (
    <div className="space-y-3">
      {items.map(p => <PostItem key={p.id} post={p} onChanged={() => load(true)} />)}
      <div ref={sentinelRef} />
      {!cursor && !loading && items.length > 0 && (
        <div className="text-center text-slate-500 text-sm py-2">You’re all caught up 🎉</div>
      )}
      {loading && <div className="text-center text-sm py-2">Loading…</div>}
    </div>
  );
}
