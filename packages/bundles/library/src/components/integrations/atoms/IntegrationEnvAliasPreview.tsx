import {
	Code,
	HStack,
	Muted,
	Text,
	VStack,
} from '@contractspec/lib.design-system';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import type {
	CredentialSetupAliasRow,
	CredentialSetupWarning,
} from '../helpers/credentialSetupModel';

export interface IntegrationEnvAliasPreviewProps {
	aliases: CredentialSetupAliasRow[];
	warnings?: CredentialSetupWarning[];
	emptyLabel?: string;
}

export function IntegrationEnvAliasPreview({
	aliases,
	warnings = [],
	emptyLabel = 'No env aliases declared.',
}: IntegrationEnvAliasPreviewProps) {
	return (
		<VStack gap="sm" align="stretch">
			{aliases.length === 0 ? <Muted>{emptyLabel}</Muted> : null}
			{aliases.map((alias) => (
				<VStack
					key={`${alias.logicalKey}:${alias.envName}:${alias.targetId ?? 'root'}`}
					gap="sm"
					align="stretch"
					className="rounded-xl border p-3 text-sm"
				>
					<HStack wrap="wrap" gap="sm" align="center">
						<Code>{alias.envName}</Code>
						<Badge variant={alias.public ? 'default' : 'secondary'}>
							<Text>{alias.public ? 'public' : 'server'}</Text>
						</Badge>
					</HStack>
					<Muted className="text-xs">
						{`${alias.logicalKey} → ${alias.targetLabel ?? alias.targetId ?? 'workspace root'}${alias.framework ? ` · ${alias.framework}` : ''}${alias.profile ? ` · ${alias.profile}` : ''}`}
					</Muted>
					{alias.warning ? (
						<Text className="text-xs">{alias.warning}</Text>
					) : null}
				</VStack>
			))}
			{warnings.map((warning) => (
				<Muted key={`${warning.level}:${warning.fieldKey ?? warning.message}`}>
					{`${warning.level.toUpperCase()}: ${warning.message}`}
				</Muted>
			))}
		</VStack>
	);
}
