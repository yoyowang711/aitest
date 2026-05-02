"use client";

import { useState, use } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import ChecklistGroup from "@/components/ChecklistGroup";
import {
  getProject,
} from "@/services/projectService";
import {
  getChecklistByProject,
  getChecklistStats,
  updateChecklistStatus,
} from "@/services/checklistService";
import type { ChecklistStatus } from "@/types";
import { ArrowLeft, FileText } from "lucide-react";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const project = getProject(id);
  const [groups, setGroups] = useState(() => getChecklistByProject(id));

  if (!project) {
    return (
      <Layout>
        <p className="text-gray-500">项目不存在</p>
      </Layout>
    );
  }

  const stats = getChecklistStats(id);

  const handleToggle = (itemId: string, nextStatus: ChecklistStatus) => {
    updateChecklistStatus(itemId, nextStatus);
    setGroups(getChecklistByProject(id));
  };

  return (
    <Layout>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-sm text-gray-400 mt-0.5">创建于 {project.created_at.slice(0, 10)}</p>
        </div>
        <Link
          href={`/project/${id}/report`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FileText size={16} />
          交付报告
        </Link>
      </div>

      {/* Stats bar */}
      <div className="flex gap-6 mb-8 p-4 rounded-lg bg-white border border-gray-200">
        <Stat label="总计" value={stats.total} />
        <Stat label="已通过" value={stats.done} color="text-green-600" />
        <Stat label="未检查" value={stats.todo} color="text-amber-600" />
        <Stat label="不适用" value={stats.n_a} color="text-gray-400" />
      </div>

      {/* Checklist */}
      {groups.map((group) => (
        <ChecklistGroup key={group.name} group={group} onToggle={handleToggle} />
      ))}
    </Layout>
  );
}

function Stat({
  label,
  value,
  color = "text-gray-900",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-sm text-gray-400 ml-1">{label}</span>
    </div>
  );
}
