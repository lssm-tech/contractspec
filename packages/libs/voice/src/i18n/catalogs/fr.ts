/**
 * French (fr) translation catalog for @contractspec/lib.voice.
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const frMessages = defineTranslation({
  meta: {
    key: 'voice.messages',
    version: '1.0.0',
    domain: 'voice',
    description: 'French translations for the voice package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'fr',
  fallback: 'en',
  messages: {
    'prompt.tts.system': {
      value:
        'Vous etes un redacteur de scripts de narration vocale.\nAnalysez le contenu et produisez un script de narration avec des directives de rythme.\nRetournez du JSON avec des segments, chacun ayant sceneId, text et contentType.',
      description:
        'Prompt systeme TTS pour la generation de scripts amelioree par LLM',
    },
    'prompt.pace.sceneMatched': {
      value:
        "Adaptez le rythme vocal aux durees des scenes. Ajustez le debit et l'emphase par segment pour correspondre a la timeline video.",
      description: 'Prompt pour la strategie de rythme alignee sur les scenes',
    },
    'prompt.emphasis.system': {
      value:
        "Vous etes un directeur vocal. Pour chaque segment, determinez l'emphase, le ton et le debit optimaux.",
      description: "Prompt systeme LLM pour le planificateur d'emphase",
    },
    'pace.intro.description': {
      value: 'Ouverture autoritaire a un rythme mesure',
      description: "Description du rythme d'introduction",
    },
    'pace.problem.description': {
      value: 'Emphase urgente sur le defi',
      description: 'Description du rythme de probleme',
    },
    'pace.solution.description': {
      value: 'Livraison calme et claire de la solution',
      description: 'Description du rythme de solution',
    },
    'pace.metric.description': {
      value: 'Emphase enthousiaste sur les resultats cles',
      description: 'Description du rythme de metrique',
    },
    'pace.cta.description': {
      value: "Appel a l'action autoritaire",
      description: 'Description du rythme CTA',
    },
    'pace.transition.description': {
      value: 'Transition rapide et neutre',
      description: 'Description du rythme de transition',
    },
    'stt.transcribing': {
      value: 'Transcription en cours...',
      description: 'Message de statut pendant la transcription',
    },
    'stt.diarization.speaker': {
      value: 'Locuteur {index}',
      description: 'Label de locuteur par defaut',
      placeholders: [{ name: 'index', type: 'number' }],
    },
    'stt.subtitle.timestamp': {
      value: '{start} --> {end}',
      description: 'Format de timestamp pour les sous-titres',
      placeholders: [
        { name: 'start', type: 'string' },
        { name: 'end', type: 'string' },
      ],
    },
    'conv.session.started': {
      value: 'Session vocale demarree',
      description: 'Notification de debut de session',
    },
    'conv.turn.user': {
      value: "L'utilisateur parle",
      description: "Indicateur de tour de l'utilisateur",
    },
    'conv.turn.agent': {
      value: "L'agent repond",
      description: "Indicateur de tour de l'agent",
    },
    'conv.session.ended': {
      value: 'Session vocale terminee. Duree : {durationMs}ms',
      description: 'Notification de fin de session',
      placeholders: [{ name: 'durationMs', type: 'number' }],
    },
  },
});
