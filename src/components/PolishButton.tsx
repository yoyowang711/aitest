"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";

export default function PolishButton({
  projectName,
  rawContent,
}: {
  projectName: string;
  rawContent: string;
}) {
  const [polished, setPolished] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePolish = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, rawContent }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "请求失败");
      } else {
        setPolished(data.polished);
      }
    } catch {
      setError("网络异常，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 按钮 */}
      {!polished && (
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handlePolish}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            {loading ? "润色中..." : "AI 润色"}
          </button>
          {error && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-600">
              <AlertTriangle size={12} />
              {error}，保留原始文本
            </span>
          )}
        </div>
      )}

      {/* 润色后内容 */}
      {polished && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-blue-500" />
            <span className="text-xs text-blue-600 font-medium">AI 润色版本</span>
            <button
              onClick={() => setPolished(null)}
              className="text-xs text-gray-400 hover:text-gray-600 ml-auto"
            >
              查看原始
            </button>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-6">
            <p className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
              {polished}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
