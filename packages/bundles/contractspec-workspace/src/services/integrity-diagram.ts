/**
 * Mermaid diagram generation for integrity analysis.
 *
 * Generates visual diagrams showing:
 * - Feature to spec relationships
 * - Orphaned specs
 * - Dependency graphs
 */

import type { IntegrityAnalysisResult, SpecInventory } from './integrity';
import type { FeatureScanResult } from '@lssm/module.contractspec-workspace';

/**
 * Type of diagram to generate.
 */
export type DiagramType = 'feature-map' | 'orphans' | 'dependencies' | 'full';

/**
 * Options for diagram generation.
 */
export interface DiagramOptions {
  /**
   * Maximum number of nodes to display.
   */
  maxNodes?: number;

  /**
   * Include only specific features.
   */
  featureKeys?: string[];

  /**
   * Show spec versions in labels.
   */
  showVersions?: boolean;

  /**
   * Direction for the flowchart.
   */
  direction?: 'LR' | 'TB' | 'RL' | 'BT';
}

/**
 * Generate a Mermaid diagram from integrity analysis results.
 */
export function generateMermaidDiagram(
  result: IntegrityAnalysisResult,
  type: DiagramType = 'feature-map',
  options: DiagramOptions = {}
): string {
  switch (type) {
    case 'feature-map':
      return generateFeatureMapDiagram(result, options);
    case 'orphans':
      return generateOrphansDiagram(result, options);
    case 'dependencies':
      return generateDependenciesDiagram(result, options);
    case 'full':
      return generateFullDiagram(result, options);
    default:
      return generateFeatureMapDiagram(result, options);
  }
}

/**
 * Generate a feature map diagram showing features and their linked specs.
 */
function generateFeatureMapDiagram(
  result: IntegrityAnalysisResult,
  options: DiagramOptions
): string {
  const { direction = 'LR', showVersions = true, maxNodes = 50 } = options;
  const lines: string[] = [`flowchart ${direction}`];

  // Filter features if specified
  let features = result.features;
  if (options.featureKeys && options.featureKeys.length > 0) {
    features = features.filter((f) => options.featureKeys?.includes(f.key));
  }

  // Track node count
  let nodeCount = 0;
  const truncated = false;

  // Add features subgraph
  if (features.length > 0) {
    lines.push('    subgraph features [Features]');
    for (const feature of features) {
      if (nodeCount >= maxNodes) break;
      const nodeId = sanitizeId(`F_${feature.key}`);
      const label = feature.title ?? feature.key;
      lines.push(`        ${nodeId}["${escapeLabel(label)}"]`);
      nodeCount++;
    }
    lines.push('    end');
  }

  // Add operations subgraph
  const ops = getReferencedSpecs(features, 'operations', result.inventory);
  if (ops.length > 0 && nodeCount < maxNodes) {
    lines.push('    subgraph ops [Operations]');
    for (const op of ops) {
      if (nodeCount >= maxNodes) break;
      const nodeId = sanitizeId(`O_${op.key}_v${op.version}`);
      const label = showVersions ? `${op.key}.v${op.version}` : op.key;
      lines.push(`        ${nodeId}["${escapeLabel(label)}"]`);
      nodeCount++;
    }
    lines.push('    end');
  }

  // Add events subgraph
  const events = getReferencedSpecs(features, 'events', result.inventory);
  if (events.length > 0 && nodeCount < maxNodes) {
    lines.push('    subgraph events [Events]');
    for (const event of events) {
      if (nodeCount >= maxNodes) break;
      const nodeId = sanitizeId(`E_${event.key}_v${event.version}`);
      const label = showVersions
        ? `${event.key}.v${event.version}`
        : event.key;
      lines.push(`        ${nodeId}["${escapeLabel(label)}"]`);
      nodeCount++;
    }
    lines.push('    end');
  }

  // Add presentations subgraph
  const presentations = getReferencedSpecs(
    features,
    'presentations',
    result.inventory
  );
  if (presentations.length > 0 && nodeCount < maxNodes) {
    lines.push('    subgraph presentations [Presentations]');
    for (const pres of presentations) {
      if (nodeCount >= maxNodes) break;
      const nodeId = sanitizeId(`P_${pres.key}_v${pres.version}`);
      const label = showVersions ? `${pres.key}.v${pres.version}` : pres.key;
      lines.push(`        ${nodeId}["${escapeLabel(label)}"]`);
      nodeCount++;
    }
    lines.push('    end');
  }

  // Add edges from features to specs
  for (const feature of features) {
    const featureId = sanitizeId(`F_${feature.key}`);

    for (const op of feature.operations) {
      const opId = sanitizeId(`O_${op.key}_v${op.version}`);
      lines.push(`    ${featureId} --> ${opId}`);
    }

    for (const event of feature.events) {
      const eventId = sanitizeId(`E_${event.key}_v${event.version}`);
      lines.push(`    ${featureId} -.-> ${eventId}`);
    }

    for (const pres of feature.presentations) {
      const presId = sanitizeId(`P_${pres.key}_v${pres.version}`);
      lines.push(`    ${featureId} --> ${presId}`);
    }
  }

  if (truncated) {
    lines.push(`    note["... and more (truncated at ${maxNodes} nodes)"]`);
  }

  return lines.join('\n');
}

