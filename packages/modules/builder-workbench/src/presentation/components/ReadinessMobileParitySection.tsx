'use client';

import type { BuilderReadinessReport } from '@contractspec/lib.builder-spec';
import { HStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

export function ReadinessMobileParitySection(props: {
	report: BuilderReadinessReport;
}) {
	return (
		<>
			<HStack justify="between">
				<Small>Mobile Parity</Small>
				<Muted>{props.report.mobileParityStatus}</Muted>
			</HStack>
			{props.report.mobileParitySummary ? (
				<>
					<HStack justify="between">
						<Small>Channel-Native Features</Small>
						<Muted>
							{props.report.mobileParitySummary.channelNativeFeatures.join(
								', '
							) || 'none'}
						</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Deep-Link Features</Small>
						<Muted>
							{props.report.mobileParitySummary.deepLinkFeatures.join(', ') ||
								'none'}
						</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Blocked Mobile Features</Small>
						<Muted>
							{props.report.mobileParitySummary.blockedFeatures.join(', ') ||
								'none'}
						</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Action Delivery</Small>
						<Muted>
							channel-native{' '}
							{props.report.mobileParitySummary.channelNativeActionCount} /
							mobile web {props.report.mobileParitySummary.deepLinkActionCount}
						</Muted>
					</HStack>
				</>
			) : null}
		</>
	);
}
