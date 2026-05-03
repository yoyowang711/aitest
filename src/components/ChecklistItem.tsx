"use client";

import { useState } from "react";
import type { ChecklistItem as ChecklistItemType } from "@/types";
import type { ChecklistStatus } from "@/types";
import { Check, Minus, Pencil } from "lucide-react";

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
  onNoteChange,
  readonly = false,
}: {
  item: ChecklistItemType;
  onToggle: (id: string, nextStatus: ChecklistStatus) => void;
  onNoteChange: (id: string, note: string) => void;
  readonly?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draftNote, setDraftNote] = useState(item.note);

  const handleToggle = () => {
    onToggle(item.id, STATUS_CYCLE[item.status]);
  };

  const handleSaveNote = () => {
    onNoteChange(item.id, draftNote);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveNote();
    if (e.key === "Escape") {
      setDraftNote(item.note);
      setEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-3 py-2.5 px-1 group">
      <button
        onClick={readonly ? undefined : handleToggle}
        disabled={readonly}
        className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
          readonly ? "cursor-default" : "cursor-pointer"
        } ${STATUS_STYLE[item.status]}`}
      >
        {STATUS_ICON[item.status]}
      </button>

      <span
        className={`flex-1 text-sm ${
          item.status === "n_a" ? "line-through text-gray-400" : "text-gray-800"
        }`}
      >
        {item.title}
        {item.required && (
          <span className="text-red-400 ml-0.5">*</span>
        )}
      </span>

      {readonly ? (
        item.note ? (
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded max-w-[120px] truncate">
            {item.note}
          </span>
        ) : null
      ) : editing ? (
        <input
          autoFocus
          className="text-xs px-2 py-1 rounded border border-gray-300 w-40 focus:outline-none focus:ring-1 focus:ring-gray-900"
          placeholder="输入备注..."
          value={draftNote}
          onChange={(e) => setDraftNote(e.target.value)}
          onBlur={handleSaveNote}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <button
          onClick={() => {
            setDraftNote(item.note);
            setEditing(true);
          }}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          {item.note ? (
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded max-w-[120px] truncate">
              {item.note}
            </span>
          ) : (
            <Pencil size={12} />
          )}
        </button>
      )}
    </div>
  );
}
