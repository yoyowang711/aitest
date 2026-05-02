import type { Project, ChecklistItem, DeliveryReport } from "@/types";

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "电商 App 2.0 改版",
    type: "app",
    created_at: "2026-03-15T08:00:00Z",
  },
  {
    id: "2",
    name: "官网首页重构",
    type: "web",
    created_at: "2026-04-01T10:30:00Z",
  },
  {
    id: "3",
    name: "后台管理系统",
    type: "backend",
    created_at: "2026-04-20T14:00:00Z",
  },
];

export const mockChecklistItems: ChecklistItem[] = [
  // Project 1 checklist
  { id: "c1", project_id: "1", group: "布局适配", title: "iPhone SE / 14 Pro Max 两端适配", status: "todo", note: "" },
  { id: "c2", project_id: "1", group: "布局适配", title: "iPad 横竖屏切换无断裂", status: "done", note: "" },
  { id: "c3", project_id: "1", group: "交互反馈", title: "所有按钮有 Pressed 态", status: "todo", note: "" },
  { id: "c4", project_id: "1", group: "交互反馈", title: "加载中 / 空数据 / 错误状态覆盖", status: "n_a", note: "本期不涉及" },
  { id: "c5", project_id: "1", group: "视觉规范", title: "颜色变量引用确认（无硬编码色值）", status: "done", note: "" },
  { id: "c6", project_id: "1", group: "视觉规范", title: "图标全部导出 SVG + PDF", status: "todo", note: "" },

  // Project 2 checklist
  { id: "c7", project_id: "2", group: "响应式", title: "1920 / 1440 / 1024 / 375 四个断点覆盖", status: "todo", note: "" },
  { id: "c8", project_id: "2", group: "响应式", title: "导航在移动端转为汉堡菜单", status: "done", note: "" },
  { id: "c9", project_id: "2", group: "组件规范", title: "Button / Input / Card 组件标注完整", status: "todo", note: "" },

  // Project 3 checklist
  { id: "c10", project_id: "3", group: "表单规范", title: "所有表单有校验状态（成功 / 失败）", status: "todo", note: "" },
  { id: "c11", project_id: "3", group: "表单规范", title: "必填 / 选填标注明确", status: "done", note: "" },
  { id: "c12", project_id: "3", group: "数据展示", title: "空表格有 Empty State 兜底", status: "todo", note: "" },
  { id: "c13", project_id: "3", group: "数据展示", title: "长列表分页 / 虚拟滚动方案明确", status: "n_a", note: "数据量小不分页" },
];

export const mockReports: DeliveryReport[] = [
  {
    id: "r1",
    project_id: "1",
    content: `# 电商 App 2.0 改版 — 交付报告

## 完成概览
- 总检查项：6
- 已通过：2
- 未检查：3
- 不适用：1

## 风险提示
- "按钮 Pressed 态" 尚未完成，建议交付前补齐
- 图标导出待完成`,
    created_at: "2026-04-10T09:00:00Z",
  },
];
