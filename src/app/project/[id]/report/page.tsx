import Link from "next/link";
import Layout from "@/components/Layout";
import PolishButton from "@/components/PolishButton";
import { getProject } from "@/services/projectService";
import { generateReportContent } from "@/services/reportService";
import { ArrowLeft } from "lucide-react";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return (
      <Layout>
        <p className="text-gray-500">项目不存在</p>
      </Layout>
    );
  }

  const content = await generateReportContent(id);

  if (!content) {
    return (
      <Layout>
        <p className="text-gray-500">暂无报告数据</p>
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

      <PolishButton projectName={project.name} rawContent={content} />

      <div className="rounded-lg border border-gray-200 bg-white p-8">
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed font-sans">
          {content}
        </pre>
      </div>
    </Layout>
  );
}
