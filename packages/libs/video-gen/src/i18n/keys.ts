/**
 * Typed message keys for the video-gen i18n system.
 *
 * All translatable strings in the package are referenced by these keys.
 * Organized by domain: prompt, script, scene, composition.
 *
 * @module i18n/keys
 */

// ─────────────────────────────────────────────────────────────────────────────
// LLM System Prompts
// ─────────────────────────────────────────────────────────────────────────────

export const PROMPT_KEYS = {
  /** Script generator system prompt */
  'prompt.script.system': 'prompt.script.system',
  /** Scene planner system prompt */
  'prompt.scenePlanner.system': 'prompt.scenePlanner.system',
  /** Style guide: professional */
  'prompt.style.professional': 'prompt.style.professional',
  /** Style guide: casual */
  'prompt.style.casual': 'prompt.style.casual',
  /** Style guide: technical */
  'prompt.style.technical': 'prompt.style.technical',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Script Generator Strings
// ─────────────────────────────────────────────────────────────────────────────

export const SCRIPT_KEYS = {
  /** "The challenge: " prefix for problem narration */
  'script.segment.challenge': 'script.segment.challenge',
  /** "The solution: " prefix for solution narration */
  'script.segment.solution': 'script.segment.solution',
  /** "The results: " prefix for metrics narration */
  'script.segment.results': 'script.segment.results',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Scene Planner Strings
// ─────────────────────────────────────────────────────────────────────────────

export const SCENE_KEYS = {
  /** "Learn more" -- default CTA */
  'scene.cta.default': 'scene.cta.default',
  /** "The Problem" -- scene hook label */
  'scene.hook.problem': 'scene.hook.problem',
  /** "The problem: " -- scene narration prefix */
  'scene.narration.problem': 'scene.narration.problem',
  /** "The Solution" -- scene hook label */
  'scene.hook.solution': 'scene.hook.solution',
  /** "The solution: " -- scene narration prefix */
  'scene.narration.solution': 'scene.narration.solution',
  /** "Results" -- scene hook label */
  'scene.hook.results': 'scene.hook.results',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Composition Default Strings
// ─────────────────────────────────────────────────────────────────────────────

export const COMPOSITION_KEYS = {
  /** "Generates:" -- ApiOverview heading */
  'composition.apiOverview.generates': 'composition.apiOverview.generates',
  /** "One spec. Every surface." -- ApiOverview tagline */
  'composition.apiOverview.tagline': 'composition.apiOverview.tagline',
  /** "REST Endpoint" */
  'composition.apiOverview.output.rest': 'composition.apiOverview.output.rest',
  /** "GraphQL Mutation" */
  'composition.apiOverview.output.graphql':
    'composition.apiOverview.output.graphql',
  /** "Prisma Model" */
  'composition.apiOverview.output.prisma':
    'composition.apiOverview.output.prisma',
  /** "TypeScript SDK" */
  'composition.apiOverview.output.typescript':
    'composition.apiOverview.output.typescript',
  /** "MCP Tool" */
  'composition.apiOverview.output.mcp': 'composition.apiOverview.output.mcp',
  /** "OpenAPI Spec" */
  'composition.apiOverview.output.openapi':
    'composition.apiOverview.output.openapi',
  /** "Learn more" -- SocialClip default CTA */
  'composition.socialClip.cta': 'composition.socialClip.cta',
  /** "Terminal" -- TerminalDemo default window title */
  'composition.terminal.title': 'composition.terminal.title',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Combined Keys
// ─────────────────────────────────────────────────────────────────────────────

export const I18N_KEYS = {
  ...PROMPT_KEYS,
  ...SCRIPT_KEYS,
  ...SCENE_KEYS,
  ...COMPOSITION_KEYS,
} as const;

/** Union type of all valid video-gen i18n keys */
export type VideoGenMessageKey = keyof typeof I18N_KEYS;
