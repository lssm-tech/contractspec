'use client';

import { useMemo } from 'react';
import { createSurfaceI18n } from '../i18n';
import type { OverlayConflict } from '../runtime/resolve-bundle';

export interface OverlayConflictResolverProps {
	conflicts: OverlayConflict[];
	onResolve: (resolution: {
		targetKey: string;
		chosenScope: 'A' | 'B';
	}) => void;
	/** Locale for i18n (e.g. from plan.locale). Defaults to 'en'. */
	locale?: string;
}

/**
 * Renders overlay merge conflicts and lets the user choose which overlay wins.
 * Simplified: keep higher-trust scope (workspace > user > session).
 */
export function OverlayConflictResolver({
	conflicts,
	onResolve,
	locale,
}: OverlayConflictResolverProps) {
	const i18n = useMemo(() => createSurfaceI18n(locale), [locale]);
	return (
		<div
			data-overlay-conflicts
			style={{
				padding: '12px',
				marginBottom: '12px',
				border: '1px solid var(--destructive, #ef4444)',
				borderRadius: '8px',
				backgroundColor: 'var(--destructive/10, #fef2f2)',
			}}
		>
			<div
				style={{
					fontSize: '14px',
					fontWeight: 600,
					marginBottom: '8px',
					color: 'var(--destructive, #ef4444)',
				}}
			>
				{i18n.t('overlay.conflicts.title')}
			</div>
			{conflicts.map((c) => (
				<div
					key={`${c.targetKey}-${c.overlayIdA}-${c.overlayIdB}`}
					style={{
						padding: '8px',
						marginBottom: '8px',
						backgroundColor: 'white',
						borderRadius: '4px',
						fontSize: '13px',
					}}
				>
					<span>{c.targetKey}</span>
					<span style={{ margin: '0 8px', color: '#9ca3af' }}>
						({c.scopeA} vs {c.scopeB})
					</span>
					<div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
						<button
							type="button"
							onClick={() =>
								onResolve({ targetKey: c.targetKey, chosenScope: 'A' })
							}
							style={{
								padding: '4px 12px',
								fontSize: '12px',
								borderRadius: '4px',
								border: '1px solid #e5e7eb',
								backgroundColor: 'white',
								cursor: 'pointer',
							}}
						>
							{i18n.t('overlay.conflicts.keepScope', { scope: c.scopeA })}
						</button>
						<button
							type="button"
							onClick={() =>
								onResolve({ targetKey: c.targetKey, chosenScope: 'B' })
							}
							style={{
								padding: '4px 12px',
								fontSize: '12px',
								borderRadius: '4px',
								border: '1px solid #e5e7eb',
								backgroundColor: 'white',
								cursor: 'pointer',
							}}
						>
							{i18n.t('overlay.conflicts.keepScope', { scope: c.scopeB })}
						</button>
					</div>
				</div>
			))}
		</div>
	);
}
