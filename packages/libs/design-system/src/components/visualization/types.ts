import type { VisualizationSpec } from '@contractspec/lib.contracts-spec/visualizations';
import type { ReactNode } from 'react';

export interface VisualizationSurfaceItem {
	key: string;
	spec: VisualizationSpec;
	data: unknown;
	title?: ReactNode;
	description?: ReactNode;
	footer?: ReactNode;
	height?: number;
	className?: string;
}
