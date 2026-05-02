"use client";

import type { ChecklistGroup as ChecklistGroupType, ChecklistStatus } from "@/types";
import ChecklistItemComponent from "./ChecklistItem";

export default function ChecklistGroup({
  group,
  onToggle,
}: {
  group: ChecklistGroupType;
  onToggle: (itemId: string, nextStatus: ChecklistStatus) => void;
}) {
  const doneCount = group.items.filter((i) => i.status === "done").length;
  const total = group.items.length;

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-medium text-gray-900">{group.name}</h3>
        <span className="text-xs text-gray-400">
          {doneCount}/{total}
        </span>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
        {group.items.map((item) => (
          <ChecklistItemComponent key={item.id} item={item} onToggle={onToggle} />
        ))}
      </div>
    </section>
  );
}
