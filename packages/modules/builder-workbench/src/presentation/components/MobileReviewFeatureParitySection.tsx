'use client';

import type { BuilderFeatureParity } from '@contractspec/lib.builder-spec';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

export function MobileReviewFeatureParitySection(props: {
	featureParity: BuilderFeatureParity[];
}) {
	return (
		<VStack gap="sm" align="stretch">
			{props.featureParity.map((feature) => (
				<HStack key={feature.featureKey} justify="between">
					<VStack gap="sm" align="start">
						<Small>{feature.label}</Small>
						<Muted>{feature.channelSupport.join(', ')}</Muted>
						{feature.statusNote || feature.mobileFallbackRef ? (
							<Muted>
								{feature.statusNote ?? 'Mobile fallback available.'}
								{feature.mobileFallbackRef
									? ` · ${feature.mobileFallbackRef}`
									: ''}
							</Muted>
						) : null}
					</VStack>
					<Badge variant="secondary">{feature.mobileSupport}</Badge>
				</HStack>
			))}
		</VStack>
	);
}
