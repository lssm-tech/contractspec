import { describe, expect, test } from 'bun:test';
import { buildContractsContextPrompt } from './contracts-context';

describe('contracts-context', () => {
  describe('buildContractsContextPrompt', () => {
    test('returns empty string when config is empty', () => {
      expect(buildContractsContextPrompt({})).toBe('');
    });

    test('includes agent tools section when agentSpecs provided', () => {
      const result = buildContractsContextPrompt({
        agentSpecs: [
          {
            key: 'agent.run',
            tools: [
              { name: 'run', description: 'Run agent' },
              { name: 'cancel', description: 'Cancel run' },
            ],
          },
        ],
      });
      expect(result).toContain('### Agent tools');
      expect(result).toContain('agent.run');
      expect(result).toContain('run, cancel');
    });

    test('includes data views section when dataViewSpecs provided', () => {
      const result = buildContractsContextPrompt({
        dataViewSpecs: [
          { key: 'agent.runs', meta: { title: 'Agent Runs' } },
        ],
      });
      expect(result).toContain('### Data views');
      expect(result).toContain('agent.runs');
      expect(result).toContain('Agent Runs');
    });

    test('includes forms section when formSpecs provided', () => {
      const result = buildContractsContextPrompt({
        formSpecs: [
          { key: 'agent.run.form', meta: { title: 'Agent Run Form' } },
        ],
      });
      expect(result).toContain('### Forms');
      expect(result).toContain('agent.run.form');
    });

    test('includes presentations section when presentationSpecs provided', () => {
      const result = buildContractsContextPrompt({
        presentationSpecs: [
          {
            key: 'agent.run.audit',
            meta: { title: 'Agent Run Audit' },
            targets: ['react'],
          },
        ],
      });
      expect(result).toContain('### Presentations');
      expect(result).toContain('agent.run.audit');
    });

    test('includes operations section when operationRefs provided', () => {
      const result = buildContractsContextPrompt({
        operationRefs: [
          { key: 'agent.run', version: '1.0.0' },
        ],
      });
      expect(result).toContain('### Operations');
      expect(result).toContain('agent.run@1.0.0');
    });
  });
});
