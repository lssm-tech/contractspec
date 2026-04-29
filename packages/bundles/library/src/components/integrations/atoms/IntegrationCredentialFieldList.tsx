import {
	HStack,
	Muted,
	Small,
	Text,
	VStack,
} from '@contractspec/lib.design-system';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import type { CredentialSetupFieldRow } from '../helpers/credentialSetupModel';

export interface IntegrationCredentialFieldListProps {
	fields: CredentialSetupFieldRow[];
	emptyLabel?: string;
}

export function IntegrationCredentialFieldList({
	fields,
	emptyLabel = 'No credential fields declared.',
}: IntegrationCredentialFieldListProps) {
	if (fields.length === 0) return <Muted>{emptyLabel}</Muted>;

	return (
		<VStack gap="sm" align="stretch">
			{fields.map((field) => (
				<VStack
					key={`${field.kind}:${field.key}`}
					gap="sm"
					align="stretch"
					className="rounded-xl border p-3 text-sm"
				>
					<HStack justify="between" align="start" gap="md">
						<VStack gap="sm" align="start">
							<Small>{field.label}</Small>
							<Muted className="text-xs">{field.kind}</Muted>
						</VStack>
						<Badge
							variant={field.status === 'missing' ? 'destructive' : 'secondary'}
						>
							<Text>{field.status}</Text>
						</Badge>
					</HStack>
					{field.description ? <Muted>{field.description}</Muted> : null}
					{field.secretRef ? (
						<Muted className="font-mono text-xs">{field.secretRef}</Muted>
					) : null}
					{field.required ? <Text className="text-xs">Required</Text> : null}
				</VStack>
			))}
		</VStack>
	);
}
