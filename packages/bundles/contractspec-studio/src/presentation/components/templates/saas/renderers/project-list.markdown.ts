/**
 * Markdown renderer for SaaS Project List presentation
 *
 * Uses dynamic import to ensure correct build order.
 */
import type { PresentationRenderer } from '@lssm/lib.contracts';
import { mockListProjectsHandler } from '@lssm/example.saas-boilerplate/handlers';

interface ProjectItem {
  id: string;
  name: string;
  status: string;
  description?: string;
}

export const projectListMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc, ctx) => {
    const data = await mockListProjectsHandler({
      limit: 20,
      offset: 0,
    });

    // The example handler returns 'projects', not 'items'
    const items =
      (data as { projects?: ProjectItem[]; items?: ProjectItem[] }).projects ??
      (data as { items?: ProjectItem[] }).items ??
      [];

    const lines: string[] = [
      '# Projects',
      '',
      `**Total**: ${data.total} projects`,
      '',
    ];

    if (items.length === 0) {
      lines.push('_No projects found._');
    } else {
      for (const project of items) {
        const status =
          project.status === 'ACTIVE'
            ? '✅'
            : project.status === 'ARCHIVED'
              ? '📦'
              : '⏸️';
        lines.push(`- ${status} **${project.name}** - ${project.status}`);
      }
    }

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};
