'use client';

import { Button } from '@contractspec/lib.design-system';
import { Card, CardContent } from '@contractspec/lib.ui-kit-web/ui/card';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import type { JourneyStepSpec } from '@contractspec/module.learning-journey/track-spec';
import { useState } from 'react';

interface FlashCardProps {
	step: JourneyStepSpec;
	isCompleted: boolean;
	isCurrent: boolean;
	onComplete?: () => void;
}

export function FlashCard({
	step,
	isCompleted,
	isCurrent,
	onComplete,
}: FlashCardProps) {
	const [isFlipped, setIsFlipped] = useState(false);

	return (
		<Card
			className={cn(
				'relative cursor-pointer overflow-hidden transition-all duration-300',
				isCurrent && 'ring-2 ring-primary',
				isCompleted && 'opacity-60'
			)}
			onClick={() => !isCompleted && setIsFlipped(!isFlipped)}
		>
			<CardContent className="p-6">
				{/* Front of card */}
				<div
					className={cn(
						'space-y-4 transition-opacity duration-200',
						isFlipped ? 'opacity-0' : 'opacity-100'
					)}
				>
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<h3 className="font-semibold text-lg">{step.title}</h3>
							{step.description && (
								<p className="mt-1 text-muted-foreground text-sm">
									{step.description}
								</p>
							)}
						</div>
						{step.xpReward && (
							<span className="rounded-full bg-green-500/10 px-2 py-1 font-semibold text-green-500 text-xs">
								+{step.xpReward} XP
							</span>
						)}
					</div>

					{isCompleted && (
						<div className="flex items-center gap-2 text-green-500">
							<span>✓</span>
							<span className="font-medium text-sm">Completed</span>
						</div>
					)}

					{isCurrent && !isCompleted && (
						<p className="text-muted-foreground text-xs">
							Tap to reveal action
						</p>
					)}
				</div>

				{/* Back of card (action) */}
				{isFlipped && !isCompleted && (
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-violet-500/10 to-violet-600/10 p-6">
						<p className="text-center text-sm">
							{step.instructions ?? 'Complete this step to earn XP'}
						</p>
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsFlipped(false)}
							>
								Back
							</Button>
							<Button
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									onComplete?.();
								}}
							>
								Mark Complete
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
