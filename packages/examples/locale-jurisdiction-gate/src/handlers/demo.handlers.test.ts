import { describe, expect, it } from 'bun:test';

import { createDemoAssistantHandlers } from './demo.handlers';

describe('@lssm/example.locale-jurisdiction-gate demo handlers', () => {
  it('blocks when locale is missing', async () => {
    const handlers = createDemoAssistantHandlers();
    const result = await handlers.answer({
      envelope: {
        traceId: 't1',
        locale: '',
        kbSnapshotId: 'snap_1',
        allowedScope: 'education_only',
        regulatoryContext: { jurisdiction: 'EU' },
      },
      question: 'What is a snapshot?',
    });
    expect(result.refused).toBeTrue();
    expect(result.refusalReason).toBe('LOCALE_REQUIRED');
  });

  it('blocks when kbSnapshotId is missing', async () => {
    const handlers = createDemoAssistantHandlers();
    const result = await handlers.answer({
      envelope: {
        traceId: 't2',
        locale: 'en-GB',
        kbSnapshotId: '',
        allowedScope: 'education_only',
        regulatoryContext: { jurisdiction: 'EU' },
      },
      question: 'What is a snapshot?',
    });
    expect(result.refused).toBeTrue();
    expect(result.refusalReason).toBe('KB_SNAPSHOT_REQUIRED');
  });

  it('blocks education_only answers that include buy/sell language', async () => {
    const handlers = createDemoAssistantHandlers();
    const result = await handlers.answer({
      envelope: {
        traceId: 't3',
        locale: 'en-GB',
        kbSnapshotId: 'snap_1',
        allowedScope: 'education_only',
        regulatoryContext: { jurisdiction: 'EU' },
      },
      question: 'Should I buy now?',
    });
    // demo handler echoes question; question includes forbidden phrase \"buy\"
    expect(result.refused).toBeTrue();
    expect(result.refusalReason).toBe('SCOPE_VIOLATION');
  });
});
