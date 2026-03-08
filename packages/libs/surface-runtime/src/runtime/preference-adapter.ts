import type {
  BundleContext,
  BundlePreferenceAdapter,
  PreferenceDimensions,
} from '../spec/types';
import { resolvePreferenceProfile } from './resolve-preferences';

/**
 * Default preference adapter. Uses in-memory resolution; savePreferencePatch is a no-op stub.
 * Integrate with lib.personalization or lib.overlay-engine for persistence.
 */
export const defaultPreferenceAdapter: BundlePreferenceAdapter = {
  async resolve(ctx: BundleContext) {
    return resolvePreferenceProfile(ctx);
  },

  async savePreferencePatch(_args: {
    actorId: string;
    workspaceId?: string;
    patch: Partial<PreferenceDimensions>;
    scope: 'user' | 'workspace-user' | 'surface';
  }): Promise<void> {
    // Stub: no-op. Full impl integrates with overlay-engine for durable storage.
  },
};
