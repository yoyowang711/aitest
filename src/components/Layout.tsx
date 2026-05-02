"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isLogin = pathname === "/login";

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight text-gray-900">
          Design Handoff Checker
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {isHome && (
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              登录
            </Link>
          )}
          {isLogin && (
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              返回首页
            </Link>
          )}
          {!isHome && !isLogin && (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                项目列表
              </Link>
              <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                D
              </span>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
