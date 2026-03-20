'use client';

import { Button } from '@contractspec/lib.design-system';
import { useState } from 'react';

interface CodeSnippetProps {
	code: string;
	language?: string;
	title?: string;
}

export function CodeSnippet({
	code,
	language = 'typescript',
	title,
}: CodeSnippetProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="overflow-hidden rounded-lg border bg-muted/50">
			{/* Header */}
			<div className="flex items-center justify-between border-b bg-muted px-4 py-2">
				<div className="flex items-center gap-2">
					<span className="font-medium text-muted-foreground text-xs uppercase">
						{language}
					</span>
					{title && (
						<>
							<span className="text-muted-foreground">•</span>
							<span className="text-sm">{title}</span>
						</>
					)}
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={handleCopy}
					className="h-7 text-xs"
				>
					{copied ? '✓ Copied' : 'Copy'}
				</Button>
			</div>

			{/* Code */}
			<pre className="overflow-x-auto p-4">
				<code className="text-sm">{code}</code>
			</pre>
		</div>
	);
}
