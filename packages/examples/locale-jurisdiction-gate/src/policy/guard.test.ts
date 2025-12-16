import { describe, expect, it } from 'bun:test';

import { enforceCitations, validateEnvelope } from './guard';

describe('locale/jurisdiction gate policy', () => {
  it('blocks unsupported locale', () => {
    const result = validateEnvelope({
      locale: 'es-ES',
      kbSnapshotId: 'snap_1',
      allowedScope: 'education_only',
      regulatoryContext: { jurisdiction: 'EU' },
    });
    expect(result.ok).toBeFalse();
    if (!result.ok) expect(result.error.code).toBe('LOCALE_REQUIRED');
  });

  it('blocks answer without citations', () => {
    const result = enforceCitations({
      sections: [{ heading: 'A', body: 'B' }],
      citations: [],
    });
    expect(result.ok).toBeFalse();
    if (!result.ok) expect(result.error.code).toBe('CITATIONS_REQUIRED');
  });
});