/**
 * Generate a diagram highlighting orphaned specs.
 */
function generateOrphansDiagram(
  result: IntegrityAnalysisResult,
  options: DiagramOptions
): string {
  const { direction = 'TB', showVersions = true, maxNodes = 50 } = options;
  const lines: string[] = [`flowchart ${direction}`];

  // Add linked specs
  const linkedOps = new Set<string>();
  const linkedEvents = new Set<string>();
  const linkedPres = new Set<string>();

  for (const feature of result.features) {
    for (const op of feature.operations) {
      linkedOps.add(`${op.key}.v${op.version}`);
    }
    for (const event of feature.events) {
      linkedEvents.add(`${event.key}.v${event.version}`);
    }
    for (const pres of feature.presentations) {
      linkedPres.add(`${pres.key}.v${pres.version}`);
    }
  }

  let nodeCount = 0;

  // Add features
  if (result.features.length > 0) {
    lines.push('    subgraph features [Features]');
    for (const feature of result.features) {
      if (nodeCount >= maxNodes) break;
      const nodeId = sanitizeId(`F_${feature.key}`);
      lines.push(
        `        ${nodeId}["${escapeLabel(feature.title ?? feature.key)}"]`
      );
      nodeCount++;
    }
    lines.push('    end');
  }

  // Add orphaned specs
  if (result.orphanedSpecs.length > 0) {
    lines.push('    subgraph orphaned [Orphaned Specs]');
    for (const spec of result.orphanedSpecs) {
      if (nodeCount >= maxNodes) break;
      const nodeId = sanitizeId(
        `orphan_${spec.type}_${spec.key}_v${spec.version}`
      );
      const label = showVersions ? `${spec.key}.v${spec.version}` : spec.key;
      lines.push(`        ${nodeId}["${escapeLabel(label)}"]`);
      nodeCount++;
    }
    lines.push('    end');
  }

  // Add linked specs
  const allLinked: { type: string; key: string; version: number }[] = [];

  for (const opKey of linkedOps) {
    const [parsedKey, parsedVersion] = parseSpecKey(opKey);
    if (parsedKey && parsedVersion) {
      allLinked.push({ type: 'operation', key: parsedKey, version: parsedVersion });
    }
  }

  for (const eventKey of linkedEvents) {
    const [parsedKey, parsedVersion] = parseSpecKey(eventKey);
    if (parsedKey && parsedVersion) {
      allLinked.push({ type: 'event', key: parsedKey, version: parsedVersion });
    }
  }

  for (const presKey of linkedPres) {
    const [parsedKey, parsedVersion] = parseSpecKey(presKey);
    if (parsedKey && parsedVersion) {
      allLinked.push({ type: 'presentation', key: parsedKey, version: parsedVersion });
    }
  }

  if (allLinked.length > 0 && nodeCount < maxNodes) {
    lines.push('    subgraph linked [Linked Specs]');
    for (const spec of allLinked) {
      if (nodeCount >= maxNodes) break;
      const nodeId = sanitizeId(`${spec.type}_${spec.key}_v${spec.version}`);
      const label = showVersions ? `${spec.key}.v${spec.version}` : spec.key;
      lines.push(`        ${nodeId}["${escapeLabel(label)}"]`);
      nodeCount++;
    }
    lines.push('    end');
  }

  // Add edges from features to linked specs
  for (const feature of result.features) {
    const featureId = sanitizeId(`F_${feature.key}`);

    for (const op of feature.operations) {
      const opId = sanitizeId(`operation_${op.key}_v${op.version}`);
      lines.push(`    ${featureId} --> ${opId}`);
    }

    for (const event of feature.events) {
      const eventId = sanitizeId(`event_${event.key}_v${event.version}`);
      lines.push(`    ${featureId} -.-> ${eventId}`);
    }

    for (const pres of feature.presentations) {
      const presId = sanitizeId(`presentation_${pres.key}_v${pres.version}`);
      lines.push(`    ${featureId} --> ${presId}`);
    }
  }

  return lines.join('\n');
}

