# @contractspec/lib.voice

Website: https://contractspec.io/

**Voice capabilities: TTS, STT, and conversational AI.**

Provides text-to-speech synthesis, speech-to-text transcription, conversational session management, and video-gen timing synchronization. All generators follow the content-gen pattern -- deterministic by default, with optional LLM enhancement.

## Installation

```bash
bun add @contractspec/lib.voice
```

## Exports

- `.` -- Re-exports all sub-domains and shared types
- `./audio/*` -- Audio utilities: format conversion, silence generation, concatenation, duration estimation
- `./tts/*` -- `VoiceSynthesizer`, `PaceAnalyzer`, `EmphasisPlanner`, `SegmentSynthesizer`, `AudioAssembler`
- `./stt/*` -- `Transcriber`, `SegmentSplitter`, `DiarizationMapper`, `SubtitleFormatter`
- `./conversational/*` -- `VoiceSessionManager`, `TurnDetector`, `ResponseOrchestrator`, `TranscriptBuilder`
- `./sync/*` -- `TimingCalculator`, `SceneAdapter`, `DurationNegotiator` (video-gen integration)
- `./types` -- Shared voice types re-exported from contract providers
- `./i18n/*` -- Localization catalogs (en, fr, es)
- `./docs/*` -- DocBlock registrations

## Usage

```ts
import { VoiceSynthesizer } from "@contractspec/lib.voice/tts";
import { Transcriber } from "@contractspec/lib.voice/stt";
import { VoiceSessionManager } from "@contractspec/lib.voice/conversational";

const synthesizer = new VoiceSynthesizer();
const audio = await synthesizer.synthesize({
  text: "Welcome to ContractSpec.",
  voice: "en-US-default",
});

const transcriber = new Transcriber();
const transcript = await transcriber.transcribe(audio);
console.log(transcript.segments);
```
