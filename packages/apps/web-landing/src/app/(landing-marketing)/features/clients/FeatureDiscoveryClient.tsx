'use client';

import { useRouter } from 'next/navigation';
import { FeatureDiscovery } from '@contractspec/bundle.library/presentation/features';

/**
 * Client component wrapper for FeatureDiscovery.
 * Handles client-side navigation when a feature is selected.
 */
export function FeatureDiscoveryClient() {
  const router = useRouter();

  return (
    <FeatureDiscovery
      onSelectFeature={(feature) =>
        router.push(`/features/${feature.meta.key}`)
      }
    />
  );
}
