/**
 * Policy evaluation helpers for patch proposals.
 * Gate patch application with PDP; emit policy.denied when blocked.
 */

import type {
  BundleContext,
  SurfacePatchOp,
  BundleAuditEmitter,
} from '../spec/types';
import type { PolicyHooks, PatchPolicyEffect } from './resolve-bundle';
import { emitPolicyDenied } from './audit-events';

/**
 * Evaluates a patch proposal with policy hooks.
 * Returns allow | deny | require-approval.
 * When policy hook is absent, returns allow (stub PDP).
 */
export function evaluatePatchProposalPolicy<C extends BundleContext>(
  ops: SurfacePatchOp[],
  ctx: C,
  policy?: PolicyHooks<C>
): PatchPolicyEffect {
  const evaluate = policy?.evaluatePatchProposal;
  if (!evaluate) return 'allow';
  return evaluate(ops, ctx);
}

/**
 * Evaluates and optionally emits policy.denied when blocked.
 * Call before applying patches. If returns false, do not apply.
 */
export function evaluateAndEmitPatchPolicy<C extends BundleContext>(
  ops: SurfacePatchOp[],
  ctx: C,
  args: {
    policy?: PolicyHooks<C>;
    audit?: BundleAuditEmitter;
    bundleKey: string;
    surfaceId?: string;
    targetId?: string;
  }
): boolean {
  const effect = evaluatePatchProposalPolicy(ops, ctx, args.policy);
  if (effect === 'deny') {
    if (args.audit) {
      emitPolicyDenied(args.audit, {
        bundleKey: args.bundleKey,
        surfaceId: args.surfaceId,
        targetId: args.targetId ?? 'patch-proposal',
        reason: 'Policy denied patch proposal',
        actorId: ctx.actorId,
      });
    }
    return false;
  }
  return true;
}
