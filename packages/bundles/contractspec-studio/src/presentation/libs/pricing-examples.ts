/**
 * Tentative pricing example values for UI display.
 * These are examples only and subject to change based on learnings from design partners.
 */

export const PRICING_EXAMPLES = {
  free: {
    regenerationsPerMonth: 200,
    aiActionsPerMonth: 100,
    projects: 1,
  },
  builder: {
    regenerationsPerMonthHint: '1,000–2,000+',
    aiActionsPerMonthHint: '1,000+',
  },
  team: {
    description: 'Higher limits + cheaper per-regen at scale',
  },
} as const;
