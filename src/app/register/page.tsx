"use client";
import { useState } from "react";
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
}
