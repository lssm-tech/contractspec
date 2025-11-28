'use client';

import { useState } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
  memberCount: number;
  createdAt: string;
}

const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Marketing Site',
    description: 'Company marketing website and blog',
    status: 'active',
    memberCount: 5,
    createdAt: '2025-01-15',
  },
  {
    id: 'proj-2',
    name: 'Customer Portal',
    description: 'Self-service customer dashboard',
    status: 'active',
    memberCount: 8,
    createdAt: '2025-02-01',
  },
  {
    id: 'proj-3',
    name: 'Analytics Dashboard',
    description: 'Internal metrics and reporting',
    status: 'active',
    memberCount: 3,
    createdAt: '2025-02-20',
  },
];

export function SaasProjectList() {
  const [projects] = useState<Project[]>(SAMPLE_PROJECTS);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Projects</h3>
        <button
          type="button"
          className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600"
        >
          New Project
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{project.name}</h4>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {project.description}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  project.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'
                }`}
              >
                {project.status}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
              <span>{project.memberCount} members</span>
              <span>{project.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
