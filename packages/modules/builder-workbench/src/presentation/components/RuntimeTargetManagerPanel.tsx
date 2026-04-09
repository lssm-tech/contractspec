'use client';

import type { RuntimeTarget } from '@contractspec/lib.provider-spec';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { Button } from '@contractspec/lib.ui-kit-web/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

export function RuntimeTargetManagerPanel(props: {
	runtimeTargets: RuntimeTarget[];
	onRegisterRecommendedTargets?: () => void | Promise<void>;
	onQuarantineRuntimeTarget?: (targetId: string) => void | Promise<void>;
	isRegisteringTargets?: boolean;
	busyTargetId?: string | null;
}) {
	const coverage = {
		managed: props.runtimeTargets.some(
			(target) =>
				target.runtimeMode === 'managed' &&
				target.registrationState === 'registered'
		),
		local: props.runtimeTargets.some(
			(target) =>
				target.runtimeMode === 'local' &&
				target.registrationState === 'registered'
		),
		hybrid: props.runtimeTargets.some(
			(target) =>
				target.runtimeMode === 'hybrid' &&
				target.registrationState === 'registered'
		),
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Runtime Targets</CardTitle>
				<CardDescription>
					Managed, local, and hybrid targets remain visible with trust and
					health signals.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="md" align="stretch">
					<HStack justify="between">
						<Small>Coverage</Small>
						<Muted>
							managed {String(coverage.managed)} / local{' '}
							{String(coverage.local)} / hybrid {String(coverage.hybrid)}
						</Muted>
					</HStack>
					<HStack justify="end">
						<Button
							variant="outline"
							onClick={() => void props.onRegisterRecommendedTargets?.()}
							disabled={props.isRegisteringTargets === true}
						>
							{props.isRegisteringTargets
								? 'Registering...'
								: 'Register Recommended Targets'}
						</Button>
					</HStack>
					{props.runtimeTargets.map((target) => (
						<VStack
							key={target.id}
							gap="sm"
							align="stretch"
							className="rounded-md border p-3"
						>
							<HStack justify="between">
								<VStack gap="sm" align="start">
									<Small>{target.displayName}</Small>
									<Muted>
										{target.runtimeMode} · {target.dataLocality} ·{' '}
										{target.capabilityProfile.availableProviders.length}{' '}
										providers
									</Muted>
								</VStack>
								<VStack gap="sm" align="end">
									<Badge variant="secondary">{target.registrationState}</Badge>
									<Muted>
										{target.trustProfile?.controller ?? 'trust pending'}
									</Muted>
								</VStack>
							</HStack>
							<Muted>{target.lastHealthSummary ?? target.networkPolicy}</Muted>
							<Muted>
								Handshake:{' '}
								{target.capabilityHandshake
									? `${target.capabilityHandshake.networkReachability} · ${target.capabilityHandshake.storageProfile}`
									: 'pending'}
							</Muted>
							<Muted>
								Trust:{' '}
								{target.trustProfile
									? `${target.trustProfile.secretsLocation} · egress ${target.trustProfile.evidenceEgressPolicy}`
									: 'pending'}
							</Muted>
							<Muted>
								Channels:{' '}
								{target.capabilityProfile.supportedChannels?.join(', ') ??
									'not declared'}
							</Muted>
							<Muted>
								Lease:{' '}
								{target.lease
									? `${target.lease.grantedTo} until ${target.lease.expiresAt}`
									: 'none'}
							</Muted>
							<Muted>
								Last export compatibility:{' '}
								{target.capabilityProfile.supportsExport
									? 'export ready'
									: 'export blocked'}
							</Muted>
							{target.blockedReasons && target.blockedReasons.length > 0 ? (
								<Muted>{target.blockedReasons.join('; ')}</Muted>
							) : null}
							<HStack justify="end">
								<Button
									variant="outline"
									onClick={() =>
										void props.onQuarantineRuntimeTarget?.(target.id)
									}
									disabled={
										props.busyTargetId === target.id ||
										target.registrationState === 'quarantined'
									}
								>
									Quarantine
								</Button>
							</HStack>
						</VStack>
					))}
					{props.runtimeTargets.length === 0 ? (
						<Muted>No runtime targets registered yet.</Muted>
					) : null}
				</VStack>
			</CardContent>
		</Card>
	);
}
