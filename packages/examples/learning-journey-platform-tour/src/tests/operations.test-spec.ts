import type { TestSpec } from '@contractspec/lib.contracts';

function defineTestSpec(spec: TestSpec) {
  return spec;
}

export const GetTrackTest = defineTestSpec({
  meta: {
    key: 'learningJourney.platformTour.getTrack.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.learning-journey-platform-tour'],
    description: 'Test for getting platform tour track',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'learningJourney.platformTour.getTrack', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'learningJourney.platformTour.getTrack' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'learningJourney.platformTour.getTrack' } },
      then: [{ type: 'expectError' }],
    },
  ],
});
