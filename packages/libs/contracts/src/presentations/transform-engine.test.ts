import { describe, expect, it } from 'bun:test';
import { type PresentationSpec } from './presentations';
import {
  createDefaultTransformEngine,
  registerBasicValidation,
  registerDefaultReactRenderer,
} from './transform-engine';

const mk = (over: Partial<PresentationSpec> = {}): PresentationSpec => ({
  meta: {
    key: 'x.test',
    version: '1.0.0',
    description: 'desc',
    domain: 'domain',
    stability: 'stable',
    owners: ['platform.content'],
    tags: [],
    title: 'Test Presentation',
    goal: 'Test Goal',
    context: 'Test Context',
  },
  source: { type: 'blocknotejs', docJson: { type: 'doc' } },
  targets: ['markdown', 'application/json', 'application/xml'],
  ...over,
});

describe('TransformEngine', () => {
  it('renders markdown/json/xml with PII redaction', async () => {
    const engine = registerBasicValidation(
      registerDefaultReactRenderer(createDefaultTransformEngine())
    );
    const d = mk({ policy: { pii: ['meta.key'] } });
    const md = await engine.render<{ mimeType: 'text/markdown'; body: string }>(
      'markdown',
      d
    );
    expect(md.mimeType).toBe('text/markdown');
    const js = await engine.render<{
      mimeType: 'application/json';
      body: string;
    }>('application/json', d);
    expect(js.mimeType).toBe('application/json');
    expect(js.body).toContain('[REDACTED]');
    const xml = await engine.render<{
      mimeType: 'application/xml';
      body: string;
    }>('application/xml', d);
    expect(xml.mimeType).toBe('application/xml');
    expect(xml.body).toContain('%5BREDACTED%5D');
  });

  it('validates meta.description presence', async () => {
    const engine = registerBasicValidation(
      registerDefaultReactRenderer(createDefaultTransformEngine())
    );

    const bad = mk({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      meta: { key: 'a', version: '1.0.0', description: '' } as any,
    });
    await expect(engine.render('application/json', bad)).rejects.toThrow();
  });
});
