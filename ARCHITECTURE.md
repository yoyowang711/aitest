7. 技术栈选择及原因
Next.js
开发效率高
路由系统简单
AI 友好（适合 vibe coding）
一键部署到 Vercel
Supabase
提供数据库 + 登录系统 + API
无需自建后端
极大降低开发复杂度
Vercel
与 Next.js 无缝集成
自动部署
零运维成本
整体目标：让非后端开发者也能完成全栈产品

8. 项目目录结构
design-handoff-checker/

src/
  app/
    page.tsx
    login/
    dashboard/
    project/
      [id]/
        page.tsx
        report/

  components/
    ChecklistItem.tsx
    ChecklistGroup.tsx
    ProjectCard.tsx
    Button.tsx

  services/
    checklistService.ts
    reportService.ts

  engine/
    ruleEngine.ts
    checklistEngine.ts
    ruleDefinitions.ts

  lib/
    supabase.ts

  utils/
    helpers.ts

  types/
    index.ts

  config/
    constants.ts

public/
tests/
README.md
9. 核心模块说明
① 项目管理模块
创建项目
选择项目类型
存储基础信息
② Checklist生成模块
根据规则生成检查项
动态组合 checklist
③ 规则引擎模块（核心）
定义页面类型规则
根据特征触发规则
输出 checklist 结构
④ 执行模块
用户勾选 checklist
保存状态（done / n_a）
⑤ 交付说明模块
checklist → 文档转换
自动生成交付说明
⑥ 协作确认模块
开发确认交付
记录交付状态
10. 数据模型设计
projects（项目表）
id
name
type（app/web/backend）
created_at
checklist_items（检查项）
id
project_id
group
title
status（todo/done/n_a）
note
rules（规则表）
id
type（login/cart/campaign）
conditions（json）
checklist_template（json）
reports（交付报告）
id
project_id
content
created_at
users（用户）
id
email
role（designer/developer）
11. 代码规范
命名规范
组件：PascalCase（ChecklistItem.tsx）
函数：camelCase（generateChecklist）
文件：kebab-case
结构规范
UI 和逻辑分离
page.tsx 只做渲染
业务逻辑必须放 services 或 engine
注释规范

所有核心函数必须说明用途：

/**
 * 根据项目类型生成 checklist
 */
规则限制
不允许在 UI 中写业务逻辑
不允许 page.tsx 生成 checklist
不允许直接拼接规则
所有逻辑必须走 engine 层