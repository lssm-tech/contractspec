import {
  loadSpecFromSource,
  type ParsedSpec,
} from '@contractspec/module.workspace';
import type { WorkspaceAdapters } from '../../ports/logger';
import { listSpecs } from '../list';

export type ViewAudience = 'product' | 'eng' | 'qa';

/**
 * Valid audience types for view generation.
 */
export const VALID_AUDIENCES: ViewAudience[] = ['product', 'eng', 'qa'];

/**
 * Options for generating views.
 */
export interface GenerateViewsOptions {
  /**
   * Target audience for the views.
   */
  audience: ViewAudience;
  /**
   * Explicit spec files to process (if not provided, scans workspace).
   */
  specFiles?: string[];
  /**
   * Git ref to compare against (only include specs changed since baseline).
   * Only used when specFiles is not provided.
   */
  baseline?: string;
}

/**
 * A single view entry with file path and content.
 */
export interface ViewEntry {
  filePath: string;
  content: string;
}

/**
 * Result of generating views.
 */
export interface GenerateViewsResult {
  /**
   * Generated views.
   */
  views: ViewEntry[];
  /**
   * Total number of specs found in workspace (when scanning).
   */
  totalSpecs?: number;
  /**
   * Number of changed files since baseline (when baseline is provided).
   */
  changedFilesCount?: number;
  /**
   * Status of the operation.
   */
  status: 'success' | 'no_specs' | 'no_changes' | 'no_changed_specs';
}

/**
 * Validate that the audience is a valid ViewAudience.
 */
export function validateAudience(audience: string): audience is ViewAudience {
  return VALID_AUDIENCES.includes(audience as ViewAudience);
}

/**
 * Generate audience-specific views for specs.
 *
 * This is the main entry point for view generation. It handles:
 * - Audience validation
 * - Spec file resolution (explicit files or workspace scan with optional baseline filtering)
 * - View generation for all matching specs
 */
export async function generateViews(
  adapters: WorkspaceAdapters,
  options: GenerateViewsOptions
): Promise<GenerateViewsResult> {
  // Validate audience
  if (!validateAudience(options.audience)) {
    throw new Error(
      `Invalid audience: ${options.audience}. Must be one of: ${VALID_AUDIENCES.join(', ')}`
    );
  }

  let filesToProcess: string[];
  let totalSpecs: number | undefined;
  let changedFilesCount: number | undefined;

  // Resolve files to process
  if (options.specFiles && options.specFiles.length > 0) {
    filesToProcess = options.specFiles;
  } else {
    // Scan workspace with optional baseline filtering
    const listResult = await listSpecsForView(adapters, {
      baseline: options.baseline,
    });

    totalSpecs = listResult.totalSpecs;
    changedFilesCount = listResult.changedFilesCount;

    // Handle baseline filtering edge cases
    if (options.baseline) {
      if (listResult.changedFilesCount === 0) {
        return {
          views: [],
          totalSpecs,
          changedFilesCount: 0,
          status: 'no_changes',
        };
      }

      if (listResult.specFiles.length === 0) {
        return {
          views: [],
          totalSpecs,
          changedFilesCount,
          status: 'no_changed_specs',
        };
      }
    }

    filesToProcess = listResult.specFiles;
  }

  // No specs to process
  if (filesToProcess.length === 0) {
    return {
      views: [],
      totalSpecs,
      changedFilesCount,
      status: 'no_specs',
    };
  }

  // Generate views for all specs
  const views: ViewEntry[] = [];
  for (const specFile of filesToProcess) {
    const content = await generateView(specFile, options.audience, adapters);
    views.push({ filePath: specFile, content });
  }

  return {
    views,
    totalSpecs,
    changedFilesCount,
    status: 'success',
  };
}

/**
 * Options for listing specs for view generation.
 */
export interface ListSpecsForViewOptions {
  /**
   * Git ref to compare against (only include specs changed since baseline).
   */
  baseline?: string;
}

/**
 * Result of listing specs for view generation.
 */
export interface ListSpecsForViewResult {
  /**
   * List of spec file paths to process.
   */
  specFiles: string[];
  /**
   * Total number of specs found in workspace.
   */
  totalSpecs: number;
  /**
   * Number of changed files (when baseline is provided).
   */
  changedFilesCount?: number;
  /**
   * Whether any changes were detected (when baseline is provided).
   */
  hasChanges?: boolean;
}

/**
 * List spec files for view generation, with optional baseline filtering.
 *
 * When a baseline is provided, only specs that changed since the baseline
 * are included in the result.
 */
export async function listSpecsForView(
  adapters: WorkspaceAdapters,
  options: ListSpecsForViewOptions = {}
): Promise<ListSpecsForViewResult> {
  // Get all specs in workspace
  const specs = await listSpecs({ fs: adapters.fs });
  const allSpecFiles = specs.map((s) => s.filePath);
  const totalSpecs = allSpecFiles.length;

  // If no baseline, return all specs
  if (!options.baseline) {
    return {
      specFiles: allSpecFiles,
      totalSpecs,
    };
  }

  // Get changed files since baseline
  const changedFiles = await adapters.git.diffFiles(options.baseline);

  if (changedFiles.length === 0) {
    return {
      specFiles: [],
      totalSpecs,
      changedFilesCount: 0,
      hasChanges: false,
    };
  }

  // Filter to specs that match changed files
  const filteredSpecs = allSpecFiles.filter((specPath) =>
    changedFiles.some(
      (changed) =>
        specPath.endsWith(changed) ||
        changed.endsWith(specPath) ||
        specPath.includes(changed) ||
        changed.includes(specPath)
    )
  );

  return {
    specFiles: filteredSpecs,
    totalSpecs,
    changedFilesCount: changedFiles.length,
    hasChanges: filteredSpecs.length > 0,
  };
}

