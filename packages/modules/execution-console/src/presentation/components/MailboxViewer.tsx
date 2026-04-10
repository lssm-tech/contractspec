import type { LaneRuntimeSnapshot } from '@contractspec/lib.execution-lanes';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { ScrollArea } from '@contractspec/lib.ui-kit-web/ui/scroll-area';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

export function MailboxViewer(props: { snapshot: LaneRuntimeSnapshot }) {
	const messages = props.snapshot.team?.mailbox ?? [];
	if (messages.length === 0) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Mailbox</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-64">
					<VStack gap="md" align="stretch">
						{messages.map((message) => (
							<VStack key={message.id} gap="xs" align="stretch">
								<HStack justify="between">
									<Small>{`${message.from} -> ${message.to}`}</Small>
									<Muted>{message.createdAt}</Muted>
								</HStack>
								<Muted>{message.body}</Muted>
							</VStack>
						))}
					</VStack>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
