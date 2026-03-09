/**
 * Minimal bundle spec for example template shells.
 * Requires @contractspec/lib.surface-runtime when used.
 */

import { defineModuleBundle } from '@contractspec/lib.surface-runtime/spec';

export const ExampleTemplateBundle = defineModuleBundle({
  meta: {
    key: 'example.template',
    version: '0.1.0',
    title: 'Example Template',
    description: 'Adaptive template shell for ContractSpec examples',
    owners: ['team-platform'],
    tags: ['example', 'template'],
    stability: 'experimental',
  },

  routes: [
    {
      routeId: 'template',
      path: '/sandbox',
      defaultSurface: 'template-shell',
    },
  ],

  surfaces: {
    'template-shell': {
      surfaceId: 'template-shell',
      kind: 'workbench',
      title: 'Template Shell',
      slots: [
        {
          slotId: 'header',
          role: 'header',
          accepts: ['action-bar'],
          cardinality: 'many',
        },
        {
          slotId: 'primary',
          role: 'primary',
          accepts: ['entity-section', 'rich-doc', 'form', 'custom-widget'],
          cardinality: 'many',
        },
        {
          slotId: 'sidebar',
          role: 'secondary',
          accepts: ['entity-section', 'custom-widget'],
          cardinality: 'one',
        },
      ],

      layouts: [
        {
          layoutId: 'main-with-sidebar',
          title: 'Main with sidebar',
          root: {
            type: 'panel-group',
            direction: 'horizontal',
            persistKey: 'example.template.main-sidebar',
            children: [
              {
                type: 'panel-group',
                direction: 'vertical',
                persistKey: 'example.template.content',
                children: [
                  { type: 'slot', slotId: 'header' },
                  { type: 'slot', slotId: 'primary' },
                ],
              },
              { type: 'slot', slotId: 'sidebar' },
            ],
          },
        },
      ],
      data: [],

      verification: {
        dimensions: {
          guidance: 'Can reveal hints and walkthrough notes.',
          density: 'Can select compact or balanced layouts.',
          dataDepth: 'Controls content depth and expansion.',
          control: 'Shows advanced options when allowed.',
          media: 'Supports text-first and hybrid modes.',
          pace: 'Maps to motion tokens and transitions.',
          narrative: 'Can order summary before or after detail.',
        },
      },
    },
  },
});
