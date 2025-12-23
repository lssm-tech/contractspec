import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { ProjectModel } from './project.schema';

/**
 * Presentation for displaying a list of projects.
 */
export const ProjectListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'saas.project.list',
    version: 1,
    description:
      'List view of projects with status, tags, and last updated info',
    domain: 'saas-boilerplate',
    owners: ['@saas-team'],
    tags: ['project', 'list', 'dashboard'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ProjectListView',
    props: ProjectModel,
  },
  targets: ['react', 'markdown', 'application/json'],
  policy: {
    flags: ['saas.projects.enabled'],
  },
};

/**
 * Presentation for project detail view.
 */
export const ProjectDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'saas.project.detail',
    version: 1,
    description: 'Detailed view of a project with settings and activity',
    domain: 'saas-boilerplate',
    owners: ['@saas-team'],
    tags: ['project', 'detail'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ProjectDetailView',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['saas.projects.enabled'],
  },
};
