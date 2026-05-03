import { supabase } from "@/lib/supabase";
import { generateChecklistTemplate } from "@/engine/checklistEngine";
import type { ChecklistItem, ChecklistGroup, ChecklistStatus, ProjectType } from "@/types";

export async function getChecklistByProject(
  projectId: string
): Promise<ChecklistGroup[]> {
  const { data, error } = await supabase
    .from("checklist_items")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getChecklistByProject error:", error);
    return [];
  }

  const groupMap = new Map<string, ChecklistItem[]>();
  for (const item of data ?? []) {
    const group = groupMap.get(item.group) ?? [];
    group.push(item);
    groupMap.set(item.group, group);
  }

  return Array.from(groupMap.entries()).map(([name, items]) => ({ name, items }));
}

export async function generateChecklistForProject(
  projectId: string,
  projectType: ProjectType
): Promise<void> {
  const existing = await getChecklistByProject(projectId);
  if (existing.length > 0) return;

  const templates = generateChecklistTemplate(projectType);
  if (templates.length === 0) return;

  const items = templates.map((t) => ({
    project_id: projectId,
    group: t.group,
    title: t.title,
    status: "todo",
    note: "",
    required: t.required,
    category: t.category,
  }));

  const { error } = await supabase.from("checklist_items").insert(items);
  if (error) console.error("generateChecklistForProject error:", error);
}

export async function updateChecklistStatus(
  itemId: string,
  status: ChecklistStatus
): Promise<void> {
  const { error } = await supabase
    .from("checklist_items")
    .update({ status })
    .eq("id", itemId);

  if (error) console.error("updateChecklistStatus error:", error);
}

export async function updateChecklistNote(
  itemId: string,
  note: string
): Promise<void> {
  const { error } = await supabase
    .from("checklist_items")
    .update({ note })
    .eq("id", itemId);

  if (error) console.error("updateChecklistNote error:", error);
}

export async function getChecklistStats(projectId: string) {
  const items = await getChecklistByProject(projectId);
  const allItems = items.flatMap((g) => g.items);
  const total = allItems.length;
  const done = allItems.filter((i) => i.status === "done").length;
  const n_a = allItems.filter((i) => i.status === "n_a").length;
  const todo = allItems.filter((i) => i.status === "todo").length;
  return { total, done, n_a, todo };
}
