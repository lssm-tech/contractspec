import type { TranscriptionSegment, SpeakerMap } from './types';

/**
 * Map raw speaker IDs from STT provider output to human-readable labels.
 *
 * Assigns sequential labels (Speaker 1, Speaker 2, ...) based on
 * first-appearance order. Calculates per-speaker statistics.
 */
export class DiarizationMapper {
  /**
   * Map speaker IDs to labels and compute statistics.
   *
   * @param segments - Transcription segments with optional speakerId
   * @param labelPrefix - Prefix for speaker labels (default "Speaker")
   */
  map(
    segments: TranscriptionSegment[],
    labelPrefix = 'Speaker'
  ): { segments: TranscriptionSegment[]; speakers: SpeakerMap[] } {
    const speakerOrder: string[] = [];
    const speakerStats = new Map<
      string,
      { segmentCount: number; totalSpeakingMs: number }
    >();

    // First pass: collect speaker IDs in order of appearance
    for (const seg of segments) {
      if (seg.speakerId && !speakerOrder.includes(seg.speakerId)) {
        speakerOrder.push(seg.speakerId);
        speakerStats.set(seg.speakerId, {
          segmentCount: 0,
          totalSpeakingMs: 0,
        });
      }
    }

    // Second pass: label segments + accumulate stats
    const labeledSegments = segments.map((seg) => {
      if (!seg.speakerId) return seg;

      const index = speakerOrder.indexOf(seg.speakerId);
      const label = `${labelPrefix} ${index + 1}`;
      const stats = speakerStats.get(seg.speakerId);
      if (!stats) {
        return { ...seg, speakerLabel: label };
      }
      stats.segmentCount += 1;
      stats.totalSpeakingMs += seg.endMs - seg.startMs;

      return { ...seg, speakerLabel: label };
    });

    const speakers: SpeakerMap[] = speakerOrder.map((id, index) => {
      const stats = speakerStats.get(id);
      return {
        id,
        label: `${labelPrefix} ${index + 1}`,
        segmentCount: stats?.segmentCount ?? 0,
        totalSpeakingMs: stats?.totalSpeakingMs ?? 0,
      };
    });

    return { segments: labeledSegments, speakers };
  }
}
