import type { PromptSpec } from './prompt';
import * as z from 'zod';

export class PromptRegistry {
  private prompts = new Map<string, PromptSpec<z.ZodType>>(); // key = name.vX

  /** Register a prompt. Throws on duplicate name+version. */
  register<I extends z.ZodType>(p: PromptSpec<I>): this {
    const key = `${p.meta.name}-v${p.meta.version}`;
    if (this.prompts.has(key)) throw new Error(`Duplicate prompt ${key}`);
    this.prompts.set(key, p);
    return this;
  }

  /** List all registered prompts. */
  list() {
    return [...this.prompts.values()];
  }

  /** Get prompt by name; when version omitted, returns highest version. */
  get(name: string, version?: number) {
    if (version != null) return this.prompts.get(`${name}-v${version}`);
    // latest by highest version
    let candidate: PromptSpec<z.ZodType> | undefined;
    let max = -Infinity;
    for (const [k, p] of this.prompts.entries()) {
      if (!k.startsWith(`${name}.v`)) continue;
      if (p.meta.version > max) {
        max = p.meta.version;
        candidate = p;
      }
    }
    return candidate;
  }
}
