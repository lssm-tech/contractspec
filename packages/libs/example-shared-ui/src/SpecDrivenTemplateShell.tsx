import {
	BundleProvider,
	BundleRenderer,
} from '@contractspec/lib.surface-runtime/react';
import type { ResolvedSurfacePlan } from '@contractspec/lib.surface-runtime/runtime/resolve-bundle';
import type { ReactNode } from 'react';
import { LocalDataIndicator } from './LocalDataIndicator';
import {
	SaveToStudioButton,
	type SaveToStudioButtonProps,
} from './SaveToStudioButton';

export interface SpecDrivenTemplateShellProps {
	plan: ResolvedSurfacePlan;
	title: string;
	description?: string;
	sidebar?: ReactNode;
	actions?: ReactNode;
	children: ReactNode;
	showSaveAction?: boolean;
	saveProps?: SaveToStudioButtonProps;
}

/**
 * Template shell driven by surface-runtime bundle spec.
 * Uses BundleRenderer for adaptive, preference-driven layouts.
 * Requires @contractspec/lib.surface-runtime as peer dependency.
 */
export function SpecDrivenTemplateShell({
	plan,
	title,
	description,
	sidebar,
	actions,
	showSaveAction = true,
	saveProps,
	children,
}: SpecDrivenTemplateShellProps) {
	const headerContent = (
		<header className="rounded-2xl border border-border bg-card p-6 shadow-sm">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
						ContractSpec Templates
					</p>
					<h1 className="font-bold text-3xl">{title}</h1>
					{description ? (
						<p className="mt-2 max-w-2xl text-muted-foreground text-sm">
							{description}
						</p>
					) : null}
				</div>
				<div className="flex flex-col items-end gap-2">
					<LocalDataIndicator />
					{showSaveAction ? <SaveToStudioButton {...saveProps} /> : null}
				</div>
			</div>
			{actions ? <div className="mt-4">{actions}</div> : null}
		</header>
	);

	const slotContent: Partial<Record<string, ReactNode>> = {
		header: headerContent,
		primary: <main className="space-y-4 p-2">{children}</main>,
	};
	if (sidebar != null) {
		slotContent.sidebar = (
			<aside className="rounded-2xl border border-border bg-card p-4">
				{sidebar}
			</aside>
		);
	}

	return (
		<BundleProvider plan={plan}>
			<BundleRenderer slotContent={slotContent} />
		</BundleProvider>
	);
}
