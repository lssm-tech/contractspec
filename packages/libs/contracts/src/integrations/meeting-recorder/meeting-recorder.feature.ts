/**
 * Meeting Recorder Integration Feature Module Specification
 *
 * Defines the feature module for meeting recorder integrations.
 */
import { defineFeature } from '../../features';

/**
 * Meeting recorder feature module that bundles meeting metadata,
 * transcript fetch, and webhook ingestion capabilities.
 */
export const MeetingRecorderFeature = defineFeature({
  meta: {
    key: 'meeting-recorder',
    version: '1.0.0',
    title: 'Meeting Recorder Integration',
    description:
      'Meeting metadata, transcript retrieval, and webhook ingestion for meeting recorder providers.',
    domain: 'integrations',
    owners: ['@platform.integrations'],
    tags: ['meeting-recorder', 'transcripts', 'integrations'],
    stability: 'experimental',
  },

  operations: [
    { key: 'meeting-recorder.meetings.list', version: '1.0.0' },
    { key: 'meeting-recorder.meetings.get', version: '1.0.0' },
    { key: 'meeting-recorder.transcripts.get', version: '1.0.0' },
    { key: 'meeting-recorder.transcripts.sync', version: '1.0.0' },
    { key: 'meeting-recorder.webhooks.ingest', version: '1.0.0' },
  ],

  events: [],
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  capabilities: {
    provides: [{ key: 'meeting-recorder', version: '1.0.0' }],
    requires: [{ key: 'identity', version: '1.0.0' }],
  },
});
