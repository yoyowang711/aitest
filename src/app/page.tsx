import Link from "next/link";
import Layout from "@/components/Layout";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center gap-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          设计交付<br />自查与控制系统
        </h1>
        <p className="text-gray-500 max-w-md">
          帮助 UI/UX 设计师在交付开发前进行结构化自查，<br />
          让设计交付变得可检查、可追踪、可标准化。
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
        >
          开始使用
          <ArrowRight size={16} />
        </Link>
      </div>
    </Layout>
  );
}
