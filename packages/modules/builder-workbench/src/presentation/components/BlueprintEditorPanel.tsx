'use client';

import type { BuilderBlueprint } from '@contractspec/lib.builder-spec';
import { Button } from '@contractspec/lib.ui-kit-web/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Textarea } from '@contractspec/lib.ui-kit-web/ui/textarea';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

export function BlueprintEditorPanel(props: {
	blueprint?: BuilderBlueprint | null;
	onBriefChange?: (value: string) => void;
	onGenerateBlueprint?: () => void | Promise<void>;
	isGeneratingBlueprint?: boolean;
}) {
	if (!props.blueprint) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Blueprint Editor</CardTitle>
					<CardDescription>
						No blueprint has been generated yet.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						onClick={() => void props.onGenerateBlueprint?.()}
						disabled={props.isGeneratingBlueprint === true}
					>
						{props.isGeneratingBlueprint
							? 'Generating...'
							: 'Generate from Captured Sources'}
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Blueprint Editor</CardTitle>
				<CardDescription>
					Locked sections and source-backed coverage stay visible while editing.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="lg" align="stretch">
					<HStack justify="end">
						<Button
							variant="outline"
							onClick={() => void props.onGenerateBlueprint?.()}
							disabled={props.isGeneratingBlueprint === true}
						>
							{props.isGeneratingBlueprint
								? 'Refreshing...'
								: 'Refresh Blueprint'}
						</Button>
					</HStack>
					<Textarea
						value={props.blueprint.appBrief}
						onChange={(event) =>
							props.onBriefChange?.(event.currentTarget.value)
						}
					/>
					<HStack justify="between">
						<Small>Coverage Fields</Small>
						<Muted>{props.blueprint.coverageReport.fields.length}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Locked Sections</Small>
						<Muted>
							{props.blueprint.lockedFieldPaths.join(', ') || 'none'}
						</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Open Questions</Small>
						<Muted>{props.blueprint.openQuestions.length}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Policies</Small>
						<Muted>{props.blueprint.policies.length}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Runtime Profiles</Small>
						<Muted>{props.blueprint.runtimeProfiles.length}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Feature Parity Markers</Small>
						<Muted>{props.blueprint.featureParity.length}</Muted>
					</HStack>
					<HStack justify="between">
						<Small>Integrations</Small>
						<Muted>{props.blueprint.integrations.length}</Muted>
					</HStack>
				</VStack>
			</CardContent>
		</Card>
	);
}
