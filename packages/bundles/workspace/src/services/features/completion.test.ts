
import { describe, expect, it } from 'bun:test';
import { detectFeatureContext } from './completion';

describe('detectFeatureContext', () => {
  it('detects operations context', () => {
    const before = `
      export const feature = defineFeature({
        operations: [
          { key: 'foo', version: '1' },
    `;
    const after = `
        ]
      });
    `;
    const context = detectFeatureContext(before, after);
    expect(context?.type).toBe('operations');
    expect(context?.specType).toBe('operation');
  });

  it('detects events context', () => {
    const before = `
      export const feature = defineFeature({
        events: [
          { key: 'foo', version: '1' },
    `;
    const after = `
        ]
      });
    `;
    const context = detectFeatureContext(before, after);
    expect(context?.type).toBe('events');
    expect(context?.specType).toBe('event');
  });

  it('returns null if array is closed', () => {
    const before = `
      export const feature = defineFeature({
        operations: [
          { key: 'foo', version: '1' }
        ],
        description: 'bar'
    `;
    const after = `
      });
    `;
    const context = detectFeatureContext(before, after);
    expect(context).toBeNull();
  });

  it('detects context in nested object inside array', () => {
     // Cursor inside an object in the array
     const before = `
      export const feature = defineFeature({
        operations: [
          { 
            key: 'foo', 
    `;
    const after = `
            version: '1'
          }
        ]
      });
    `;
    const context = detectFeatureContext(before, after);
    expect(context?.type).toBe('operations');
  });
});
