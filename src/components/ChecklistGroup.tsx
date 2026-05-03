"use client";

import { useState } from "react";
import type { ChecklistGroup as ChecklistGroupType, ChecklistStatus } from "@/types";
import ChecklistItemComponent from "./ChecklistItem";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function ChecklistGroup({
  group,
  onToggle,
  onNoteChange,
  readonly = false,
}: {
  group: ChecklistGroupType;
  onToggle: (itemId: string, nextStatus: ChecklistStatus) => void;
  onNoteChange: (itemId: string, note: string) => void;
  readonly?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const doneCount = group.items.filter((i) => i.status === "done").length;
  const n_aCount = group.items.filter((i) => i.status === "n_a").length;
  const total = group.items.length;
  const requiredCount = group.items.filter((i) => i.required && i.status === "todo").length;

  return (
    <section className="mb-4">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-2 py-2.5 px-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-left group-header"
      >
        <span className="text-gray-400">
          {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </span>
        <h3 className="font-medium text-gray-900">{group.name}</h3>
        <span className="text-xs text-gray-400">
          {doneCount + n_aCount}/{total}
        </span>
        {requiredCount > 0 && (
          <span className="text-xs text-red-400 ml-auto">
            {requiredCount} 项必填未完成
          </span>
        )}
      </button>

      {!collapsed && (
        <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100 mt-1">
          {group.items.map((item) => (
            <ChecklistItemComponent
              key={item.id}
              item={item}
              onToggle={onToggle}
              onNoteChange={onNoteChange}
              readonly={readonly}
            />
          ))}
        </div>
      )}
    </section>
  );
}
