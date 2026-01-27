import fs from 'node:fs';

const MAX_DETAIL_CHARS = 60000;
const MAX_LIST_ITEMS = 20;

interface WhatChangedData {
  summary?: string;
  detailsPath?: string;
}

interface RiskData {
  status?: string;
  breaking?: number;
  nonBreaking?: number;
}

interface ValidationData {
  status?: string;
  outputPath?: string;
}

interface DriftData {
  status?: string;
  files?: string[];
}

interface ReportData {
  whatChanged?: WhatChangedData;
  risk?: RiskData;
  validation?: ValidationData;
  drift?: DriftData;
  nextSteps?: string[];
}

const args = process.argv.slice(2);
const argMap = new Map<string, string>();

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg?.startsWith('--')) {
    const key = arg.replace(/^--/, '');
    const value = args[i + 1];
    if (value) {
      argMap.set(key, value);
    }
    i += 1;
  }
}

const dataPath = argMap.get('data') || process.env.CONTRACTSPEC_REPORT_DATA;
const outputPath =
  argMap.get('output') ||
  process.env.CONTRACTSPEC_REPORT_OUTPUT ||
  'contractspec-report.md';
const summaryPath = argMap.get('summary') || process.env.GITHUB_STEP_SUMMARY;

if (!dataPath) {
  console.error(
    'Missing report data path. Use --data or CONTRACTSPEC_REPORT_DATA.'
  );
  process.exit(1);
}

const readFileIfExists = (filePath?: string): string => {
  if (!filePath) return '';
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf8');
};

const truncate = (value: string, maxChars = MAX_DETAIL_CHARS): string => {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, maxChars)}\n\n*(output truncated)*`;
};

const formatList = (items?: string[]): string => {
  if (!items || items.length === 0) return '- None';
  return items
    .slice(0, MAX_LIST_ITEMS)
    .map((item) => `- ${item}`)
    .join('\n');
};

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8')) as ReportData;

const viewContent = truncate(readFileIfExists(data.whatChanged?.detailsPath));
const validationOutput = truncate(
  readFileIfExists(data.validation?.outputPath)
);
const driftFiles = data.drift?.files ?? [];

const lines: string[] = [];

lines.push('## ContractSpec Report');
lines.push('');
lines.push('### 1) What changed');
if (data.whatChanged?.summary) {
  lines.push(data.whatChanged.summary);
} else {
  lines.push('No contract changes detected.');
}
if (viewContent.trim().length > 0) {
  lines.push('');
  lines.push('<details>');
  lines.push('<summary>Contract view (product)</summary>');
  lines.push('');
  lines.push(viewContent);
  lines.push('');
  lines.push('</details>');
}

lines.push('');
lines.push('### 2) Risk classification');
if (data.risk?.status) {
  const riskSummary = [
    `Status: ${data.risk.status}`,
    data.risk.breaking !== undefined ? `Breaking: ${data.risk.breaking}` : null,
    data.risk.nonBreaking !== undefined
      ? `Non-breaking: ${data.risk.nonBreaking}`
      : null,
  ].filter(Boolean);
  lines.push(riskSummary.join(' | '));
} else {
  lines.push('Impact analysis unavailable.');
}

lines.push('');
lines.push('### 3) Validation results');
if (data.validation?.status) {
  lines.push(`Status: ${data.validation.status}`);
  if (validationOutput.trim().length > 0) {
    lines.push('');
    lines.push('<details>');
    lines.push('<summary>Validation output</summary>');
    lines.push('');
    lines.push(validationOutput);
    lines.push('');
    lines.push('</details>');
  }
} else {
  lines.push('Validation step not run.');
}

lines.push('');
lines.push('### 4) Drift results');
if (data.drift?.status) {
  lines.push(`Status: ${data.drift.status}`);
  if (driftFiles.length > 0) {
    lines.push('');
    lines.push('<details>');
    lines.push('<summary>Drifted files</summary>');
    lines.push('');
    lines.push(formatList(driftFiles));
    lines.push('');
    lines.push('</details>');
  }
} else {
  lines.push('Drift check not run.');
}

lines.push('');
lines.push('### 5) Next steps');
if (data.nextSteps && data.nextSteps.length > 0) {
  lines.push(formatList(data.nextSteps));
} else {
  lines.push('- No action required.');
}

const report = `${lines.join('\n')}\n`;
fs.writeFileSync(outputPath, report, 'utf8');

if (summaryPath) {
  fs.appendFileSync(summaryPath, report, 'utf8');
}
