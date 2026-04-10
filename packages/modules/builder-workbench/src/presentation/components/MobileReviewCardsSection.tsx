'use client';

import type { BuilderMobileReviewCard } from '@contractspec/lib.builder-spec';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { Button } from '@contractspec/lib.ui-kit-web/ui/button';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

export function MobileReviewCardsSection(props: {
	cards: BuilderMobileReviewCard[];
	onApproveCard?: (cardId: string) => void | Promise<void>;
	onRejectCard?: (cardId: string) => void | Promise<void>;
	onAcknowledgeCard?: (cardId: string) => void | Promise<void>;
	onOpenDetails?: (cardId: string, href?: string) => void | Promise<void>;
	busyCardId?: string | null;
}) {
	return (
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
					{card.status ? <Muted>Status: {card.status}</Muted> : null}
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
					<Muted>
						Action modes:{' '}
						{card.actions
							.map(
								(action) =>
									`${action.label}:${action.deliveryMode ?? 'unspecified'}`
							)
							.join(', ')}
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
							if (action.id === 'acknowledge') {
								return (
									<Button
										key={action.id}
										variant="outline"
										onClick={() => void props.onAcknowledgeCard?.(card.id)}
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
								<VStack key={action.id} gap="sm" align="end">
									<Button
										variant="outline"
										onClick={() =>
											void props.onOpenDetails?.(card.id, action.deepLinkHref)
										}
									>
										{action.label}
									</Button>
									{action.statusNote ? (
										<Muted>{action.statusNote}</Muted>
									) : null}
								</VStack>
							);
						})}
					</HStack>
				</VStack>
			))}
			{props.cards.length === 0 ? (
				<Muted>No mobile review cards have been created yet.</Muted>
			) : null}
		</VStack>
	);
}
