'use client';

import { useMemo } from 'react';
import { ContractSpecFeatureFlags } from '@lssm/lib.progressive-delivery/feature-flags';

type FeatureFlagName =
  (typeof ContractSpecFeatureFlags)[keyof typeof ContractSpecFeatureFlags];

const BASE_FLAGS = Object.values(ContractSpecFeatureFlags).reduce<
  Record<string, boolean>
>((acc, flag) => {
  acc[flag] = true;
  return acc;
}, {});

interface WindowWithStudioFlags extends Window {
  __STUDIO_FEATURE_FLAGS__?: Record<string, boolean>;
}

function parseEnvFlags(): Record<string, boolean> {
  const payload = process.env.NEXT_PUBLIC_STUDIO_FEATURE_FLAGS;
  return parseFlagPayload(payload);
}

function parseFlagPayload(
  payload?: string | null
): Record<string, boolean> {
  if (!payload) return {};
  try {
    const parsed = JSON.parse(payload) as Record<string, boolean>;
    if (parsed && typeof parsed === 'object') {
      return normalizeFlags(parsed);
    }
  } catch {
    const entries = payload.split(',').map((entry) => entry.trim());
    const flags: Record<string, boolean> = {};
    entries.forEach((entry) => {
      if (!entry) return;
      const [key, rawValue] = entry.split('=');
      if (!key) return;
      flags[key.trim()] =
        rawValue === undefined ? true : rawValue.trim() === 'true';
    });
    return flags;
  }
  return {};
}

function normalizeFlags(input: Record<string, unknown>): Record<string, boolean> {
  return Object.entries(input).reduce<Record<string, boolean>>(
    (acc, [key, value]) => {
      acc[key] = Boolean(value);
      return acc;
    },
    {}
  );
}

function readWindowFlags(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  const runtimeFlags = (
    window as WindowWithStudioFlags
  ).__STUDIO_FEATURE_FLAGS__;
  if (!runtimeFlags || typeof runtimeFlags !== 'object') {
    return {};
  }
  return normalizeFlags(runtimeFlags);
}

function resolveFeatureFlags(): Record<string, boolean> {
  return {
    ...BASE_FLAGS,
    ...parseEnvFlags(),
    ...readWindowFlags(),
  };
}

export function useStudioFeatureFlags(): Record<string, boolean> {
  return useMemo(() => resolveFeatureFlags(), []);
}

export function useStudioFeatureFlag(flag: FeatureFlagName): boolean {
  const featureFlags = useStudioFeatureFlags();
  return featureFlags[flag] ?? false;
}

