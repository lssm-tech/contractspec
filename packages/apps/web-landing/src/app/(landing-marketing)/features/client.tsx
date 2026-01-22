'use client';

import { useRouter } from 'next/navigation';
import { FeatureDiscovery } from '@contractspec/bundle.library/presentation/features';

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
