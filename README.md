1. 项目简介

本项目是一个设计交付自查与控制系统（Design Handoff Checker）。
它的核心作用是：
帮助 UI/UX 设计师在交付设计稿给开发之前，进行结构化自查，确保设计交付是完整、规范、可执行的。
它通过“交付清单 + 规则引擎 + 交付报告”的方式，将原本依赖经验的设计交付流程变成：
可检查
可追踪
可标准化的流程
最终目标是降低设计与开发之间的沟通成本和返工率。
2. 如何运行项目
① 安装依赖
npm install
② 配置环境变量
创建 .env.local
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
③ 启动开发环境
npm run dev
④ 打开浏览器
http://localhost:3000
3. 技术栈
Next.js（前端框架）
React（UI构建）
TypeScript（类型系统）
Supabase（数据库 + 登录 + 后端服务）
TailwindCSS（样式）
Vercel（部署）