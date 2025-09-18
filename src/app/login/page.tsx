"use client";
import { useState } from "react";
export default function LoginPage(){
  const [form, setForm] = useState({ email:"", password:"" });
  const [msg, setMsg] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  async function submit(e:React.FormEvent){
    e.preventDefault(); setMsg(null); setLoading(true);
    const res = await fetch("/api/auth/login", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    if (res.ok) window.location.href="/"; else setMsg((await res.json()).error || "Login failed");
  }
  return (<div className="max-w-md mx-auto card">
    <h1 className="text-xl font-semibold mb-4">Welcome back</h1>
    {msg && <p className="text-red-600 mb-2">{msg}</p>}
    <form onSubmit={submit} className="space-y-3">
      <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required /></div>
      <div><label className="label">Password</label><input className="input" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required /></div>
      <button className="btn btn-primary w-full" disabled={loading}>{loading? "Logging in..." : "Login"}</button>
    </form>
  </div>);
}
