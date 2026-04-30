export interface BehaviorSupportDimensions {
	attention: 'ambient' | 'next-step' | 'priority' | 'review';
	activation: 'self-start' | 'prompted' | 'guided-start' | 'ritual';
	actionScale: 'tiny' | 'small' | 'standard' | 'large';
	rhythm: 'flexible' | 'steady' | 'time-boxed' | 'deadline-driven';
	environment: 'open' | 'structured' | 'focused' | 'collaborative';
	challenge: 'low' | 'moderate' | 'stretch' | 'high';
	meaningFrame:
		| 'progress'
		| 'mastery'
		| 'impact'
		| 'relief'
		| 'belonging'
		| 'agency';
	permission: 'proceed' | 'start-smaller' | 'pause' | 'renegotiate';
	selfAuthority:
		| 'light'
		| 'structured'
		| 'confidence-building'
		| 'high-autonomy';
	accountability: 'private' | 'self-review' | 'peer-review' | 'external-review';
	recovery: 'resume' | 'repair' | 'reset' | 'renegotiate';
	reflection: 'none' | 'brief' | 'standard' | 'deep';
}

export type BehaviorSupportDimension = keyof BehaviorSupportDimensions;
export type BehaviorSupportDimensionValue =
	BehaviorSupportDimensions[BehaviorSupportDimension];

export * from './behavior-support-preset-definitions';
export * from './behavior-support-presets';
