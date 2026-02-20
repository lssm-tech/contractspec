/**
 * English (en) translation catalog for @contractspec/lib.lifecycle.
 *
 * This is the primary / reference locale. All message keys must be present here.
 *
 * @module i18n/catalogs/en
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const enMessages = defineTranslation({
  meta: {
    key: 'lifecycle.messages',
    version: '1.0.0',
    domain: 'lifecycle',
    description:
      'Display labels, stage metadata, and formatter strings for the lifecycle package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'en',
  fallback: 'en',
  messages: {
    // ═════════════════════════════════════════════════════════════════════════
    // Stage Names
    // ═════════════════════════════════════════════════════════════════════════

    'stage.exploration.name': {
      value: 'Exploration / Ideation',
      description: 'Display name for the Exploration stage',
    },
    'stage.problemSolutionFit.name': {
      value: 'Problem\u2013Solution Fit',
      description: 'Display name for the Problem-Solution Fit stage',
    },
    'stage.mvpEarlyTraction.name': {
      value: 'MVP & Early Traction',
      description: 'Display name for the MVP & Early Traction stage',
    },
    'stage.productMarketFit.name': {
      value: 'Product\u2013Market Fit',
      description: 'Display name for the Product-Market Fit stage',
    },
    'stage.growthScaleUp.name': {
      value: 'Growth / Scale-up',
      description: 'Display name for the Growth / Scale-up stage',
    },
    'stage.expansionPlatform.name': {
      value: 'Expansion / Platform',
      description: 'Display name for the Expansion / Platform stage',
    },
    'stage.maturityRenewal.name': {
      value: 'Maturity / Renewal',
      description: 'Display name for the Maturity / Renewal stage',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Stage Questions
    // ═════════════════════════════════════════════════════════════════════════

    'stage.exploration.question': {
      value: 'Is there a problem worth my time?',
      description: 'Key question for the Exploration stage',
    },
    'stage.problemSolutionFit.question': {
      value: 'Do people care enough about this solution?',
      description: 'Key question for the Problem-Solution Fit stage',
    },
    'stage.mvpEarlyTraction.question': {
      value: 'Can we get real usage and learn fast?',
      description: 'Key question for the MVP & Early Traction stage',
    },
    'stage.productMarketFit.question': {
      value: 'Is this pulling us forward?',
      description: 'Key question for the Product-Market Fit stage',
    },
    'stage.growthScaleUp.question': {
      value: 'Can we grow this repeatably?',
      description: 'Key question for the Growth / Scale-up stage',
    },
    'stage.expansionPlatform.question': {
      value: 'What is the next growth curve?',
      description: 'Key question for the Expansion / Platform stage',
    },
    'stage.maturityRenewal.question': {
      value: 'Optimize, reinvent, or sunset?',
      description: 'Key question for the Maturity / Renewal stage',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Stage Signals
    // ═════════════════════════════════════════════════════════════════════════

    'stage.exploration.signal.0': {
      value: '20+ discovery interviews',
      description: 'Signal for Exploration stage',
    },
    'stage.exploration.signal.1': {
      value: 'Clear problem statement',
      description: 'Signal for Exploration stage',
    },
    'stage.exploration.signal.2': {
      value: 'Named ICP',
      description: 'Signal for Exploration stage',
    },
    'stage.problemSolutionFit.signal.0': {
      value: 'Prototype reuse',
      description: 'Signal for Problem-Solution Fit stage',
    },
    'stage.problemSolutionFit.signal.1': {
      value: 'Referral energy',
      description: 'Signal for Problem-Solution Fit stage',
    },
    'stage.problemSolutionFit.signal.2': {
      value: 'Pre-pay interest',
      description: 'Signal for Problem-Solution Fit stage',
    },
    'stage.mvpEarlyTraction.signal.0': {
      value: '20\u201350 named active users',
      description: 'Signal for MVP & Early Traction stage',
    },
    'stage.mvpEarlyTraction.signal.1': {
      value: 'Weekly releases',
      description: 'Signal for MVP & Early Traction stage',
    },
    'stage.mvpEarlyTraction.signal.2': {
      value: 'Noisy feedback',
      description: 'Signal for MVP & Early Traction stage',
    },
    'stage.productMarketFit.signal.0': {
      value: 'Retention without heroics',
      description: 'Signal for Product-Market Fit stage',
    },
    'stage.productMarketFit.signal.1': {
      value: 'Organic word-of-mouth',
      description: 'Signal for Product-Market Fit stage',
    },
    'stage.productMarketFit.signal.2': {
      value: 'Value stories',
      description: 'Signal for Product-Market Fit stage',
    },
    'stage.growthScaleUp.signal.0': {
      value: 'Predictable channels',
      description: 'Signal for Growth / Scale-up stage',
    },
    'stage.growthScaleUp.signal.1': {
      value: 'Specialized hires',
      description: 'Signal for Growth / Scale-up stage',
    },
    'stage.growthScaleUp.signal.2': {
      value: 'Unit economics on track',
      description: 'Signal for Growth / Scale-up stage',
    },
    'stage.expansionPlatform.signal.0': {
      value: 'Stable core metrics',
      description: 'Signal for Expansion / Platform stage',
    },
    'stage.expansionPlatform.signal.1': {
      value: 'Partner/API demand',
      description: 'Signal for Expansion / Platform stage',
    },
    'stage.expansionPlatform.signal.2': {
      value: 'Ecosystem pull',
      description: 'Signal for Expansion / Platform stage',
    },
    'stage.maturityRenewal.signal.0': {
      value: 'Margin focus',
      description: 'Signal for Maturity / Renewal stage',
    },
    'stage.maturityRenewal.signal.1': {
      value: 'Portfolio bets',
      description: 'Signal for Maturity / Renewal stage',
    },
    'stage.maturityRenewal.signal.2': {
      value: 'Narrative refresh',
      description: 'Signal for Maturity / Renewal stage',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Stage Traps
    // ═════════════════════════════════════════════════════════════════════════

    'stage.exploration.trap.0': {
      value: 'Branding before discovery',
      description: 'Trap for Exploration stage',
    },
    'stage.exploration.trap.1': {
      value: 'Premature tooling decisions',
      description: 'Trap for Exploration stage',
    },
    'stage.problemSolutionFit.trap.0': {
      value: '\u201cMarket is huge\u201d without users',
      description: 'Trap for Problem-Solution Fit stage',
    },
    'stage.problemSolutionFit.trap.1': {
      value: 'Skipping qualitative loops',
      description: 'Trap for Problem-Solution Fit stage',
    },
    'stage.mvpEarlyTraction.trap.0': {
      value: 'Overbuilt infra for 10 users',
      description: 'Trap for MVP & Early Traction stage',
    },
    'stage.mvpEarlyTraction.trap.1': {
      value: 'Undefined retention metric',
      description: 'Trap for MVP & Early Traction stage',
    },
    'stage.productMarketFit.trap.0': {
      value: 'Hero growth that does not scale',
      description: 'Trap for Product-Market Fit stage',
    },
    'stage.productMarketFit.trap.1': {
      value: 'Ignoring churn signals',
      description: 'Trap for Product-Market Fit stage',
    },
    'stage.growthScaleUp.trap.0': {
      value: 'Paid spend masking retention gaps',
      description: 'Trap for Growth / Scale-up stage',
    },
    'stage.growthScaleUp.trap.1': {
      value: 'Infra debt blocking launches',
      description: 'Trap for Growth / Scale-up stage',
    },
    'stage.expansionPlatform.trap.0': {
      value: 'Platform theater before wedge is solid',
      description: 'Trap for Expansion / Platform stage',
    },
    'stage.maturityRenewal.trap.0': {
      value: 'Assuming past success is enough',
      description: 'Trap for Maturity / Renewal stage',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Stage Focus Areas
    // ═════════════════════════════════════════════════════════════════════════

    'stage.exploration.focus.0': {
      value: 'Customer discovery',
      description: 'Focus area for Exploration stage',
    },
    'stage.exploration.focus.1': {
      value: 'Problem definition',
      description: 'Focus area for Exploration stage',
    },
    'stage.exploration.focus.2': {
      value: 'Segment clarity',
      description: 'Focus area for Exploration stage',
    },
    'stage.problemSolutionFit.focus.0': {
      value: 'Solution hypothesis',
      description: 'Focus area for Problem-Solution Fit stage',
    },
    'stage.problemSolutionFit.focus.1': {
      value: 'Value messaging',
      description: 'Focus area for Problem-Solution Fit stage',
    },
    'stage.problemSolutionFit.focus.2': {
      value: 'Feedback capture',
      description: 'Focus area for Problem-Solution Fit stage',
    },
    'stage.mvpEarlyTraction.focus.0': {
      value: 'Activation',
      description: 'Focus area for MVP & Early Traction stage',
    },
    'stage.mvpEarlyTraction.focus.1': {
      value: 'Cohort tracking',
      description: 'Focus area for MVP & Early Traction stage',
    },
    'stage.mvpEarlyTraction.focus.2': {
      value: 'Feedback rituals',
      description: 'Focus area for MVP & Early Traction stage',
    },
    'stage.productMarketFit.focus.0': {
      value: 'Retention',
      description: 'Focus area for Product-Market Fit stage',
    },
    'stage.productMarketFit.focus.1': {
      value: 'Reliability',
      description: 'Focus area for Product-Market Fit stage',
    },
    'stage.productMarketFit.focus.2': {
      value: 'ICP clarity',
      description: 'Focus area for Product-Market Fit stage',
    },
    'stage.growthScaleUp.focus.0': {
      value: 'Ops systems',
      description: 'Focus area for Growth / Scale-up stage',
    },
    'stage.growthScaleUp.focus.1': {
      value: 'Growth loops',
      description: 'Focus area for Growth / Scale-up stage',
    },
    'stage.growthScaleUp.focus.2': {
      value: 'Reliability engineering',
      description: 'Focus area for Growth / Scale-up stage',
    },
    'stage.expansionPlatform.focus.0': {
      value: 'Partnerships',
      description: 'Focus area for Expansion / Platform stage',
    },
    'stage.expansionPlatform.focus.1': {
      value: 'APIs',
      description: 'Focus area for Expansion / Platform stage',
    },
    'stage.expansionPlatform.focus.2': {
      value: 'New market validation',
      description: 'Focus area for Expansion / Platform stage',
    },
    'stage.maturityRenewal.focus.0': {
      value: 'Cost optimization',
      description: 'Focus area for Maturity / Renewal stage',
    },
    'stage.maturityRenewal.focus.1': {
      value: 'Reinvention bets',
      description: 'Focus area for Maturity / Renewal stage',
    },
    'stage.maturityRenewal.focus.2': {
      value: 'Sunset planning',
      description: 'Focus area for Maturity / Renewal stage',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Formatter Strings
    // ═════════════════════════════════════════════════════════════════════════

    'formatter.stageTitle': {
      value: 'Stage {order} \u00b7 {name}',
      description: 'Title template for stage summary',
      placeholders: [
        { name: 'order', type: 'number' },
        { name: 'name', type: 'string' },
      ],
    },
    'formatter.axis.product': {
      value: 'Product: {phase}',
      description: 'Product axis label in summary',
      placeholders: [{ name: 'phase', type: 'string' }],
    },
    'formatter.axis.company': {
      value: 'Company: {phase}',
      description: 'Company axis label in summary',
      placeholders: [{ name: 'phase', type: 'string' }],
    },
    'formatter.axis.capital': {
      value: 'Capital: {phase}',
      description: 'Capital axis label in summary',
      placeholders: [{ name: 'phase', type: 'string' }],
    },
    'formatter.action.fallback': {
      value: 'Focus on upcoming milestones.',
      description: 'Default action copy when no top action exists',
    },
    'formatter.digest': {
      value: 'Next up for {name}: {actionCopy}',
      description: 'Recommendation digest template',
      placeholders: [
        { name: 'name', type: 'string' },
        { name: 'actionCopy', type: 'string' },
      ],
    },
  },
});
