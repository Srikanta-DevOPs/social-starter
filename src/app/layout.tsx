import "./globals.css";
import Link from "next/link";
import { requireUser } from "@/lib/requireUser";

export const metadata = { title: "Social Starter", description: "Modern social app starter" };

export default async function RootLayout({ children }:{ children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <nav className="container flex h-14 items-center gap-4">
            <Link href="/" className="font-semibold">Social</Link>
            <Link href="/explore" className="text-sm">Explore</Link>
            <div className="flex-1" />
            {user ? (
              <div className="flex items-center gap-2">
                <Link className="btn" href={`/u/${user.handle}`}>@{user.handle}</Link>
                <Link className="btn btn-primary" href="/compose">Compose</Link>
                <form action="/api/auth/logout" method="post"><button className="btn">Logout</button></form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link className="btn" href="/login">Login</Link>
                <Link className="btn btn-primary" href="/register">Sign up</Link>
              </div>
            )}
          </nav>
        </header>
        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}
