import { definePresentation, StabilityEnum } from '@contractspec/lib.contracts-spec';
import { ProjectModel } from './project.schema';

/**
 * Presentation for displaying a list of projects.
 */
export const ProjectListPresentation = definePresentation({
  meta: {
    key: 'saas.project.list',
    version: '1.0.0',
    title: 'Project List',
    description:
      'List view of projects with status, tags, and last updated info',
    domain: 'saas-boilerplate',
    owners: ['@saas-team'],
    tags: ['project', 'list', 'dashboard'],
    stability: StabilityEnum.Beta,
    goal: 'Browse and manage projects',
    context: 'Project list page',
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
});

/**
 * Presentation for project detail view.
 */
export const ProjectDetailPresentation = definePresentation({
  meta: {
    key: 'saas.project.detail',
    version: '1.0.0',
    title: 'Project Details',
    description: 'Detailed view of a project with settings and activity',
    domain: 'saas-boilerplate',
    owners: ['@saas-team'],
    tags: ['project', 'detail'],
    stability: StabilityEnum.Beta,
    goal: 'View and edit project details',
    context: 'Project detail page',
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
});
