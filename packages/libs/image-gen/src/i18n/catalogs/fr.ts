/**
 * French (fr) translation catalog for @contractspec/lib.image-gen.
 *
 * @module i18n/catalogs/fr
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const frMessages = defineTranslation({
  meta: {
    key: 'image-gen.messages',
    version: '1.0.0',
    domain: 'image-gen',
    description: 'French translations for the image-gen package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'fr',
  fallback: 'en',
  messages: {
    'prompt.system.imagePromptEngineer': {
      value:
        "Vous \u00eates un expert en ing\u00e9nierie de prompts d'images. \u00c0 partir d'un brief JSON contenant titre, r\u00e9sum\u00e9, probl\u00e8mes, solutions, objectif, style et tokens de style, produisez un prompt d\u00e9taill\u00e9 de g\u00e9n\u00e9ration d'image. Le prompt doit \u00eatre vivant, sp\u00e9cifique et optimis\u00e9 pour les mod\u00e8les de g\u00e9n\u00e9ration d'images IA. Concentrez-vous sur la composition, l'\u00e9clairage, la palette de couleurs et le sujet. Produisez uniquement le texte du prompt, pas de JSON.",
      description:
        "Prompt syst\u00e8me pour l'ing\u00e9nierie de prompts d'images par LLM",
    },

    'image.generate.description': {
      value: 'G\u00e9n\u00e9rer une image {style} pour {purpose}',
      description:
        "Mod\u00e8le de description pour les t\u00e2ches de g\u00e9n\u00e9ration d'images",
      placeholders: [
        { name: 'style', type: 'string' },
        { name: 'purpose', type: 'string' },
      ],
    },
    'image.prompt.featuring': {
      value: 'mettant en avant {solutions}',
      description: 'Fragment de prompt pour les solutions mises en avant',
      placeholders: [{ name: 'solutions', type: 'string' }],
    },
    'image.prompt.industryContext': {
      value: 'contexte {industry}',
      description: 'Fragment de prompt pour le contexte industriel',
      placeholders: [{ name: 'industry', type: 'string' }],
    },
    'image.error.noProvider': {
      value: "Aucun fournisseur d'images configur\u00e9",
      description:
        "Message d'erreur quand aucun ImageProvider n'est disponible",
    },
    'image.error.generationFailed': {
      value: "La g\u00e9n\u00e9ration d'image a \u00e9chou\u00e9",
      description:
        "Message d'erreur quand la g\u00e9n\u00e9ration d'image \u00e9choue",
    },

    'purpose.blogHero': {
      value: 'Image hero de blog',
      description: "Libell\u00e9 pour l'objectif image hero de blog",
    },
    'purpose.socialOg': {
      value: 'Image OG pour r\u00e9seaux sociaux',
      description: "Libell\u00e9 pour l'objectif image Open Graph",
    },
    'purpose.socialTwitter': {
      value: 'Image carte Twitter',
      description: "Libell\u00e9 pour l'objectif image carte Twitter",
    },
    'purpose.socialInstagram': {
      value: 'Image Instagram',
      description: "Libell\u00e9 pour l'objectif image Instagram",
    },
    'purpose.landingHero': {
      value: "Hero de page d'atterrissage",
      description:
        "Libell\u00e9 pour l'objectif image hero de page d'atterrissage",
    },
    'purpose.videoThumbnail': {
      value: 'Miniature vid\u00e9o',
      description: "Libell\u00e9 pour l'objectif miniature vid\u00e9o",
    },
    'purpose.emailHeader': {
      value: "En-t\u00eate d'email",
      description: "Libell\u00e9 pour l'objectif image en-t\u00eate d'email",
    },
    'purpose.illustration': {
      value: 'Illustration',
      description: "Libell\u00e9 pour l'objectif illustration",
    },
    'purpose.icon': {
      value: 'Ic\u00f4ne',
      description: "Libell\u00e9 pour l'objectif ic\u00f4ne",
    },
  },
});
