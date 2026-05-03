import type { ProjectType } from "@/types";

export interface RiskWarning {
  id: string;
  category: string;
  title: string;
  description: string;
}

// ================================================================
// 按模块定义风险提示
// ================================================================

const allRiskWarnings: Record<string, RiskWarning[]> = {
  login: [
    {
      id: "risk_login_1",
      category: "登录",
      title: "密码可见性切换",
      description: "建议提供密码显隐切换按钮，避免用户输入错误",
    },
    {
      id: "risk_login_2",
      category: "登录",
      title: "自动登录有效期",
      description: "如支持自动登录，需明确有效期策略并与开发对齐",
    },
    {
      id: "risk_login_3",
      category: "登录",
      title: "第三方登录失败回退",
      description: "第三方登录（微信/Apple ID）失败时，应有降级方案或友好提示",
    },
  ],

  form: [
    {
      id: "risk_form_1",
      category: "表单",
      title: "必填校验提示",
      description: "必填项未填时，应提供明确的错误提示位置和文案",
    },
    {
      id: "risk_form_2",
      category: "表单",
      title: "格式校验提示",
      description: "邮箱/手机号/身份证等格式校验需实时反馈，不要仅在后端校验",
    },
    {
      id: "risk_form_3",
      category: "表单",
      title: "提交后防重复",
      description: "提交按钮应有 Loading / Disabled 状态，防止用户重复点击",
    },
  ],

  cart: [
    {
      id: "risk_cart_1",
      category: "购物车",
      title: "空状态引导",
      description: "购物车为空时应有明确的操作引导（如「去逛逛」），而非空白页",
    },
    {
      id: "risk_cart_2",
      category: "购物车",
      title: "价格变更提示",
      description: "商品价格变动时需明确提示用户，避免结算时价格与加入时不一致",
    },
    {
      id: "risk_cart_3",
      category: "购物车",
      title: "库存不足提示",
      description: "结算时如库存不足，应在商品行内标注，不要仅弹窗提示",
    },
  ],

  campaign: [
    {
      id: "risk_campaign_1",
      category: "活动",
      title: "已过期活动入口处理",
      description: "活动过期后的入口应如何处理（隐藏/置灰/跳转）需明确标注",
    },
    {
      id: "risk_campaign_2",
      category: "活动",
      title: "重复参与限制",
      description: "同一用户多次参与活动的行为限制应提前定义（如每人限 1 次）",
    },
    {
      id: "risk_campaign_3",
      category: "活动",
      title: "规则变更通知",
      description: "活动规则变更时是否需要通知已参与用户，提前与运营对齐",
    },
  ],
};

// ================================================================
// 项目类型 → 启用哪些风险模块
// ================================================================

const PROJECT_RISK_MODULES: Record<ProjectType, string[]> = {
  app: ["login", "form", "campaign"],
  web: ["form", "cart", "campaign"],
  backend: ["form"],
};

// ================================================================
// 对外接口
// ================================================================

export function getRiskWarnings(projectType: ProjectType): RiskWarning[] {
  const moduleIds = PROJECT_RISK_MODULES[projectType] ?? ["form"];
  const warnings: RiskWarning[] = [];

  for (const moduleId of moduleIds) {
    const moduleWarnings = allRiskWarnings[moduleId];
    if (moduleWarnings) warnings.push(...moduleWarnings);
  }

  return warnings;
}
