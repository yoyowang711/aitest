import { supabase } from "@/lib/supabase";
import type { Project, ProjectType, ProjectStatus } from "@/types";

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProjects error:", error);
    return [];
  }
  return data ?? [];
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getProject error:", error);
    return null;
  }
  return data;
}

export async function createProject(
  name: string,
  type: ProjectType
): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .insert({ name, type })
    .select()
    .single();

  if (error) {
    console.error("createProject error:", error);
    return null;
  }
  return data;
}

export async function updateProjectStatus(
  id: string,
  status: ProjectStatus
): Promise<void> {
  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", id);

  if (error) console.error("updateProjectStatus error:", error);
}
