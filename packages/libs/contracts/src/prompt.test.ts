import { describe, expect, it } from 'bun:test';
import * as z from 'zod';
import {
  definePrompt,
  type PromptSpec,
  type PromptArg,
  type PromptContentPart,
} from './prompt';

describe('definePrompt', () => {
  it('should return the prompt spec unchanged', () => {
    const spec: PromptSpec<z.ZodObject<{ query: z.ZodString }>> = {
      meta: {
        key: 'test.prompt',
        version: 1,
        title: 'Test Prompt',
        description: 'A test prompt',
      },
      args: [
        {
          name: 'query',
          description: 'Search query',
          required: true,
          schema: z.string(),
        },
      ],
      input: z.object({ query: z.string() }),
      render: async (args) => [{ type: 'text', text: `Query: ${args.query}` }],
    };

    const result = definePrompt(spec);
    expect(result).toBe(spec);
    expect(result.meta.key).toBe('test.prompt');
  });

  it('should preserve metadata fields', () => {
    const spec = definePrompt({
      meta: {
        key: 'full.prompt',
        version: 2,
        title: 'Full Prompt',
        description: 'A fully configured prompt',
        tags: ['test', 'example'],
        stability: 'stable',
        owners: ['platform.core'],
      },
      args: [],
      input: z.object({}),
      render: async () => [{ type: 'text', text: 'Hello' }],
    });

    expect(spec.meta.version).toBe(2);
    expect(spec.meta.tags).toEqual(['test', 'example']);
    expect(spec.meta.stability).toBe('stable');
    expect(spec.meta.owners).toEqual(['platform.core']);
  });

  it('should preserve policy configuration', () => {
    const spec = definePrompt({
      meta: {
        key: 'policy.prompt',
        version: 1,
        title: 'Policy Prompt',
        description: 'Prompt with policy',
      },
      args: [{ name: 'email', schema: z.string().email() }],
      input: z.object({ email: z.string().email() }),
      policy: {
        flags: ['beta-feature'],
        pii: ['email'],
        rateLimit: { rpm: 10, key: 'user' },
      },
      render: async () => [{ type: 'text', text: 'Hello' }],
    });

    expect(spec.policy?.flags).toEqual(['beta-feature']);
    expect(spec.policy?.pii).toEqual(['email']);
    expect(spec.policy?.rateLimit?.rpm).toBe(10);
  });
});

describe('PromptArg interface', () => {
  it('should define argument with required fields', () => {
    const arg: PromptArg = {
      name: 'searchQuery',
      schema: z.string(),
    };

    expect(arg.name).toBe('searchQuery');
    expect(arg.required).toBeUndefined();
  });

  it('should define argument with all fields', () => {
    const arg: PromptArg = {
      name: 'userId',
      description: 'The user ID to lookup',
      required: true,
      schema: z.string().uuid(),
      completeWith: 'user-autocomplete',
    };

    expect(arg.description).toBe('The user ID to lookup');
    expect(arg.required).toBe(true);
    expect(arg.completeWith).toBe('user-autocomplete');
  });
});

describe('PromptContentPart types', () => {
  it('should support text content', () => {
    const part: PromptContentPart = { type: 'text', text: 'Hello, world!' };
    expect(part.type).toBe('text');
    expect(part.text).toBe('Hello, world!');
  });

  it('should support resource content', () => {
    const part: PromptContentPart = {
      type: 'resource',
      uri: 'file:///path/to/doc.md',
      title: 'Documentation',
    };
    expect(part.type).toBe('resource');
    expect(part.uri).toBe('file:///path/to/doc.md');
    expect(part.title).toBe('Documentation');
  });
});

describe('render function', () => {
  it('should receive args and context', async () => {
    const spec = definePrompt({
      meta: {
        key: 'render.test',
        version: 1,
        title: 'Render Test',
        description: 'Test render function',
      },
      args: [{ name: 'name', schema: z.string() }],
      input: z.object({ name: z.string() }),
      render: async (args, ctx) => [
        { type: 'text', text: `Hello, ${args.name}!` },
        { type: 'text', text: `User: ${ctx.userId ?? 'anonymous'}` },
        { type: 'text', text: `Link: ${ctx.link('/users/{id}', { id: 123 })}` },
      ],
    });

    const result = await spec.render(
      { name: 'World' },
      {
        userId: 'user_123',
        locale: 'en-US',
        link: (template, vars) =>
          Object.entries(vars).reduce(
            (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
            template
          ),
      }
    );

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ type: 'text', text: 'Hello, World!' });
    expect(result[1]).toEqual({ type: 'text', text: 'User: user_123' });
    expect(result[2]).toEqual({ type: 'text', text: 'Link: /users/123' });
  });
});
