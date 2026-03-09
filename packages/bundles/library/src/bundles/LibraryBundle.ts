/**
 * Library bundle spec for workspace shell (sandbox, docs, templates).
 * Uses @contractspec/lib.surface-runtime for adaptive, preference-driven layouts.
 */

import { defineModuleBundle } from '@contractspec/lib.surface-runtime/spec';

export const LibraryBundle = defineModuleBundle({
  meta: {
    key: 'library.workspace',
    version: '0.1.0',
    title: 'Library Workspace',
    description:
      'Workspace shell for docs, templates, sandbox, and feature discovery',
    owners: ['team-platform'],
    tags: ['library', 'workspace', 'docs', 'sandbox', 'templates'],
    stability: 'experimental',
  },

  routes: [
    {
      routeId: 'sandbox',
      path: '/sandbox',
      defaultSurface: 'workspace-shell',
    },
    {
      routeId: 'docs',
      path: '/docs',
      defaultSurface: 'workspace-shell',
    },
    {
      routeId: 'docs-slug',
      path: '/docs/:slug',
      defaultSurface: 'workspace-shell',
    },
    {
      routeId: 'studio',
      path: '/studio/:projectSlug',
      defaultSurface: 'workspace-shell',
    },
  ],

  surfaces: {
    'workspace-shell': {
      surfaceId: 'workspace-shell',
      kind: 'workbench',
      title: 'Workspace Shell',
      slots: [
        {
          slotId: 'header',
          role: 'header',
          accepts: ['action-bar'],
          cardinality: 'many',
        },
        {
          slotId: 'sidebar',
          role: 'secondary',
          accepts: ['entity-section', 'custom-widget'],
          cardinality: 'one',
        },
        {
          slotId: 'primary',
          role: 'primary',
          accepts: [
            'entity-section',
            'rich-doc',
            'data-view',
            'form',
            'custom-widget',
          ],
          cardinality: 'many',
          mutableByAi: true,
          mutableByUser: true,
        },
        {
          slotId: 'assistant',
          role: 'assistant',
          accepts: ['assistant-panel', 'chat-thread'],
          cardinality: 'many',
          mutableByAi: true,
          mutableByUser: true,
        },
      ],

      layouts: [
        {
          layoutId: 'sidebar-main',
          title: 'Sidebar + Main',
          root: {
            type: 'panel-group',
            direction: 'horizontal',
            persistKey: 'library.workspace.sidebar-main',
            children: [
              { type: 'slot', slotId: 'sidebar' },
              {
                type: 'panel-group',
                direction: 'vertical',
                persistKey: 'library.workspace.content',
                children: [
                  { type: 'slot', slotId: 'header' },
                  { type: 'slot', slotId: 'primary' },
                ],
              },
            ],
          },
        },
        {
          layoutId: 'sidebar-main-assistant',
          title: 'Sidebar + Main + Assistant',
          root: {
            type: 'panel-group',
            direction: 'horizontal',
            persistKey: 'library.workspace.sidebar-main-assistant',
            children: [
              { type: 'slot', slotId: 'sidebar' },
              {
                type: 'panel-group',
                direction: 'vertical',
                persistKey: 'library.workspace.content',
                children: [
                  { type: 'slot', slotId: 'header' },
                  { type: 'slot', slotId: 'primary' },
                ],
              },
              { type: 'slot', slotId: 'assistant' },
            ],
          },
        },
      ],

      data: [],

      verification: {
        dimensions: {
          guidance:
            'Can reveal walkthrough notes, field help, and contextual hints.',
          density:
            'Can select compact, balanced, or dense layouts for docs and templates.',
          dataDepth:
            'Controls content depth, pagination size, and inline expansion.',
          control:
            'Shows advanced commands and raw config only when allowed.',
          media:
            'Supports text-first docs, visual templates, and hybrid modes.',
          pace: 'Maps to motion tokens and confirmation behavior.',
          narrative:
            'Can order summary before or after detail sections.',
        },
      },
    },
  },
});
