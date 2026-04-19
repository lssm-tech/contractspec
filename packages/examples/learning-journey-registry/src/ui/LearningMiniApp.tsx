'use client';

import { CoachingMiniApp } from '@contractspec/example.learning-journey-ui-coaching';
import { GamifiedMiniApp } from '@contractspec/example.learning-journey-ui-gamified';
import { OnboardingMiniApp } from '@contractspec/example.learning-journey-ui-onboarding';
import type { LearningView } from '@contractspec/example.learning-journey-ui-shared';
import { useMemo } from 'react';
import { getLearningAppType, getLearningTrack } from './template-config';

interface LearningMiniAppProps {
	initialView?: LearningView;
	onViewChange?: (view: LearningView) => void;
	templateId: string;
}

function MissingLearningTemplate({ templateId }: { templateId: string }) {
	return (
		<div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-6 text-center">
			<p className="text-amber-500">Unknown learning template: {templateId}</p>
		</div>
	);
}

/** Router component that picks the correct mini-app based on template ID */
export function LearningMiniApp({
	templateId,
	initialView = 'overview',
	onViewChange,
}: LearningMiniAppProps) {
	const track = useMemo(() => getLearningTrack(templateId), [templateId]);
	const appType = getLearningAppType(templateId);

	if (!track || !appType) {
		return <MissingLearningTemplate templateId={templateId} />;
	}

	switch (appType) {
		case 'gamified':
			return (
				<GamifiedMiniApp
					track={track}
					initialView={initialView}
					onViewChange={onViewChange}
				/>
			);
		case 'onboarding':
			return (
				<OnboardingMiniApp
					track={track}
					initialView={initialView}
					onViewChange={onViewChange}
				/>
			);
		case 'coaching':
			return (
				<CoachingMiniApp
					track={track}
					initialView={initialView}
					onViewChange={onViewChange}
				/>
			);
		default:
			return <MissingLearningTemplate templateId={templateId} />;
	}
}

export function LearningTrackList({ templateId }: { templateId?: string }) {
	if (!templateId) return <MissingLearningTemplate templateId="unknown" />;
	return <LearningMiniApp templateId={templateId} initialView="overview" />;
}

export function LearningTrackDetail({ templateId }: { templateId?: string }) {
	if (!templateId) return <MissingLearningTemplate templateId="unknown" />;
	return <LearningMiniApp templateId={templateId} initialView="steps" />;
}

export function LearningTrackProgressWidget({
	templateId,
}: {
	templateId?: string;
}) {
	if (!templateId) return <MissingLearningTemplate templateId="unknown" />;
	return <LearningMiniApp templateId={templateId} initialView="progress" />;
}
