/**
 * Spanish (es) translation catalog for @contractspec/module.lifecycle-advisor.
 *
 * @module i18n/catalogs/es
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const esMessages = defineTranslation({
  meta: {
    key: 'lifecycle-advisor.messages',
    version: '1.0.0',
    domain: 'lifecycle-advisor',
    description: 'Playbook, ceremony, library, and engine strings (Spanish)',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'es',
  fallback: 'en',
  messages: {
    // ── Playbook focus areas ──────────────────────────────────────────

    // Stage 0: Exploration
    'playbook.stage0.focus.0': {
      value: 'Descubrimiento',
      description: 'Stage 0 focus area: discovery research',
    },
    'playbook.stage0.focus.1': {
      value: 'Claridad del problema',
      description: 'Stage 0 focus area: sharpening the problem definition',
    },
    'playbook.stage0.focus.2': {
      value: 'Persona',
      description: 'Stage 0 focus area: identifying the target persona',
    },

    // Stage 1: Problem-Solution Fit
    'playbook.stage1.focus.0': {
      value: 'Prototipo',
      description: 'Stage 1 focus area: building a prototype',
    },
    'playbook.stage1.focus.1': {
      value: 'Retroalimentaci\u00f3n',
      description: 'Stage 1 focus area: gathering user feedback',
    },
    'playbook.stage1.focus.2': {
      value: 'Prueba de valor',
      description: 'Stage 1 focus area: proving the value proposition',
    },

    // Stage 2: MVP & Early Traction
    'playbook.stage2.focus.0': {
      value: 'Activaci\u00f3n',
      description: 'Stage 2 focus area: user activation',
    },
    'playbook.stage2.focus.1': {
      value: 'Telemetr\u00eda',
      description: 'Stage 2 focus area: usage telemetry',
    },
    'playbook.stage2.focus.2': {
      value: 'Retroalimentaci\u00f3n',
      description: 'Stage 2 focus area: continuous user feedback',
    },

    // Stage 3: Product-Market Fit
    'playbook.stage3.focus.0': {
      value: 'Retenci\u00f3n',
      description: 'Stage 3 focus area: user retention',
    },
    'playbook.stage3.focus.1': {
      value: 'Fiabilidad',
      description: 'Stage 3 focus area: product reliability',
    },
    'playbook.stage3.focus.2': {
      value: 'Historia',
      description: 'Stage 3 focus area: building the narrative',
    },

    // Stage 4: Growth / Scale-up
    'playbook.stage4.focus.0': {
      value: 'Sistemas',
      description: 'Stage 4 focus area: scalable systems',
    },
    'playbook.stage4.focus.1': {
      value: 'Bucles de crecimiento',
      description: 'Stage 4 focus area: repeatable growth loops',
    },
    'playbook.stage4.focus.2': {
      value: 'Especializaci\u00f3n',
      description: 'Stage 4 focus area: team specialization',
    },

    // Stage 5: Expansion / Platform
    'playbook.stage5.focus.0': {
      value: 'Socios',
      description: 'Stage 5 focus area: partner ecosystem',
    },
    'playbook.stage5.focus.1': {
      value: 'APIs',
      description: 'Stage 5 focus area: platform APIs',
    },
    'playbook.stage5.focus.2': {
      value: 'Apuestas de expansi\u00f3n',
      description: 'Stage 5 focus area: expansion experiments',
    },

    // Stage 6: Maturity / Renewal
    'playbook.stage6.focus.0': {
      value: 'Optimizaci\u00f3n',
      description: 'Stage 6 focus area: operational optimization',
    },
    'playbook.stage6.focus.1': {
      value: 'Renovaci\u00f3n',
      description: 'Stage 6 focus area: product renewal',
    },
    'playbook.stage6.focus.2': {
      value: 'Portafolio',
      description: 'Stage 6 focus area: portfolio management',
    },

    // ── Playbook action titles & descriptions ─────────────────────────

    // Stage 0 actions
    'playbook.stage0.action0.title': {
      value: 'Realizar un sprint de entrevistas de 5 d\u00edas',
      description: 'Action title for stage 0 interview sprint',
    },
    'playbook.stage0.action0.description': {
      value:
        'Programar al menos 5 entrevistas consecutivas y capturar citas sin editar.',
      description: 'Action description for stage 0 interview sprint',
    },
    'playbook.stage0.action1.title': {
      value: 'Redactar la historia del problema',
      description: 'Action title for stage 0 problem narrative',
    },
    'playbook.stage0.action1.description': {
      value:
        'Resumir el dolor en un p\u00e1rrafo que puedas repetir a los socios.',
      description: 'Action description for stage 0 problem narrative',
    },

    // Stage 1 actions
    'playbook.stage1.action0.title': {
      value: 'Ciclo de retroalimentaci\u00f3n del prototipo',
      description: 'Action title for stage 1 prototype iteration',
    },
    'playbook.stage1.action0.description': {
      value:
        'Entregar un prototipo de baja fidelidad y recopilar 3 rondas de reacciones.',
      description: 'Action description for stage 1 prototype iteration',
    },
    'playbook.stage1.action1.title': {
      value: 'Capturar se\u00f1ales de recomendaci\u00f3n',
      description: 'Action title for stage 1 referral tracking',
    },
    'playbook.stage1.action1.description': {
      value:
        'Preguntar a cada tester qui\u00e9n m\u00e1s deber\u00eda ver la demo.',
      description: 'Action description for stage 1 referral tracking',
    },

    // Stage 2 actions
    'playbook.stage2.action0.title': {
      value: 'Definir lista de verificaci\u00f3n de activaci\u00f3n',
      description: 'Action title for stage 2 activation definition',
    },
    'playbook.stage2.action0.description': {
      value:
        'Documentar los 3 pasos que los usuarios deben completar para obtener valor.',
      description: 'Action description for stage 2 activation definition',
    },
    'playbook.stage2.action1.title': {
      value: 'Sincronizaci\u00f3n semanal con usuarios',
      description: 'Action title for stage 2 user communication',
    },
    'playbook.stage2.action1.description': {
      value:
        'Organizar una llamada recurrente con tus 5 testers m\u00e1s activos.',
      description: 'Action description for stage 2 user communication',
    },

    // Stage 3 actions
    'playbook.stage3.action0.title': {
      value: 'Realizar un estudio de retenci\u00f3n',
      description: 'Action title for stage 3 retention analysis',
    },
    'playbook.stage3.action0.description': {
      value:
        'Entrevistar a 3 usuarios retenidos y publicar sus m\u00e9tricas antes/despu\u00e9s.',
      description: 'Action description for stage 3 retention analysis',
    },
    'playbook.stage3.action1.title': {
      value: 'Revisi\u00f3n ligera de incidentes',
      description: 'Action title for stage 3 reliability review',
    },
    'playbook.stage3.action1.description': {
      value:
        'Revisar los \u00faltimos 2 problemas de fiabilidad y capturar las correcciones.',
      description: 'Action description for stage 3 reliability review',
    },

    // Stage 4 actions
    'playbook.stage4.action0.title': {
      value: 'Codificar un bucle de crecimiento',
      description: 'Action title for stage 4 growth loop setup',
    },
    'playbook.stage4.action0.description': {
      value:
        'Elegir un bucle (SEO, referencias, outbound) y documentar responsables + entradas.',
      description: 'Action description for stage 4 growth loop setup',
    },
    'playbook.stage4.action1.title': {
      value: 'Crear mapa de contrataci\u00f3n',
      description: 'Action title for stage 4 hiring plan',
    },
    'playbook.stage4.action1.description': {
      value:
        'Listar los roles especializados necesarios para los pr\u00f3ximos 2 trimestres.',
      description: 'Action description for stage 4 hiring plan',
    },

    // Stage 5 actions
    'playbook.stage5.action0.title': {
      value: 'Brief de preparaci\u00f3n para socios',
      description: 'Action title for stage 5 partner preparation',
    },
    'playbook.stage5.action0.description': {
      value:
        'Documentar tipos de socios, propuestas de valor y pasos de incorporaci\u00f3n.',
      description: 'Action description for stage 5 partner preparation',
    },
    'playbook.stage5.action1.title': {
      value: 'Portafolio de experimentos de expansi\u00f3n',
      description: 'Action title for stage 5 expansion planning',
    },
    'playbook.stage5.action1.description': {
      value:
        'Listar los 3 principales mercados o l\u00edneas de producto con responsables.',
      description: 'Action description for stage 5 expansion planning',
    },

    // Stage 6 actions
    'playbook.stage6.action0.title': {
      value: 'Realizar una revisi\u00f3n costo-valor',
      description: 'Action title for stage 6 margin audit',
    },
    'playbook.stage6.action0.description': {
      value: 'Auditar cada superficie principal por impacto en m\u00e1rgenes.',
      description: 'Action description for stage 6 margin audit',
    },
    'playbook.stage6.action1.title': {
      value: 'Definir la apuesta de renovaci\u00f3n',
      description: 'Action title for stage 6 reinvention track',
    },
    'playbook.stage6.action1.description': {
      value:
        'Elegir una pista de reinvenci\u00f3n o descontinuaci\u00f3n y establecer puntos de control.',
      description: 'Action description for stage 6 reinvention track',
    },

    // ── Ceremony titles & copy ────────────────────────────────────────

    'ceremony.stage0.title': {
      value: 'Chispa de descubrimiento',
      description: 'Ceremony title for stage 0',
    },
    'ceremony.stage0.copy': {
      value:
        'Comparte la cita de dolor m\u00e1s impactante con tu equipo. Enm\u00e1rcala, celebra el enfoque.',
      description: 'Ceremony copy for stage 0',
    },
    'ceremony.stage1.title': {
      value: 'Resonancia de la soluci\u00f3n',
      description: 'Ceremony title for stage 1',
    },
    'ceremony.stage1.copy': {
      value:
        'Graba un breve screencast contando la historia antes/despu\u00e9s a tu futuro yo.',
      description: 'Ceremony copy for stage 1',
    },
    'ceremony.stage2.title': {
      value: 'Brindis por la tracci\u00f3n',
      description: 'Ceremony title for stage 2',
    },
    'ceremony.stage2.copy': {
      value:
        'Brinda por tus primeros 20 usuarios reales\u2014di sus nombres, diles por qu\u00e9 importan.',
      description: 'Ceremony copy for stage 2',
    },
    'ceremony.stage3.title': {
      value: 'Se\u00f1al de fuego PMF',
      description: 'Ceremony title for stage 3',
    },
    'ceremony.stage3.copy': {
      value:
        'Escribe una carta a tu futuro yo de la Serie A describiendo la atracci\u00f3n que sientes hoy.',
      description: 'Ceremony copy for stage 3',
    },
    'ceremony.stage4.title': {
      value: 'Sistemas de escala',
      description: 'Ceremony title for stage 4',
    },
    'ceremony.stage4.copy': {
      value:
        'Invita al equipo a mapear el viaje desde el primer usuario hasta la m\u00e1quina repetible.',
      description: 'Ceremony copy for stage 4',
    },
    'ceremony.stage5.title': {
      value: 'Umbral de la plataforma',
      description: 'Ceremony title for stage 5',
    },
    'ceremony.stage5.copy': {
      value:
        'Organiza un c\u00edrculo de socios\u2014invita a los aliados a compartir lo que necesitan de tu plataforma.',
      description: 'Ceremony copy for stage 5',
    },
    'ceremony.stage6.title': {
      value: 'Cumbre de renovaci\u00f3n',
      description: 'Ceremony title for stage 6',
    },
    'ceremony.stage6.copy': {
      value:
        'Haz una pausa para honrar lo que te trajo aqu\u00ed, luego compr\u00f3metete p\u00fablicamente con la pr\u00f3xima reinvenci\u00f3n.',
      description: 'Ceremony copy for stage 6',
    },

    // ── Library descriptions ──────────────────────────────────────────

    'library.stage0.item0': {
      value: 'Resumir entrevistas y sintetizar insights de IC.',
      description: 'Library tool description for stage 0 item 0',
    },
    'library.stage0.item1': {
      value:
        'Crear storyboards de baja fidelidad sin c\u00f3digo personalizado.',
      description: 'Library tool description for stage 0 item 1',
    },
    'library.stage1.item0': {
      value:
        'Controlar funcionalidades del prototipo detr\u00e1s de flags ligeros.',
      description: 'Library tool description for stage 1 item 0',
    },
    'library.stage1.item1': {
      value: 'Capturar se\u00f1ales de cuestionario para scoring temprano.',
      description: 'Library tool description for stage 1 item 1',
    },
    'library.stage2.item0': {
      value: 'Instrumentar rutas de activaci\u00f3n + cohortes.',
      description: 'Library tool description for stage 2 item 0',
    },
    'library.stage2.item1': {
      value: 'Recopilar trazas y m\u00e9tricas m\u00ednimas viables.',
      description: 'Library tool description for stage 2 item 1',
    },
    'library.stage3.item0': {
      value:
        'Detectar autom\u00e1ticamente brechas de contrato y mejoras de spec.',
      description: 'Library tool description for stage 3 item 0',
    },
    'library.stage3.item1': {
      value: 'Generar orientaci\u00f3n enfocada en retenci\u00f3n a escala.',
      description: 'Library tool description for stage 3 item 1',
    },
    'library.stage4.item0': {
      value: 'Orquestaci\u00f3n de experimentos con barandillas.',
      description: 'Library tool description for stage 4 item 0',
    },
    'library.stage4.item1': {
      value:
        'Estabilizar infraestructura y SLOs a medida que los equipos se dividen.',
      description: 'Library tool description for stage 4 item 1',
    },
    'library.stage5.item0': {
      value: 'Automatizar flujos de trabajo de socios e integraciones.',
      description: 'Library tool description for stage 5 item 0',
    },
    'library.stage5.item1': {
      value: 'Exponer incorporaci\u00f3n de socios gestionada v\u00eda Studio.',
      description: 'Library tool description for stage 5 item 1',
    },
    'library.stage6.item0': {
      value: 'Modelar escenarios de margen y apuestas de reinversi\u00f3n.',
      description: 'Library tool description for stage 6 item 0',
    },
    'library.stage6.item1': {
      value: 'Estandarizar rituales de renovaci\u00f3n y automatizaci\u00f3n.',
      description: 'Library tool description for stage 6 item 1',
    },

    // ── Engine fallback strings ───────────────────────────────────────

    'engine.fallbackAction.title': {
      value: 'Avanzar en {focus}',
      description: 'Fallback action title when no specific action exists',
      placeholders: [{ name: 'focus', type: 'string' }],
    },
    'engine.fallbackAction.description': {
      value: 'Identificar una tarea que mejore "{focus}" esta semana.',
      description: 'Fallback action description when no specific action exists',
      placeholders: [{ name: 'focus', type: 'string' }],
    },
  },
});
