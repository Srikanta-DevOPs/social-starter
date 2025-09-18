import { logout } from "@/lib/auth";
import { NextResponse } from "next/server";
export async function POST(){ logout(); return NextResponse.redirect(new URL("/", process.env.APP_URL || "http://localhost:3000")); }