/**
 * Generate an audience-specific view of a spec file.
 */
export async function generateView(
  specFile: string,
  audience: ViewAudience,
  adapters: WorkspaceAdapters
): Promise<string> {
  // Using the module's static analysis, which uses node:fs internally
  // We check existence first using adapters for better error handling
  if (!(await adapters.fs.exists(specFile))) {
    throw new Error(`File not found: ${specFile}`);
  }

  const specs = await loadSpecFromSource(specFile);

  if (specs.length === 0) {
    return `No specs found in ${specFile} (Parse result empty)`;
  }

  return specs
    .map((spec) => formatSpecForAudience(spec, audience))
    .join('\n\n---\n\n');
}

function formatSpecForAudience(
  spec: ParsedSpec,
  audience: ViewAudience
): string {
  const lines: string[] = [];

  switch (audience) {
    case 'product':
      formatProductView(spec, lines);
      break;
    case 'eng':
      formatEngView(spec, lines);
      break;
    case 'qa':
      formatQaView(spec, lines);
      break;
  }

  return lines.join('\n');
}

function formatProductView(spec: ParsedSpec, lines: string[]) {
  lines.push(`# ${spec.meta.key}`);
  lines.push('**View**: Product (User Flow & Capabilities)');
  lines.push('');

  if (spec.meta.goal) {
    lines.push(`### Goal\n${spec.meta.goal}\n`);
  }
  if (spec.meta.context) {
    lines.push(`### Context\n${spec.meta.context}\n`);
  }

  if (spec.specType === 'feature') {
    if (spec.operations?.length) {
      lines.push('### Capabilities (Operations)');
      spec.operations.forEach((op) => lines.push(`- **${op.name}**`));
      lines.push('');
    }
    if (spec.presentations?.length) {
      lines.push('### User Interfaces (Presentations)');
      spec.presentations.forEach((p) => lines.push(`- **${p.name}**`));
      lines.push('');
    }
  } else if (spec.specType === 'operation') {
    lines.push('### Behavior');
    if (spec.hasPolicy) lines.push('- ✅ Enforces Business Policies');
    if (spec.hasIo) lines.push('- ✅ Validates Inputs/Outputs');
    if (spec.emittedEvents?.length) {
      lines.push('### Triggers');
      spec.emittedEvents.forEach((ev) =>
        lines.push(`- **${ev.name}** (Event)`)
      );
    }
  } else {
    lines.push(`Type: ${spec.specType}`);
  }
}

function formatEngView(spec: ParsedSpec, lines: string[]) {
  lines.push(`# ${spec.meta.key}`);
  lines.push('**View**: Engineering (API, Schemas, Constraints)');
  lines.push('');

  lines.push(`- **Type**: \`${spec.specType}\``);
  lines.push(`- **Version**: \`${spec.meta.version}\``);
  if (spec.meta.stability)
    lines.push(`- **Stability**: \`${spec.meta.stability}\``);
  lines.push('');

  if (spec.specType === 'operation') {
    lines.push('### Contract Details');
    lines.push(`- **I/O Schema**: ${spec.hasIo ? '✅ Defined' : '❌ Missing'}`);
    lines.push(
      `- **Policy Config**: ${spec.hasPolicy ? '✅ Defined' : '❌ None'}`
    );
    lines.push('');

    if (spec.emittedEvents?.length) {
      lines.push('### Emitted Events');
      spec.emittedEvents.forEach((ev) => lines.push(`- \`${ev.name}\``));
      lines.push('');
    }
  } else if (spec.specType === 'feature') {
    if (spec.operations?.length) {
      lines.push('### Operations');
      spec.operations.forEach((op) => lines.push(`- \`${op.name}\``));
      lines.push('');
    }
    if (spec.events?.length) {
      lines.push('### Events');
      spec.events.forEach((ev) => lines.push(`- \`${ev.name}\``));
      lines.push('');
    }
  }

  if (spec.sourceBlock) {
    lines.push('### Source Signature');
    lines.push('```typescript');
    lines.push(spec.sourceBlock);
    lines.push('```');
  }
}

function formatQaView(spec: ParsedSpec, lines: string[]) {
  lines.push(`# ${spec.meta.key}`);
  lines.push('**View**: QA (Scenarios, Test Coverage)');
  lines.push('');

  if (spec.meta.goal) {
    lines.push(`**Goal**: ${spec.meta.goal}\n`);
  }

  if (spec.testRefs?.length) {
    lines.push('### Linked Scenarios');
    spec.testRefs.forEach((test) => lines.push(`- 🧪 \`${test.name}\``));
    lines.push('');
  } else {
    lines.push('### Linked Scenarios');
    lines.push('_(No explicit test refs found)_');
    lines.push('');
  }

  lines.push('### Verification Checklist');
  if (spec.specType === 'operation') {
    lines.push(
      `- [ ] Verify input validation for \`${spec.meta.key}\` (Success/Fail cases)`
    );
    if (spec.hasPolicy) lines.push(`- [ ] Verify policy enforcement rules`);
    if (spec.emittedEvents?.length) {
      spec.emittedEvents.forEach((ev) =>
        lines.push(`- [ ] Verify event \`${ev.name}\` is emitted`)
      );
    }
  } else if (spec.specType === 'feature') {
    if (spec.operations?.length) {
      spec.operations.forEach((op) =>
        lines.push(`- [ ] Test Operation flow: \`${op.name}\``)
      );
    }
    if (spec.presentations?.length) {
      spec.presentations.forEach((p) =>
        lines.push(`- [ ] Test UI Component: \`${p.name}\``)
      );
    }
  }
}
