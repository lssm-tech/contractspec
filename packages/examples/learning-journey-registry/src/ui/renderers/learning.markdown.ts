import type { PresentationRenderer } from '@contractspec/lib.presentation-runtime-core/transform-engine';
import type {
	JourneyProgressSnapshot,
	JourneyTrackSpec,
} from '@contractspec/module.learning-journey/track-spec';
import type { LearningPresentationData } from '../presentation-data';

const ensureData = (data: unknown): LearningPresentationData => {
	if (!data || typeof data !== 'object') {
		throw new Error('learningJourneyMarkdownRenderer: missing data');
	}
	return data as LearningPresentationData;
};

function formatStepStatus(
	progress: JourneyProgressSnapshot,
	stepId: string
): string {
	const step = progress.steps.find((item) => item.stepId === stepId);
	return step?.status ?? 'LOCKED';
}

function formatTrackSummary(
	track: JourneyTrackSpec,
	progress: JourneyProgressSnapshot
): string[] {
	return [
		`## ${track.name}`,
		track.description ? `${track.description}` : '',
		`- Progress: ${progress.progressPercent}%`,
		`- XP Earned: ${progress.xpEarned}`,
		`- Current Step: ${progress.currentStepId ?? 'None'}`,
	].filter(Boolean);
}

export const learningTrackListMarkdownRenderer: PresentationRenderer<{
	body: string;
	mimeType: string;
}> = {
	target: 'markdown',
	render: async (desc, ctx) => {
		if (
			desc.source.type !== 'component' ||
			desc.meta.key !== 'learning.journey.track_list'
		) {
			throw new Error('learningTrackListMarkdownRenderer: not track_list');
		}

		const data = ensureData(ctx?.data);
		const lines = ['# Learning Journey Catalog', ''];
		for (const track of data.tracks) {
			lines.push(...formatTrackSummary(track, data.progress));
			lines.push('');
		}

		return {
			mimeType: 'text/markdown',
			body: lines.join('\n'),
		};
	},
};

export const learningTrackDetailMarkdownRenderer: PresentationRenderer<{
	body: string;
	mimeType: string;
}> = {
	target: 'markdown',
	render: async (desc, ctx) => {
		if (
			desc.source.type !== 'component' ||
			desc.meta.key !== 'learning.journey.track_detail'
		) {
			throw new Error('learningTrackDetailMarkdownRenderer: not track_detail');
		}

		const data = ensureData(ctx?.data);
		const lines = ['# Learning Journey Detail', ''];
		lines.push(
			...formatTrackSummary(data.track, data.progress),
			'',
			'## Steps',
			''
		);
		for (const [index, step] of data.track.steps.entries()) {
			lines.push(
				`${index + 1}. **${step.title}**`,
				`   - Status: ${formatStepStatus(data.progress, step.id)}`,
				`   - Event: ${step.completion.eventName}`
			);
		}

		return {
			mimeType: 'text/markdown',
			body: lines.join('\n'),
		};
	},
};

export const learningTrackProgressWidgetMarkdownRenderer: PresentationRenderer<{
	body: string;
	mimeType: string;
}> = {
	target: 'markdown',
	render: async (desc, ctx) => {
		if (
			desc.source.type !== 'component' ||
			desc.meta.key !== 'learning.journey.progress_widget'
		) {
			throw new Error(
				'learningTrackProgressWidgetMarkdownRenderer: not progress_widget'
			);
		}

		const data = ensureData(ctx?.data);
		const lines = [
			'# Learning Progress',
			'',
			`**Track**: ${data.track.name}`,
			`**Progress**: ${data.progress.progressPercent}%`,
			`**Completed Steps**: ${data.progress.completedStepCount}/${data.progress.totalSteps}`,
			`**Next Step**: ${data.progress.nextStepId ?? 'None'}`,
			`**XP Earned**: ${data.progress.xpEarned}`,
		];

		return {
			mimeType: 'text/markdown',
			body: lines.join('\n'),
		};
	},
};
