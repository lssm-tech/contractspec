/**
 * English (en) translation catalog for @contractspec/lib.video-gen.
 *
 * This is the primary / reference locale. All message keys must be present here.
 *
 * @module i18n/catalogs/en
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const enMessages = defineTranslation({
  meta: {
    key: 'video-gen.messages',
    version: '1.0.0',
    domain: 'video-gen',
    description:
      'All user-facing, LLM-facing, and developer-facing strings for the video-gen package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'en',
  fallback: 'en',
  messages: {
    // ═════════════════════════════════════════════════════════════════════════
    // LLM System Prompts
    // ═════════════════════════════════════════════════════════════════════════

    'prompt.script.system': {
      value:
        'You are a video narration script writer.\nWrite a narration script for a short video (30-60 seconds).\n{styleGuide}\n\nReturn JSON with shape:\n{\n  "segments": [{ "sceneId": string, "text": string }],\n  "fullText": string\n}\n\nScene IDs should be: "intro", "problems", "solutions", "metrics", "cta".\nOnly include segments that are relevant to the brief content.',
      description: 'Script generator LLM system prompt',
      placeholders: [{ name: 'styleGuide', type: 'string' }],
    },
    'prompt.scenePlanner.system': {
      value:
        'You are a video scene planner for ContractSpec marketing/documentation videos.\nGiven a content brief, break it into video scenes.\n\nEach scene must have:\n- compositionId: one of "ApiOverview", "SocialClip", "TerminalDemo"\n- props: the input props for that composition (see type definitions)\n- durationInFrames: duration at {fps}fps\n- narrationText: what the narrator says during this scene\n\nReturn a JSON object with shape:\n{\n  "scenes": [{ "compositionId": string, "props": object, "durationInFrames": number, "narrationText": string }],\n  "narrationScript": string\n}\n\nKeep the total duration around {targetSeconds} seconds.\nPrioritize clarity and pacing. Each scene should communicate one idea.',
      description: 'Scene planner LLM system prompt',
      placeholders: [
        { name: 'fps', type: 'number' },
        { name: 'targetSeconds', type: 'number' },
      ],
    },
    'prompt.style.professional': {
      value:
        'Use a clear, authoritative, professional tone. Be concise and direct.',
      description: 'Style guide for professional narration',
    },
    'prompt.style.casual': {
      value:
        'Use a friendly, conversational tone. Be approachable and relatable.',
      description: 'Style guide for casual narration',
    },
    'prompt.style.technical': {
      value: 'Use precise technical language. Be detailed and accurate.',
      description: 'Style guide for technical narration',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Script Generator
    // ═════════════════════════════════════════════════════════════════════════

    'script.segment.challenge': {
      value: 'The challenge: {content}',
      description: 'Narration segment prefix for problems',
      placeholders: [{ name: 'content', type: 'string' }],
    },
    'script.segment.solution': {
      value: 'The solution: {content}',
      description: 'Narration segment prefix for solutions',
      placeholders: [{ name: 'content', type: 'string' }],
    },
    'script.segment.results': {
      value: 'The results: {content}',
      description: 'Narration segment prefix for metrics',
      placeholders: [{ name: 'content', type: 'string' }],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Scene Planner
    // ═════════════════════════════════════════════════════════════════════════

    'scene.cta.default': {
      value: 'Learn more',
      description: 'Default call-to-action text for scenes',
    },
    'scene.hook.problem': {
      value: 'The Problem',
      description: 'Scene hook label for problem statement',
    },
    'scene.narration.problem': {
      value: 'The problem: {content}',
      description: 'Scene narration for problem statement',
      placeholders: [{ name: 'content', type: 'string' }],
    },
    'scene.hook.solution': {
      value: 'The Solution',
      description: 'Scene hook label for solution',
    },
    'scene.narration.solution': {
      value: 'The solution: {content}',
      description: 'Scene narration for solution',
      placeholders: [{ name: 'content', type: 'string' }],
    },
    'scene.hook.results': {
      value: 'Results',
      description: 'Scene hook label for results/metrics',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Composition Defaults
    // ═════════════════════════════════════════════════════════════════════════

    'composition.apiOverview.generates': {
      value: 'Generates:',
      description: 'ApiOverview heading for generated outputs',
    },
    'composition.apiOverview.tagline': {
      value: 'One spec. Every surface.',
      description: 'ApiOverview default tagline',
    },
    'composition.apiOverview.output.rest': {
      value: 'REST Endpoint',
      description: 'Generated output label: REST',
    },
    'composition.apiOverview.output.graphql': {
      value: 'GraphQL Mutation',
      description: 'Generated output label: GraphQL',
    },
    'composition.apiOverview.output.prisma': {
      value: 'Prisma Model',
      description: 'Generated output label: Prisma',
    },
    'composition.apiOverview.output.typescript': {
      value: 'TypeScript SDK',
      description: 'Generated output label: TypeScript SDK',
    },
    'composition.apiOverview.output.mcp': {
      value: 'MCP Tool',
      description: 'Generated output label: MCP Tool',
    },
    'composition.apiOverview.output.openapi': {
      value: 'OpenAPI Spec',
      description: 'Generated output label: OpenAPI',
    },
    'composition.socialClip.cta': {
      value: 'Learn more',
      description: 'SocialClip default CTA',
    },
    'composition.terminal.title': {
      value: 'Terminal',
      description: 'TerminalDemo default window title',
    },
  },
});
