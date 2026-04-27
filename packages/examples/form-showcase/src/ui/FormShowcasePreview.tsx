'use client';

import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import { H2, Text } from '@contractspec/lib.design-system/typography';
import { AllFieldsDemoForm } from './FormShowcaseAllFieldsDemo';
import { Metric, PreviewPanel } from './FormShowcasePreviewParts';
import { ProgressiveDemoForm } from './FormShowcaseProgressiveDemo';
import {
	allFieldSections,
	fieldKinds,
	progressiveSteps,
} from './form-showcase-preview.model';

export function FormShowcasePreview() {
	return (
		<VStack as="section" gap="lg" className="p-4 sm:p-5">
			<HStack align="start" justify="between" className="gap-4 lg:flex-nowrap">
				<VStack gap="xs" className="min-w-0 flex-1">
					<Text className="font-semibold text-muted-foreground text-xs uppercase">
						Form-only template
					</Text>
					<H2 className="font-serif text-3xl tracking-normal">
						ContractSpec form preview
					</H2>
					<Text className="max-w-4xl text-muted-foreground text-sm leading-6">
						An actual form surface showing text, email, textarea, select, radio,
						checkbox, switch, autocomplete, address, phone, date, time,
						datetime, group, array, conditional fields, sections, and steps.
					</Text>
				</VStack>
				<HStack
					align="stretch"
					justify="end"
					wrap="wrap"
					className="shrink-0 gap-2"
				>
					<Metric label="Kinds" value={String(fieldKinds.length)} />
					<Metric label="Sections" value={String(allFieldSections.length)} />
					<Metric label="Steps" value={String(progressiveSteps.length)} />
				</HStack>
			</HStack>

			<HStack align="start" className="gap-5 xl:flex-nowrap">
				<PreviewPanel
					title="All field kinds"
					description="Responsive sections, grouped credentials, repeated contact rows, rich fields, policy hints, and conditional controls."
				>
					<AllFieldsDemoForm />
				</PreviewPanel>
				<PreviewPanel
					title="Progressive layout"
					description="A step-oriented setup form with resolver-style plan choice, computed slug, security review conditionals, and draft/submit actions."
				>
					<ProgressiveDemoForm />
				</PreviewPanel>
			</HStack>
		</VStack>
	);
}
