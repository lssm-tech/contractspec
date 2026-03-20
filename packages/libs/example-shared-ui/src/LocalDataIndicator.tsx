'use client';

import { RefreshCw, Shield } from 'lucide-react';
import { useState } from 'react';

import { useTemplateRuntime } from './lib/runtime-context';

export function LocalDataIndicator() {
	const { projectId, templateId, template, installer } = useTemplateRuntime();
	const [isResetting, setIsResetting] = useState(false);

	const handleReset = async () => {
		setIsResetting(true);
		try {
			await installer.install(templateId, { projectId });
		} finally {
			setIsResetting(false);
		}
	};

	return (
		<div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-muted-foreground text-xs">
			<Shield className="h-3.5 w-3.5 text-violet-400" />
			<span>
				Local runtime ·{' '}
				<span className="font-semibold text-foreground">{template.name}</span>
			</span>
			<button
				type="button"
				className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 font-semibold text-[11px] text-muted-foreground hover:text-foreground"
				onClick={handleReset}
				disabled={isResetting}
			>
				<RefreshCw className="h-3 w-3" />
				{isResetting ? 'Resetting…' : 'Reset data'}
			</button>
		</div>
	);
}
