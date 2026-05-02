import { mockChecklistItems } from "./mockData";
import type { ChecklistItem, ChecklistGroup, ChecklistStatus } from "@/types";

export function getChecklistByProject(projectId: string): ChecklistGroup[] {
  const items = mockChecklistItems.filter((c) => c.project_id === projectId);
  const groupMap = new Map<string, ChecklistItem[]>();

  for (const item of items) {
    const group = groupMap.get(item.group) ?? [];
    group.push(item);
    groupMap.set(item.group, group);
  }

  return Array.from(groupMap.entries()).map(([name, items]) => ({
    name,
    items,
  }));
}

export function updateChecklistStatus(
  itemId: string,
  status: ChecklistStatus
): ChecklistItem | undefined {
  const item = mockChecklistItems.find((c) => c.id === itemId);
  if (item) item.status = status;
  return item;
}

export function getChecklistStats(projectId: string) {
  const items = mockChecklistItems.filter((c) => c.project_id === projectId);
  const total = items.length;
  const done = items.filter((i) => i.status === "done").length;
  const n_a = items.filter((i) => i.status === "n_a").length;
  const todo = items.filter((i) => i.status === "todo").length;
  return { total, done, n_a, todo };
}
