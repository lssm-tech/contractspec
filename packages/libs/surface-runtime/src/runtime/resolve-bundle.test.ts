import { describe, expect, it } from 'bun:test';
import { buildContext } from './build-context';
import { defineModuleBundle } from '../spec/define-module-bundle';
import { resolveBundle } from './resolve-bundle';
import {
  createInMemoryOverrideStore,
  buildOverrideTargetKey,
} from './override-store';

describe('resolveBundle', () => {
  const bundle = defineModuleBundle({
    meta: { key: 'pm.workbench', version: '0.1.0', title: 'PM Workbench' },
    routes: [
      {
        routeId: 'pm-issue',
        path: '/operate/pm/issues/:issueId',
        defaultSurface: 'issue-workbench',
      },
    ],
    surfaces: {
      'issue-workbench': {
        surfaceId: 'issue-workbench',
        kind: 'workbench',
        title: 'Issue Workbench',
        slots: [
          {
            slotId: 'primary',
            role: 'primary',
            accepts: ['entity-section', 'table'],
            cardinality: 'many',
          },
        ],
        layouts: [
          {
            layoutId: 'balanced',
            root: { type: 'slot', slotId: 'primary' },
          },
          {
            layoutId: 'dense',
            when: (ctx) => ctx.preferences.density === 'dense',
            root: { type: 'slot', slotId: 'primary' },
          },
        ],
        data: [],
        verification: {
          dimensions: {
            guidance: 'Hints available on hover or focus.',
            density: 'Layouts adapt from compact to dense.',
            dataDepth: 'Depth controls relation hydration.',
            control: 'Controls visible per capability.',
            media: 'Media supports text and visual modes.',
            pace: 'Pace maps to motion tokens.',
            narrative: 'Narrative order summary vs evidence.',
          },
        },
      },
    },
  });

  it('resolves to surface plan for matching route', async () => {
    const plan = await resolveBundle(bundle, {
      tenantId: 't1',
      route: '/operate/pm/issues/123',
      params: { issueId: '123' },
      query: {},
      device: 'desktop',
      preferences: {
        guidance: 'hints',
        density: 'standard',
        dataDepth: 'detailed',
        control: 'standard',
        media: 'text',
        pace: 'balanced',
        narrative: 'top-down',
      },
      capabilities: [],
    });
    expect(plan.bundleKey).toBe('pm.workbench');
    expect(plan.surfaceId).toBe('issue-workbench');
    expect(plan.layoutId).toBe('balanced');
    expect(plan.audit.reasons).toContain('surface=issue-workbench');
  });

  it('applies overlay merge when overlayMerge option provided', async () => {
    const store = createInMemoryOverrideStore();
    const targetKey = buildOverrideTargetKey(
      'pm.workbench',
      'issue-workbench',
      'pm-issue'
    );
    await store.save('user', targetKey, [
      {
        op: 'insert-node',
        slotId: 'primary',
        node: {
          nodeId: 'ov-node-1',
          kind: 'entity-card',
          title: 'Overlay Card',
        },
      },
    ]);
    const plan = await resolveBundle(
      bundle,
      {
        tenantId: 't1',
        route: '/operate/pm/issues/123',
        params: { issueId: '123' },
        query: {},
        device: 'desktop',
        preferences: {
          guidance: 'hints',
          density: 'standard',
          dataDepth: 'detailed',
          control: 'standard',
          media: 'text',
          pace: 'balanced',
          narrative: 'top-down',
        },
        capabilities: [],
      },
      { overlayMerge: { overrideStore: store } }
    );
    expect(plan.nodes).toHaveLength(1);
    expect(plan.nodes[0]?.nodeId).toBe('ov-node-1');
    expect(plan.overlays).toHaveLength(1);
    expect(plan.overlays[0]?.scope).toBe('user');
  });

  it('selects dense layout when preference matches', async () => {
    const plan = await resolveBundle(bundle, {
      tenantId: 't1',
      route: '/operate/pm/issues/456',
      params: { issueId: '456' },
      query: {},
      device: 'desktop',
      preferences: {
        guidance: 'hints',
        density: 'dense',
        dataDepth: 'detailed',
        control: 'standard',
        media: 'text',
        pace: 'balanced',
        narrative: 'top-down',
      },
      capabilities: [],
    });
    expect(plan.layoutId).toBe('dense');
  });

  it('selects layout from activeViewId when entity and viewKinds present', async () => {
    const { PmWorkbenchBundle } =
      await import('../examples/pm-workbench.bundle');
    const plan = await resolveBundle(PmWorkbenchBundle, {
      tenantId: 't1',
      route: '/operate/pm/issues/123',
      params: { issueId: '123' },
      query: {},
      device: 'desktop',
      entity: { type: 'pm.issue', id: '123' },
      activeViewId: 'balanced-detail',
      preferences: {
        guidance: 'hints',
        density: 'standard',
        dataDepth: 'detailed',
        control: 'standard',
        media: 'text',
        pace: 'balanced',
        narrative: 'top-down',
      },
      capabilities: [],
    });
    expect(plan.layoutId).toBe('balanced-three-pane');
  });
});

