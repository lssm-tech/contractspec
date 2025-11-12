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

export function toCsvGeneric<TMeta extends CsvXmlExportMeta>(
  payload: CsvXmlExportPayload<TMeta>,
  options?: { metaColumns?: string[]; itemColumns?: string[] }
): string {
  const metaCols = options?.metaColumns ?? Object.keys(payload.meta);
  const itemCols = options?.itemColumns ?? [
    'id',
    'name',
    'qty',
    'unitPrice',
    'currency',
  ];
  const header = [...metaCols, ...itemCols];
  const lines: string[] = [];
  lines.push(header.join(','));
  for (const it of payload.items) {
    const row = [
      ...metaCols.map((k) => escapeCsv(String(payload.meta[k] ?? ''))),
      ...itemCols.map((k) => escapeCsv(String((it as any)[k] ?? ''))),
    ];
    lines.push(row.join(','));
  }
  return lines.join('\n');
}

export function toXmlGeneric<TMeta extends CsvXmlExportMeta>(
  payload: CsvXmlExportPayload<TMeta>,
  options?: { root?: string; itemTag?: string }
): string {
  const root = options?.root ?? 'export';
  const itemTag = options?.itemTag ?? 'item';
  const metaEntries = Object.entries(payload.meta)
    .map(([k, v]) => `    <${k}>${xml(String(v ?? ''))}</${k}>`)
    .join('\n');
  const items = payload.items
    .map((it) => {
      const attrs = it.id ? ` id="${xml(String(it.id))}"` : '';
      const fields = Object.entries(it)
        .filter(([k]) => k !== 'id')
        .map(([k, v]) => `    <${k}>${xml(String(v ?? ''))}</${k}>`)
        .join('\n');
      return `  <${itemTag}${attrs}>\n${fields}\n  </${itemTag}>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<${root}>\n  <meta>\n${metaEntries}\n  </meta>\n  <items>\n${items}\n  </items>\n</${root}>`;
}

function escapeCsv(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}

function xml(val: string): string {
  return val
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
