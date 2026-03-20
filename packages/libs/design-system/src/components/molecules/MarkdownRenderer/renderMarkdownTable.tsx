import * as React from 'react';
import { formatInlineMarkdown } from './formatInlineMarkdown';

export function renderMarkdownTable(
	lines: string[],
	keyPrefix: number
): React.ReactNode {
	if (lines.length < 2) return null;

	const parseRow = (row: string) =>
		row
			.split('|')
			.slice(1, -1)
			.map((cell) => cell.trim());

	const headers = parseRow(lines[0] ?? '');
	const dataRows = lines.slice(2).map(parseRow);

	return (
		<div key={`table-${keyPrefix}`} className="my-4 overflow-x-auto">
			<table className="min-w-full border-collapse border border-border text-sm">
				<thead>
					<tr className="bg-muted/50">
						{headers.map((header, idx) => (
							<th
								key={idx}
								className="border border-border px-3 py-2 text-left font-semibold"
							>
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{dataRows.map((row, rowIdx) => (
						<tr key={rowIdx} className="hover:bg-muted/30">
							{row.map((cell, cellIdx) => (
								<td key={cellIdx} className="border border-border px-3 py-2">
									{formatInlineMarkdown(cell)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
