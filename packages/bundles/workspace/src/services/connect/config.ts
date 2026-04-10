import type { ConnectVerdict } from '@contractspec/lib.contracts-spec/workspace-config';
import micromatch from 'micromatch';
import type { ConnectResolvedWorkspace } from './shared';

export function assertConnectEnabled(
	workspace: ConnectResolvedWorkspace
): void {
	if (!workspace.config.connect?.enabled) {
		throw new Error(
			'ContractSpec Connect is not enabled. Configure .contractsrc.json > connect.enabled = true.'
		);
	}
}

export function matchConfiguredPath(
	workspace: ConnectResolvedWorkspace,
	path: string,
	patterns: string[] | undefined
): boolean {
	if (!patterns || patterns.length === 0) {
		return false;
	}

	const normalized = path.replaceAll('\\', '/');
	return micromatch.isMatch(normalized, patterns, { contains: true });
}

export function configuredThreshold(
	workspace: ConnectResolvedWorkspace,
	key:
		| 'protectedPathWrite'
		| 'unknownImpact'
		| 'contractDrift'
		| 'breakingChange'
		| 'destructiveCommand',
	fallback: ConnectVerdict
): ConnectVerdict {
	return workspace.config.connect?.policy?.reviewThresholds?.[key] ?? fallback;
}

export function isAllowedCommand(
	workspace: ConnectResolvedWorkspace,
	command: string
): boolean {
	return matchesCommandRule(workspace.config.connect?.commands?.allow, command);
}

export function isReviewCommand(
	workspace: ConnectResolvedWorkspace,
	command: string
): boolean {
	return matchesCommandRule(
		workspace.config.connect?.commands?.review,
		command
	);
}

export function isDeniedCommand(
	workspace: ConnectResolvedWorkspace,
	command: string
): boolean {
	return matchesCommandRule(workspace.config.connect?.commands?.deny, command);
}

function matchesCommandRule(
	rules: string[] | undefined,
	command: string
): boolean {
	if (!rules || rules.length === 0) {
		return false;
	}

	return rules.some(
		(rule) => command === rule || command.startsWith(`${rule} `)
	);
}
