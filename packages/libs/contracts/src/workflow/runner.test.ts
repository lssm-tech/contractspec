import { describe, expect, it, vi } from 'vitest';
import {
  WorkflowRegistry,
  type WorkflowSpec,
  type Step,
} from './spec';
import { WorkflowRunner, type WorkflowRunnerConfig } from './runner';
import { InMemoryStateStore } from './adapters/memory-store';
import type { WorkflowState } from './state';
import { OwnersEnum, StabilityEnum, TagsEnum } from '../ownership';
import type { ResolvedAppConfig } from '../app-config/runtime';

function workflowSpec(overrides?: {
  steps?: Step[];
  transitions?: WorkflowSpec['definition']['transitions'];
}): WorkflowSpec {
  return {
    meta: {
      name: 'sigil.workflow.runner',
      version: 1,
      title: 'Runner Workflow',
      description: 'Workflow used in runner tests',
      domain: 'testing',
      owners: [OwnersEnum.PlatformSigil],
      tags: [TagsEnum.Auth],
      stability: StabilityEnum.Experimental,
    },
    definition: {
      entryStepId: 'start',
      steps: overrides?.steps ?? [
        {
          id: 'start',
          type: 'automation',
          label: 'Start',
          action: { operation: { name: 'sigil.start', version: 1 } },
        },
        {
          id: 'review',
          type: 'human',
          label: 'Review',
          action: { form: { key: 'reviewForm', version: 1 } },
        },
        {
          id: 'finish',
          type: 'automation',
          label: 'Finish',
          action: { operation: { name: 'sigil.finish', version: 1 } },
        },
      ],
      transitions:
        overrides?.transitions ?? [
          { from: 'start', to: 'review' },
          { from: 'review', to: 'finish', condition: 'data.approved === true' },
        ],
    },
  };
}

function createRunner(
  spec: WorkflowSpec,
  events: Array<{ event: string; payload: any }>,
  options?: Pick<
    WorkflowRunnerConfig,
    'appConfigProvider' | 'enforceCapabilities'
  >
) {
  const registry = new WorkflowRegistry();
  registry.register(spec);
  const store = new InMemoryStateStore();

  const opExecutor = vi.fn(async (op: { name: string }, _input?: unknown, _ctx?: unknown) => {
    if (op.name === 'sigil.start') return { approved: true };
    if (op.name === 'sigil.finish') return { done: true };
    return {};
  });

  const runner = new WorkflowRunner({
    registry,
    stateStore: store,
    opExecutor,
    appConfigProvider: options?.appConfigProvider,
    enforceCapabilities: options?.enforceCapabilities,
    eventEmitter: (event, payload) => events.push({ event, payload }),
  });

  return { runner, store, opExecutor };
}

