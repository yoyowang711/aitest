"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/services/projectService";
import { getGuestId } from "@/lib/guest";
import type { Project } from "@/types";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const guestId = getGuestId();
    getProjects(guestId).then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

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
        <span className="text-sm text-gray-400">{projects.length} 个项目</span>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-400 text-center py-20">
          暂无项目，先在 Supabase 中插入数据
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </Layout>
  );
}
