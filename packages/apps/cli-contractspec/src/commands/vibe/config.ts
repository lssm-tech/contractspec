/**
 * Vibe config types and exports.
 *
 * Thin re-export from bundle.workspace.
 */

import { vibe } from '@contractspec/bundle.workspace';

export type VibeConfig = typeof vibe extends {
  DEFAULT_VIBE_CONFIG: infer T;
}
  ? T
  : never;

export const { DEFAULT_VIBE_CONFIG, loadVibeConfig } = vibe;
