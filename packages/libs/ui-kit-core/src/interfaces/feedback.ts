import type * as React from 'react';
import type {
	SharedClassNameProps,
	SharedDensity,
	SharedDisableableProps,
} from './common';

export interface SharedEmptyStateProps extends SharedClassNameProps {
	icon?: React.ReactNode;
	title: React.ReactNode;
	description?: React.ReactNode;
	primaryAction?: React.ReactNode;
	secondaryAction?: React.ReactNode;
	density?: SharedDensity | null;
}

export interface SharedPageHeaderProps extends SharedClassNameProps {
	breadcrumb?: React.ReactNode;
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	actions?: React.ReactNode;
	spacing?: 'sm' | 'md' | 'lg' | null;
}

export interface SharedStepperProps extends SharedClassNameProps {
	current: number;
	total: number;
	size?: 'sm' | 'md' | null;
}

export interface SharedLoadingButtonProps
	extends SharedDisableableProps,
		SharedClassNameProps {
	loading?: boolean;
}

export interface SharedToastProps extends SharedClassNameProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}
