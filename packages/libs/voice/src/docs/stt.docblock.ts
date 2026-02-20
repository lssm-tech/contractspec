/**
 * @docblock
 * @title STT Sub-domain
 * @domain voice.stt
 * @description
 * Speech-to-text transcription with diarization and subtitle generation.
 *
 * Pipeline: Audio -> SegmentSplitter -> STTProvider -> DiarizationMapper -> SubtitleFormatter -> TranscriptionProject
 *
 * The Transcriber class orchestrates the full pipeline.
 */
export const sttDocblock = true;
