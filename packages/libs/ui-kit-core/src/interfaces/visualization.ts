import type { SharedClassNameProps } from './common';

export type SharedVisualizationInteractionHandler = (params: unknown) => void;

export interface SharedVisualizationProps extends SharedClassNameProps {
	model: unknown;
	height?: number;
	onDataPointPress?: SharedVisualizationInteractionHandler;
}
