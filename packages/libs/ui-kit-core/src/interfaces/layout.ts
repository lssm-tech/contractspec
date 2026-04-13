import type { SharedClassNameProps, SharedFieldOrientation } from './common';

export interface SharedDialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export interface SharedStackProps extends SharedClassNameProps {
	direction?: Extract<SharedFieldOrientation, 'horizontal' | 'vertical'>;
}

export interface SharedSliderProps extends SharedClassNameProps {
	disabled?: boolean;
	min?: number;
	max?: number;
	step?: number;
	value?: number | number[];
}

export interface SharedTableProps extends SharedClassNameProps {}
