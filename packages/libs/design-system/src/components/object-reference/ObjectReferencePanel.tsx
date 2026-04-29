'use client';

import type * as React from 'react';
import {
	AdaptivePanel,
	type AdaptivePanelBreakpoint,
	type AdaptivePanelMode,
} from '../overlays/AdaptivePanel';

export type ObjectReferencePanelMode = AdaptivePanelMode;

export type ObjectReferencePanelBreakpoint = AdaptivePanelBreakpoint;

export interface ObjectReferencePanelProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	trigger: React.ReactNode;
	title: React.ReactNode;
	description?: React.ReactNode;
	mode?: ObjectReferencePanelMode;
	mobileMode?: Exclude<ObjectReferencePanelMode, 'responsive'>;
	desktopMode?: Exclude<ObjectReferencePanelMode, 'responsive'>;
	breakpoint?: ObjectReferencePanelBreakpoint;
	className?: string;
	children: React.ReactNode;
}

export function ObjectReferencePanel(props: ObjectReferencePanelProps) {
	return <AdaptivePanel {...props} />;
}
