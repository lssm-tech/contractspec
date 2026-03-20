'use client';

import { FeatureDiscovery } from '@contractspec/bundle.library/presentation/features';
import { useRouter } from 'next/navigation';

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
