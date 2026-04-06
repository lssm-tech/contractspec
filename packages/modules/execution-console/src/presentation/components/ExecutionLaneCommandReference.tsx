import { EXECUTION_LANE_COMMANDS } from '@contractspec/lib.execution-lanes/interop';
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

export function ExecutionLaneCommandReference() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Lane Commands</CardTitle>
				<CardDescription>
					Typed command semantics exposed by{' '}
					<code>@contractspec/lib.execution-lanes/interop</code>.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="md" align="stretch">
					{EXECUTION_LANE_COMMANDS.map((command) => (
						<VStack key={command.usage} gap="xs" align="stretch">
							<HStack justify="between">
								<Badge variant="secondary">{command.usage}</Badge>
								<Badge>{command.lane}</Badge>
							</HStack>
							<Small>{command.summary}</Small>
							<Muted>
								mode: {command.mode}
								{' · '}
								task input: {command.acceptsTask ? 'required' : 'optional'}
							</Muted>
						</VStack>
					))}
				</VStack>
			</CardContent>
		</Card>
	);
}
