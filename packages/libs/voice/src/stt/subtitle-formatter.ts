import type { TranscriptionSegment } from './types';

/**
 * Format transcription segments as SRT or VTT subtitles.
 */
export class SubtitleFormatter {
  /**
   * Convert segments to SRT format.
   */
  toSRT(segments: TranscriptionSegment[]): string {
    return segments
      .map((seg, i) => {
        const start = this.formatTimeSRT(seg.startMs);
        const end = this.formatTimeSRT(seg.endMs);
        const label = seg.speakerLabel ? `[${seg.speakerLabel}] ` : '';
        return `${i + 1}\n${start} --> ${end}\n${label}${seg.text}`;
      })
      .join('\n\n');
  }

  /**
   * Convert segments to WebVTT format.
   */
  toVTT(segments: TranscriptionSegment[]): string {
    const header = 'WEBVTT\n\n';
    const cues = segments
      .map((seg, i) => {
        const start = this.formatTimeVTT(seg.startMs);
        const end = this.formatTimeVTT(seg.endMs);
        const label = seg.speakerLabel ? `<v ${seg.speakerLabel}>` : '';
        return `${i + 1}\n${start} --> ${end}\n${label}${seg.text}`;
      })
      .join('\n\n');

    return header + cues;
  }

  /** Format ms as SRT timestamp: HH:MM:SS,mmm */
  private formatTimeSRT(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const millis = ms % 1000;
    return `${this.pad(hours, 2)}:${this.pad(minutes, 2)}:${this.pad(seconds, 2)},${this.pad(millis, 3)}`;
  }

  /** Format ms as VTT timestamp: HH:MM:SS.mmm */
  private formatTimeVTT(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const millis = ms % 1000;
    return `${this.pad(hours, 2)}:${this.pad(minutes, 2)}:${this.pad(seconds, 2)}.${this.pad(millis, 3)}`;
  }

  private pad(value: number, length: number): string {
    return value.toString().padStart(length, '0');
  }
}
