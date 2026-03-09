/**
 * AI SDK adapter stub. Full planner/chat integration deferred to Phase 5.
 */

import type { AiSdkBundleAdapter } from './interfaces';
import type { ResolvedSurfacePlan } from '../runtime/resolve-bundle';
import type { SurfacePatchProposal } from '../spec/types';

export const aiSdkAdapterStub: AiSdkBundleAdapter = {
  startThread(_args) {
    return null;
  },

  async requestPatches(_args: {
    currentPlan: ResolvedSurfacePlan;
    userMessage: string;
  }): Promise<SurfacePatchProposal[]> {
    return [];
  },
};
