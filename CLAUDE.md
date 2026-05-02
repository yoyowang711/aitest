·全部用中文回复
2.固定称呼开头(AI忘了叫你=
该/compact了)
3.写代码前先说方案，等批准再动手
4.需求模糊先提问
5.写完列出边缘情况
6.超3个文件先拆任务
7.出bug先写复现测试
8.被纠正后制定不再犯的计划
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Design Handoff Checker — a tool that helps UI/UX designers run structured self-checks before handing off designs to developers. It uses a checklist + rule engine + delivery report system to make the design handoff process verifiable and trackable.

## Initial Setup

```bash
# Scaffold Next.js (TypeScript + Tailwind + App Router):
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server → http://localhost:3000
npm run build        # Production build
```

## Tech Stack

Next.js (App Router) + TypeScript + React + Tailwind CSS + Supabase (db/auth/api) + Vercel (deploy)

## Architecture

### Separation of Concerns — the most important rule

- **`page.tsx`** — render only. Never write business logic here.
- **`src/services/`** — all business logic.
- **`src/engine/`** — rule engine core. Checklist generation and rule matching must go through this layer. Never bypass it from pages or components.

### Directory Layout

```
src/
  app/                   # App Router pages
    page.tsx             # Home
    login/               # /login
    dashboard/           # /dashboard — project list
    project/[id]/        # /project/:id — checklist area
      report/            # /project/:id/report — delivery report
  components/            # Shared UI (PascalCase files)
  services/              # Business logic (checklistService, reportService)
  engine/                # Rule engine (ruleEngine, checklistEngine, ruleDefinitions)
  lib/supabase.ts        # Supabase client
  types/index.ts         # All type definitions
  config/constants.ts    # Constants
public/                  # Static assets
tests/                   # Test files
```

### Data Model

- **projects** — id, name, type (app/web/backend), created_at
- **checklist_items** — id, project_id, group, title, status (todo/done/n_a), note
- **rules** — id, type (login/cart/campaign), conditions (JSON), checklist_template (JSON)
- **reports** — id, project_id, content, created_at
- **users** — id, email, role (designer/developer)

### MVP Phase — Mock Data

During MVP, use hardcoded mock data in `src/services/` instead of real Supabase calls. All service functions should match the eventual Supabase API signatures so swapping mock → real is a one-line change. The `src/lib/supabase.ts` client should be set up and importable, even if services don't use it yet.

### Naming Conventions

- Components: `PascalCase` (`ChecklistItem.tsx`)
- Functions: `camelCase` (`generateChecklist`)
- Files: `kebab-case` (`checklist-service.ts`)

## User Roles & Flow

- **Designer**: Create project → select type → receive checklist → self-check → view risk warnings → generate delivery report → submit
- **Developer**: View delivery report → check checklist completion → confirm receipt
