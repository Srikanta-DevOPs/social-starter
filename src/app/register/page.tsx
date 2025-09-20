"use client";
import { useState } from "react";
<<<<<<< HEAD
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [err,setErr]=useState("");
  const router = useRouter();

  async function submit(e:any){
    e.preventDefault(); setErr("");
    const res = await fetch("/api/auth/register",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const j = await res.json();
    if(!res.ok){ setErr(j.error||"Failed"); return; }
    router.push("/");
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-3">
      <h1 className="text-2xl font-bold">Create account</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="border w-full p-2 rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border w-full p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="border w-full p-2 rounded" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <button className="bg-black text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
=======
export default function RegisterPage(){
  const [form, setForm] = useState({ name:"", handle:"", email:"", password:"" });
  const [msg, setMsg] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  async function submit(e:React.FormEvent){
    e.preventDefault(); setMsg(null); setLoading(true);
    const res = await fetch("/api/auth/register", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    if (res.ok) window.location.href="/"; else setMsg((await res.json()).error || "Signup failed");
  }
  return (<div className="max-w-md mx-auto card">
    <h1 className="text-xl font-semibold mb-4">Create account</h1>
    {msg && <p className="text-red-600 mb-2">{msg}</p>}
    <form onSubmit={submit} className="space-y-3">
      <div><label className="label">Name</label><input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required /></div>
      <div><label className="label">Handle</label><input className="input" value={form.handle} onChange={e=>setForm({...form, handle:e.target.value.replace(/[^a-zA-Z0-9_]/g,'')})} required /></div>
      <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required /></div>
      <div><label className="label">Password</label><input className="input" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required /></div>
      <button className="btn btn-primary w-full" disabled={loading}>{loading? "Creating..." : "Sign up"}</button>
    </form>
  </div>);
>>>>>>> 1e78a84ba37c5432150f9a5c011193a42dc406a5
}
