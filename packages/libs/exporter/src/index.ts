import {
	createRecordBatch,
	formatCsvBatch,
	formatJsonBatch,
	formatXmlBatch,
	type InterchangeRecord,
} from '@contractspec/lib.data-exchange-core';

export interface CsvXmlExportItem {
	id?: string;
	name: string;
	qty: number;
	unitPrice?: number;
	currency?: string;
	[key: string]: unknown;
}

export type CsvXmlExportMeta = Record<
	string,
	string | number | boolean | null | undefined
>;

export interface CsvXmlExportPayload<
	TMeta extends CsvXmlExportMeta = CsvXmlExportMeta,
> {
	meta: TMeta;
	items: CsvXmlExportItem[];
}

function createLegacyBatch<TMeta extends CsvXmlExportMeta>(
	payload: CsvXmlExportPayload<TMeta>,
	itemColumns: string[]
) {
	return createRecordBatch(
		payload.items.map((item) => {
			const projectedItem = Object.fromEntries(
				itemColumns.map((column) => [column, item[column]])
			);
			return projectedItem as InterchangeRecord;
		}),
		{
			format: 'json',
			metadata: payload.meta,
		}
	);
}

/**
 * @deprecated Prefer `@contractspec/lib.data-exchange-core/codecs`.
 */
export function toCsvGeneric<TMeta extends CsvXmlExportMeta>(
	payload: CsvXmlExportPayload<TMeta>,
	options?: { metaColumns?: string[]; itemColumns?: string[] }
): string {
	const itemCols = options?.itemColumns ?? [
		'id',
		'name',
		'qty',
		'unitPrice',
		'currency',
	];
	const metaCols = options?.metaColumns ?? Object.keys(payload.meta);
	const batch = createLegacyBatch(payload, itemCols);
	const rows = batch.records.map((record) => ({
		...Object.fromEntries(
			metaCols.map((column) => [column, payload.meta[column]])
		),
		...record,
	}));
	return formatCsvBatch(
		{
			...batch,
			records: rows,
		},
		{ columns: [...metaCols, ...itemCols] }
	);
}

/**
 * @deprecated Prefer `@contractspec/lib.data-exchange-core/codecs`.
 */
export function toXmlGeneric<TMeta extends CsvXmlExportMeta>(
	payload: CsvXmlExportPayload<TMeta>,
	options?: { root?: string; itemTag?: string }
): string {
	const batch = createRecordBatch(payload.items as InterchangeRecord[], {
		format: 'xml',
		metadata: payload.meta,
	});
	return formatXmlBatch(batch, {
		rootTag: options?.root ?? 'export',
		recordTag: options?.itemTag ?? 'item',
		attributeFields: ['id'],
	});
}

/**
 * @deprecated Prefer `@contractspec/lib.data-exchange-core/codecs`.
 */
export function toJsonGeneric<TMeta extends CsvXmlExportMeta>(
	payload: CsvXmlExportPayload<TMeta>,
	options?: { pretty?: boolean }
): string {
	const batch = createRecordBatch(payload.items as InterchangeRecord[], {
		format: 'json',
		metadata: payload.meta,
	});
	return formatJsonBatch(batch, {
		pretty: options?.pretty,
		metadataKey: 'meta',
		recordsKey: 'items',
	});
}
export * from './exporter.feature';
