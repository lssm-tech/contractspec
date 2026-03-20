'use client';

import {
	Button,
	ErrorState,
	LoaderBlock,
	MarkdownRenderer,
} from '@contractspec/lib.design-system';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { Card } from '@contractspec/lib.ui-kit-web/ui/card';
import { useCallback } from 'react';
import { useTemplateRuntime } from './lib/runtime-context';
import type { TemplateId } from './lib/types';
import { formatPresentationName } from './markdown/formatPresentationName';
import { useMarkdownPresentation } from './markdown/useMarkdownPresentation';

export interface MarkdownViewProps {
	/** Optional override, otherwise comes from context */
	templateId?: TemplateId;
	presentationId?: string;
	className?: string;
}

/**
 * MarkdownView renders template presentations as markdown using TransformEngine.
 * It allows switching between available presentations for the template.
 */
export function MarkdownView({
	templateId: propTemplateId,
	presentationId,
	className,
}: MarkdownViewProps) {
	const {
		engine,
		template,
		templateId: contextTemplateId,
		resolvePresentation,
		fetchData,
	} = useTemplateRuntime();

	const templateId = propTemplateId ?? contextTemplateId;
	const presentations = (template?.presentations as string[]) ?? [];
	const {
		error,
		loading,
		markdownContent,
		renderMarkdown,
		selectedPresentation,
		setSelectedPresentation,
	} = useMarkdownPresentation({
		engine,
		fetchData,
		presentationId,
		presentations,
		resolvePresentation,
		templateId,
	});

	if (!presentations.length) {
		return (
			<Card className={className}>
				<div className="p-6 text-center">
					<p className="text-muted-foreground">
						No presentations available for this template.
					</p>
				</div>
			</Card>
		);
	}

	const handleCopy = useCallback(() => {
		if (markdownContent) {
			void navigator.clipboard.writeText(markdownContent);
		}
	}, [markdownContent]);

	return (
		<div className={className}>
			{/* Presentation Selector */}
			<div className="mb-4 flex flex-wrap items-center gap-2">
				<span className="font-medium text-muted-foreground text-sm">
					Presentation:
				</span>
				{presentations.map((name) => (
					<Button
						key={name}
						variant={selectedPresentation === name ? 'default' : 'outline'}
						size="sm"
						onPress={() => setSelectedPresentation(name)}
					>
						{formatPresentationName(name)}
					</Button>
				))}
				<div className="ml-auto flex items-center gap-2">
					<Badge variant="secondary">LLM-friendly</Badge>
					<Button
						variant="outline"
						size="sm"
						onPress={handleCopy}
						disabled={!markdownContent || loading}
					>
						Copy
					</Button>
				</div>
			</div>

			{/* Content Area */}
			<Card className="overflow-hidden">
				{loading && <LoaderBlock label="Rendering markdown..." />}

				{error && (
					<ErrorState
						title="Render failed"
						description={error.message}
						onRetry={renderMarkdown}
						retryLabel="Retry"
					/>
				)}

				{!loading && !error && markdownContent && (
					<div className="p-6">
						<MarkdownRenderer content={markdownContent} />
					</div>
				)}

				{!loading && !error && !markdownContent && (
					<div className="p-6 text-center">
						<p className="text-muted-foreground">
							Select a presentation to view its markdown output.
						</p>
					</div>
				)}
			</Card>
		</div>
	);
}
