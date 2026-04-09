'use client';

import type {
	ExternalExecutionProvider,
	ExternalExecutionReceipt,
} from '@contractspec/lib.provider-spec';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

export function ProviderReceiptSection(props: {
	providers: ExternalExecutionProvider[];
	receipts: ExternalExecutionReceipt[];
}) {
	return (
		<>
			<VStack gap="md" align="stretch">
				<Small>Registered Providers</Small>
				{props.providers.length === 0 ? (
					<Muted>No providers registered yet.</Muted>
				) : (
					props.providers.slice(0, 6).map((provider) => (
						<VStack
							key={provider.id}
							gap="sm"
							align="stretch"
							className="rounded-md border p-3"
						>
							<HStack justify="between">
								<VStack gap="sm" align="start">
									<Small>{provider.displayName}</Small>
									<Muted>
										{provider.providerKind} · {provider.authMode} ·{' '}
										{provider.availability ?? 'available'}
									</Muted>
								</VStack>
								<Badge variant="secondary">{provider.status}</Badge>
							</HStack>
							<Muted>
								Tasks:{' '}
								{provider.supportedTaskTypes.join(', ') || 'no task types'}
							</Muted>
							<Muted>
								Runtime modes:{' '}
								{provider.supportedRuntimeModes.join(', ') ||
									'no runtime modes'}
							</Muted>
						</VStack>
					))
				)}
			</VStack>
			<VStack gap="md" align="stretch">
				<Small>Recent Receipts</Small>
				{props.receipts.slice(0, 4).map((receipt) => (
					<VStack
						key={receipt.id}
						gap="sm"
						align="stretch"
						className="rounded-md border p-3"
					>
						<HStack justify="between">
							<VStack gap="sm" align="start">
								<Small>{receipt.providerId}</Small>
								<Muted>
									{receipt.taskType} · {receipt.runtimeMode}
								</Muted>
							</VStack>
							<Badge variant="secondary">{receipt.status}</Badge>
						</HStack>
						<Muted>Context hash: {receipt.contextHash}</Muted>
						<Muted>
							Artifact hashes: {receipt.outputArtifactHashes.join(', ')}
						</Muted>
						<Muted>
							Verification refs: {receipt.verificationRefs.join(', ') || 'none'}
						</Muted>
					</VStack>
				))}
				{props.receipts.length === 0 ? (
					<Muted>No execution receipts recorded yet.</Muted>
				) : null}
			</VStack>
		</>
	);
}
