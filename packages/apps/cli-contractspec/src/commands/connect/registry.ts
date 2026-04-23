import type { Config } from '../../utils/config';
import { createHarnessEvaluationRuntime } from '../harness/runtime';

export function createConnectEvaluationRuntime(input: {
	registryPath: string;
	config: Config;
	packageRoot: string;
	decisionId: string;
}) {
	return createHarnessEvaluationRuntime(input);
}
