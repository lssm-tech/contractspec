import { describe, expect, it } from 'bun:test';
import { generatePresentationSpec } from './presentation';
import type { PresentationSpecData } from '../types/spec-types';

describe('generatePresentationSpec', () => {
  const baseData: PresentationSpecData = {
    name: 'test.pres',
    version: '1',
    description: 'Test presentation',
    owners: ['team-a'],
    tags: ['test'],
    stability: 'stable',
    presentationKind: 'web_component',
  };

  it('generates a web_component spec', () => {
    const code = generatePresentationSpec(baseData);
    expect(code).toContain("kind: 'web_component'");
    expect(code).toContain("framework: 'react'");
    expect(code).toContain("componentKey: 'test_pres'");
  });

  it('generates a markdown spec', () => {
    const data: PresentationSpecData = {
      ...baseData,
      presentationKind: 'markdown',
    };
    const code = generatePresentationSpec(data);
    expect(code).toContain("kind: 'markdown'");
    expect(code).toContain('TODO: Add markdown content here');
  });

  it('generates a data spec', () => {
    const data: PresentationSpecData = {
      ...baseData,
      presentationKind: 'data',
    };
    const code = generatePresentationSpec(data);
    expect(code).toContain("kind: 'data'");
    expect(code).toContain("mimeType: 'application/json'");
  });
});
