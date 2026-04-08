'use client';

import type {
	BuilderApprovalTicket,
	BuilderDirectiveCandidate,
	BuilderTranscriptSegment,
} from '@contractspec/lib.builder-spec';
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
import { Textarea } from '@contractspec/lib.ui-kit-web/ui/textarea';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

export function GuidedChatVoicePanel(props: {
	promptDraft: string;
	transcripts: BuilderTranscriptSegment[];
	directives: BuilderDirectiveCandidate[];
	approvalTickets: BuilderApprovalTicket[];
	onDraftChange?: (value: string) => void;
	onCapturePrompt?: () => void | Promise<void>;
	onGenerateBlueprint?: () => void | Promise<void>;
	isCapturingPrompt?: boolean;
	isGeneratingBlueprint?: boolean;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Guided Chat / Voice</CardTitle>
				<CardDescription>
					Every transcript and directive stays visible with confidence and
					review state.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="lg" align="stretch">
					<Textarea
						value={props.promptDraft}
						onChange={(event) =>
							props.onDraftChange?.(event.currentTarget.value)
						}
						placeholder="Describe the app, constraints, or corrections."
					/>
					<VStack gap="md" align="stretch">
						{props.transcripts.map((segment) => (
							<HStack key={segment.id} justify="between">
								<VStack gap="sm" align="start">
									<Small>{segment.text}</Small>
									<Muted>
										{segment.language} · {Math.round(segment.confidence * 100)}%
									</Muted>
								</VStack>
								<Badge
									variant={
										segment.requiresConfirmation ? 'destructive' : 'secondary'
									}
								>
									{segment.status}
								</Badge>
							</HStack>
						))}
					</VStack>
					<VStack gap="sm" align="stretch">
						{props.directives.map((directive) => (
							<HStack key={directive.id} justify="between">
								<VStack gap="sm" align="start">
									<Small>{directive.statement}</Small>
									<Muted>{directive.riskLevel ?? 'low'} risk</Muted>
								</VStack>
								<Badge
									variant={
										directive.requiresReview ? 'destructive' : 'secondary'
									}
								>
									{directive.targetArea}
								</Badge>
							</HStack>
						))}
					</VStack>
					<HStack justify="between">
						<Small>Open Approval Tickets</Small>
						<Muted>
							{
								props.approvalTickets.filter(
									(ticket) => ticket.status === 'open'
								).length
							}
						</Muted>
					</HStack>
					<HStack justify="end">
						<Button
							variant="outline"
							onClick={() => void props.onCapturePrompt?.()}
							disabled={
								!props.promptDraft.trim() || props.isCapturingPrompt === true
							}
						>
							{props.isCapturingPrompt ? 'Capturing...' : 'Capture Prompt'}
						</Button>
						<Button
							onClick={() => void props.onGenerateBlueprint?.()}
							disabled={props.isGeneratingBlueprint === true}
						>
							{props.isGeneratingBlueprint
								? 'Generating...'
								: 'Generate Blueprint'}
						</Button>
					</HStack>
				</VStack>
			</CardContent>
		</Card>
	);
}
