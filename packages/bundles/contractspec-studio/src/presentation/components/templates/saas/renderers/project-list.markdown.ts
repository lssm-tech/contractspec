/**
 * Markdown renderer for SaaS Project List presentation
 *
 * Uses dynamic import to ensure correct build order.
 */
import type { PresentationRenderer } from '@lssm/lib.contracts';
import type { Project } from '../hooks/useProjectList';
import { mockListProjectsHandler } from '@lssm/example.saas-boilerplate/handlers/index';

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

    const lines: string[] = [
      '# Projects',
      '',
      `**Total**: ${data.total} projects`,
      '',
    ];

    if (data.projects.length === 0) {
      lines.push('_No projects found._');
    } else {
      for (const project of data.projects) {
        const status =
          project.status === 'ACTIVE'
            ? '✅'
            : project.status === 'ARCHIVED'
              ? '📦'
              : '⏸️';
        lines.push(
          `- ${status} **${(project as Project).name}** - ${project.status}`
        );
      }
    }

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};
