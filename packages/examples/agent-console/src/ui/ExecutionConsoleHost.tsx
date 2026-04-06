'use client';

import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { ExecutionLaneConsoleDemo } from '@contractspec/module.execution-console';
import { AgentDashboard } from './AgentDashboard';

export function ExecutionConsoleHost() {
	return (
		<VStack gap="xl" align="stretch">
			<AgentDashboard />
			<ExecutionLaneConsoleDemo />
		</VStack>
	);
}
