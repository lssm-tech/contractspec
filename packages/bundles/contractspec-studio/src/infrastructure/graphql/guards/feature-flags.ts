import {
  ContractSpecFeatureFlags,
  type ContractSpecFeatureFlag,
} from '@lssm/lib.progressive-delivery';
import type { Context } from '../types';

type FeatureFlagName =
  (typeof ContractSpecFeatureFlags)[ContractSpecFeatureFlag];

export function hasFeatureFlag(
  ctx: Context,
  flag: FeatureFlagName
): boolean {
  return ctx.featureFlags?.[flag] ?? false;
}

export function requireFeatureFlag(
  ctx: Context,
  flag: FeatureFlagName,
  message?: string
): void {
  if (!hasFeatureFlag(ctx, flag)) {
    throw new Error(message ?? `Feature ${flag} is not enabled`);
  }
}

