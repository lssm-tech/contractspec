import * as React from 'react';

export function formatInlineMarkdown(text: string): React.ReactNode {
	const parts = text.split(/(\*\*[^*]+\*\*)/g);
	return parts.map((part, i) => {
		if (part.startsWith('**') && part.endsWith('**')) {
			return <strong key={i}>{part.slice(2, -2)}</strong>;
		}

		if (part.includes('`')) {
			const codeParts = part.split(/(`[^`]+`)/g);
			return codeParts.map((codePart, j) => {
				if (codePart.startsWith('`') && codePart.endsWith('`')) {
					return (
						<code
							key={`${i}-${j}`}
							className="rounded bg-violet-500/10 px-1.5 py-0.5 font-mono text-sm"
						>
							{codePart.slice(1, -1)}
						</code>
					);
				}

				return codePart;
			});
		}

		return part;
	});
}
