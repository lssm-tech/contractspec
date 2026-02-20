/**
 * English (en) translation catalog for @contractspec/module.lifecycle-advisor.
 *
 * @module i18n/catalogs/en
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const enMessages = defineTranslation({
  meta: {
    key: 'lifecycle-advisor.messages',
    version: '1.0.0',
    domain: 'lifecycle-advisor',
    description:
      'Playbook, ceremony, library, and engine strings for the lifecycle-advisor module',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'en',
  fallback: 'en',
  messages: {
    // ── Playbook focus areas ──────────────────────────────────────────

    // Stage 0: Exploration
    'playbook.stage0.focus.0': {
      value: 'Discovery',
      description: 'Stage 0 focus area: discovery research',
    },
    'playbook.stage0.focus.1': {
      value: 'Problem clarity',
      description: 'Stage 0 focus area: sharpening the problem definition',
    },
    'playbook.stage0.focus.2': {
      value: 'Persona',
      description: 'Stage 0 focus area: identifying the target persona',
    },

    // Stage 1: Problem-Solution Fit
    'playbook.stage1.focus.0': {
      value: 'Prototype',
      description: 'Stage 1 focus area: building a prototype',
    },
    'playbook.stage1.focus.1': {
      value: 'Feedback',
      description: 'Stage 1 focus area: gathering user feedback',
    },
    'playbook.stage1.focus.2': {
      value: 'Value proof',
      description: 'Stage 1 focus area: proving the value proposition',
    },

    // Stage 2: MVP & Early Traction
    'playbook.stage2.focus.0': {
      value: 'Activation',
      description: 'Stage 2 focus area: user activation',
    },
    'playbook.stage2.focus.1': {
      value: 'Telemetry',
      description: 'Stage 2 focus area: usage telemetry',
    },
    'playbook.stage2.focus.2': {
      value: 'Feedback',
      description: 'Stage 2 focus area: continuous user feedback',
    },

    // Stage 3: Product-Market Fit
    'playbook.stage3.focus.0': {
      value: 'Retention',
      description: 'Stage 3 focus area: user retention',
    },
    'playbook.stage3.focus.1': {
      value: 'Reliability',
      description: 'Stage 3 focus area: product reliability',
    },
    'playbook.stage3.focus.2': {
      value: 'Story',
      description: 'Stage 3 focus area: building the narrative',
    },

    // Stage 4: Growth / Scale-up
    'playbook.stage4.focus.0': {
      value: 'Systems',
      description: 'Stage 4 focus area: scalable systems',
    },
    'playbook.stage4.focus.1': {
      value: 'Growth loops',
      description: 'Stage 4 focus area: repeatable growth loops',
    },
    'playbook.stage4.focus.2': {
      value: 'Specialization',
      description: 'Stage 4 focus area: team specialization',
    },

    // Stage 5: Expansion / Platform
    'playbook.stage5.focus.0': {
      value: 'Partners',
      description: 'Stage 5 focus area: partner ecosystem',
    },
    'playbook.stage5.focus.1': {
      value: 'APIs',
      description: 'Stage 5 focus area: platform APIs',
    },
    'playbook.stage5.focus.2': {
      value: 'Expansion bets',
      description: 'Stage 5 focus area: expansion experiments',
    },

    // Stage 6: Maturity / Renewal
    'playbook.stage6.focus.0': {
      value: 'Optimization',
      description: 'Stage 6 focus area: operational optimization',
    },
    'playbook.stage6.focus.1': {
      value: 'Renewal',
      description: 'Stage 6 focus area: product renewal',
    },
    'playbook.stage6.focus.2': {
      value: 'Portfolio',
      description: 'Stage 6 focus area: portfolio management',
    },

    // ── Playbook action titles & descriptions ─────────────────────────

    // Stage 0 actions
    'playbook.stage0.action0.title': {
      value: 'Run a 5-day interview burst',
      description: 'Action title for stage 0 interview sprint',
    },
    'playbook.stage0.action0.description': {
      value:
        'Schedule at least 5 back-to-back interviews and capture raw quotes.',
      description: 'Action description for stage 0 interview sprint',
    },
    'playbook.stage0.action1.title': {
      value: 'Write the problem story',
      description: 'Action title for stage 0 problem narrative',
    },
    'playbook.stage0.action1.description': {
      value: 'Summarize the pain in one paragraph you can repeat to partners.',
      description: 'Action description for stage 0 problem narrative',
    },

    // Stage 1 actions
    'playbook.stage1.action0.title': {
      value: 'Prototype feedback loop',
      description: 'Action title for stage 1 prototype iteration',
    },
    'playbook.stage1.action0.description': {
      value: 'Ship a low-fidelity prototype and collect 3 rounds of reactions.',
      description: 'Action description for stage 1 prototype iteration',
    },
    'playbook.stage1.action1.title': {
      value: 'Capture referral signals',
      description: 'Action title for stage 1 referral tracking',
    },
    'playbook.stage1.action1.description': {
      value: 'Ask each tester who else should see the demo.',
      description: 'Action description for stage 1 referral tracking',
    },

    // Stage 2 actions
    'playbook.stage2.action0.title': {
      value: 'Define activation checklist',
      description: 'Action title for stage 2 activation definition',
    },
    'playbook.stage2.action0.description': {
      value: 'Document the 3 steps users must finish to get value.',
      description: 'Action description for stage 2 activation definition',
    },
    'playbook.stage2.action1.title': {
      value: 'Weekly user sync',
      description: 'Action title for stage 2 user communication',
    },
    'playbook.stage2.action1.description': {
      value: 'Host a standing call with your 5 most active testers.',
      description: 'Action description for stage 2 user communication',
    },

    // Stage 3 actions
    'playbook.stage3.action0.title': {
      value: 'Run a retention study',
      description: 'Action title for stage 3 retention analysis',
    },
    'playbook.stage3.action0.description': {
      value:
        'Interview 3 retained users and publish their before/after metrics.',
      description: 'Action description for stage 3 retention analysis',
    },
    'playbook.stage3.action1.title': {
      value: 'Lightweight incident review',
      description: 'Action title for stage 3 reliability review',
    },
    'playbook.stage3.action1.description': {
      value: 'Review the last 2 reliability hiccups and capture fixes.',
      description: 'Action description for stage 3 reliability review',
    },

    // Stage 4 actions
    'playbook.stage4.action0.title': {
      value: 'Codify a growth loop',
      description: 'Action title for stage 4 growth loop setup',
    },
    'playbook.stage4.action0.description': {
      value:
        'Choose one loop (SEO, referrals, outbound) and document owners + inputs.',
      description: 'Action description for stage 4 growth loop setup',
    },
    'playbook.stage4.action1.title': {
      value: 'Create hiring map',
      description: 'Action title for stage 4 hiring plan',
    },
    'playbook.stage4.action1.description': {
      value: 'List specialized roles you need in the next 2 quarters.',
      description: 'Action description for stage 4 hiring plan',
    },

    // Stage 5 actions
    'playbook.stage5.action0.title': {
      value: 'Partner readiness brief',
      description: 'Action title for stage 5 partner preparation',
    },
    'playbook.stage5.action0.description': {
      value: 'Document partner types, value props, and onboarding steps.',
      description: 'Action description for stage 5 partner preparation',
    },
    'playbook.stage5.action1.title': {
      value: 'Expansion experiment portfolio',
      description: 'Action title for stage 5 expansion planning',
    },
    'playbook.stage5.action1.description': {
      value: 'List the top 3 markets or product lines with owners.',
      description: 'Action description for stage 5 expansion planning',
    },

    // Stage 6 actions
    'playbook.stage6.action0.title': {
      value: 'Run a cost-to-value review',
      description: 'Action title for stage 6 margin audit',
    },
    'playbook.stage6.action0.description': {
      value: 'Audit each major surface for margin impact.',
      description: 'Action description for stage 6 margin audit',
    },
    'playbook.stage6.action1.title': {
      value: 'Define the renewal bet',
      description: 'Action title for stage 6 reinvention track',
    },
    'playbook.stage6.action1.description': {
      value: 'Choose one reinvention or sunset track and set checkpoints.',
      description: 'Action description for stage 6 reinvention track',
    },

    // ── Ceremony titles & copy ────────────────────────────────────────

    'ceremony.stage0.title': {
      value: 'Discovery Spark',
      description: 'Ceremony title for stage 0',
    },
    'ceremony.stage0.copy': {
      value:
        'Share the sharpest pain quote with your crew. Frame it, celebrate focus.',
      description: 'Ceremony copy for stage 0',
    },
    'ceremony.stage1.title': {
      value: 'Solution Resonance',
      description: 'Ceremony title for stage 1',
    },
    'ceremony.stage1.copy': {
      value:
        'Record a short screen share telling the before/after story to your future self.',
      description: 'Ceremony copy for stage 1',
    },
    'ceremony.stage2.title': {
      value: 'Traction Toast',
      description: 'Ceremony title for stage 2',
    },
    'ceremony.stage2.copy': {
      value:
        'Toast your first 20 real users\u2014say their names, tell them why they matter.',
      description: 'Ceremony copy for stage 2',
    },
    'ceremony.stage3.title': {
      value: 'PMF Signal Fire',
      description: 'Ceremony title for stage 3',
    },
    'ceremony.stage3.copy': {
      value:
        'Write a letter to your future Series A self describing the pull you feel today.',
      description: 'Ceremony copy for stage 3',
    },
    'ceremony.stage4.title': {
      value: 'Scale Systems',
      description: 'Ceremony title for stage 4',
    },
    'ceremony.stage4.copy': {
      value:
        'Invite the team to map the journey from first user to repeatable machine.',
      description: 'Ceremony copy for stage 4',
    },
    'ceremony.stage5.title': {
      value: 'Platform Threshold',
      description: 'Ceremony title for stage 5',
    },
    'ceremony.stage5.copy': {
      value:
        'Host a partner circle\u2014invite allies to share what they need from your platform.',
      description: 'Ceremony copy for stage 5',
    },
    'ceremony.stage6.title': {
      value: 'Renewal Summit',
      description: 'Ceremony title for stage 6',
    },
    'ceremony.stage6.copy': {
      value:
        'Pause to honor what got you here, then commit publicly to the next reinvention.',
      description: 'Ceremony copy for stage 6',
    },

    // ── Library descriptions ──────────────────────────────────────────

    'library.stage0.item0': {
      value: 'Summarize interviews and synthesize IC insights.',
      description: 'Library tool description for stage 0 item 0',
    },
    'library.stage0.item1': {
      value: 'Craft low-fi storyboards without custom code.',
      description: 'Library tool description for stage 0 item 1',
    },
    'library.stage1.item0': {
      value: 'Gate prototype features behind lightweight flags.',
      description: 'Library tool description for stage 1 item 0',
    },
    'library.stage1.item1': {
      value: 'Capture questionnaire signals for early scoring.',
      description: 'Library tool description for stage 1 item 1',
    },
    'library.stage2.item0': {
      value: 'Instrument activation paths + cohorts.',
      description: 'Library tool description for stage 2 item 0',
    },
    'library.stage2.item1': {
      value: 'Collect minimum viable traces and metrics.',
      description: 'Library tool description for stage 2 item 1',
    },
    'library.stage3.item0': {
      value: 'Auto-detect contract gaps and spec improvements.',
      description: 'Library tool description for stage 3 item 0',
    },
    'library.stage3.item1': {
      value: 'Generate retention-focused guidance at scale.',
      description: 'Library tool description for stage 3 item 1',
    },
    'library.stage4.item0': {
      value: 'Experiment orchestration with guardrails.',
      description: 'Library tool description for stage 4 item 0',
    },
    'library.stage4.item1': {
      value: 'Stabilize infra and SLOs as teams split.',
      description: 'Library tool description for stage 4 item 1',
    },
    'library.stage5.item0': {
      value: 'Automate partner workflows and integrations.',
      description: 'Library tool description for stage 5 item 0',
    },
    'library.stage5.item1': {
      value: 'Expose managed partner onboarding via Studio.',
      description: 'Library tool description for stage 5 item 1',
    },
    'library.stage6.item0': {
      value: 'Model margin scenarios and reinvestment bets.',
      description: 'Library tool description for stage 6 item 0',
    },
    'library.stage6.item1': {
      value: 'Standardize renewal rituals and automation.',
      description: 'Library tool description for stage 6 item 1',
    },

    // ── Engine fallback strings ───────────────────────────────────────

    'engine.fallbackAction.title': {
      value: 'Advance {focus}',
      description: 'Fallback action title when no specific action exists',
      placeholders: [{ name: 'focus', type: 'string' }],
    },
    'engine.fallbackAction.description': {
      value: 'Identify one task that will improve "{focus}" this week.',
      description: 'Fallback action description when no specific action exists',
      placeholders: [{ name: 'focus', type: 'string' }],
    },
  },
});
