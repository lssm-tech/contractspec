/**
 * Marketing bundle spec for landing, template gallery, and changelog surfaces.
 * Uses @contractspec/lib.surface-runtime for adaptive, preference-driven layouts.
 */

import { defineModuleBundle } from '@contractspec/lib.surface-runtime/spec';

export const MarketingBundle = defineModuleBundle({
  meta: {
    key: 'marketing.pages',
    version: '0.1.0',
    title: 'Marketing Pages',
    description:
      'Adaptive surfaces for landing, template gallery, changelog, and product pages',
    owners: ['team-platform'],
    tags: ['marketing', 'landing', 'templates', 'changelog'],
    stability: 'experimental',
  },

  routes: [
    {
      routeId: 'landing',
      path: '/',
      defaultSurface: 'landing',
    },
    {
      routeId: 'product',
      path: '/product',
      defaultSurface: 'product',
    },
    {
      routeId: 'templates',
      path: '/templates',
      defaultSurface: 'template-gallery',
    },
    {
      routeId: 'changelog',
      path: '/changelog',
      defaultSurface: 'changelog',
    },
    {
      routeId: 'contact',
      path: '/contact',
      defaultSurface: 'contact',
    },
  ],

  surfaces: {
    landing: {
      surfaceId: 'landing',
      kind: 'overview',
      title: 'Landing Page',
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
          accepts: ['entity-section', 'custom-widget'],
          cardinality: 'many',
        },
      ],
      layouts: [
        {
          layoutId: 'single-column',
          title: 'Single column',
          root: {
            type: 'panel-group',
            direction: 'vertical',
            persistKey: 'marketing.landing',
            children: [
              { type: 'slot', slotId: 'header' },
              { type: 'slot', slotId: 'primary' },
            ],
          },
        },
      ],
      data: [],
      verification: {
        dimensions: {
          guidance:
            'Can reveal product tour, feature highlights, and contextual CTAs.',
          density: 'Can select compact hero or detailed multi-section layouts.',
          dataDepth: 'Controls section depth and inline expansion.',
          control: 'Shows advanced navigation when allowed.',
          media: 'Supports text-first, visual hero, and hybrid modes.',
          pace: 'Maps to scroll and transition behavior.',
          narrative:
            'Can order hero before or after problem/solution sections.',
        },
      },
    },
    'template-gallery': {
      surfaceId: 'template-gallery',
      kind: 'list',
      title: 'Template Gallery',
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
          accepts: ['entity-section', 'table', 'custom-widget'],
          cardinality: 'many',
        },
      ],
      layouts: [
        {
          layoutId: 'gallery',
          title: 'Gallery',
          root: {
            type: 'panel-group',
            direction: 'vertical',
            persistKey: 'marketing.templates',
            children: [
              { type: 'slot', slotId: 'header' },
              { type: 'slot', slotId: 'primary' },
            ],
          },
        },
      ],
      data: [],
      verification: {
        dimensions: {
          guidance:
            'Can reveal template descriptions, filters, and preview hints.',
          density:
            'Can select grid density (compact, standard, detailed cards).',
          dataDepth: 'Controls template metadata and preview depth.',
          control: 'Shows filters and sort when allowed.',
          media: 'Supports card grid, list, and preview modes.',
          pace: 'Maps to modal and transition behavior.',
          narrative: 'Can order featured templates before or after full list.',
        },
      },
    },
    changelog: {
      surfaceId: 'changelog',
      kind: 'timeline',
      title: 'Changelog',
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
          accepts: ['entity-section', 'timeline', 'custom-widget'],
          cardinality: 'many',
        },
      ],
      layouts: [
        {
          layoutId: 'timeline',
          title: 'Timeline',
          root: {
            type: 'panel-group',
            direction: 'vertical',
            persistKey: 'marketing.changelog',
            children: [
              { type: 'slot', slotId: 'header' },
              { type: 'slot', slotId: 'primary' },
            ],
          },
        },
      ],
      data: [],
      verification: {
        dimensions: {
          guidance: 'Can reveal version notes and migration hints.',
          density: 'Can select compact or detailed changelog entries.',
          dataDepth: 'Controls entry expansion and diff visibility.',
          control: 'Shows filters and version navigation when allowed.',
          media: 'Supports text-first and code-highlight modes.',
          pace: 'Maps to scroll and expand behavior.',
          narrative: 'Can order newest-first or oldest-first chronology.',
        },
      },
    },
    product: {
      surfaceId: 'product',
      kind: 'overview',
      title: 'Product Page',
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
          accepts: ['entity-section', 'custom-widget'],
          cardinality: 'many',
        },
      ],
      layouts: [
        {
          layoutId: 'product-layout',
          title: 'Product',
          root: {
            type: 'panel-group',
            direction: 'vertical',
            persistKey: 'marketing.product',
            children: [
              { type: 'slot', slotId: 'header' },
              { type: 'slot', slotId: 'primary' },
            ],
          },
        },
      ],
      data: [],
      verification: {
        dimensions: {
          guidance: 'Can reveal product features and comparison hints.',
          density: 'Can select compact or detailed product sections.',
          dataDepth: 'Controls feature depth and comparison tables.',
          control: 'Shows pricing and plan details when allowed.',
          media: 'Supports text-first and visual feature modes.',
          pace: 'Maps to section transitions.',
          narrative: 'Can order value prop before or after feature details.',
        },
      },
    },
    contact: {
      surfaceId: 'contact',
      kind: 'detail',
      title: 'Contact',
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
          accepts: ['form', 'entity-section', 'custom-widget'],
          cardinality: 'many',
        },
      ],
      layouts: [
        {
          layoutId: 'contact-layout',
          title: 'Contact',
          root: {
            type: 'panel-group',
            direction: 'vertical',
            persistKey: 'marketing.contact',
            children: [
              { type: 'slot', slotId: 'header' },
              { type: 'slot', slotId: 'primary' },
            ],
          },
        },
      ],
      data: [],
      verification: {
        dimensions: {
          guidance: 'Can reveal form hints and validation help.',
          density: 'Can select compact or detailed form layout.',
          dataDepth: 'Controls field visibility and validation depth.',
          control: 'Shows additional contact options when allowed.',
          media: 'Supports text-first form and hybrid modes.',
          pace: 'Maps to validation and submit feedback.',
          narrative: 'Can order form before or after contact info.',
        },
      },
    },
  },
});
