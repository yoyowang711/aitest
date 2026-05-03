import { getRulesForProject } from "./ruleDefinitions";
import type { ChecklistItemTemplate, ProjectType } from "@/types";

export function generateChecklistTemplate(
  projectType: ProjectType
): ChecklistItemTemplate[] {
  return getRulesForProject(projectType);
}
