import { describe, expect, it } from 'bun:test';
import { IntegrationSpecRegistry } from '../spec';
import { registerStripeIntegration, stripeIntegrationSpec } from './stripe';
import {
  postmarkIntegrationSpec,
  registerPostmarkIntegration,
} from './postmark';
import { qdrantIntegrationSpec, registerQdrantIntegration } from './qdrant';
import { linearIntegrationSpec, registerLinearIntegration } from './linear';
import { jiraIntegrationSpec, registerJiraIntegration } from './jira';
import { notionIntegrationSpec, registerNotionIntegration } from './notion';
import { granolaIntegrationSpec, registerGranolaIntegration } from './granola';
import { tldvIntegrationSpec, registerTldvIntegration } from './tldv';
import {
  firefliesIntegrationSpec,
  registerFirefliesIntegration,
} from './fireflies';
import { fathomIntegrationSpec, registerFathomIntegration } from './fathom';

describe('integration provider specs', () => {
  it('registers Stripe integration', () => {
    const registry = registerStripeIntegration(new IntegrationSpecRegistry());
    const registered = registry.get('payments.stripe', '1.0.0');
    expect(registered).toBe(stripeIntegrationSpec);
    expect(registered?.supportedModes).toEqual(['managed', 'byok']);
    expect(registered?.capabilities.provides).toEqual([
      { key: 'payments.psp', version: '1.0.0' },
    ]);
    expect(registered?.secretSchema.schema).toMatchObject({
      required: ['apiKey', 'webhookSecret'],
    });
  });

  it('registers Postmark integration', () => {
    const registry = registerPostmarkIntegration(new IntegrationSpecRegistry());
    const registered = registry.get('email.postmark', '1.0.0');
    expect(registered).toBe(postmarkIntegrationSpec);
    expect(registered?.supportedModes).toEqual(['managed', 'byok']);
    expect(registered?.secretSchema.schema).toMatchObject({
      required: ['serverToken'],
    });
  });

  it('registers Qdrant integration', () => {
    const registry = registerQdrantIntegration(new IntegrationSpecRegistry());
    const registered = registry.get('vectordb.qdrant', '1.0.0');
    expect(registered).toBe(qdrantIntegrationSpec);
    expect(registered?.supportedModes).toEqual(['managed', 'byok']);
    expect(registered?.capabilities.provides).toEqual([
      { key: 'vector-db.search', version: '1.0.0' },
      { key: 'vector-db.storage', version: '1.0.0' },
    ]);
  });

  it('registers Linear integration', () => {
    const registry = registerLinearIntegration(new IntegrationSpecRegistry());
    const registered = registry.get('project-management.linear', '1.0.0');
    expect(registered).toBe(linearIntegrationSpec);
    expect(registered?.capabilities.provides).toEqual([
      { key: 'project-management.work-items', version: '1.0.0' },
    ]);
  });

  it('registers Jira integration', () => {
    const registry = registerJiraIntegration(new IntegrationSpecRegistry());
    const registered = registry.get('project-management.jira', '1.0.0');
    expect(registered).toBe(jiraIntegrationSpec);
  });

  it('registers Notion integration', () => {
    const registry = registerNotionIntegration(new IntegrationSpecRegistry());
    const registered = registry.get('project-management.notion', '1.0.0');
    expect(registered).toBe(notionIntegrationSpec);
  });

  it('registers Granola integration', () => {
    const registry = registerGranolaIntegration(new IntegrationSpecRegistry());
    const registered = registry.get('meeting-recorder.granola', '1.0.0');
    expect(registered).toBe(granolaIntegrationSpec);
    expect(registered?.supportedModes).toEqual(['byok']);
    expect(registered?.capabilities.provides).toEqual([
      { key: 'meeting-recorder.meetings.read', version: '1.0.0' },
      { key: 'meeting-recorder.transcripts.read', version: '1.0.0' },
    ]);
    expect(registered?.secretSchema.schema).toMatchObject({
      required: ['apiKey'],
    });
  });

  it('registers tl;dv integration', () => {
    const registry = registerTldvIntegration(new IntegrationSpecRegistry());
    const registered = registry.get('meeting-recorder.tldv', '1.0.0');
    expect(registered).toBe(tldvIntegrationSpec);
    expect(registered?.supportedModes).toEqual(['byok']);
    expect(registered?.capabilities.provides).toEqual([
      { key: 'meeting-recorder.meetings.read', version: '1.0.0' },
      { key: 'meeting-recorder.transcripts.read', version: '1.0.0' },
      { key: 'meeting-recorder.webhooks', version: '1.0.0' },
    ]);
    expect(registered?.secretSchema.schema).toMatchObject({
      required: ['apiKey'],
    });
  });

  it('registers Fireflies integration', () => {
    const registry = registerFirefliesIntegration(
      new IntegrationSpecRegistry()
    );
    const registered = registry.get('meeting-recorder.fireflies', '1.0.0');
    expect(registered).toBe(firefliesIntegrationSpec);
    expect(registered?.supportedModes).toEqual(['byok']);
    expect(registered?.capabilities.provides).toEqual([
      { key: 'meeting-recorder.meetings.read', version: '1.0.0' },
      { key: 'meeting-recorder.transcripts.read', version: '1.0.0' },
      { key: 'meeting-recorder.webhooks', version: '1.0.0' },
    ]);
    expect(registered?.secretSchema.schema).toMatchObject({
      required: ['apiKey'],
    });
  });

  it('registers Fathom integration', () => {
    const registry = registerFathomIntegration(new IntegrationSpecRegistry());
    const registered = registry.get('meeting-recorder.fathom', '1.0.0');
    expect(registered).toBe(fathomIntegrationSpec);
    expect(registered?.supportedModes).toEqual(['byok']);
    expect(registered?.capabilities.provides).toEqual([
      { key: 'meeting-recorder.meetings.read', version: '1.0.0' },
      { key: 'meeting-recorder.transcripts.read', version: '1.0.0' },
      { key: 'meeting-recorder.webhooks', version: '1.0.0' },
    ]);
    expect(registered?.secretSchema.schema).toMatchObject({
      required: ['apiKey'],
    });
  });
});
