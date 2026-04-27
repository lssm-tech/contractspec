'use client';

import { Input, Textarea } from '@contractspec/lib.design-system';
import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import { Text } from '@contractspec/lib.design-system/typography';
import type { ReactNode } from 'react';
import { ActionButton } from './FormShowcaseActionButton';
import {
	Field,
	SelectPreview,
	SwitchPreview,
} from './FormShowcaseControlPrimitives';
import { progressiveDefaultValues } from './form-showcase-preview.data';
import {
	progressiveActions,
	progressiveSteps,
} from './form-showcase-preview.model';

export function ProgressiveDemoForm() {
	return (
		<VStack role="form" aria-label="Progressive form demo" gap="md">
			<HStack gap="sm" wrap="wrap">
				{progressiveSteps.map((step, index) => (
					<Text
						key={step.key}
						className="rounded-full border border-border bg-background px-3 py-1 text-xs"
					>
						{index + 1}. {step.titleI18n ?? step.key}
					</Text>
				))}
			</HStack>
			<StepPanel title="Step 1: Workspace">
				<Field id="companyName" label="Company name" kind="Required text">
					<Input
						id="companyName"
						defaultValue={progressiveDefaultValues.companyName}
					/>
				</Field>
				<Field
					id="workspaceSlug"
					label="Workspace slug"
					kind="Computed on blur"
				>
					<HStack gap="none" wrap="nowrap">
						<Input
							id="workspaceSlug"
							defaultValue={progressiveDefaultValues.workspaceSlug}
							className="rounded-r-none"
						/>
						<Text className="flex h-9 items-center rounded-r-md border border-input border-l-0 bg-muted px-3 text-muted-foreground text-sm">
							.contractspec.app
						</Text>
					</HStack>
				</Field>
			</StepPanel>
			<StepPanel title="Step 2: Plan">
				<Field
					id="plan"
					label="Resolver-backed plan"
					kind="Autocomplete/select"
				>
					<SelectPreview
						id="plan"
						value="Team"
						options={['Starter', 'Enterprise']}
					/>
				</Field>
				<Field id="ownerEmail" label="Owner email" kind="Required email">
					<Input
						id="ownerEmail"
						type="email"
						defaultValue={progressiveDefaultValues.ownerEmail}
					/>
				</Field>
			</StepPanel>
			<StepPanel title="Step 3: Review">
				<SwitchPreview label="Needs security review" checked />
				<Field
					id="securityNotes"
					label="Conditional textarea"
					kind="Required when review is enabled"
				>
					<Textarea
						id="securityNotes"
						rows={4}
						defaultValue={progressiveDefaultValues.securityNotes}
					/>
				</Field>
				<Field id="goLiveDate" label="Go-live date" kind="Date">
					<Input id="goLiveDate" type="date" defaultValue="2026-06-01" />
				</Field>
			</StepPanel>
			<HStack gap="sm" wrap="wrap">
				{progressiveActions.map((action, index) => (
					<ActionButton
						key={action.key}
						variant={index === 0 ? 'ghost' : 'primary'}
						label={action.labelI18n}
					/>
				))}
			</HStack>
		</VStack>
	);
}

function StepPanel({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<VStack
			gap="md"
			className="rounded-md border border-border bg-background p-4"
		>
			<Text className="font-semibold text-sm">{title}</Text>
			{children}
		</VStack>
	);
}
