import { describe, expect, it } from 'bun:test';
import * as z from 'zod';
import { PromptRegistry } from './promptRegistry';
import { definePrompt } from './prompt';

describe('PromptRegistry', () => {
  describe('register', () => {
    it('should register a prompt', () => {
      const registry = new PromptRegistry();
      const prompt = definePrompt({
        meta: {
          key: 'test.prompt',
          version: '1.0.0',
          title: 'Test',
          description: 'Test prompt',
        },
        args: [],
        input: z.object({}),
        render: async () => [{ type: 'text', text: 'Hello' }],
      });

      registry.register(prompt);
      expect(registry.list()).toHaveLength(1);
    });

    it('should return this for chaining', () => {
      const registry = new PromptRegistry();
      const prompt1 = definePrompt({
        meta: {
          key: 'prompt.one',
          version: '1.0.0',
          title: 'One',
          description: 'First',
        },
        args: [],
        input: z.object({}),
        render: async () => [],
      });
      const prompt2 = definePrompt({
        meta: {
          key: 'prompt.two',
          version: '1.0.0',
          title: 'Two',
          description: 'Second',
        },
        args: [],
        input: z.object({}),
        render: async () => [],
      });

      registry.register(prompt1).register(prompt2);
      expect(registry.list()).toHaveLength(2);
    });

    it('should throw on duplicate key+version', () => {
      const registry = new PromptRegistry();
      const prompt1 = definePrompt({
        meta: {
          key: 'duplicate.prompt',
          version: '1.0.0',
          title: 'Original',
          description: 'First',
        },
        args: [],
        input: z.object({}),
        render: async () => [],
      });
      const prompt2 = definePrompt({
        meta: {
          key: 'duplicate.prompt',
          version: '1.0.0',
          title: 'Duplicate',
          description: 'Second',
        },
        args: [],
        input: z.object({}),
        render: async () => [],
      });

      registry.register(prompt1);
      expect(() => registry.register(prompt2)).toThrow(/Duplicate prompt/);
    });

    it('should allow same key with different versions', () => {
      const registry = new PromptRegistry();
      const v1 = definePrompt({
        meta: {
          key: 'versioned.prompt',
          version: '1.0.0',
          title: 'V1',
          description: 'First',
        },
        args: [],
        input: z.object({}),
        render: async () => [],
      });
      const v2 = definePrompt({
        meta: {
          key: 'versioned.prompt',
          version: '2.0.0',
          title: 'V2',
          description: 'Second',
        },
        args: [],
        input: z.object({}),
        render: async () => [],
      });

      registry.register(v1).register(v2);
      expect(registry.list()).toHaveLength(2);
    });
  });

  describe('list', () => {
    it('should return empty array for empty registry', () => {
      const registry = new PromptRegistry();
      expect(registry.list()).toEqual([]);
    });

    it('should return all registered prompts', () => {
      const registry = new PromptRegistry();
      const prompts = [
        definePrompt({
          meta: {
            key: 'p1',
            version: '1.0.0',
            title: 'P1',
            description: 'First',
          },
          args: [],
          input: z.object({}),
          render: async () => [],
        }),
        definePrompt({
          meta: {
            key: 'p2',
            version: '1.0.0',
            title: 'P2',
            description: 'Second',
          },
          args: [],
          input: z.object({}),
          render: async () => [],
        }),
      ];

      prompts.forEach((p) => registry.register(p));
      expect(registry.list()).toHaveLength(2);
    });
  });

  describe('get', () => {
    it('should get prompt by name and version', () => {
      const registry = new PromptRegistry();
      const prompt = definePrompt({
        meta: {
          key: 'target.prompt',
          version: '1.0.0',
          title: 'Target',
          description: 'Target prompt',
        },
        args: [],
        input: z.object({}),
        render: async () => [],
      });

      registry.register(prompt);
      const result = registry.get('target.prompt', '1.0.0');
      expect(result).toBe(prompt);
    });

    it('should return undefined for non-existent prompt', () => {
      const registry = new PromptRegistry();
      expect(registry.get('nonexistent', '1.0.0')).toBeUndefined();
    });
  });
});