describe('WorkflowRunner', () => {
  it('executes automation and human steps until completion', async () => {
    const events: Array<{ event: string; payload: any }> = [];
    const spec = workflowSpec();
    const { runner, store, opExecutor } = createRunner(spec, events);

    const workflowId = await runner.start(spec.meta.name);
    expect(events[0]).toMatchObject({ event: 'workflow.started' });

    let state = await runner.getState(workflowId);
    expect(state.currentStep).toBe('start');
    expect(state.status).toBe('running');

    await runner.executeStep(workflowId);
    state = await runner.getState(workflowId);
    expect(state.currentStep).toBe('review');
    expect(state.data.approved).toBe(true);
    expect(opExecutor).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'sigil.start' }),
      undefined,
      expect.objectContaining({ step: expect.objectContaining({ id: 'start' }) })
    );

    await runner.executeStep(workflowId, { confirmation: true });
    state = await runner.getState(workflowId);
    expect(state.currentStep).toBe('finish');
    expect(state.data.confirmation).toBe(true);

    await runner.executeStep(workflowId);
    state = await runner.getState(workflowId);
    expect(state.status).toBe('completed');
    expect(state.currentStep).toBe('finish');
    expect(events.some(({ event }) => event === 'workflow.step_completed')).toBe(true);
  });

  it('provides resolved app config context to the operation executor', async () => {
    const events: Array<{ event: string; payload: any }> = [];
    const spec = workflowSpec();
    const resolvedAppConfig: ResolvedAppConfig = {
      appId: 'demo-app',
      tenantId: 'tenant-1',
      blueprintName: 'demo.blueprint',
      blueprintVersion: 1,
      configVersion: 1,
      capabilities: { enabled: [], disabled: [] },
      features: { include: [], exclude: [] },
      dataViews: {},
      workflows: {},
      policies: [],
      experiments: { catalog: [], active: [], paused: [] },
      featureFlags: [],
      routes: [],
      integrations: [],
      knowledge: [],
      translation: {
        defaultLocale: 'en',
        supportedLocales: ['en'],
        blueprintCatalog: { name: 'demo.catalog', version: 1 },
        tenantOverrides: [],
      },
      branding: {
        appName: 'Demo App',
        assets: {},
        colors: { primary: '#000000', secondary: '#ffffff' },
        domain: 'tenant-1.demo.localhost',
      },
    };

    const { runner, opExecutor } = createRunner(spec, events, {
      appConfigProvider: async () => resolvedAppConfig,
    });

    const workflowId = await runner.start(spec.meta.name);
    await runner.executeStep(workflowId);

    const context = opExecutor.mock.calls[0]?.[2] as any;
    expect(context?.resolvedAppConfig).toBe(resolvedAppConfig);
    expect(context?.integrations).toEqual(resolvedAppConfig.integrations);
    expect(context?.knowledge).toEqual(resolvedAppConfig.knowledge);
    expect(context?.branding).toEqual(resolvedAppConfig.branding);
    expect(context?.translation).toEqual(resolvedAppConfig.translation);
  });

  it('invokes capability enforcement hook before executing operation', async () => {
    const events: Array<{ event: string; payload: any }> = [];
    const spec = workflowSpec();
    const enforceCapabilities = vi.fn();

    const { runner } = createRunner(spec, events, { enforceCapabilities });
    const workflowId = await runner.start(spec.meta.name);
    await runner.executeStep(workflowId);

    expect(enforceCapabilities).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'sigil.start' }),
      expect.objectContaining({ step: expect.objectContaining({ id: 'start' }) })
    );
  });

  it('rejects step execution when guard evaluates to false', async () => {
    const events: Array<{ event: string; payload: any }> = [];
    const guardedSpec = workflowSpec({
      steps: [
        {
          id: 'start',
          type: 'automation',
          label: 'Start',
          action: { operation: { name: 'sigil.start', version: 1 } },
        },
        {
          id: 'review',
          type: 'human',
          label: 'Review',
          guard: { type: 'expression', value: 'data.approved === true' },
          action: { form: { key: 'reviewForm', version: 1 } },
        },
      ],
      transitions: [{ from: 'start', to: 'review' }],
    });

    const { runner, store } = createRunner(guardedSpec, events);
    const workflowId = await runner.start(guardedSpec.meta.name);
    await runner.executeStep(workflowId); // start -> review, approved === true

    // Force guard to fail by removing approval flag.
    await store.update(workflowId, (current: WorkflowState) => ({
      ...current,
      data: {},
    }));

    await expect(runner.executeStep(workflowId)).rejects.toThrow(/GuardRejected/);
    const state = await runner.getState(workflowId);
    expect(state.currentStep).toBe('review');
    expect(state.status).toBe('running');
  });

  it('cancels a workflow', async () => {
    const events: Array<{ event: string; payload: any }> = [];
    const spec = workflowSpec();
    const { runner } = createRunner(spec, events);

    const workflowId = await runner.start(spec.meta.name);
    await runner.cancel(workflowId);
    const state = await runner.getState(workflowId);
    expect(state.status).toBe('cancelled');
    expect(events.some(({ event }) => event === 'workflow.cancelled')).toBe(true);
  });
});

