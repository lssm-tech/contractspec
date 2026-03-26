import TurndownService from 'turndown';

interface BlockNoteMark {
	type?: string;
	attrs?: Record<string, unknown>;
}

interface BlockNoteNode {
	type?: string;
	content?: BlockNoteNode[];
	text?: string;
	marks?: BlockNoteMark[];
	attrs?: Record<string, unknown>;
}

function renderTextNode(node: BlockNoteNode): string {
	const text = node.text ?? '';
	if (!node.marks || node.marks.length === 0) return text;

	return node.marks.reduce((acc, mark) => {
		switch (mark.type) {
			case 'bold':
				return `**${acc}**`;
			case 'italic':
				return `*${acc}*`;
			case 'underline':
				return `__${acc}__`;
			case 'strike':
				return `~~${acc}~~`;
			case 'code':
				return `\`${acc}\``;
			case 'link': {
				const href = mark.attrs?.href ?? '';
				return href ? `[${acc}](${href})` : acc;
			}
			default:
				return acc;
		}
	}, text);
}

function renderInline(nodes: BlockNoteNode[] | undefined): string {
	if (!nodes?.length) return '';
	return nodes.map((child) => renderNode(child)).join('');
}

function renderList(
	nodes: BlockNoteNode[] | undefined,
	ordered = false
): string {
	if (!nodes?.length) return '';
	let counter = 1;
	return nodes
		.map((item) => {
			const body = renderInline(item.content ?? []);
			if (!body) return '';
			const prefix = ordered ? `${counter++}. ` : '- ';
			return `${prefix}${body}`;
		})
		.filter(Boolean)
		.join('\n');
}

function renderNode(node: BlockNoteNode): string {
	switch (node.type) {
		case 'doc':
			return renderInline(node.content);
		case 'paragraph': {
			const text = renderInline(node.content);
			return text.trim().length ? text : '';
		}
		case 'heading': {
			const levelAttr = node.attrs?.level;
			const levelVal = typeof levelAttr === 'number' ? levelAttr : 1;
			const level = Math.min(Math.max(levelVal, 1), 6);
			return `${'#'.repeat(level)} ${renderInline(node.content)}`.trim();
		}
		case 'bullet_list':
			return renderList(node.content, false);
		case 'ordered_list':
			return renderList(node.content, true);
		case 'list_item':
			return renderInline(node.content);
		case 'blockquote': {
			const body = renderInline(node.content);
			return body
				.split('\n')
				.map((line) => `> ${line}`)
				.join('\n');
		}
		case 'code_block': {
			const body = renderInline(node.content);
			return body ? `\`\`\`\n${body}\n\`\`\`` : '';
		}
		case 'horizontal_rule':
			return '---';
		case 'hard_break':
			return '\n';
		case 'text':
			return renderTextNode(node);
		default:
			if (node.text) return renderTextNode(node);
			return '';
	}
}

type LinkLikeNode = {
	getAttribute?: (name: string) => string | null;
	href?: unknown;
};

export function createMarkdownTurndownService(): TurndownService {
	const turndownService = new TurndownService({
		headingStyle: 'atx',
		codeBlockStyle: 'fenced',
		bulletListMarker: '-',
	});

	turndownService.addRule('link', {
		filter: 'a',
		replacement: (content, node) => {
			const candidate = node as LinkLikeNode;
			const href =
				candidate.getAttribute?.('href') ??
				(typeof candidate.href === 'string' ? candidate.href : '');
			if (href && content) {
				return `[${content}](${href})`;
			}
			return content || '';
		},
	});

	return turndownService;
}

const defaultTurndown = createMarkdownTurndownService();

export function htmlToMarkdown(html: string): string {
	return defaultTurndown.turndown(html);
}

export function blockNoteToMarkdown(docJson: unknown): string {
	if (typeof docJson === 'string') return docJson;

	if (docJson && typeof docJson === 'object' && 'html' in docJson) {
		const html = String((docJson as { html: unknown }).html);
		return htmlToMarkdown(html);
	}

	const root = docJson as BlockNoteNode;
	if (root?.type === 'doc' || root?.content) {
		const blocks = (root.content ?? [])
			.map((node) => renderNode(node))
			.filter(Boolean);
		return blocks.join('\n\n').trim();
	}

	try {
		return JSON.stringify(docJson, null, 2);
	} catch {
		return String(docJson);
	}
}
