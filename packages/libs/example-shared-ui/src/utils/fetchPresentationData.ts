/**
 * Fetch Presentation Data Utility
 *
 * Types for presentation data fetching.
 * Actual fetching logic is now handled via TemplateRuntimeContext and dependency injection.
 */
import type { TemplateId } from '../lib/types';

/**
 * Data fetcher result type
 */
export interface PresentationDataResult {
  data: unknown;
  metadata?: {
    total?: number;
    timestamp?: Date;
    source?: string;
  };
}

/**
 * @deprecated Use fetchData from TemplateRuntimeContext instead.
 */
/**
 * @deprecated Use fetchData from TemplateRuntimeContext instead.
 */
export async function fetchPresentationData(
  _presentationName: string,
  _templateId: TemplateId
): Promise<PresentationDataResult> {
  throw new Error(
    'fetchPresentationData is deprecated. Use fetchData from TemplateRuntimeContext.'
  );
}

/**
 * @deprecated
 */
export function hasPresentationDataFetcher(_presentationName: string): boolean {
  return false;
}

/**
 * @deprecated
 */
export function getRegisteredPresentationFetchers(): string[] {
  return [];
}
