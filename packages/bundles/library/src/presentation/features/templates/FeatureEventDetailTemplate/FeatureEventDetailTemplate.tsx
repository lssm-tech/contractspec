'use client';

import {
	Breadcrumbs,
	CodeBlock,
	EmptyState,
	PageHeaderResponsive,
	StatusChip,
} from '@contractspec/lib.design-system';
import { Card } from '@contractspec/lib.ui-kit-web/ui/card';
import { Box, HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { BookOpen, Code, Database, Radio } from 'lucide-react';
import Link from 'next/link';
import { useRelatedDocs } from '../../hooks/useRelatedDocs';
import type { FeatureEventDetailTemplateProps } from './types';

export function FeatureEventDetailTemplate({
	feature,
	eventKey,
	event,
	spec,
	className,
}: FeatureEventDetailTemplateProps) {
	const eventRef = event ?? feature.events?.find((ev) => ev.key === eventKey);

	const relatedDocs = useRelatedDocs(eventRef?.key || '', spec?.meta?.tags);

	if (!eventRef) {
		return (
			<VStack
				gap="lg"
				className={cn('mx-auto w-full max-w-5xl p-6', className)}
			>
				<PageHeaderResponsive
					title="Event Not Found"
					subtitle={`Event ${eventKey} not found in feature ${feature.meta.key}`}
					breadcrumb={
						<Breadcrumbs
							items={[
								{ label: 'Features', href: '/features' },
								{
									label: feature.meta.title || feature.meta.key,
									href: `/features/${feature.meta.key}`,
								},
								{
									label: 'Events',
									href: `/features/${feature.meta.key}/events`,
								},
							]}
						/>
					}
				/>
				<EmptyState
					title="Event not found"
					description={`The event '${eventKey}' could not be found in this feature.`}
					icon={<Radio className="h-12 w-12 text-muted-foreground" />}
				/>
			</VStack>
		);
	}

	return (
		<VStack gap="lg" className={cn('mx-auto w-full max-w-5xl p-6', className)}>
			<PageHeaderResponsive
				title={eventRef.key}
				subtitle={`Event defined in ${feature.meta.title ?? feature.meta.key}`}
				breadcrumb={
					<Breadcrumbs
						items={[
							{ label: 'Features', href: '/features' },
							{
								label: feature.meta.title || feature.meta.key,
								href: `/features/${feature.meta.key}`,
							},
							{ label: 'Events', href: `/features/${feature.meta.key}#events` },
							{ label: eventRef.key },
						]}
					/>
				}
			/>

			<HStack gap="sm">
				<StatusChip
					tone="neutral"
					label={eventRef.key}
					size="sm"
					icon={<Radio className="h-3 w-3" />}
				/>
				<StatusChip tone="neutral" label={`v${eventRef.version}`} size="sm" />
				{spec?.meta?.stability ? (
					<StatusChip
						tone={spec.meta.stability === 'stable' ? 'success' : 'warning'}
						label={spec.meta.stability}
						size="sm"
					/>
				) : null}
			</HStack>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					<Card className="p-6">
						<VStack gap="md">
							<HStack className="items-center gap-2 border-b pb-2">
								<Code className="h-5 w-5 text-muted-foreground" />
								<h3 className="font-semibold text-lg">Payload Definition</h3>
							</HStack>

							{spec ? (
								<VStack gap="lg">
									{spec.meta.description && (
										<p className="text-muted-foreground">
											{spec.meta.description}
										</p>
									)}

									<Box className="flex-col gap-2">
										<span className="font-medium text-muted-foreground text-sm uppercase tracking-wider">
											Payload Schema
										</span>
										<CodeBlock
											code={JSON.stringify(spec.payload, null, 2)}
											language="json"
										/>
									</Box>
								</VStack>
							) : (
								<VStack gap="md">
									<p className="text-muted-foreground">
										Full payload details are not available for this event
										reference.
									</p>
									<CodeBlock
										code={JSON.stringify(eventRef, null, 2)}
										language="json"
									/>
								</VStack>
							)}
						</VStack>
					</Card>
				</div>

				<div className="space-y-6">
					<Card className="p-6">
						<VStack gap="md">
							<HStack className="items-center gap-2 border-b pb-2">
								<Database className="h-5 w-5 text-muted-foreground" />
								<h3 className="font-semibold text-lg">Metadata</h3>
							</HStack>

							<dl className="grid grid-cols-1 gap-4 text-sm">
								<div>
									<dt className="text-muted-foreground">Key</dt>
									<dd className="truncate font-medium">{eventRef.key}</dd>
								</div>
								<div>
									<dt className="text-muted-foreground">Version</dt>
									<dd className="font-medium">{eventRef.version}</dd>
								</div>
								{spec?.meta?.owners && (
									<div>
										<dt className="text-muted-foreground">Owners</dt>
										<dd className="flex flex-wrap gap-1 font-medium">
											{spec.meta.owners.map((o: string) => (
												<StatusChip
													key={o}
													label={o}
													size="sm"
													tone="neutral"
												/>
											))}
										</dd>
									</div>
								)}
							</dl>
						</VStack>
					</Card>
				</div>

				{/* Related Docs */}
				{relatedDocs?.length ? (
					<div className="lg:col-span-3">
						<Card className="p-6">
							<VStack gap="md">
								<HStack className="items-center gap-2 border-b pb-2">
									<BookOpen className="h-5 w-5 text-muted-foreground" />
									<h3 className="font-semibold text-lg">
										Related Documentation
									</h3>
								</HStack>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
									{relatedDocs.map((doc) => (
										<Link
											key={doc.id}
											href={doc.route || `/docs/${doc.id}`}
											className="group block"
										>
											<div className="h-full rounded-lg border p-4 transition-colors hover:border-primary">
												<h4 className="mb-1 font-semibold group-hover:text-primary">
													{doc.title}
												</h4>
												{doc.summary && (
													<p className="line-clamp-2 text-muted-foreground text-sm">
														{doc.summary}
													</p>
												)}
											</div>
										</Link>
									))}
								</div>
							</VStack>
						</Card>
					</div>
				) : null}
			</div>
		</VStack>
	);
}
