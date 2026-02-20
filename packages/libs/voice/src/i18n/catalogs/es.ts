/**
 * Spanish (es) translation catalog for @contractspec/lib.voice.
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const esMessages = defineTranslation({
  meta: {
    key: 'voice.messages',
    version: '1.0.0',
    domain: 'voice',
    description: 'Spanish translations for the voice package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'es',
  fallback: 'en',
  messages: {
    'prompt.tts.system': {
      value:
        'Eres un escritor de guiones de narracion vocal.\nAnaliza el contenido y produce un guion de narracion con directivas de ritmo.\nDevuelve JSON con segmentos, cada uno con sceneId, text y contentType.',
      description:
        'Prompt del sistema TTS para generacion de guiones mejorada con LLM',
    },
    'prompt.pace.sceneMatched': {
      value:
        'Ajusta el ritmo vocal a la duracion de las escenas. Modifica la velocidad y el enfasis por segmento para coincidir con la linea de tiempo del video.',
      description:
        'Prompt para la estrategia de ritmo sincronizado con escenas',
    },
    'prompt.emphasis.system': {
      value:
        'Eres un director vocal. Para cada segmento, determina el enfasis, tono y velocidad optimos.',
      description: 'Prompt del sistema LLM para el planificador de enfasis',
    },
    'pace.intro.description': {
      value: 'Apertura autoritaria a un ritmo medido',
      description: 'Descripcion del ritmo de introduccion',
    },
    'pace.problem.description': {
      value: 'Enfasis urgente en el desafio',
      description: 'Descripcion del ritmo de problema',
    },
    'pace.solution.description': {
      value: 'Entrega calmada y clara de la solucion',
      description: 'Descripcion del ritmo de solucion',
    },
    'pace.metric.description': {
      value: 'Enfasis entusiasta en los resultados clave',
      description: 'Descripcion del ritmo de metrica',
    },
    'pace.cta.description': {
      value: 'Llamada a la accion autoritaria',
      description: 'Descripcion del ritmo CTA',
    },
    'pace.transition.description': {
      value: 'Transicion rapida y neutral',
      description: 'Descripcion del ritmo de transicion',
    },
    'stt.transcribing': {
      value: 'Transcribiendo audio...',
      description: 'Mensaje de estado durante la transcripcion',
    },
    'stt.diarization.speaker': {
      value: 'Hablante {index}',
      description: 'Etiqueta de hablante predeterminada',
      placeholders: [{ name: 'index', type: 'number' }],
    },
    'stt.subtitle.timestamp': {
      value: '{start} --> {end}',
      description: 'Formato de marca de tiempo para subtitulos',
      placeholders: [
        { name: 'start', type: 'string' },
        { name: 'end', type: 'string' },
      ],
    },
    'conv.session.started': {
      value: 'Sesion de voz iniciada',
      description: 'Notificacion de inicio de sesion',
    },
    'conv.turn.user': {
      value: 'El usuario esta hablando',
      description: 'Indicador de turno del usuario',
    },
    'conv.turn.agent': {
      value: 'El agente esta respondiendo',
      description: 'Indicador de turno del agente',
    },
    'conv.session.ended': {
      value: 'Sesion de voz finalizada. Duracion: {durationMs}ms',
      description: 'Notificacion de fin de sesion',
      placeholders: [{ name: 'durationMs', type: 'number' }],
    },
  },
});