/**
 * Generate a dependency diagram showing spec relationships.
 */
function generateDependenciesDiagram(
  result: IntegrityAnalysisResult,
  options: DiagramOptions
): string {
  const { direction = 'TB', showVersions = true, maxNodes = 50 } = options;
  const lines: string[] = [`flowchart ${direction}`];

  let nodeCount = 0;

  // Show features and their deep dependencies
  for (const feature of result.features) {
    if (nodeCount >= maxNodes) break;

    const featureId = sanitizeId(`F_${feature.key}`);
    lines.push(
      `    ${featureId}["${escapeLabel(feature.title ?? feature.key)}"]`
    );
    nodeCount++;

    // Add operations
    for (const op of feature.operations) {
      if (nodeCount >= maxNodes) break;
      const opId = sanitizeId(`O_${op.key}_v${op.version}`);
      const label = showVersions ? `${op.key}.v${op.version}` : op.key;
      lines.push(`    ${opId}["${escapeLabel(label)}"]`);
      lines.push(`    ${featureId} --> ${opId}`);
      nodeCount++;
    }

    // Add events (linked from feature)
    for (const event of feature.events) {
      if (nodeCount >= maxNodes) break;
      const eventId = sanitizeId(`E_${event.key}_v${event.version}`);
      const label = showVersions
        ? `${event.key}.v${event.version}`
        : event.key;
      lines.push(`    ${eventId}["${escapeLabel(label)}"]`);
      lines.push(`    ${featureId} -.-> ${eventId}`);
      nodeCount++;
    }

    // Add presentations
    for (const pres of feature.presentations) {
      if (nodeCount >= maxNodes) break;
      const presId = sanitizeId(`P_${pres.key}_v${pres.version}`);
      const label = showVersions ? `${pres.key}.v${pres.version}` : pres.key;
      lines.push(`    ${presId}["${escapeLabel(label)}"]`);
      lines.push(`    ${featureId} --> ${presId}`);
      nodeCount++;
    }

    // Add op to presentation links
    for (const link of feature.opToPresentationLinks) {
      const opId = sanitizeId(`O_${link.op.key}_v${link.op.version}`);
      const presId = sanitizeId(`P_${link.pres.key}_v${link.pres.version}`);
      lines.push(`    ${opId} --> ${presId}`);
    }
  }

  return lines.join('\n');
}

/**
 * Generate a full diagram with all relationships.
 */
function generateFullDiagram(
  result: IntegrityAnalysisResult,
  options: DiagramOptions
): string {
  // For full diagrams, combine feature-map with orphans
  const featureMap = generateFeatureMapDiagram(result, options);

  // Add orphaned specs if any
  if (result.orphanedSpecs.length === 0) {
    return featureMap;
  }

  const lines = featureMap.split('\n');

  // Insert orphaned specs subgraph before the end
  lines.push('    subgraph orphaned [Orphaned Specs]');

  for (const spec of result.orphanedSpecs.slice(0, 20)) {
    const nodeId = sanitizeId(
      `orphan_${spec.type}_${spec.key}_v${spec.version}`
    );
    const label = `${spec.key}.v${spec.version}`;
    lines.push(`        ${nodeId}["${escapeLabel(label)}"]:::orphan`);
  }

  lines.push('    end');

  // Add styling for orphaned nodes
  lines.push('    classDef orphan stroke-dasharray: 5 5');

  return lines.join('\n');
}

/**
 * Get referenced specs from features.
 */
function getReferencedSpecs(
  features: FeatureScanResult[],
  field: 'operations' | 'events' | 'presentations',
  _inventory: SpecInventory
): { key: string; version: number }[] {
  const seen = new Set<string>();
  const result: { key: string; version: number }[] = [];

  for (const feature of features) {
    for (const ref of feature[field]) {
      const key = `${ref.key}.v${ref.version}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(ref);
      }
    }
  }

  return result;
}

/**
 * Parse a spec key like "name.v1" into [name, version].
 */
function parseSpecKey(key: string): [string | undefined, number | undefined] {
  const match = key.match(/^(.+)\.v(\d+)$/);
  if (!match) return [undefined, undefined];
  return [match[1], Number(match[2])];
}

/**
 * Sanitize an ID for use in Mermaid.
 */
function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Escape a label for use in Mermaid.
 */
function escapeLabel(label: string): string {
  return label
    .replace(/"/g, "'")
    .replace(/\[/g, '(')
    .replace(/\]/g, ')')
    .replace(/\{/g, '(')
    .replace(/\}/g, ')');
}
