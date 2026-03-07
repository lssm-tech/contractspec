import { defineFeature } from '@contractspec/lib.contracts-spec';

export const VideoApiShowcaseFeature = defineFeature({
  meta: {
    key: 'video-api-showcase',
    version: '1.0.0',
    title: 'Video API Showcase',
    description:
      'Generate API documentation videos from contract spec metadata',
    domain: 'video',
    owners: ['@examples'],
    tags: ['video', 'api', 'documentation', 'showcase'],
    stability: 'experimental',
  },

  docs: [
    'docs.examples.video-api-showcase',
    'docs.examples.video-api-showcase.usage',
  ],
});
