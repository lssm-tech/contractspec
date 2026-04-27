'use client';

import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import { H2, Text } from '@contractspec/lib.design-system/typography';
import {
	FieldKindGrid,
	Metric,
	PreviewPanel,
	SampleValues,
	SectionTimeline,
} from './FormShowcasePreviewParts';
import {
	allFieldSampleValues,
	allFieldSections,
	fieldKinds,
	progressiveActions,
	progressiveSampleValues,
	progressiveSteps,
} from './form-showcase-preview.model';

export function FormShowcasePreview() {
	return (
		<VStack as="section" gap="xl" className="p-4 sm:p-6">
			<HStack align="stretch" className="gap-4 lg:flex-nowrap">
				<VStack
					gap="xs"
					className="flex-1 rounded-lg border border-border bg-card p-5 shadow-sm"
				>
					<Text className="font-semibold text-muted-foreground text-xs uppercase">
						Form-only template
					</Text>
					<H2 className="mt-2 font-serif text-3xl tracking-normal">
						ContractSpec form preview
					</H2>
					<Text className="mt-2 max-w-3xl text-muted-foreground text-sm leading-6">
						Two schema-backed FormSpec contracts cover rich field kinds,
						responsive sections, progressive steps, groups, arrays,
						conditionals, PII policy, and action metadata.
					</Text>
				</VStack>
				<HStack
					align="stretch"
					className="w-full gap-2 rounded-lg border border-border bg-background p-4 lg:w-80 lg:flex-col"
				>
					<Metric label="Kinds" value={String(fieldKinds.length)} />
					<Metric label="Sections" value={String(allFieldSections.length)} />
					<Metric label="Steps" value={String(progressiveSteps.length)} />
				</HStack>
			</HStack>

			<HStack align="start" className="gap-6 xl:flex-nowrap">
				<PreviewPanel
					title="All field kinds"
					description="Schema fields grouped into responsive sections with nested arrays, input groups, policy hints, and conditional logic."
				>
					<FieldKindGrid kinds={fieldKinds} />
					<SectionTimeline sections={allFieldSections} />
					<SampleValues values={allFieldSampleValues} />
				</PreviewPanel>
				<PreviewPanel
					title="Progressive steps"
					description="Step flow with resolver-backed choices, conditional review notes, draft and submit actions."
				>
					<SectionTimeline sections={progressiveSteps} />
					<SampleValues values={progressiveSampleValues} />
					<HStack gap="sm" wrap="wrap">
						{progressiveActions.map((action) => (
							<Text
								key={action.key}
								className="rounded-full border border-border bg-muted px-3 py-1 text-muted-foreground text-xs"
							>
								{action.labelI18n}
							</Text>
						))}
					</HStack>
				</PreviewPanel>
			</HStack>
		</VStack>
	);
}
