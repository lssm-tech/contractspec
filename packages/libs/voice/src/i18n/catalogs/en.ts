/**
 * English (en) translation catalog for @contractspec/lib.voice.
 *
 * This is the primary / reference locale. All message keys must be present here.
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const enMessages = defineTranslation({
  meta: {
    key: 'voice.messages',
    version: '1.0.0',
    domain: 'voice',
    description:
      'All user-facing, LLM-facing, and developer-facing strings for the voice package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'en',
  fallback: 'en',
  messages: {
    // TTS Prompts
    'prompt.tts.system': {
      value:
        'You are a voice narration script writer.\nAnalyze the content and produce a narration script with pacing directives.\nReturn JSON with segments, each having sceneId, text, and contentType.',
      description: 'TTS system prompt for LLM-enhanced script generation',
    },
    'prompt.pace.sceneMatched': {
      value:
        'Match voice pacing to scene durations. Adjust rate and emphasis per segment to fit the video timeline.',
      description: 'Prompt for scene-matched pacing strategy',
    },
    'prompt.emphasis.system': {
      value:
        'You are a voice director. For each segment, determine the optimal emphasis, tone, and speaking rate.',
      description: 'Emphasis planner LLM system prompt',
    },

    // TTS Pacing
    'pace.intro.description': {
      value: 'Authoritative opening at a measured pace',
      description: 'Description for intro pacing',
    },
    'pace.problem.description': {
      value: 'Urgent emphasis on the challenge',
      description: 'Description for problem pacing',
    },
    'pace.solution.description': {
      value: 'Calm, clear delivery of the solution',
      description: 'Description for solution pacing',
    },
    'pace.metric.description': {
      value: 'Excited emphasis on key results',
      description: 'Description for metric pacing',
    },
    'pace.cta.description': {
      value: 'Authoritative call to action',
      description: 'Description for CTA pacing',
    },
    'pace.transition.description': {
      value: 'Quick neutral transition',
      description: 'Description for transition pacing',
    },

    // STT
    'stt.transcribing': {
      value: 'Transcribing audio...',
      description: 'Status message during transcription',
    },
    'stt.diarization.speaker': {
      value: 'Speaker {index}',
      description: 'Default speaker label',
      placeholders: [{ name: 'index', type: 'number' }],
    },
    'stt.subtitle.timestamp': {
      value: '{start} --> {end}',
      description: 'Subtitle timestamp format',
      placeholders: [
        { name: 'start', type: 'string' },
        { name: 'end', type: 'string' },
      ],
    },

    // Conversational
    'conv.session.started': {
      value: 'Voice session started',
      description: 'Session start notification',
    },
    'conv.turn.user': {
      value: 'User is speaking',
      description: 'User turn indicator',
    },
    'conv.turn.agent': {
      value: 'Agent is responding',
      description: 'Agent turn indicator',
    },
    'conv.session.ended': {
      value: 'Voice session ended. Duration: {durationMs}ms',
      description: 'Session end notification',
      placeholders: [{ name: 'durationMs', type: 'number' }],
    },
  },
});
