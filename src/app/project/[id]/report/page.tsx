"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import PolishButton from "@/components/PolishButton";
import { getProject } from "@/services/projectService";
import { generateReportContent } from "@/services/reportService";
import { getGuestId } from "@/lib/guest";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [projectName, setProjectName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const guestId = getGuestId();
    getProject(id).then((project) => {
      if (!project) {
        setLoading(false);
        return;
      }
      setProjectName(project.name);
      generateReportContent(id, guestId).then((c) => {
        setContent(c);
        setLoading(false);
      });
    });
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      </Layout>
    );
  }

  if (!projectName) {
    return (
      <Layout>
        <p className="text-gray-500">项目不存在</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/project/${id}`} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">交付报告</h1>
      </div>

      <PolishButton projectName={projectName} rawContent={content} />

      <div className="rounded-lg border border-gray-200 bg-white p-8">
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed font-sans">
          {content || "暂无报告数据"}
        </pre>
      </div>
    </Layout>
  );
}
