function validateEventSpec(code: string) {
  const keyMatches = code.matchAll(/key:\s*['"]([^'"]+)['"]/g);
  for (const match of keyMatches) {
    const keyValue = match[1];
    if (!keyValue) continue;

    const segments = keyValue.split('.');
    const lastSegment = segments[segments.length - 1] ?? '';

    // ALLOW COPY-PASTE FROM spec-checker.ts
    const isPastTense =
      /(?:ed|created|updated|deleted|completed|assigned|removed|triggered|synced|failed|processed|started|stopped|cancelled|finished|submitted|approved|rejected|confirmed|expired|activated|deactivated|verified|revoked|initialized|published|moved|sent|won|lost|run|begun|done|gone|seen|taken|made|paid|held|read|bought|sold|found|left|met|heard|known|thrown|shown|drawn|grown|flown|written|driven|chosen|spoken|broken|forgotten|hidden|bitten|eaten|given|risen|struck|shaken)$/i.test(
        lastSegment
      );

    if (!isPastTense) {
      console.log(
        `[Event] Warning: Event name should use past tense: ${keyValue} (segment: ${lastSegment})`
      );
    } else {
      console.log(`[Event] Passed: ${keyValue}`);
    }
  }
}

function validateCommonFields(code: string) {
  // usesSpecTypes logic
  const usesSpecTypes =
    code.includes(': OperationSpec') ||
    code.includes(': PresentationSpec') ||
    code.includes(': EventSpec') ||
    code.includes(': FeatureSpec') ||
    code.includes(': WorkflowSpec') ||
    code.includes(': DataViewSpec') ||
    code.includes(': MigrationSpec') ||
    code.includes(': TelemetrySpec') ||
    code.includes(': ExperimentSpec') ||
    code.includes(': AppBlueprintSpec') ||
    code.includes(': FeatureModuleSpec') ||
    code.includes('defineCommand(') ||
    code.includes('defineQuery(') ||
    code.includes('defineEvent(');

  console.log(`[Common] usesSpecTypes: ${usesSpecTypes}`);

  if (!usesSpecTypes) {
    return;
  }

  // Skip pure re-export files
  const isPureReExport =
    /^[\s\n]*(export\s*\*\s*from|export\s*\{\s*[^}]*\s*\}\s*from)/m.test(
      code
    ) && !code.includes('= {');

  console.log(`[Common] isPureReExport: ${isPureReExport}`);

  if (isPureReExport) {
    return;
  }

  // Stability
  const hasStabilityString =
    /stability:\s*['"](?:experimental|beta|stable|deprecated)['"]/.test(code);
  const hasStabilityEnum = /stability:\s*StabilityEnum\./.test(code);

  console.log(`[Common] hasStabilityString: ${hasStabilityString}`);
  console.log(`[Common] hasStabilityEnum: ${hasStabilityEnum}`);

  if (!hasStabilityString && !hasStabilityEnum) {
    console.log('[Common] Warning: Missing or invalid stability field');
  }
}

// Test Data
const eventCode = `
export const AgentToolAssignedEvent = defineEvent({
  meta: {
    key: 'agent-console.agent.toolAssigned',
    version: 1,
    description: 'A tool was assigned to an agent.',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['agent', 'tool', 'assigned'],
  },
  payload: AgentToolAssignedPayload,
});
`;

const presentationIndexCode = `/**
 * Agent Console Presentations - re-exports from domain modules for backward compatibility.
 */

// Agent presentations
export {
  AgentListPresentation,
  AgentDetailPresentation,
  AgentConsoleDashboardPresentation,
} from '../agent/agent.presentation';

// Run presentations
export {
  RunListPresentation,
  RunDetailPresentation,
} from '../run/run.presentation';
// Alias: RunMetricsPresentation -> RunDetailPresentation (for backward compatibility)
export { RunDetailPresentation as RunMetricsPresentation } from '../run/run.presentation';

// Tool presentations
export {
  ToolListPresentation,
  ToolDetailPresentation,
} from '../tool/tool.presentation';
// Alias: ToolRegistryPresentation -> ToolListPresentation (for backward compatibility)
export { ToolListPresentation as ToolRegistryPresentation } from '../tool/tool.presentation';
`;

console.log('--- Testing Event Spec ---');
validateEventSpec(eventCode);

console.log('\n--- Testing Presentation Index ---');
validateCommonFields(presentationIndexCode);
