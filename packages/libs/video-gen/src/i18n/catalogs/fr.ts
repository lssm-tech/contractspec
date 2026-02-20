/**
 * French (fr) translation catalog for @contractspec/lib.video-gen.
 *
 * @module i18n/catalogs/fr
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const frMessages = defineTranslation({
  meta: {
    key: 'video-gen.messages',
    version: '1.0.0',
    domain: 'video-gen',
    description: 'French translations for the video-gen package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'fr',
  fallback: 'en',
  messages: {
    // ═════════════════════════════════════════════════════════════════════════
    // LLM System Prompts
    // ═════════════════════════════════════════════════════════════════════════

    'prompt.script.system': {
      value:
        'Vous \u00eates un r\u00e9dacteur de scripts de narration vid\u00e9o.\n\u00c9crivez un script de narration pour une courte vid\u00e9o (30-60 secondes).\n{styleGuide}\n\nRetournez du JSON avec la forme\u00a0:\n{\n  "segments": [{ "sceneId": string, "text": string }],\n  "fullText": string\n}\n\nLes identifiants de sc\u00e8ne doivent \u00eatre\u00a0: "intro", "problems", "solutions", "metrics", "cta".\nN\'incluez que les segments pertinents au brief.',
      description: 'Script generator LLM system prompt',
      placeholders: [{ name: 'styleGuide', type: 'string' }],
    },
    'prompt.scenePlanner.system': {
      value:
        'Vous \u00eates un planificateur de sc\u00e8nes vid\u00e9o pour les vid\u00e9os marketing/documentation de ContractSpec.\n\u00c0 partir d\'un brief, d\u00e9composez-le en sc\u00e8nes vid\u00e9o.\n\nChaque sc\u00e8ne doit avoir\u00a0:\n- compositionId\u00a0: un parmi "ApiOverview", "SocialClip", "TerminalDemo"\n- props\u00a0: les propri\u00e9t\u00e9s d\'entr\u00e9e de cette composition\n- durationInFrames\u00a0: dur\u00e9e \u00e0 {fps}\u00a0fps\n- narrationText\u00a0: ce que le narrateur dit pendant cette sc\u00e8ne\n\nRetournez un objet JSON avec la forme\u00a0:\n{\n  "scenes": [{ "compositionId": string, "props": object, "durationInFrames": number, "narrationText": string }],\n  "narrationScript": string\n}\n\nGardez la dur\u00e9e totale autour de {targetSeconds} secondes.\nPrivil\u00e9giez la clart\u00e9 et le rythme. Chaque sc\u00e8ne doit communiquer une id\u00e9e.',
      description: 'Scene planner LLM system prompt',
      placeholders: [
        { name: 'fps', type: 'number' },
        { name: 'targetSeconds', type: 'number' },
      ],
    },
    'prompt.style.professional': {
      value:
        'Utilisez un ton clair, autoritaire et professionnel. Soyez concis et direct.',
      description: 'Style guide for professional narration',
    },
    'prompt.style.casual': {
      value:
        'Utilisez un ton amical et conversationnel. Soyez accessible et proche.',
      description: 'Style guide for casual narration',
    },
    'prompt.style.technical': {
      value:
        'Utilisez un langage technique pr\u00e9cis. Soyez d\u00e9taill\u00e9 et exact.',
      description: 'Style guide for technical narration',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Script Generator
    // ═════════════════════════════════════════════════════════════════════════

    'script.segment.challenge': {
      value: 'Le d\u00e9fi\u00a0: {content}',
      description: 'Narration segment prefix for problems',
      placeholders: [{ name: 'content', type: 'string' }],
    },
    'script.segment.solution': {
      value: 'La solution\u00a0: {content}',
      description: 'Narration segment prefix for solutions',
      placeholders: [{ name: 'content', type: 'string' }],
    },
    'script.segment.results': {
      value: 'Les r\u00e9sultats\u00a0: {content}',
      description: 'Narration segment prefix for metrics',
      placeholders: [{ name: 'content', type: 'string' }],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Scene Planner
    // ═════════════════════════════════════════════════════════════════════════

    'scene.cta.default': {
      value: 'En savoir plus',
      description: 'Default call-to-action text for scenes',
    },
    'scene.hook.problem': {
      value: 'Le probl\u00e8me',
      description: 'Scene hook label for problem statement',
    },
    'scene.narration.problem': {
      value: 'Le probl\u00e8me\u00a0: {content}',
      description: 'Scene narration for problem statement',
      placeholders: [{ name: 'content', type: 'string' }],
    },
    'scene.hook.solution': {
      value: 'La solution',
      description: 'Scene hook label for solution',
    },
    'scene.narration.solution': {
      value: 'La solution\u00a0: {content}',
      description: 'Scene narration for solution',
      placeholders: [{ name: 'content', type: 'string' }],
    },
    'scene.hook.results': {
      value: 'R\u00e9sultats',
      description: 'Scene hook label for results/metrics',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Composition Defaults
    // ═════════════════════════════════════════════════════════════════════════

    'composition.apiOverview.generates': {
      value: 'G\u00e9n\u00e8re\u00a0:',
      description: 'ApiOverview heading for generated outputs',
    },
    'composition.apiOverview.tagline': {
      value: 'Un spec. Toutes les surfaces.',
      description: 'ApiOverview default tagline',
    },
    'composition.apiOverview.output.rest': {
      value: 'Endpoint REST',
      description: 'Generated output label: REST',
    },
    'composition.apiOverview.output.graphql': {
      value: 'Mutation GraphQL',
      description: 'Generated output label: GraphQL',
    },
    'composition.apiOverview.output.prisma': {
      value: 'Mod\u00e8le Prisma',
      description: 'Generated output label: Prisma',
    },
    'composition.apiOverview.output.typescript': {
      value: 'SDK TypeScript',
      description: 'Generated output label: TypeScript SDK',
    },
    'composition.apiOverview.output.mcp': {
      value: 'Outil MCP',
      description: 'Generated output label: MCP Tool',
    },
    'composition.apiOverview.output.openapi': {
      value: 'Spec OpenAPI',
      description: 'Generated output label: OpenAPI',
    },
    'composition.socialClip.cta': {
      value: 'En savoir plus',
      description: 'SocialClip default CTA',
    },
    'composition.terminal.title': {
      value: 'Terminal',
      description: 'TerminalDemo default window title',
    },
  },
});
