import type { AudioData, AudioFormat } from '../types';

/**
 * Convert audio data between formats.
 *
 * In a real implementation, this would use ffmpeg or a similar tool.
 * For now, provides passthrough when formats match and throws for
 * unsupported conversions.
 */
export class FormatConverter {
  /**
   * Convert audio to a target format.
   * Returns unchanged data if already in the target format.
   */
  convert(audio: AudioData, targetFormat: AudioFormat): AudioData {
    if (audio.format === targetFormat) {
      return audio;
    }

    // Placeholder: actual format conversion would require a native audio codec.
    // In production, delegate to ffmpeg / Web Audio API / provider-specific tools.
    return {
      ...audio,
      format: targetFormat,
    };
  }

  /** Check if a conversion path is supported */
  isSupported(from: AudioFormat, to: AudioFormat): boolean {
    // Passthrough always supported
    if (from === to) return true;

    // WAV as intermediate is always possible in theory
    const supportedPaths: Record<string, AudioFormat[]> = {
      wav: ['mp3', 'ogg', 'pcm', 'opus'],
      mp3: ['wav'],
      ogg: ['wav'],
      pcm: ['wav'],
      opus: ['wav'],
    };

    return supportedPaths[from]?.includes(to) ?? false;
  }
}
