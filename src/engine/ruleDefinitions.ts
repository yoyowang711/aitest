import type { Rule, ChecklistItemTemplate, ProjectType } from "@/types";

const C = (category: string) => category;

// ================================================================
// 基础规则（所有项目类型必选）
// ================================================================

const baseTemplate: ChecklistItemTemplate[] = [
  // 📋 基础交付
  { group: "基础交付", title: "所有页面已覆盖完整流程（无断点）", required: true, category: C("base") },
  { group: "基础交付", title: "所有页面有明确命名", required: true, category: C("base") },
  { group: "基础交付", title: "关键路径（核心流程）完整", required: true, category: C("base") },
  { group: "基础交付", title: "页面层级关系清晰（无孤立页面）", required: false, category: C("base") },
  { group: "基础交付", title: "所有弹窗/浮层有明确触发和关闭逻辑", required: false, category: C("base") },

  // 🧩 组件规范
  { group: "组件规范", title: "复用已有组件（避免重复设计）", required: false, category: C("base") },
  { group: "组件规范", title: "组件状态完整（default / hover / active / disabled）", required: true, category: C("base") },
  { group: "组件规范", title: "组件具备 loading 状态（如按钮 / 列表）", required: false, category: C("base") },
  { group: "组件规范", title: "组件具备错误状态（如输入框校验失败）", required: false, category: C("base") },

  // 📏 标注规范
  { group: "标注规范", title: "标注尺寸（width / height）", required: true, category: C("base") },
  { group: "标注规范", title: "标注间距（padding / margin）", required: true, category: C("base") },
  { group: "标注规范", title: "标注字体（size / weight）", required: true, category: C("base") },
  { group: "标注规范", title: "标注颜色（token / hex）", required: true, category: C("base") },
  { group: "标注规范", title: "符合设计系统规范（栅格 / spacing）", required: false, category: C("base") },

  // 🔁 交互说明
  { group: "交互说明", title: "说明页面跳转逻辑", required: true, category: C("base") },
  { group: "交互说明", title: "说明交互反馈（点击 / hover）", required: false, category: C("base") },
  { group: "交互说明", title: "说明 loading 行为", required: false, category: C("base") },
  { group: "交互说明", title: "说明异常处理（error / timeout）", required: false, category: C("base") },

  // 📦 资源准备
  { group: "资源准备", title: "提供所有 icon（SVG / PNG）", required: true, category: C("base") },
  { group: "资源准备", title: "提供图片资源", required: true, category: C("base") },
  { group: "资源准备", title: "提供切图（如需要）", required: false, category: C("base") },
];

// ================================================================
// 页面模块规则（按需组合）
// ================================================================

const loginModule: ChecklistItemTemplate[] = [
  { group: "登录页", title: "登录成功 / 失败状态反馈完整", required: true, category: C("login") },
  { group: "登录页", title: "忘记密码流程完整", required: false, category: C("login") },
  { group: "登录页", title: "第三方登录入口就绪（如有）", required: false, category: C("login") },
];

const cartModule: ChecklistItemTemplate[] = [
  { group: "购物车", title: "空购物车状态已设计", required: true, category: C("cart") },
  { group: "购物车", title: "商品数量修改交互明确", required: false, category: C("cart") },
  { group: "购物车", title: "删除确认弹窗已设计", required: true, category: C("cart") },
  { group: "购物车", title: "价格计算展示正确", required: false, category: C("cart") },
];

const campaignModule: ChecklistItemTemplate[] = [
  { group: "活动页", title: "活动状态标注（未开始 / 进行中 / 已结束）", required: true, category: C("campaign") },
  { group: "活动页", title: "倒计时 / 限时逻辑说明", required: false, category: C("campaign") },
  { group: "活动页", title: "活动规则展示方式明确", required: false, category: C("campaign") },
  { group: "活动页", title: "异常情况处理（库存不足 / 已过期）", required: true, category: C("campaign") },
];

// ================================================================
// 规则库
// ================================================================

const allRules: Rule[] = [
  {
    id: "base",
    type: "general",
    categories: ["base"],
    checklist_template: baseTemplate,
  },
  {
    id: "module_login",
    type: "login",
    categories: ["login"],
    checklist_template: loginModule,
  },
  {
    id: "module_cart",
    type: "cart",
    categories: ["cart"],
    checklist_template: cartModule,
  },
  {
    id: "module_campaign",
    type: "campaign",
    categories: ["campaign"],
    checklist_template: campaignModule,
  },
];

// ================================================================
// 项目类型 → 启用哪些模块
// ================================================================

const PROJECT_MODULES: Record<ProjectType, string[]> = {
  app: ["base", "login", "campaign"],
  web: ["base", "cart", "campaign"],
  backend: ["base"],
};

// ================================================================
// 对外接口
// ================================================================

export function getRulesForProject(type: ProjectType): ChecklistItemTemplate[] {
  const moduleIds = PROJECT_MODULES[type] ?? ["base"];
  const templates: ChecklistItemTemplate[] = [];

  for (const moduleId of moduleIds) {
    const rule = allRules.find((r) => r.id === moduleId);
    if (rule) templates.push(...rule.checklist_template);
  }

  return templates;
}
