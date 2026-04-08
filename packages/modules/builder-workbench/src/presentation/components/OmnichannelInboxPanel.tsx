'use client';

import type {
	BuilderChannelMessage,
	BuilderParticipantBinding,
} from '@contractspec/lib.builder-spec';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

export function OmnichannelInboxPanel(props: {
	messages: BuilderChannelMessage[];
	participantBindings: BuilderParticipantBinding[];
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Omnichannel Inbox</CardTitle>
				<CardDescription>
					Telegram and WhatsApp changes remain visible as reviewed Builder
					timeline entries.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="md" align="stretch">
					{props.messages.map((message) => (
						<HStack key={message.id} justify="between">
							<VStack gap="sm" align="start">
								<Small>{message.contentRef}</Small>
								<Muted>
									{message.channelType} · {message.messageKind} ·{' '}
									{message.direction}
								</Muted>
								<Muted>{message.eventType ?? 'message'}</Muted>
							</VStack>
							<Badge
								variant={
									message.participantBindingId ? 'secondary' : 'destructive'
								}
							>
								{message.participantBindingId ? 'verified' : 'unverified'}
							</Badge>
						</HStack>
					))}
					<HStack justify="between">
						<Small>Active Bindings</Small>
						<Muted>
							{
								props.participantBindings.filter(
									(binding) => !binding.revokedAt
								).length
							}
						</Muted>
					</HStack>
				</VStack>
			</CardContent>
		</Card>
	);
}
