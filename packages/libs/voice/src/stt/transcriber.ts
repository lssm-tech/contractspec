import type { STTProvider } from '../types';
import type {
  STTBrief,
  STTOptions,
  TranscriptionProject,
  TranscriptionResult,
  TranscriptionSegment,
} from './types';
import { SegmentSplitter } from './segment-splitter';
import { DiarizationMapper } from './diarization-mapper';
import { SubtitleFormatter } from './subtitle-formatter';

/**
 * Main STT orchestrator.
 *
 * Pipeline:
 * 1. Split audio into processable chunks (if needed)
 * 2. Transcribe via STTProvider
 * 3. Map speaker IDs to labels (if diarization enabled)
 * 4. Format subtitles (if requested)
 */
export class Transcriber {
  private readonly stt: STTProvider;
  private readonly segmentSplitter = new SegmentSplitter();
  private readonly diarizationMapper = new DiarizationMapper();
  private readonly subtitleFormatter = new SubtitleFormatter();

  constructor(options: STTOptions) {
    this.stt = options.stt;
  }

  /** Transcribe audio to text */
  async transcribe(brief: STTBrief): Promise<TranscriptionProject> {
    const projectId = generateProjectId();

    // 1. Split if needed
    const chunks = this.segmentSplitter.split(brief.audio);

    // 2. Transcribe each chunk
    const allSegments: TranscriptionSegment[] = [];
    let fullText = '';
    let totalDurationMs = 0;
    let offsetMs = 0;

    for (const chunk of chunks) {
      const result = await this.stt.transcribe({
        audio: chunk,
        language: brief.language,
        diarize: brief.diarize,
        speakerCount: brief.speakerCount,
        wordTimestamps: true,
        vocabularyHints: brief.vocabularyHints,
      });

      // Offset segment timestamps for multi-chunk
      const offsetSegments = result.segments.map((seg) => ({
        text: seg.text,
        startMs: seg.startMs + offsetMs,
        endMs: seg.endMs + offsetMs,
        speakerId: seg.speakerId,
        speakerName: seg.speakerName,
        confidence: seg.confidence,
      }));

      allSegments.push(...offsetSegments);
      fullText += (fullText ? ' ' : '') + result.text;
      totalDurationMs += result.durationMs;
      offsetMs += chunk.durationMs ?? 0;
    }

    // 3. Diarization mapping
    let mappedSegments = allSegments;
    let speakers;
    if (brief.diarize) {
      const mapping = this.diarizationMapper.map(allSegments);
      mappedSegments = mapping.segments;
      speakers = mapping.speakers;
    }

    const transcript: TranscriptionResult = {
      text: fullText,
      segments: mappedSegments,
      language: brief.language ?? 'en',
      durationMs: totalDurationMs,
    };

    // 4. Subtitles
    let subtitles: string | undefined;
    const format = brief.subtitleFormat ?? 'none';
    if (format === 'srt') {
      subtitles = this.subtitleFormatter.toSRT(mappedSegments);
    } else if (format === 'vtt') {
      subtitles = this.subtitleFormatter.toVTT(mappedSegments);
    }

    return {
      id: projectId,
      transcript,
      subtitles,
      speakers,
    };
  }

  /** Stream transcription (real-time, if provider supports it) */
  async *transcribeStream(
    audio: AsyncIterable<Uint8Array>,
    options?: Partial<STTBrief>
  ): AsyncIterable<TranscriptionSegment> {
    if (!this.stt.transcribeStream) {
      throw new Error(
        'Streaming transcription not supported by the current STT provider'
      );
    }

    const stream = this.stt.transcribeStream(audio, {
      language: options?.language,
      diarize: options?.diarize,
      speakerCount: options?.speakerCount,
      wordTimestamps: true,
      vocabularyHints: options?.vocabularyHints,
    });

    for await (const segment of stream) {
      yield {
        text: segment.text,
        startMs: segment.startMs,
        endMs: segment.endMs,
        speakerId: segment.speakerId,
        speakerLabel: segment.speakerName,
        confidence: segment.confidence,
      };
    }
  }
}

function generateProjectId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `stt_${timestamp}_${random}`;
}
