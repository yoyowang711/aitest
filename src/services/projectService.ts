import { mockProjects } from "./mockData";
import type { Project } from "@/types";

export function getProjects(): Project[] {
  return mockProjects;
}

export function getProject(id: string): Project | undefined {
  return mockProjects.find((p) => p.id === id);
}
