import { supabase } from "@/lib/supabase";
import { getChecklistStats, getChecklistByProject } from "./checklistService";
import { getProject } from "./projectService";
import type { DeliveryReport } from "@/types";

export async function getReportByProject(
  projectId: string
): Promise<DeliveryReport | null> {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data;
}

export async function generateReportContent(projectId: string): Promise<string> {
  const project = await getProject(projectId);
  const stats = await getChecklistStats(projectId);
  const groups = await getChecklistByProject(projectId);

  if (!project) return "";

  const lines: string[] = [
    `# ${project.name} — 交付报告`,
    "",
    "## 完成概览",
    `- 总检查项：${stats.total}`,
    `- 已通过：${stats.done}`,
    `- 未检查：${stats.todo}`,
    `- 不适用：${stats.n_a}`,
    "",
    "## 分组详情",
    "",
  ];

  for (const group of groups) {
    lines.push(`### ${group.name}`);
    for (const item of group.items) {
      const label = { todo: "⬜", done: "✅", n_a: "➖" }[item.status];
      lines.push(`- ${label} ${item.title}${item.note ? ` (${item.note})` : ""}`);
    }
    lines.push("");
  }

  const todoItems = groups.flatMap((g) => g.items.filter((i) => i.status === "todo"));
  if (todoItems.length > 0) {
    lines.push("## 风险提示");
    lines.push(`以下 ${todoItems.length} 项尚未完成，建议交付前处理：`);
    for (const item of todoItems) {
      lines.push(`- ${item.title}`);
    }
  }

  return lines.join("\n");
}

export async function saveReport(
  projectId: string,
  content: string
): Promise<DeliveryReport | null> {
  const { data, error } = await supabase
    .from("reports")
    .insert({ project_id: projectId, content })
    .select()
    .single();

  if (error) {
    console.error("saveReport error:", error);
    return null;
  }
  return data;
}
