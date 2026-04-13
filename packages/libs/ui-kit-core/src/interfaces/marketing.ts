import type * as React from 'react';
import type { SharedClassNameProps } from './common';

export interface SharedFeatureItem {
	title: React.ReactNode;
	description?: React.ReactNode;
	icon?: React.ReactNode;
}

export interface SharedFeatureGridProps extends SharedClassNameProps {
	items: SharedFeatureItem[];
	columns?: 2 | 3 | 4;
}

export interface SharedPricingTier {
	name: string;
	price: string;
	tagline?: string;
	features: string[];
	cta?: { label: string; href?: string; onClick?: () => void };
	highlighted?: boolean;
}

export interface SharedPricingTableProps extends SharedClassNameProps {
	tiers: SharedPricingTier[];
}
