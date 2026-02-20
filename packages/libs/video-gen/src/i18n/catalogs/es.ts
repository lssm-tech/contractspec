/**
 * Spanish (es) translation catalog for @contractspec/lib.video-gen.
 *
 * @module i18n/catalogs/es
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const esMessages = defineTranslation({
  meta: {
    key: 'video-gen.messages',
    version: '1.0.0',
    domain: 'video-gen',
    description: 'Spanish translations for the video-gen package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'es',
  fallback: 'en',
  messages: {
    // ═════════════════════════════════════════════════════════════════════════
    // LLM System Prompts
    // ═════════════════════════════════════════════════════════════════════════

    'prompt.script.system': {
      value:
        'Eres un redactor de guiones de narraci\u00f3n para v\u00eddeo.\nEscribe un gui\u00f3n de narraci\u00f3n para un v\u00eddeo corto (30-60 segundos).\n{styleGuide}\n\nDevuelve JSON con la forma:\n{\n  "segments": [{ "sceneId": string, "text": string }],\n  "fullText": string\n}\n\nLos identificadores de escena deben ser: "intro", "problems", "solutions", "metrics", "cta".\nIncluye solo los segmentos relevantes para el brief.',
      description: 'Script generator LLM system prompt',
      placeholders: [{ name: 'styleGuide', type: 'string' }],
    },
    'prompt.scenePlanner.system': {
      value:
        'Eres un planificador de escenas de v\u00eddeo para v\u00eddeos de marketing/documentaci\u00f3n de ContractSpec.\nDado un brief de contenido, div\u00eddelo en escenas de v\u00eddeo.\n\nCada escena debe tener:\n- compositionId: uno de "ApiOverview", "SocialClip", "TerminalDemo"\n- props: las propiedades de entrada de esa composici\u00f3n\n- durationInFrames: duraci\u00f3n a {fps} fps\n- narrationText: lo que dice el narrador durante esta escena\n\nDevuelve un objeto JSON con la forma:\n{\n  "scenes": [{ "compositionId": string, "props": object, "durationInFrames": number, "narrationText": string }],\n  "narrationScript": string\n}\n\nMant\u00e9n la duraci\u00f3n total alrededor de {targetSeconds} segundos.\nPrioriza la claridad y el ritmo. Cada escena debe comunicar una idea.',
      description: 'Scene planner LLM system prompt',
      placeholders: [
        { name: 'fps', type: 'number' },
        { name: 'targetSeconds', type: 'number' },
      ],
    },
    'prompt.style.professional': {
      value:
        'Usa un tono claro, autoritario y profesional. S\u00e9 conciso y directo.',
      description: 'Style guide for professional narration',
    },
    'prompt.style.casual': {
      value:
        'Usa un tono amigable y conversacional. S\u00e9 accesible y cercano.',
      description: 'Style guide for casual narration',
    },
    'prompt.style.technical': {
      value:
        'Usa un lenguaje t\u00e9cnico preciso. S\u00e9 detallado y exacto.',
      description: 'Style guide for technical narration',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Script Generator
    // ═════════════════════════════════════════════════════════════════════════

    'script.segment.challenge': {
      value: 'El desaf\u00edo: {content}',
      description: 'Narration segment prefix for problems',
      placeholders: [{ name: 'content', type: 'string' }],
    },
    'script.segment.solution': {
      value: 'La soluci\u00f3n: {content}',
      description: 'Narration segment prefix for solutions',
      placeholders: [{ name: 'content', type: 'string' }],
    },
    'script.segment.results': {
      value: 'Los resultados: {content}',
      description: 'Narration segment prefix for metrics',
      placeholders: [{ name: 'content', type: 'string' }],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Scene Planner
    // ═════════════════════════════════════════════════════════════════════════

    'scene.cta.default': {
      value: 'M\u00e1s informaci\u00f3n',
      description: 'Default call-to-action text for scenes',
    },
    'scene.hook.problem': {
      value: 'El problema',
      description: 'Scene hook label for problem statement',
    },
    'scene.narration.problem': {
      value: 'El problema: {content}',
      description: 'Scene narration for problem statement',
      placeholders: [{ name: 'content', type: 'string' }],
    },
    'scene.hook.solution': {
      value: 'La soluci\u00f3n',
      description: 'Scene hook label for solution',
    },
    'scene.narration.solution': {
      value: 'La soluci\u00f3n: {content}',
      description: 'Scene narration for solution',
      placeholders: [{ name: 'content', type: 'string' }],
    },
    'scene.hook.results': {
      value: 'Resultados',
      description: 'Scene hook label for results/metrics',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Composition Defaults
    // ═════════════════════════════════════════════════════════════════════════

    'composition.apiOverview.generates': {
      value: 'Genera:',
      description: 'ApiOverview heading for generated outputs',
    },
    'composition.apiOverview.tagline': {
      value: 'Una spec. Todas las superficies.',
      description: 'ApiOverview default tagline',
    },
    'composition.apiOverview.output.rest': {
      value: 'Endpoint REST',
      description: 'Generated output label: REST',
    },
    'composition.apiOverview.output.graphql': {
      value: 'Mutaci\u00f3n GraphQL',
      description: 'Generated output label: GraphQL',
    },
    'composition.apiOverview.output.prisma': {
      value: 'Modelo Prisma',
      description: 'Generated output label: Prisma',
    },
    'composition.apiOverview.output.typescript': {
      value: 'SDK TypeScript',
      description: 'Generated output label: TypeScript SDK',
    },
    'composition.apiOverview.output.mcp': {
      value: 'Herramienta MCP',
      description: 'Generated output label: MCP Tool',
    },
    'composition.apiOverview.output.openapi': {
      value: 'Spec OpenAPI',
      description: 'Generated output label: OpenAPI',
    },
    'composition.socialClip.cta': {
      value: 'M\u00e1s informaci\u00f3n',
      description: 'SocialClip default CTA',
    },
    'composition.terminal.title': {
      value: 'Terminal',
      description: 'TerminalDemo default window title',
    },
  },
});
