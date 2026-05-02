"use client";

import type { ChecklistItem as ChecklistItemType } from "@/types";
import type { ChecklistStatus } from "@/types";
import { Check, Minus } from "lucide-react";

const STATUS_CYCLE: Record<ChecklistStatus, ChecklistStatus> = {
  todo: "done",
  done: "n_a",
  n_a: "todo",
};

const STATUS_STYLE: Record<ChecklistStatus, string> = {
  todo: "border-gray-300 bg-white text-gray-400",
  done: "bg-green-500 border-green-500 text-white",
  n_a: "bg-gray-300 border-gray-300 text-gray-500",
};

const STATUS_ICON: Record<ChecklistStatus, React.ReactNode> = {
  todo: null,
  done: <Check size={12} strokeWidth={3} />,
  n_a: <Minus size={12} strokeWidth={3} />,
};

export default function ChecklistItemComponent({
  item,
  onToggle,
}: {
  item: ChecklistItemType;
  onToggle: (id: string, nextStatus: ChecklistStatus) => void;
}) {
  const handleToggle = () => {
    onToggle(item.id, STATUS_CYCLE[item.status]);
  };

  return (
    <div className="flex items-center gap-3 py-2.5 px-1 group">
      <button
        onClick={handleToggle}
        className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${STATUS_STYLE[item.status]}`}
      >
        {STATUS_ICON[item.status]}
      </button>
      <span
        className={`flex-1 text-sm ${
          item.status === "n_a" ? "line-through text-gray-400" : "text-gray-800"
        }`}
      >
        {item.title}
      </span>
      {item.note && (
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{item.note}</span>
      )}
    </div>
  );
}
