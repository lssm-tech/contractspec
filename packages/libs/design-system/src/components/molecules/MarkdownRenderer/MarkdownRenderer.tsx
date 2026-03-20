'use client';

import * as React from 'react';
import { formatInlineMarkdown } from './formatInlineMarkdown';
import { renderMarkdownTable } from './renderMarkdownTable';
import type { MarkdownRendererProps } from './types';

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
	const lines = content.split('\n');
	const rendered: React.ReactNode[] = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i] ?? '';

		if (line.startsWith('|') && lines[i + 1]?.match(/^\|[\s-|]+\|$/)) {
			const tableLines: string[] = [line];
			i++;

			while (i < lines.length && (lines[i]?.startsWith('|') ?? false)) {
				tableLines.push(lines[i] ?? '');
				i++;
			}

			rendered.push(renderMarkdownTable(tableLines, rendered.length));
			continue;
		}

		if (line.startsWith('# ')) {
			rendered.push(
				<h1 key={i} className="mb-4 font-bold text-2xl">
					{line.slice(2)}
				</h1>
			);
		} else if (line.startsWith('## ')) {
			rendered.push(
				<h2 key={i} className="mt-6 mb-3 font-semibold text-xl">
					{line.slice(3)}
				</h2>
			);
		} else if (line.startsWith('### ')) {
			rendered.push(
				<h3 key={i} className="mt-4 mb-2 font-medium text-lg">
					{line.slice(4)}
				</h3>
			);
		} else if (line.startsWith('> ')) {
			rendered.push(
				<blockquote
					key={i}
					className="my-2 border-violet-500/50 border-l-4 pl-4 text-muted-foreground italic"
				>
					{line.slice(2)}
				</blockquote>
			);
		} else if (line.startsWith('- ')) {
			rendered.push(
				<li key={i} className="ml-4 list-disc">
					{formatInlineMarkdown(line.slice(2))}
				</li>
			);
		} else if (line.startsWith('**') && line.includes(':**')) {
			const [label, ...rest] = line.split(':**');
			rendered.push(
				<p key={i} className="my-1">
					<strong>{label?.slice(2)}:</strong>
					{rest.join(':**')}
				</p>
			);
		} else if (line.startsWith('_') && line.endsWith('_')) {
			rendered.push(
				<p key={i} className="my-1 text-muted-foreground italic">
					{line.slice(1, -1)}
				</p>
			);
		} else if (!line.trim()) {
			rendered.push(<div key={i} className="h-2" />);
		} else {
			rendered.push(
				<p key={i} className="my-1">
					{formatInlineMarkdown(line)}
				</p>
			);
		}

		i++;
	}

	return (
		<div className="prose prose-sm dark:prose-invert max-w-none">
			{rendered}
		</div>
	);
}
