import {
  type Owner,
  OwnersEnum,
  type Stability,
  StabilityEnum,
  type Tag,
  TagsEnum,
} from '@contractspec/lib.contracts-spec/ownership';
import type {
  PresentationSourceComponentReact,
  PresentationSpec,
  PresentationTarget,
} from '@contractspec/lib.contracts-spec/presentations';

/**
 * Options for creating a React component presentation.
 */
export interface CreateComponentPresentationOptions {
  /** Fully-qualified spec key (e.g., "web-landing.home") */
  key: string;
  /** Component key resolved by host componentMap */
  componentKey: string;
  /** Short human-friendly summary */
  description: string;
  /** Business goal: why this exists */
  goal: string;
  /** Background, constraints, scope edges */
  context: string;
  /** Breaking changes => bump version @default '1.0.0' */
  version?: string;
  /** Lifecycle marker @default StabilityEnum.Stable */
  stability?: Stability;
  /** Owners for CODEOWNERS / on-call @default [OwnersEnum.PlatformCore] */
  owners?: Owner[];
  /** Search tags, grouping, docs navigation @default [] */
  tags?: Tag[];
  /** Render targets @default ['react', 'markdown'] */
  targets?: PresentationTarget[];
}

/**
 * Creates a PresentationSpec for a React component with all required metadata.
 *
 * @param opts - Configuration options for the presentation
 * @returns A fully-typed PresentationSpec
 */
export function createComponentPresentation(
  opts: CreateComponentPresentationOptions
): PresentationSpec {
  const source: PresentationSourceComponentReact = {
    type: 'component',
    framework: 'react',
    componentKey: opts.componentKey,
  };

  return {
    meta: {
      key: opts.key,
      version: opts.version ?? '1.0.0',
      description: opts.description,
      goal: opts.goal,
      context: opts.context,
      stability: opts.stability ?? StabilityEnum.Stable,
      owners: opts.owners ?? [OwnersEnum.PlatformCore],
      tags: opts.tags ?? [],
    },
    source,
    targets: opts.targets ?? ['react', 'markdown'],
  };
}

/**
 * Helper to derive tags from a URL path.
 * Example: "/docs/libraries/ai-agent" -> ["docs", "libraries", "ai-agent"]
 */
export function tagsFromPath(path: string): Tag[] {
  return path
    .split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => segment as Tag);
}

/**
 * Default goal for documentation pages.
 */
export const DOCS_GOAL =
  'Educate developers on ContractSpec usage and concepts';

/**
 * Default context for documentation pages.
 */
export const DOCS_CONTEXT =
  'Part of the ContractSpec documentation site, rendered on contractspec.io';

/**
 * Default goal for marketing/landing pages.
 */
export const MARKETING_GOAL =
  'Convert visitors into ContractSpec users and customers';

/**
 * Default context for marketing pages.
 */
export const MARKETING_CONTEXT =
  'Marketing content on contractspec.io, designed for conversion';

/**
 * Default tags for documentation pages.
 */
export const DOCS_TAGS: Tag[] = [TagsEnum.Docs];