describe('buildContext', () => {
  it('builds full context from minimal params', () => {
    const ctx = buildContext({ route: '/operate/pm/issues/123' });
    expect(ctx.route).toBe('/operate/pm/issues/123');
    expect(ctx.tenantId).toBe('default');
    expect(ctx.device).toBe('desktop');
    expect(ctx.preferences.density).toBe('standard');
    expect(ctx.preferences.guidance).toBe('hints');
  });

  it('merges partial preferences', () => {
    const ctx = buildContext({
      route: '/test',
      preferences: { density: 'dense' },
    });
    expect(ctx.preferences.density).toBe('dense');
    expect(ctx.preferences.guidance).toBe('hints');
  });
});

describe('resolveBundle fallbacks', () => {
  it('resolves data recipe bindings', async () => {
    const bundle = defineModuleBundle({
      meta: { key: 'x', version: '0.1.0', title: 'X' },
      routes: [{ routeId: 'r', path: '/', defaultSurface: 's' }],
      surfaces: {
        s: {
          surfaceId: 's',
          kind: 'workbench',
          title: 'S',
          slots: [
            {
              slotId: 'p',
              role: 'primary',
              accepts: ['entity-section'],
              cardinality: 'many',
            },
          ],
          layouts: [{ layoutId: 'l', root: { type: 'slot', slotId: 'p' } }],
          data: [
            {
              recipeId: 'issue',
              source: { kind: 'entity', entityType: 'issue' },
              hydrateInto: 'issue',
            },
          ],
          verification: {
            dimensions: {
              guidance: 'Guidance hints available.',
              density: 'Density layout options.',
              dataDepth: 'Data depth controls.',
              control: 'Control visibility.',
              media: 'Media mode support.',
              pace: 'Pace for transitions.',
              narrative: 'Narrative flow order.',
            },
          },
        },
      },
    });
    const ctx = buildContext({ route: '/' });
    const plan = await resolveBundle(bundle, ctx);
    expect(plan.bindings.issue).toEqual({
      recipeId: 'issue',
      source: { kind: 'entity', entityType: 'issue' },
      _stub: true,
    });
  });

  it('includes audit metadata', async () => {
    const bundle = defineModuleBundle({
      meta: { key: 'x', version: '0.1.0', title: 'X' },
      routes: [{ routeId: 'r', path: '/', defaultSurface: 's' }],
      surfaces: {
        s: {
          surfaceId: 's',
          kind: 'workbench',
          title: 'S',
          slots: [
            {
              slotId: 'p',
              role: 'primary',
              accepts: ['entity-section'],
              cardinality: 'many',
            },
          ],
          layouts: [{ layoutId: 'l', root: { type: 'slot', slotId: 'p' } }],
          data: [],
          verification: {
            dimensions: {
              guidance: 'Guidance hints available.',
              density: 'Density layout options.',
              dataDepth: 'Data depth controls.',
              control: 'Control visibility.',
              media: 'Media mode support.',
              pace: 'Pace for transitions.',
              narrative: 'Narrative flow order.',
            },
          },
        },
      },
    });
    const ctx = buildContext({ route: '/' });
    const plan = await resolveBundle(bundle, ctx);
    expect(plan.audit.resolutionId).toMatch(/^res_/);
    expect(plan.audit.createdAt).toBeDefined();
  });

  it('returns actions and commands from surface', async () => {
    const bundle = defineModuleBundle({
      meta: { key: 'x', version: '0.1.0', title: 'X' },
      routes: [{ routeId: 'r', path: '/', defaultSurface: 's' }],
      surfaces: {
        s: {
          surfaceId: 's',
          kind: 'workbench',
          title: 'S',
          slots: [
            {
              slotId: 'p',
              role: 'primary',
              accepts: ['entity-section'],
              cardinality: 'many',
            },
          ],
          layouts: [{ layoutId: 'l', root: { type: 'slot', slotId: 'p' } }],
          data: [],
          actions: [{ actionId: 'a1', title: 'Action 1', placement: 'header' }],
          commands: [{ commandId: 'c1', title: 'Cmd 1', intent: 'do' }],
          verification: {
            dimensions: {
              guidance: 'Guidance hints available.',
              density: 'Density layout options.',
              dataDepth: 'Data depth controls.',
              control: 'Control visibility.',
              media: 'Media mode support.',
              pace: 'Pace for transitions.',
              narrative: 'Narrative flow order.',
            },
          },
        },
      },
    });
    const ctx = buildContext({ route: '/' });
    const plan = await resolveBundle(bundle, ctx);
    expect(plan.actions).toHaveLength(1);
    expect(plan.actions[0]?.actionId).toBe('a1');
    expect(plan.commands).toHaveLength(1);
    expect(plan.commands[0]?.commandId).toBe('c1');
  });

  it('returns adaptation with applied dimensions', async () => {
    const bundle = defineModuleBundle({
      meta: { key: 'x', version: '0.1.0', title: 'X' },
      routes: [{ routeId: 'r', path: '/', defaultSurface: 's' }],
      surfaces: {
        s: {
          surfaceId: 's',
          kind: 'workbench',
          title: 'S',
          slots: [
            {
              slotId: 'p',
              role: 'primary',
              accepts: ['entity-section'],
              cardinality: 'many',
            },
          ],
          layouts: [{ layoutId: 'l', root: { type: 'slot', slotId: 'p' } }],
          data: [],
          verification: {
            dimensions: {
              guidance: 'Guidance hints available.',
              density: 'Density layout options.',
              dataDepth: 'Data depth controls.',
              control: 'Control visibility.',
              media: 'Media mode support.',
              pace: 'Pace for transitions.',
              narrative: 'Narrative flow order.',
            },
          },
        },
      },
    });
    const ctx = buildContext({ route: '/', preferences: { density: 'dense' } });
    const plan = await resolveBundle(bundle, ctx);
    expect(plan.adaptation.appliedDimensions.density).toBe('dense');
    expect(plan.overlays).toEqual([]);
    expect(plan.ai).toBeDefined();
  });

  it('returns error plan when resolution fails', async () => {
    const bundle = defineModuleBundle({
      meta: { key: 'x', version: '0.1.0', title: 'X' },
      routes: [{ routeId: 'r', path: '/', defaultSurface: 'missing' }],
      surfaces: {
        s: {
          surfaceId: 's',
          kind: 'workbench',
          title: 'S',
          slots: [
            {
              slotId: 'p',
              role: 'primary',
              accepts: ['entity-section'],
              cardinality: 'many',
            },
          ],
          layouts: [{ layoutId: 'l', root: { type: 'slot', slotId: 'p' } }],
          data: [],
          verification: {
            dimensions: {
              guidance: 'Guidance hints available.',
              density: 'Density layout options.',
              dataDepth: 'Data depth controls.',
              control: 'Control visibility.',
              media: 'Media mode support.',
              pace: 'Pace for transitions.',
              narrative: 'Narrative flow order.',
            },
          },
        },
      },
    });
    const ctx = buildContext({ route: '/' });
    const plan = await resolveBundle(bundle, ctx);
    expect(plan.surfaceId).toBe('_error');
    expect(plan.layoutId).toBe('_error');
    expect(plan.audit.reasons).toContain('fallback=error');
  });
});
