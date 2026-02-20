/**
 * Spanish (es) translation catalog for @contractspec/module.lifecycle-core.
 *
 * @module i18n/catalogs/es
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const esMessages = defineTranslation({
  meta: {
    key: 'lifecycle-core.messages',
    version: '1.0.0',
    domain: 'lifecycle-core',
    description: 'Milestone titles, descriptions, and action items (Spanish)',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'es',
  fallback: 'en',
  messages: {
    // Stage 0
    'milestone.stage0ProblemStatement.title': {
      value: 'Redactar el enunciado del problema',
      description: 'Milestone title for stage 0',
    },
    'milestone.stage0ProblemStatement.description': {
      value:
        'Capturar la descripci\u00f3n m\u00e1s clara del problema principal en las palabras del cliente.',
      description: 'Milestone description for stage 0',
    },
    'milestone.stage0ProblemStatement.action.0': {
      value: 'Entrevistar al menos 5 clientes ideales',
      description: 'Action item for stage 0',
    },
    'milestone.stage0ProblemStatement.action.1': {
      value: 'Sintetizar las citas en un resumen de una p\u00e1gina',
      description: 'Action item for stage 0',
    },

    // Stage 1
    'milestone.stage1PrototypeLoop.title': {
      value: 'Ciclo de retroalimentaci\u00f3n del prototipo',
      description: 'Milestone title for stage 1',
    },
    'milestone.stage1PrototypeLoop.description': {
      value:
        'Entregar un prototipo clickeable y recopilar 3 rondas de retroalimentaci\u00f3n.',
      description: 'Milestone description for stage 1',
    },
    'milestone.stage1PrototypeLoop.action.0': {
      value: 'Crear un prototipo de baja fidelidad',
      description: 'Action item for stage 1',
    },
    'milestone.stage1PrototypeLoop.action.1': {
      value: 'Programar llamadas de retroalimentaci\u00f3n recurrentes',
      description: 'Action item for stage 1',
    },

    // Stage 2
    'milestone.stage2Activation.title': {
      value: 'Lista de verificaci\u00f3n de activaci\u00f3n',
      description: 'Milestone title for stage 2',
    },
    'milestone.stage2Activation.description': {
      value:
        'Definir los pasos m\u00ednimos necesarios para que un nuevo usuario tenga \u00e9xito.',
      description: 'Milestone description for stage 2',
    },
    'milestone.stage2Activation.action.0': {
      value: 'Documentar el flujo de incorporaci\u00f3n',
      description: 'Action item for stage 2',
    },
    'milestone.stage2Activation.action.1': {
      value: 'Instrumentar an\u00e1lisis de activaci\u00f3n',
      description: 'Action item for stage 2',
    },

    // Stage 3
    'milestone.stage3RetentionNarrative.title': {
      value: 'Narrativa de retenci\u00f3n',
      description: 'Milestone title for stage 3',
    },
    'milestone.stage3RetentionNarrative.description': {
      value:
        'Crear la historia antes/despu\u00e9s que demuestre por qu\u00e9 los usuarios se quedan.',
      description: 'Milestone description for stage 3',
    },
    'milestone.stage3RetentionNarrative.action.0': {
      value: 'Entrevistar a 3 usuarios retenidos',
      description: 'Action item for stage 3',
    },
    'milestone.stage3RetentionNarrative.action.1': {
      value:
        'Publicar un resumen de una p\u00e1gina con m\u00e9tricas concretas',
      description: 'Action item for stage 3',
    },

    // Stage 4
    'milestone.stage4GrowthLoop.title': {
      value: 'Instalar un bucle de crecimiento',
      description: 'Milestone title for stage 4',
    },
    'milestone.stage4GrowthLoop.description': {
      value:
        'Establecer un movimiento repetible de adquisici\u00f3n \u2192 activaci\u00f3n \u2192 referencia.',
      description: 'Milestone description for stage 4',
    },
    'milestone.stage4GrowthLoop.action.0': {
      value: 'Definir m\u00e9tricas del bucle',
      description: 'Action item for stage 4',
    },
    'milestone.stage4GrowthLoop.action.1': {
      value: 'Asignar responsables para cada etapa',
      description: 'Action item for stage 4',
    },
    'milestone.stage4GrowthLoop.action.2': {
      value: 'Revisi\u00f3n semanal',
      description: 'Action item for stage 4',
    },

    // Stage 5
    'milestone.stage5PlatformBlueprint.title': {
      value: 'Plan de la plataforma',
      description: 'Milestone title for stage 5',
    },
    'milestone.stage5PlatformBlueprint.description': {
      value: 'Alinearse en APIs, integraciones y gobernanza para socios.',
      description: 'Milestone description for stage 5',
    },
    'milestone.stage5PlatformBlueprint.action.0': {
      value: 'Crear r\u00fabrica de evaluaci\u00f3n de integraciones',
      description: 'Action item for stage 5',
    },
    'milestone.stage5PlatformBlueprint.action.1': {
      value:
        'Publicar lista de verificaci\u00f3n de incorporaci\u00f3n de socios',
      description: 'Action item for stage 5',
    },

    // Stage 6
    'milestone.stage6RenewalOps.title': {
      value: 'Ritmo operativo de renovaci\u00f3n',
      description: 'Milestone title for stage 6',
    },
    'milestone.stage6RenewalOps.description': {
      value:
        'Decidir si optimizar, reinvertir o descontinuar cada superficie principal.',
      description: 'Milestone description for stage 6',
    },
    'milestone.stage6RenewalOps.action.0': {
      value: 'Realizar revisi\u00f3n de renovaci\u00f3n trimestral',
      description: 'Action item for stage 6',
    },
    'milestone.stage6RenewalOps.action.1': {
      value: 'Documentar apuestas de reinversi\u00f3n',
      description: 'Action item for stage 6',
    },
  },
});
