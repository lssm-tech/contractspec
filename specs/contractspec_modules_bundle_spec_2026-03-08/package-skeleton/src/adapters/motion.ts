export interface MotionBundleAdapter {
  getTokens(pace: "deliberate" | "balanced" | "rapid"): {
    durationMs: number;
    enableEntrance: boolean;
    layout: boolean;
  };
}
