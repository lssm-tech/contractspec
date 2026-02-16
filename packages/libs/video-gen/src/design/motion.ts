// ---------------------------------------------------------------------------
// Video Motion Primitives
// ---------------------------------------------------------------------------
// Easing curves, durations, and transition presets optimized for video.
// These are designed for use with Remotion's `interpolate()` function.
// ---------------------------------------------------------------------------

import { Easing } from 'remotion';

/**
 * Easing functions for video animations.
 * Remotion's interpolate() accepts these directly.
 */
export const videoEasing = {
  /** Smooth entrance -- objects appearing */
  entrance: Easing.out(Easing.exp),
  /** Smooth exit -- objects disappearing */
  exit: Easing.in(Easing.exp),
  /** Emphasis/bounce -- drawing attention */
  emphasis: Easing.out(Easing.back(1.4)),
  /** Linear -- constant speed (progress bars, typing) */
  linear: Easing.linear,
  /** Gentle ease -- subtle movements */
  gentle: Easing.bezier(0.25, 0.1, 0.25, 1),
  /** Spring-like -- playful movements */
  spring: Easing.out(Easing.back(1.7)),
} as const;

/**
 * Standard durations in frames.
 * All values assume 30fps unless noted.
 */
export const videoDurations = {
  /** Scene transition (fade, slide, etc.) */
  sceneTransition: 20,
  /** Text entrance animation */
  textEntrance: 15,
  /** Text exit animation */
  textExit: 12,
  /** Code typing speed (frames per character) */
  codeTypingPerChar: 2,
  /** Pause after a section/concept */
  sectionPause: 30,
  /** Brief pause for emphasis */
  emphasisPause: 15,
  /** Logo/brand reveal */
  brandReveal: 25,
  /** Minimum scene duration */
  minScene: 60,
  /** Standard short scene (2s) */
  shortScene: 60,
  /** Standard medium scene (4s) */
  mediumScene: 120,
  /** Standard long scene (8s) */
  longScene: 240,
} as const;

/**
 * Pre-built transition configurations for scene-to-scene transitions.
 */
export const videoTransitions = {
  fade: { type: 'fade' as const, durationInFrames: 20 },
  slideLeft: { type: 'slide-left' as const, durationInFrames: 20 },
  slideRight: { type: 'slide-right' as const, durationInFrames: 20 },
  wipe: { type: 'wipe' as const, durationInFrames: 15 },
  none: { type: 'none' as const, durationInFrames: 0 },
} as const;
