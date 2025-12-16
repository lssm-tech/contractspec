import type {
  EventSpecData,
  OperationSpecData,
  PresentationSpecData,
  Stability,
} from '@lssm/bundle.contractspec-workspace';
import { templates } from '@lssm/bundle.contractspec-workspace';
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

export function generateSpecCode(args: {
  type: 'operation' | 'event' | 'presentation' | 'feature';
  name: string;
  version: number;
  description: string;
  stability: Stability;
  owners: string[];
  tags: string[];
  domain: string;
  opKind: 'command' | 'query';
  featureKey?: string;
}): string {
  if (args.type === 'operation') return generateOperation(args);
  if (args.type === 'event') return generateEvent(args);
  if (args.type === 'presentation') return generatePresentation(args);
  return generateFeature(args);
}

function generateOperation(args: {
  name: string;
  version: number;
  description: string;
  stability: Stability;
  owners: string[];
  tags: string[];
  opKind: 'command' | 'query';
}): string {
  const specData: OperationSpecData = {
    name: args.name,
    version: args.version,
    description: args.description,
    stability: args.stability,
    owners: args.owners,
    tags: args.tags,
    kind: args.opKind,
    goal: 'TODO: Define business goal',
    context: 'TODO: Define context',
    hasInput: true,
    hasOutput: true,
    auth: 'user',
    flags: [],
    emitsEvents: false,
  };
  return templates.generateOperationSpec(specData);
}

function generateEvent(args: {
  name: string;
  version: number;
  description: string;
  stability: Stability;
  owners: string[];
  tags: string[];
}): string {
  const specData: EventSpecData = {
    name: args.name,
    version: args.version,
    description: args.description,
    stability: args.stability,
    owners: args.owners,
    tags: args.tags,
    piiFields: [],
  };
  return templates.generateEventSpec(specData);
}

function generatePresentation(args: {
  name: string;
  version: number;
  description: string;
  stability: Stability;
  owners: string[];
  tags: string[];
}): string {
  const specData: PresentationSpecData = {
    name: args.name,
    version: args.version,
    description: args.description,
    stability: args.stability,
    owners: args.owners,
    tags: args.tags,
    presentationKind: 'web_component',
  };
  return templates.generatePresentationSpec(specData);
}

function generateFeature(args: {
  name: string;
  description: string;
  stability: Stability;
  owners: string[];
  tags: string[];
  domain: string;
  featureKey?: string;
}): string {
  const key = args.featureKey ?? args.name.replace(/\./g, '-');
  const feature: FeatureModuleSpec = {
    meta: {
      key,
      title: args.name,
      description: args.description,
      domain: args.domain,
      owners: args.owners,
      tags: args.tags,
      stability: args.stability,
    },
    operations: [],
    events: [],
    presentations: [],
    capabilities: { provides: [], requires: [] },
    opToPresentation: [],
  };

  return generateFeatureModuleTs(feature);
}

function generateFeatureModuleTs(feature: FeatureModuleSpec): string {
  const varName = `${toPascalCase(feature.meta.key)}Feature`;
  return `import type { FeatureModuleSpec } from '@lssm/lib.contracts';

export const ${varName}: FeatureModuleSpec = ${JSON.stringify(
    feature,
    null,
    2
  )} as const;
`;
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_.]/)
    .filter((s) => s.length > 0)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}


