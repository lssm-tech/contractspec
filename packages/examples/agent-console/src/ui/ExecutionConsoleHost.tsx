'use client';

import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { ExecutionLaneConsoleDemo } from '@contractspec/module.execution-console';
import { AgentConsolePreview } from './AgentConsolePreview';

export function ExecutionConsoleHost() {
	return (
		<VStack gap="xl" align="stretch">
			<AgentConsolePreview />
			<ExecutionLaneConsoleDemo />
		</VStack>
	);
}
