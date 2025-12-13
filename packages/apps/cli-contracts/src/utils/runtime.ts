export type RuntimeKind = 'bun' | 'node';

export function detectRuntime(): RuntimeKind {
  // Bun defines a global `Bun` object.

  const isBun = typeof (globalThis as { Bun?: unknown }).Bun !== 'undefined';
  return isBun ? 'bun' : 'node';
}
