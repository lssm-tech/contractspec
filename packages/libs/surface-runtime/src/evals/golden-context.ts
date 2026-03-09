/**
 * Golden context format for resolver evals.
 * Fixed bundle context plus expected output constraints.
 * No PII.
 */

import type { PreferenceDimensions } from '../spec/types';

export interface GoldenContext {
  /** Route path (e.g. /operate/pm/issues/:issueId). */
  route: string;
  /** Route params (e.g. { issueId: '123' }). */
  params?: Record<string, string>;
  /** Partial preferences; rest use defaults. */
  preferences?: Partial<PreferenceDimensions>;
  /** Device type. */
  device?: 'desktop' | 'tablet' | 'mobile';
  /** Capability flags. */
  capabilities?: string[];
  /** Optional description for the golden case. */
  description?: string;
}

export interface GoldenContextFile {
  version: 1;
  contexts: GoldenContext[];
}
