---
'@contractspec/lib.contracts-spec': minor
'@contractspec/lib.contracts-integrations': minor
'@contractspec/lib.voice': minor
'@contractspec/lib.video-gen': minor
---

Add @contractspec/lib.voice package for TTS, STT, and conversational voice

- Expanded voice.ts contract with VoiceSynthesizer, Transcriber, and conversational types
- New deepgram, openai-realtime, and voice-video-sync integration specs (mirrored)
- Updated elevenlabs, fal, gradium integration specs for voice capabilities
- New voice library with TTS, STT, audio utilities, sync, and conversational modules
- Full i18n support (en, fr, es)
- video-gen: integrate VoiceSynthesizer, Transcriber, subtitle generation, voice timing
- Added thumbnail and voiceTimingMap fields to VideoProject contract
