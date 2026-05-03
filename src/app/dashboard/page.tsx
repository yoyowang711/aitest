"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import ProjectCard from "@/components/ProjectCard";
import { getProjects, createProject } from "@/services/projectService";
import { getGuestId } from "@/lib/guest";
import type { Project, ProjectType } from "@/types";
import { Loader2, Plus, X } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<ProjectType>("app");
  const [submitting, setSubmitting] = useState(false);

  const loadProjects = () => {
    const guestId = getGuestId();
    getProjects(guestId).then((data) => {
      setProjects(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    const guestId = getGuestId();
    const project = await createProject(name.trim(), type, guestId);
    setSubmitting(false);
    if (project) {
      setShowModal(false);
      setName("");
      router.push(`/project/${project.id}`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">项目列表</h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          新建项目
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-4">暂无项目</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            创建第一个项目
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* 弹窗 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">新建项目</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <label className="flex flex-col gap-1.5 mb-4">
              <span className="text-sm font-medium text-gray-700">项目名称</span>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="输入项目名称"
              />
            </label>

            <label className="flex flex-col gap-1.5 mb-5">
              <span className="text-sm font-medium text-gray-700">项目类型</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ProjectType)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="app">📱 App</option>
                <option value="web">🌐 Web</option>
                <option value="backend">⚙️ 后台</option>
              </select>
            </label>

            <button
              onClick={handleCreate}
              disabled={submitting || !name.trim()}
              className="w-full py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {submitting ? "创建中..." : "创建项目"}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
