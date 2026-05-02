export type ProjectType = "app" | "web" | "backend";

export type ChecklistStatus = "todo" | "done" | "n_a";

export type UserRole = "designer" | "developer";

export type RuleType = "login" | "cart" | "campaign" | "general";

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  created_at: string;
}

export interface ChecklistItem {
  id: string;
  project_id: string;
  group: string;
  title: string;
  status: ChecklistStatus;
  note: string;
}

export interface ChecklistGroup {
  name: string;
  items: ChecklistItem[];
}

export interface Rule {
  id: string;
  type: RuleType;
  conditions: Record<string, unknown>;
  checklist_template: ChecklistItemTemplate[];
}

export interface ChecklistItemTemplate {
  group: string;
  title: string;
}

export interface DeliveryReport {
  id: string;
  project_id: string;
  content: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
}
