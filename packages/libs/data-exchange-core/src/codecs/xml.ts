import { createRecordBatch, flattenRecord, unflattenRecord } from '../records';
import type { InterchangeRecord, JsonValue, RecordBatch } from '../types';

function escapeXml(value: unknown): string {
	const normalized =
		value === undefined || value === null
			? ''
			: typeof value === 'string'
				? value
				: JSON.stringify(value);
	return normalized
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function unescapeXml(value: string): string {
	return value
		.replace(/&apos;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&gt;/g, '>')
		.replace(/&lt;/g, '<')
		.replace(/&amp;/g, '&');
}

function readSection(content: string, tag: string): string | null {
	const match = content.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i'));
	return match?.[1] ?? null;
}

function parseFieldBlock(block: string): InterchangeRecord {
	const record: InterchangeRecord = {};
	const fieldMatches = block.matchAll(/<([\w.-]+)>([\s\S]*?)<\/\1>/g);
	for (const match of fieldMatches) {
		record[match[1]!] = unescapeXml(match[2] ?? '');
	}
	return unflattenRecord(record);
}

function parseMetadata(
	block: string | null
): Record<string, JsonValue | undefined> {
	if (!block) return {};
	const metadata: Record<string, JsonValue | undefined> = {};
	const matches = block.matchAll(/<([\w.-]+)>([\s\S]*?)<\/\1>/g);
	for (const match of matches) {
		metadata[match[1]!] = unescapeXml(match[2] ?? '');
	}
	return metadata;
}

export interface XmlCodecOptions {
	rootTag?: string;
	recordTag?: string;
	attributeFields?: string[];
}

export function parseXmlContent(
	content: string,
	options: Pick<RecordBatch, 'name'> & XmlCodecOptions = {}
): RecordBatch {
	const rootTag = options.rootTag ?? 'records';
	const recordTag = options.recordTag ?? 'record';
	const rootContent = readSection(content, rootTag) ?? content;
	const metadata = parseMetadata(readSection(rootContent, 'meta'));
	const recordMatches = rootContent.matchAll(
		new RegExp(`<${recordTag}[^>]*>([\\s\\S]*?)</${recordTag}>`, 'g')
	);
	const records = Array.from(recordMatches, (match) =>
		parseFieldBlock(match[1]!)
	);

	return createRecordBatch(records, {
		name: options.name,
		metadata,
		format: 'xml',
	});
}

export function formatXmlBatch(
	batch: RecordBatch,
	options: XmlCodecOptions = {}
): string {
	const rootTag = options.rootTag ?? 'records';
	const recordTag = options.recordTag ?? 'record';
	const attributeFields = new Set(options.attributeFields ?? []);
	const metadata = Object.entries(batch.metadata ?? {})
		.map(([key, value]) => `    <${key}>${escapeXml(value)}</${key}>`)
		.join('\n');
	const records = batch.records
		.map((record) => {
			const flattened = flattenRecord(record);
			const attributes = Array.from(attributeFields)
				.filter((field) => flattened[field] !== undefined)
				.map((field) => ` ${field}="${escapeXml(flattened[field])}"`)
				.join('');
			const fields = Object.entries(flattened)
				.filter(([key]) => !attributeFields.has(key))
				.map(([key, value]) => `    <${key}>${escapeXml(value)}</${key}>`)
				.join('\n');
			return `  <${recordTag}${attributes}>\n${fields}\n  </${recordTag}>`;
		})
		.join('\n');

	const metaBlock = metadata ? `  <meta>\n${metadata}\n  </meta>\n` : '';
	return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootTag}>\n${metaBlock}  <items>\n${records}\n  </items>\n</${rootTag}>`;
}
