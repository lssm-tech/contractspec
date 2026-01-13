import type { TestSpec } from '@contractspec/lib.contracts';

function defineTestSpec(spec: TestSpec) {
  return spec;
}

export const GetTrackTest = defineTestSpec({
  meta: {
    key: 'learningJourney.crmOnboarding.getTrack.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.learning-journey-crm-onboarding'],
    description: 'Test for getting CRM onboarding track',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'learningJourney.crmOnboarding.getTrack', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'learningJourney.crmOnboarding.getTrack' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'learningJourney.crmOnboarding.getTrack' } },
      then: [{ type: 'expectError' }],
    },
  ],
});
