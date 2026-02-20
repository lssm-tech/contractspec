/**
 * Typed message keys for the voice i18n system.
 *
 * All translatable strings in the package are referenced by these keys.
 * Organized by sub-domain: TTS prompts, TTS pacing, STT, Conversational.
 */

export const TTS_PROMPT_KEYS = {
  'prompt.tts.system': 'prompt.tts.system',
  'prompt.pace.sceneMatched': 'prompt.pace.sceneMatched',
  'prompt.emphasis.system': 'prompt.emphasis.system',
} as const;

export const TTS_PACE_KEYS = {
  'pace.intro.description': 'pace.intro.description',
  'pace.problem.description': 'pace.problem.description',
  'pace.solution.description': 'pace.solution.description',
  'pace.metric.description': 'pace.metric.description',
  'pace.cta.description': 'pace.cta.description',
  'pace.transition.description': 'pace.transition.description',
} as const;

export const STT_KEYS = {
  'stt.transcribing': 'stt.transcribing',
  'stt.diarization.speaker': 'stt.diarization.speaker',
  'stt.subtitle.timestamp': 'stt.subtitle.timestamp',
} as const;

export const CONVERSATIONAL_KEYS = {
  'conv.session.started': 'conv.session.started',
  'conv.turn.user': 'conv.turn.user',
  'conv.turn.agent': 'conv.turn.agent',
  'conv.session.ended': 'conv.session.ended',
} as const;

export const I18N_KEYS = {
  ...TTS_PROMPT_KEYS,
  ...TTS_PACE_KEYS,
  ...STT_KEYS,
  ...CONVERSATIONAL_KEYS,
} as const;

/** Union type of all valid voice i18n keys */
export type VoiceMessageKey = keyof typeof I18N_KEYS;
