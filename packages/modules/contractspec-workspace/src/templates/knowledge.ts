import type { KnowledgeSpaceSpecData, Stability } from '../types/spec-types';
import { toPascalCase, escapeString } from './utils';

export function generateKnowledgeSpaceSpec(
  data: KnowledgeSpaceSpecData
): string {
  const specName = toPascalCase(data.name.split('.').pop() ?? 'KnowledgeSpace');
  const varName = `${specName}KnowledgeSpace`;
  const registerFn = `register${specName}KnowledgeSpace`;

  const retention = renderRetention(data);
  const access = renderAccess(data);
  const indexing = renderIndexing(data);
  const policyComment =
    data.policyName && !data.policyVersion
      ? ` // defaults to latest version`
      : '';

  return `import { StabilityEnum } from '@lssm/lib.contracts/ownership';
import type { KnowledgeSpaceSpec } from '@lssm/lib.contracts/knowledge/spec';
import type { KnowledgeSpaceRegistry } from '@lssm/lib.contracts/knowledge/spec';

export const ${varName}: KnowledgeSpaceSpec = {
  meta: {
    key: '${escapeString(data.name)}',
    version: ${data.version},
    category: '${data.category}',
    displayName: '${escape(data.displayName)}',
    title: '${escape(data.title)}',
    description: '${escape(data.description)}',
    domain: '${escape(data.domain)}',
    owners: [${data.owners.map((owner) => `'${escapeString(owner)}'`).join(', ')}],
    tags: [${data.tags.map((tag) => `'${escapeString(tag)}'`).join(', ')}],
    stability: StabilityEnum.${stabilityToEnum(data.stability)},
  },
  retention: ${retention},
  access: {
${access}${data.policyName ? `    policy: { name: '${escapeString(data.policyName)}',${data.policyVersion ? ` version: ${data.policyVersion}` : ''} },${policyComment}\n` : ''}  },
${indexing}  description: '${escape(data.description || data.displayName)}',
};

export function ${registerFn}(registry: KnowledgeSpaceRegistry): KnowledgeSpaceRegistry {
  return registry.register(${varName});
}
`;
}

function renderRetention(data: KnowledgeSpaceSpecData): string {
  const ttl =
    data.retention.ttlDays === null
      ? 'null'
      : typeof data.retention.ttlDays === 'number'
        ? String(data.retention.ttlDays)
        : 'null';
  const archive =
    typeof data.retention.archiveAfterDays === 'number'
      ? `, archiveAfterDays: ${data.retention.archiveAfterDays}`
      : '';
  return `{ ttlDays: ${ttl}${archive} }`;
}

function renderAccess(data: KnowledgeSpaceSpecData): string {
  const trustLine = `    trustLevel: '${data.trustLevel}',\n`;
  const automationLine = `    automationWritable: ${data.automationWritable},\n`;
  return `${trustLine}${automationLine}`;
}

function renderIndexing(data: KnowledgeSpaceSpecData): string {
  const entries: string[] = [];
  if (data.embeddingModel) {
    entries.push(`    embeddingModel: '${escape(data.embeddingModel)}'`);
  }
  if (typeof data.chunkSize === 'number') {
    entries.push(`    chunkSize: ${data.chunkSize}`);
  }
  if (data.vectorDbIntegration) {
    entries.push(
      `    vectorDbIntegration: '${escape(data.vectorDbIntegration)}'`
    );
  }
  if (entries.length === 0) {
    return '';
  }
  return `  indexing: {\n${entries.join(',\n')}\n  },\n`;
}

function stabilityToEnum(stability: Stability): string {
  switch (stability) {
    case 'beta':
      return 'Beta';
    case 'stable':
      return 'Stable';
    case 'deprecated':
      return 'Deprecated';
    case 'experimental':
    default:
      return 'Experimental';
  }
}

function escape(value: string): string {
  return value.replace(/`/g, '\\`').replace(/'/g, "\\'");
}




