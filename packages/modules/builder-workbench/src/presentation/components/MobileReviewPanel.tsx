'use client';

import type {
	BuilderFeatureParity,
	BuilderMobileReviewCard,
} from '@contractspec/lib.builder-spec';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { Button } from '@contractspec/lib.ui-kit-web/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

export function MobileReviewPanel(props: {
	featureParity: BuilderFeatureParity[];
	cards: BuilderMobileReviewCard[];
	onApproveCard?: (cardId: string) => void | Promise<void>;
	onRejectCard?: (cardId: string) => void | Promise<void>;
	onOpenDetails?: (cardId: string, href?: string) => void | Promise<void>;
	busyCardId?: string | null;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Mobile Review</CardTitle>
				<CardDescription>
					Mobile parity markers and review cards stay inspectable without a
					desktop-only escape hatch.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="lg" align="stretch">
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
					<VStack gap="sm" align="stretch">
						{props.cards.map((card) => (
							<VStack
								key={card.id}
								gap="sm"
								align="stretch"
								className="rounded-md border p-3"
							>
								<HStack justify="between">
									<VStack gap="sm" align="start">
										<Small>{card.summary}</Small>
										<Muted>
											{card.channelType} · {card.subjectType} ·{' '}
											{card.affectedAreas.join(', ') || 'no affected areas'}
										</Muted>
									</VStack>
									<Badge>{card.riskLevel}</Badge>
								</HStack>
								<Muted>{card.evidence.harnessSummary}</Muted>
								<Muted>
									Provider:{' '}
									{card.provider?.id
										? `${card.provider.id}${card.provider.runId ? ` · ${card.provider.runId}` : ''}`
										: 'manual / runtime'}
								</Muted>
								<Muted>
									Evidence refs: {card.evidence.sourceRefs.length} · Receipt:{' '}
									{card.evidence.receiptId ?? 'none'}
								</Muted>
								<HStack justify="end">
									{card.actions.map((action) => {
										if (action.id === 'approve') {
											return (
												<Button
													key={action.id}
													onClick={() => void props.onApproveCard?.(card.id)}
													disabled={props.busyCardId === card.id}
												>
													{action.label}
												</Button>
											);
										}
										if (action.id === 'reject') {
											return (
												<Button
													key={action.id}
													variant="outline"
													onClick={() => void props.onRejectCard?.(card.id)}
													disabled={props.busyCardId === card.id}
												>
													{action.label}
												</Button>
											);
										}
										return (
											<Button
												key={action.id}
												variant="outline"
												onClick={() =>
													void props.onOpenDetails?.(
														card.id,
														action.deepLinkHref
													)
												}
											>
												{action.label}
											</Button>
										);
									})}
								</HStack>
							</VStack>
						))}
					</VStack>
					{props.cards.length === 0 ? (
						<Muted>No mobile review cards have been created yet.</Muted>
					) : null}
				</VStack>
			</CardContent>
		</Card>
	);
}
