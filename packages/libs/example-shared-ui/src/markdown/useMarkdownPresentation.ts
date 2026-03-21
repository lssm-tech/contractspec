'use client';

import type { PresentationTarget } from '@contractspec/lib.contracts-spec/presentations';
import type { TransformEngine } from '@contractspec/lib.presentation-runtime-core/transform-engine';
import { useCallback, useEffect, useState } from 'react';

interface MarkdownOutput {
	mimeType: string;
	body: string;
}

interface UseMarkdownPresentationOptions {
	engine?: TransformEngine | null;
	fetchData: (presentationId: string) => Promise<{ data: unknown }>;
	presentationId?: string;
	presentations: string[];
	resolvePresentation?: (presentationId: string) => unknown;
	templateId?: string;
}

interface UseMarkdownPresentationResult {
	error: Error | null;
	loading: boolean;
	markdownContent: string;
	renderMarkdown: () => Promise<void>;
	selectedPresentation: string;
	setSelectedPresentation: (presentationId: string) => void;
}

export function useMarkdownPresentation({
	engine,
	fetchData,
	presentationId,
	presentations,
	resolvePresentation,
	templateId,
}: UseMarkdownPresentationOptions): UseMarkdownPresentationResult {
	const [selectedPresentation, setSelectedPresentation] = useState<string>('');
	const [markdownContent, setMarkdownContent] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (presentationId && presentations.includes(presentationId)) {
			setSelectedPresentation(presentationId);
			return;
		}

		if (presentations.length === 0) {
			setSelectedPresentation('');
			return;
		}

		if (!presentations.includes(selectedPresentation)) {
			setSelectedPresentation(presentations[0] ?? '');
		}
	}, [presentationId, presentations, selectedPresentation, templateId]);

	const renderMarkdown = useCallback(async () => {
		if (!selectedPresentation || !engine) return;

		setLoading(true);
		setError(null);

		try {
			if (!resolvePresentation) {
				throw new Error('resolvePresentation not available in runtime context');
			}

			const descriptor = resolvePresentation(selectedPresentation);

			if (!descriptor) {
				throw new Error(
					`Presentation descriptor not found: ${selectedPresentation}`
				);
			}

			const dataResult = await fetchData(selectedPresentation);
			const result = await engine.render<MarkdownOutput>(
				'markdown' as PresentationTarget,
				descriptor as Parameters<TransformEngine['render']>[1],
				{ data: dataResult.data }
			);

			setMarkdownContent(result.body);
		} catch (err) {
			setError(
				err instanceof Error ? err : new Error('Failed to render markdown')
			);
		} finally {
			setLoading(false);
		}
	}, [engine, fetchData, resolvePresentation, selectedPresentation]);

	useEffect(() => {
		void renderMarkdown();
	}, [renderMarkdown]);

	return {
		error,
		loading,
		markdownContent,
		renderMarkdown,
		selectedPresentation,
		setSelectedPresentation,
	};
}
