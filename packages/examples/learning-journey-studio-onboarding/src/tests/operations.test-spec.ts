import type { TestSpec } from '@contractspec/lib.contracts';

function defineTestSpec(spec: TestSpec) {
  return spec;
}

export const GetTrackTest = defineTestSpec({
  meta: {
    key: 'learningJourney.studioOnboarding.getTrack.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.learning-journey-studio-onboarding'],
    description: 'Test for getting studio onboarding track',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: {
      key: 'learningJourney.studioOnboarding.getTrack',
      version: '1.0.0',
    },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'learningJourney.studioOnboarding.getTrack' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'learningJourney.studioOnboarding.getTrack' } },
      then: [{ type: 'expectError' }],
    },
  ],
});
