import { describe, expect, it } from 'bun:test';
import { scanFeatureSource } from './feature-scan';

describe('scanFeatureSource', () => {
  it('extracts metadata with string versions', () => {
    const code = `
      export const Feature = defineFeature({
        meta: {
          key: 'my.feature',
          version: '1.0.0',
          title: 'My Feature',
          description: 'A test feature',
          owners: ['platform.core'],
          tags: ['test'],
          stability: 'experimental',
        },
        operations: [
          { key: 'op.one', version: '1.2.3' },
          { key: 'op.two', version: '2.0.0' },
        ],
        events: [
          { key: 'event.one', version: '0.1.0' },
        ],
        presentations: [
          { key: 'pres.one', version: '3.0.0' },
        ],
        capabilities: {
          provides: [
            { key: 'cap.provide', version: '1.0.0' },
          ],
          requires: [
            { key: 'cap.require', version: '2.0.0' },
            { key: 'cap.require.legacy' }, // should default
          ],
        },
        opToPresentation: [
          {
            op: { key: 'op.one', version: '1.2.3' },
            pres: { key: 'pres.one', version: '3.0.0' },
          },
        ],
        presentationsTargets: [
          {
            key: 'pres.one',
            version: '3.0.0',
            targets: ['web', 'flutter'],
          },
        ],
      });
    `;

    const result = scanFeatureSource(code, 'src/my.feature.ts');

    expect(result.key).toBe('my.feature');
    expect(result.operations).toEqual([
      { key: 'op.one', version: '1.2.3' },
      { key: 'op.two', version: '2.0.0' },
    ]);
    expect(result.events).toEqual([{ key: 'event.one', version: '0.1.0' }]);
    expect(result.presentations).toEqual([
      { key: 'pres.one', version: '3.0.0' },
    ]);
    expect(result.capabilities.provides).toEqual([
      { key: 'cap.provide', version: '1.0.0' },
    ]);
    expect(result.capabilities.requires).toEqual([
      { key: 'cap.require', version: '2.0.0' },
      { key: 'cap.require.legacy', version: '1.0.0' },
    ]);
    expect(result.opToPresentationLinks).toEqual([
      {
        op: { key: 'op.one', version: '1.2.3' },
        pres: { key: 'pres.one', version: '3.0.0' },
      },
    ]);
    expect(result.presentationsTargets).toEqual([
      {
        key: 'pres.one',
        version: '3.0.0',
        targets: ['web', 'flutter'] as unknown as Record<string, unknown>[],
      },
    ]);
  });
});
