import Link from "next/link";
import type { Project } from "@/types";

function ProjectTypeBadge({ type }: { type: Project["type"] }) {
  const map = { app: "📱 App", web: "🌐 Web", backend: "⚙️ 后台" };
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
      {map[type]}
    </span>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/project/${project.id}`}
      className="block p-5 rounded-xl border border-gray-200 bg-white hover:shadow-md hover:border-gray-300 transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <ProjectTypeBadge type={project.type} />
        <span className="text-xs text-gray-400">{project.created_at.slice(0, 10)}</span>
      </div>
      <h3 className="font-semibold text-gray-900">{project.name}</h3>
    </Link>
  );
}
