import type { RiskWarning } from "@/engine/riskRules";
import { Lightbulb } from "lucide-react";

export default function RiskWarnings({ warnings }: { warnings: RiskWarning[] }) {
  if (warnings.length === 0) return null;

  return (
    <div className="lg:sticky lg:top-20">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-1.5 mb-3 text-gray-400">
          <Lightbulb size={13} />
          <span className="text-xs font-medium">风险提示</span>
          <span className="text-[10px]">{warnings.length} 条</span>
        </div>

        <ul className="space-y-2.5">
          {warnings.map((w) => (
            <li key={w.id} className="text-xs">
              <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded mr-1.5">
                {w.category}
              </span>
              <span className="text-gray-700 font-medium">{w.title}</span>
              <p className="text-gray-400 mt-0.5 leading-relaxed">{w.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
