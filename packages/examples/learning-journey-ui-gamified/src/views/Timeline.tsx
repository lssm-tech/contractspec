'use client';

import type { LearningViewProps } from '@contractspec/example.learning-journey-ui-shared';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { DayCalendar } from '../components/DayCalendar';

export function Timeline({ track, progress }: LearningViewProps) {
	// Check if this is a quest with day unlocks
	const hasQuestDays = track.steps.some(
		(s) => s.availability?.unlockOnDay !== undefined
	);

	if (hasQuestDays) {
		// Quest-style calendar view
		const totalDays = Math.max(
			...track.steps.map((s) => s.availability?.unlockOnDay ?? 1),
			7
		);

		const completedDays = track.steps
			.filter((s) => progress.completedStepIds.includes(s.id))
			.map((s) => s.availability?.unlockOnDay ?? 1);

		// Current day is the first incomplete day
		const currentDay =
			track.steps.find((s) => !progress.completedStepIds.includes(s.id))
				?.availability?.unlockOnDay ?? 1;

		return (
			<div className="space-y-6">
				{/* Header */}
				<div className="text-center">
					<h2 className="font-bold text-xl">{track.name}</h2>
					<p className="text-muted-foreground">
						Complete each day's challenge to progress
					</p>
				</div>

				{/* Calendar Grid */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<span>📅</span>
							<span>Your Journey</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="flex justify-center">
						<DayCalendar
							totalDays={totalDays}
							currentDay={currentDay}
							completedDays={completedDays}
						/>
					</CardContent>
				</Card>

				{/* Daily Steps */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<span>📝</span>
							<span>Daily Challenges</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{track.steps.map((step) => {
								const day = step.availability?.unlockOnDay ?? 1;
								const isCompleted = progress.completedStepIds.includes(step.id);
								const isLocked = day > currentDay;

								return (
									<div
										key={step.id}
										className={`flex items-start gap-4 rounded-lg border p-4 ${
											isLocked ? 'opacity-50' : ''
										}`}
									>
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted font-semibold">
											{isCompleted ? '✓' : isLocked ? '🔒' : day}
										</div>
										<div className="flex-1">
											<h4 className="font-semibold">{step.title}</h4>
											<p className="text-muted-foreground text-sm">
												{step.description}
											</p>
										</div>
										{step.xpReward && (
											<span
												className={`font-medium text-sm ${
													isCompleted
														? 'text-green-500'
														: 'text-muted-foreground'
												}`}
											>
												+{step.xpReward} XP
											</span>
										)}
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Drill-style timeline (step order)
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center">
				<h2 className="font-bold text-xl">Learning Path</h2>
				<p className="text-muted-foreground">
					Follow the steps to master this skill
				</p>
			</div>

			{/* Timeline */}
			<Card>
				<CardContent className="p-6">
					<div className="relative">
						{/* Vertical line */}
						<div className="absolute top-0 left-5 h-full w-0.5 bg-border" />

						{/* Steps */}
						<div className="space-y-6">
							{track.steps.map((step, index) => {
								const isCompleted = progress.completedStepIds.includes(step.id);
								const isCurrent =
									!isCompleted &&
									track.steps
										.slice(0, index)
										.every((s) => progress.completedStepIds.includes(s.id));

								return (
									<div key={step.id} className="relative flex gap-4 pl-2">
										{/* Node */}
										<div
											className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
												isCompleted
													? 'border-green-500 bg-green-500 text-white'
													: isCurrent
														? 'border-violet-500 bg-violet-500 text-white'
														: 'border-border bg-background'
											}`}
										>
											{isCompleted ? '✓' : index + 1}
										</div>

										{/* Content */}
										<div className="flex-1 pb-4">
											<div className="flex items-start justify-between gap-2">
												<div>
													<h4
														className={`font-semibold ${
															isCompleted
																? 'text-foreground'
																: isCurrent
																	? 'text-violet-500'
																	: 'text-muted-foreground'
														}`}
													>
														{step.title}
													</h4>
													<p className="mt-1 text-muted-foreground text-sm">
														{step.description}
													</p>
												</div>
												{step.xpReward && (
													<span
														className={`shrink-0 rounded-full px-2 py-1 font-semibold text-xs ${
															isCompleted
																? 'bg-green-500/10 text-green-500'
																: 'bg-muted text-muted-foreground'
														}`}
													>
														+{step.xpReward} XP
													</span>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
