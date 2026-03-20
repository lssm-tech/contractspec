'use client';

import { Button } from '@contractspec/lib.design-system';
import type { LearningView, ViewTabsProps } from '../types';

const VIEW_LABELS: Record<LearningView, { label: string; icon: string }> = {
	overview: { label: 'Overview', icon: '📊' },
	steps: { label: 'Steps', icon: '📝' },
	progress: { label: 'Progress', icon: '📈' },
	timeline: { label: 'Timeline', icon: '📅' },
};

const DEFAULT_VIEWS: LearningView[] = [
	'overview',
	'steps',
	'progress',
	'timeline',
];

export function ViewTabs({
	currentView,
	onViewChange,
	availableViews = DEFAULT_VIEWS,
}: ViewTabsProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{availableViews.map((view) => {
				const { label, icon } = VIEW_LABELS[view];
				const isActive = currentView === view;

				return (
					<Button
						key={view}
						variant={isActive ? 'default' : 'outline'}
						size="sm"
						onClick={() => onViewChange(view)}
						className="gap-1.5"
					>
						<span>{icon}</span>
						<span>{label}</span>
					</Button>
				);
			})}
		</div>
	);
}
