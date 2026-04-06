import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { ScrollArea } from '@contractspec/lib.ui-kit-web/ui/scroll-area';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';
import type { ExecutionLaneTimelineItem } from '../../core';

export function ExecutionLaneTimeline(props: {
	items: ExecutionLaneTimelineItem[];
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Timeline</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-80">
					<VStack gap="md" align="stretch">
						{props.items.map((item) => (
							<HStack key={item.id} justify="between" align="start">
								<VStack gap="xs" align="stretch">
									<HStack gap="sm">
										<Badge variant="outline">{item.kind}</Badge>
										<Small>{item.label}</Small>
									</HStack>
									{item.detail ? <Muted>{item.detail}</Muted> : null}
								</VStack>
								<Muted>{item.timestamp}</Muted>
							</HStack>
						))}
					</VStack>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
