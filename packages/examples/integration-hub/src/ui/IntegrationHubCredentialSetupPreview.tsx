import type { IntegrationOwnershipMode } from '@contractspec/lib.contracts-integrations';
import {
	Box,
	Button,
	HStack,
	Muted,
	Small,
	Text,
	VStack,
} from '@contractspec/lib.design-system';
import { integrationHubCredentialSetupState } from '../setup/credential-setup';
import { buildIntegrationHubCredentialSetupPreviewModel } from './IntegrationHubCredentialSetupPreview.model';

export interface IntegrationHubCredentialSetupPreviewProps {
	mode?: IntegrationOwnershipMode;
	onModeChange?: (mode: IntegrationOwnershipMode) => void;
}

export function IntegrationHubCredentialSetupPreview({
	mode = integrationHubCredentialSetupState.selectedMode,
	onModeChange,
}: IntegrationHubCredentialSetupPreviewProps) {
	const { fields, aliases, missingSecrets } =
		buildIntegrationHubCredentialSetupPreviewModel(mode);

	return (
		<Box className="rounded-2xl border border-border bg-card p-4">
			<VStack gap="lg" align="stretch">
				<VStack gap="xs" align="stretch">
					<Small className="font-semibold uppercase tracking-wide">
						BYOK and monorepo env setup
					</Small>
					<Text className="text-muted-foreground text-sm">
						The Integration Hub sample now publishes credential manifests,
						server-only secret references, and Next/Expo public aliases for
						multi-app workspaces.
					</Text>
				</VStack>

				<HStack className="flex-wrap gap-2">
					{(['managed', 'byok'] as const).map((option) => (
						<Button
							key={option}
							type="button"
							variant={mode === option ? 'default' : 'outline'}
							onClick={() => onModeChange?.(option)}
						>
							{option === 'byok' ? 'BYOK' : 'Managed'}
						</Button>
					))}
				</HStack>

				<VStack gap="sm" align="stretch">
					<Small>Required setup fields</Small>
					<Box className="grid gap-2 md:grid-cols-2">
						{fields.map((field) => (
							<Box
								key={`${field.kind}:${field.key}`}
								className="rounded-xl border border-border bg-background p-3"
							>
								<HStack className="items-start justify-between gap-3">
									<VStack gap="xs" align="stretch">
										<Text className="font-medium text-sm">
											{toLabel(field.key)}
										</Text>
										<Muted className="text-xs">{field.description}</Muted>
										{field.secretRef ? (
											<Small className="font-mono">{field.secretRef}</Small>
										) : null}
									</VStack>
									<Small className="rounded-full bg-muted px-2 py-0.5">
										{field.configured ? 'configured' : 'missing'}
									</Small>
								</HStack>
							</Box>
						))}
					</Box>
				</VStack>

				<VStack gap="sm" align="stretch">
					<Small>App aliases</Small>
					<Box className="grid gap-2 md:grid-cols-2">
						{aliases.map((alias) => (
							<Box
								key={`${alias.targetId}:${alias.name}`}
								className="rounded-xl border border-border bg-background p-3"
							>
								<Text className="font-mono text-sm">{alias.name}</Text>
								<Muted className="text-xs">
									{alias.targetLabel} · {alias.framework} ·{' '}
									{alias.exposure ?? 'server'}
								</Muted>
								{isPublicAlias(alias.name) ? (
									<Small className="text-amber-600">Public client alias</Small>
								) : null}
							</Box>
						))}
					</Box>
				</VStack>

				{missingSecrets.length ? (
					<Box className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
						<Text className="font-medium text-sm">
							Missing BYOK secret refs:{' '}
							{missingSecrets.map((field) => toLabel(field.key)).join(', ')}.
						</Text>
						<Muted className="text-xs">
							Secret fields stay server-only and are not materialized as
							NEXT_PUBLIC_* or EXPO_PUBLIC_* aliases.
						</Muted>
					</Box>
				) : null}
			</VStack>
		</Box>
	);
}

function isPublicAlias(name: string) {
	return name.startsWith('NEXT_PUBLIC_') || name.startsWith('EXPO_PUBLIC_');
}

function toLabel(key: string) {
	return key
		.replace(/[_-]+/g, ' ')
		.replace(/\b\w/g, (char) => char.toUpperCase());
}
