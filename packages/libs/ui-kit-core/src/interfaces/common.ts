import type * as React from 'react';

export type SharedDensity = 'compact' | 'default';
export type SharedSize = 'sm' | 'md' | 'lg';
export type SharedFieldOrientation = 'vertical' | 'horizontal' | 'responsive';

export interface SharedClassNameProps {
	className?: string;
}

export interface SharedChildrenProps {
	children?: React.ReactNode;
}

export interface SharedDisableableProps {
	disabled?: boolean;
}

export interface SharedLoadableProps {
	loading?: boolean;
}

export interface SharedOption {
	value: string;
	label: string;
	count?: number;
}

export interface SharedActionConfig {
	label: string;
	href?: string;
	onClick?: () => void;
	icon?: React.ReactNode;
}

export interface SharedFieldError {
	message?: string;
}
