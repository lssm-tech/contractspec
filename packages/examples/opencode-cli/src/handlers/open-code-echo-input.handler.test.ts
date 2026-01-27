import type { HandlerCtx } from '@contractspec/lib.contracts';
import { describe, expect, it } from 'bun:test';
import { openCodeEchoInputHandler } from './open-code-echo-input.handler';

describe('OpenCodeEchoCommand', () => {
  it('echoes the prompt', async () => {
    const result = await openCodeEchoInputHandler(
      { prompt: 'Hello, OpenCode' },
      {} as HandlerCtx
    );

    expect(result).toEqual({ message: 'Hello, OpenCode' });
  });

  it('preserves newlines', async () => {
    const prompt = 'Line one\nLine two';
    const result = await openCodeEchoInputHandler({ prompt }, {} as HandlerCtx);

    expect(result).toEqual({ message: prompt });
  });
});
