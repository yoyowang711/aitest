"use client";

import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import ChecklistGroup from "@/components/ChecklistGroup";
import ProgressBar from "@/components/ProgressBar";
import RiskWarnings from "@/components/RiskWarnings";
import { getProject, updateProjectStatus } from "@/services/projectService";
import { getRiskWarnings, type RiskWarning } from "@/engine/riskRules";
import {
  getChecklistByProject,
  updateChecklistStatus,
  updateChecklistNote,
  generateChecklistForProject,
} from "@/services/checklistService";
import type { ChecklistStatus, ChecklistGroup as ChecklistGroupType, ProjectStatus } from "@/types";
import { ArrowLeft, FileText, Loader2, Lock, CheckCircle } from "lucide-react";

const STATUS_BADGE: Record<ProjectStatus, { label: string; color: string }> = {
  editing: { label: "自查中", color: "bg-amber-100 text-amber-700" },
  submitted: { label: "已提交", color: "bg-blue-100 text-blue-700" },
  confirmed: { label: "已确认", color: "bg-green-100 text-green-700" },
};

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [projectName, setProjectName] = useState("");
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>("editing");
  const [groups, setGroups] = useState<ChecklistGroupType[]>([]);
  const [riskWarnings, setRiskWarnings] = useState<RiskWarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const generatedRef = useRef(false);

  const readonly = projectStatus !== "editing";

  const loadData = async () => {
    setLoading(true);
    const project = await getProject(id);
    if (!project) {
      setLoading(false);
      return;
    }
    setProjectName(project.name);
    setProjectStatus(project.status ?? "editing");
    setRiskWarnings(getRiskWarnings(project.type));

    if (!generatedRef.current) {
      generatedRef.current = true;
      await generateChecklistForProject(id, project.type);
    }

    const checklistGroups = await getChecklistByProject(id);
    setGroups(checklistGroups);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const allItems = groups.flatMap((g) => g.items);
  const requiredItems = allItems.filter((i) => i.required);
  const stats = {
    total: allItems.length,
    done: allItems.filter((i) => i.status === "done").length,
    n_a: allItems.filter((i) => i.status === "n_a").length,
    todo: allItems.filter((i) => i.status === "todo").length,
    requiredTotal: requiredItems.length,
    requiredTodo: requiredItems.filter((i) => i.status === "todo").length,
    requiredDone: requiredItems.filter((i) => i.status === "done" || i.status === "n_a").length,
  };

  const handleToggle = async (itemId: string, nextStatus: ChecklistStatus) => {
    if (readonly) return;
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        items: g.items.map((it) =>
          it.id === itemId ? { ...it, status: nextStatus } : it
        ),
      }))
    );
    await updateChecklistStatus(itemId, nextStatus);
  };

  const handleNoteChange = async (itemId: string, note: string) => {
    if (readonly) return;
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        items: g.items.map((it) =>
          it.id === itemId ? { ...it, note } : it
        ),
      }))
    );
    await updateChecklistNote(itemId, note);
  };

  const handleSubmit = async () => {
    // 只验证必填项
    const pendingRequired = requiredItems.filter((i) => i.status === "todo");
    if (pendingRequired.length > 0) {
      const titles = pendingRequired.map((i) => `"${i.title}"`).join("\n");
      alert(`还有 ${pendingRequired.length} 项必填未完成：\n\n${titles}`);
      return;
    }

    if (!confirm("提交后将锁定 checklist，确认提交？")) return;

    setSubmitting(true);
    await updateProjectStatus(id, "submitted");
    setProjectStatus("submitted");
    setSubmitting(false);
  };

  const handleConfirm = async () => {
    if (!confirm("确认接收此设计交付？")) return;

    setSubmitting(true);
    await updateProjectStatus(id, "confirmed");
    setProjectStatus("confirmed");
    setSubmitting(false);
  };

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

  const badge = STATUS_BADGE[projectStatus];

  return (
    <Layout>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{projectName}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
              {badge.label}
            </span>
          </div>
        </div>
        <Link
          href={`/project/${id}/report`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FileText size={16} />
          交付报告
        </Link>
      </div>

      {/* 两栏布局 */}
      <div className="lg:flex lg:gap-8">
        {/* 左栏：核心功能区 */}
        <div className="lg:flex-1 min-w-0">
          {/* 进度条 */}
          <div className="mb-6 p-4 rounded-lg bg-white border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                必填项进度（{stats.requiredDone}/{stats.requiredTotal}）
              </span>
              {readonly && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <Lock size={12} /> 只读
                </span>
              )}
            </div>
            <ProgressBar done={stats.requiredDone} total={stats.requiredTotal} />
          </div>

          {/* 统计 */}
          <div className="flex gap-6 mb-8 p-4 rounded-lg bg-white border border-gray-200">
            <Stat label="总计" value={stats.total} />
            <Stat label="已通过" value={stats.done} color="text-green-600" />
            <Stat label="未检查" value={stats.todo} color="text-amber-600" />
            <Stat label="不适用" value={stats.n_a} color="text-gray-400" />
          </div>

          {/* Checklist */}
          {groups.length === 0 ? (
            <p className="text-gray-400 text-center py-10">该项目暂无 checklist</p>
          ) : (
            groups.map((group) => (
              <ChecklistGroup
                key={group.name}
                group={group}
                onToggle={handleToggle}
                onNoteChange={handleNoteChange}
                readonly={readonly}
              />
            ))
          )}

          {/* 操作按钮 */}
          <div className="mt-8 flex justify-center gap-4">
            {projectStatus === "editing" && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {submitting ? "提交中..." : "提交交付"}
              </button>
            )}

            {projectStatus === "submitted" && (
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-8 py-2.5 rounded-lg bg-green-600 text-white font-medium text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <CheckCircle size={16} />
                {submitting ? "处理中..." : "确认接收"}
              </button>
            )}
          </div>
        </div>

        {/* 右栏：风险提示 */}
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <RiskWarnings warnings={riskWarnings} />
        </div>

        {/* 移动端：风险提示在底部 */}
        <div className="lg:hidden mt-8">
          <RiskWarnings warnings={riskWarnings} />
        </div>
      </div>
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
