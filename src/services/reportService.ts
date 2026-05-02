import { mockReports } from "./mockData";
import { getChecklistStats, getChecklistByProject } from "./checklistService";
import { getProject } from "./projectService";
import type { DeliveryReport } from "@/types";

export function getReportByProject(projectId: string): DeliveryReport | undefined {
  return mockReports.find((r) => r.project_id === projectId);
}

export function generateReportContent(projectId: string): string {
  const project = getProject(projectId);
  const stats = getChecklistStats(projectId);
  const groups = getChecklistByProject(projectId);

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
