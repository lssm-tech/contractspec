import type { ReactNode } from 'react';

import { LocalDataIndicator } from './LocalDataIndicator';
import {
	SaveToStudioButton,
	type SaveToStudioButtonProps,
} from './SaveToStudioButton';

export interface TemplateShellProps {
	title: string;
	description?: string;
	sidebar?: ReactNode;
	actions?: ReactNode;
	children: ReactNode;
	showSaveAction?: boolean;
	saveProps?: SaveToStudioButtonProps;
}

export const TemplateShell = ({
	title,
	description,
	sidebar,
	actions,
	showSaveAction = true,
	saveProps,
	children,
}: TemplateShellProps) => (
	<div className="space-y-6">
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

		<div
			className={
				sidebar ? 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]' : 'w-full'
			}
		>
			<main className="space-y-4 p-2">{children}</main>
			{sidebar ? (
				<aside className="rounded-2xl border border-border bg-card p-4">
					{sidebar}
				</aside>
			) : null}
		</div>
	</div>
);
