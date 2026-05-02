"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login — accept any non-empty email/password
    if (email && password) {
      router.push("/dashboard");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">登录</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-gray-700">邮箱</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="designer@example.com"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-gray-700">密码</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="任意密码（Mock）"
              />
            </label>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors"
            >
              登录
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-4 text-center">
            MVP 阶段：输入任意邮箱和密码即可登录
          </p>
        </div>
      </div>
    </Layout>
  );
}
