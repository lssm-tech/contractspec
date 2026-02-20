/**
 * French (fr) translation catalog for @contractspec/module.lifecycle-core.
 *
 * @module i18n/catalogs/fr
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const frMessages = defineTranslation({
  meta: {
    key: 'lifecycle-core.messages',
    version: '1.0.0',
    domain: 'lifecycle-core',
    description: 'Milestone titles, descriptions, and action items (French)',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'fr',
  fallback: 'en',
  messages: {
    // Stage 0
    'milestone.stage0ProblemStatement.title': {
      value: 'R\u00e9diger l\u2019\u00e9nonc\u00e9 du probl\u00e8me',
      description: 'Milestone title for stage 0',
    },
    'milestone.stage0ProblemStatement.description': {
      value:
        'Capturer la description la plus claire du probl\u00e8me principal dans les mots du client.',
      description: 'Milestone description for stage 0',
    },
    'milestone.stage0ProblemStatement.action.0': {
      value: 'Interviewer au moins 5 clients id\u00e9aux',
      description: 'Action item for stage 0',
    },
    'milestone.stage0ProblemStatement.action.1': {
      value: 'Synth\u00e9tiser les citations dans un brief d\u2019une page',
      description: 'Action item for stage 0',
    },

    // Stage 1
    'milestone.stage1PrototypeLoop.title': {
      value: 'Boucle de retours sur le prototype',
      description: 'Milestone title for stage 1',
    },
    'milestone.stage1PrototypeLoop.description': {
      value: 'Livrer un prototype cliquable et recueillir 3 tours de retours.',
      description: 'Milestone description for stage 1',
    },
    'milestone.stage1PrototypeLoop.action.0': {
      value: 'Cr\u00e9er un prototype basse fid\u00e9lit\u00e9',
      description: 'Action item for stage 1',
    },
    'milestone.stage1PrototypeLoop.action.1': {
      value: 'Planifier des appels de retours r\u00e9currents',
      description: 'Action item for stage 1',
    },

    // Stage 2
    'milestone.stage2Activation.title': {
      value: 'Checklist d\u2019activation',
      description: 'Milestone title for stage 2',
    },
    'milestone.stage2Activation.description': {
      value:
        'D\u00e9finir les \u00e9tapes minimales n\u00e9cessaires pour qu\u2019un nouvel utilisateur r\u00e9ussisse.',
      description: 'Milestone description for stage 2',
    },
    'milestone.stage2Activation.action.0': {
      value: 'Documenter le flux d\u2019int\u00e9gration',
      description: 'Action item for stage 2',
    },
    'milestone.stage2Activation.action.1': {
      value: 'Instrumenter les analytics d\u2019activation',
      description: 'Action item for stage 2',
    },

    // Stage 3
    'milestone.stage3RetentionNarrative.title': {
      value: 'R\u00e9cit de r\u00e9tention',
      description: 'Milestone title for stage 3',
    },
    'milestone.stage3RetentionNarrative.description': {
      value:
        'Cr\u00e9er l\u2019histoire avant/apr\u00e8s qui prouve pourquoi les utilisateurs restent.',
      description: 'Milestone description for stage 3',
    },
    'milestone.stage3RetentionNarrative.action.0': {
      value: 'Interviewer 3 utilisateurs retenus',
      description: 'Action item for stage 3',
    },
    'milestone.stage3RetentionNarrative.action.1': {
      value:
        'Publier un r\u00e9sum\u00e9 d\u2019une page avec des m\u00e9triques concr\u00e8tes',
      description: 'Action item for stage 3',
    },

    // Stage 4
    'milestone.stage4GrowthLoop.title': {
      value: 'Installer une boucle de croissance',
      description: 'Milestone title for stage 4',
    },
    'milestone.stage4GrowthLoop.description': {
      value:
        'Mettre en place un mouvement r\u00e9p\u00e9table acquisition \u2192 activation \u2192 recommandation.',
      description: 'Milestone description for stage 4',
    },
    'milestone.stage4GrowthLoop.action.0': {
      value: 'D\u00e9finir les m\u00e9triques de la boucle',
      description: 'Action item for stage 4',
    },
    'milestone.stage4GrowthLoop.action.1': {
      value: 'Assigner des responsables pour chaque \u00e9tape',
      description: 'Action item for stage 4',
    },
    'milestone.stage4GrowthLoop.action.2': {
      value: 'Revue hebdomadaire',
      description: 'Action item for stage 4',
    },

    // Stage 5
    'milestone.stage5PlatformBlueprint.title': {
      value: 'Plan de la plateforme',
      description: 'Milestone title for stage 5',
    },
    'milestone.stage5PlatformBlueprint.description': {
      value:
        'S\u2019aligner sur les APIs, int\u00e9grations et gouvernance pour les partenaires.',
      description: 'Milestone description for stage 5',
    },
    'milestone.stage5PlatformBlueprint.action.0': {
      value: 'Cr\u00e9er une grille de notation des int\u00e9grations',
      description: 'Action item for stage 5',
    },
    'milestone.stage5PlatformBlueprint.action.1': {
      value: 'Publier la checklist d\u2019int\u00e9gration partenaire',
      description: 'Action item for stage 5',
    },

    // Stage 6
    'milestone.stage6RenewalOps.title': {
      value: 'Rythme op\u00e9rationnel de renouvellement',
      description: 'Milestone title for stage 6',
    },
    'milestone.stage6RenewalOps.description': {
      value:
        'D\u00e9cider s\u2019il faut optimiser, r\u00e9investir ou arr\u00eater chaque surface majeure.',
      description: 'Milestone description for stage 6',
    },
    'milestone.stage6RenewalOps.action.0': {
      value: 'Tenir une revue de renouvellement trimestrielle',
      description: 'Action item for stage 6',
    },
    'milestone.stage6RenewalOps.action.1': {
      value: 'Documenter les paris de r\u00e9investissement',
      description: 'Action item for stage 6',
    },
  },
});
