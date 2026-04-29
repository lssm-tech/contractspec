import {
	buildEnvExample,
	resolveEnvironmentForTarget,
} from '@contractspec/integration.runtime/environment';
import type { EnvironmentConfig } from '@contractspec/lib.contracts-spec/workspace-config/environment';

export function generateWorkspaceEnvExample(config: EnvironmentConfig): string {
	return buildEnvExample(resolveEnvironmentForTarget({ config }));
}

export function generateTargetEnvExample(
	config: EnvironmentConfig,
	targetId: string,
	profile?: string
): string {
	return buildEnvExample(
		resolveEnvironmentForTarget({
			config,
			targetId,
			profile,
		})
	);
}
