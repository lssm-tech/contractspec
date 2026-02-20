/**
 * English (en) translation catalog for @contractspec/lib.content-gen.
 *
 * This is the primary / reference locale. All message keys must be present here.
 *
 * @module i18n/catalogs/en
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const enMessages = defineTranslation({
  meta: {
    key: 'content-gen.messages',
    version: '1.0.0',
    domain: 'content-gen',
    description:
      'All user-facing, LLM-facing, and developer-facing strings for the content-gen package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'en',
  fallback: 'en',
  messages: {
    // ═════════════════════════════════════════════════════════════════════════
    // LLM System Prompts
    // ═════════════════════════════════════════════════════════════════════════

    'prompt.blog.system': {
      value:
        'You are a product marketing writer. Produce JSON with title, subtitle, intro, sections[].heading/body/bullets, outro.',
      description: 'Blog generator LLM system prompt',
    },
    'prompt.email.system': {
      value:
        'Draft product marketing email as JSON {subject, previewText, body, cta}.',
      description: 'Email generator LLM system prompt',
    },
    'prompt.landing.system': {
      value:
        'Write JSON landing page copy with hero/highlights/socialProof/faq arrays.',
      description: 'Landing page generator LLM system prompt',
    },
    'prompt.social.system': {
      value:
        'Create JSON array of social posts for twitter/linkedin/threads with body, hashtags, cta.',
      description: 'Social post generator LLM system prompt',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Blog Generator
    // ═════════════════════════════════════════════════════════════════════════

    'blog.intro': {
      value:
        'Operators like {role} teams face {problems}. {title} changes that by {summary}.',
      description: 'Blog post intro paragraph template',
      placeholders: [
        { name: 'role', type: 'string' },
        { name: 'problems', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'summary', type: 'string' },
      ],
    },
    'blog.heading.whyNow': {
      value: 'Why now',
      description: 'Blog section heading: why now',
    },
    'blog.heading.whatYouGet': {
      value: 'What you get',
      description: 'Blog section heading: what you get',
    },
    'blog.heading.proofItWorks': {
      value: 'Proof it works',
      description: 'Blog section heading: proof it works',
    },
    'blog.body.whatYouGet': {
      value: 'A focused stack built for policy-safe automation.',
      description: 'Blog section body: what you get',
    },
    'blog.body.proofItWorks': {
      value: 'Teams using the blueprint report measurable wins.',
      description: 'Blog section body: proof it works',
    },
    'blog.metric.launchWorkflows': {
      value: 'Launch workflows in minutes',
      description: 'Default metric: launch workflows',
    },
    'blog.metric.cutReviewTime': {
      value: 'Cut review time by 60%',
      description: 'Default metric: cut review time',
    },
    'blog.outro.default': {
      value: 'Ready to see it live? Spin up a sandbox in under 5 minutes.',
      description: 'Default blog outro / call to action',
    },
    'blog.whyNow': {
      value:
        '{audience} teams are stuck with {pains}. {title} delivers guardrails without slowing shipping.',
      description: 'Blog why-now section body template',
      placeholders: [
        { name: 'audience', type: 'string' },
        { name: 'pains', type: 'string' },
        { name: 'title', type: 'string' },
      ],
    },
    'blog.audience.industry': {
      value: ' in {industry}',
      description: 'Audience industry suffix for blog why-now',
      placeholders: [{ name: 'industry', type: 'string' }],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Email Generator
    // ═════════════════════════════════════════════════════════════════════════

    'email.subject.announcement.launch': {
      value: 'Launch: {title}',
      description: 'Announcement email subject variant: launch',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.announcement.live': {
      value: '{title} is live',
      description: 'Announcement email subject variant: live',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.announcement.new': {
      value: 'New: {title}',
      description: 'Announcement email subject variant: new',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.onboarding.getStarted': {
      value: 'Get started with {title}',
      description: 'Onboarding email subject variant: get started',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.onboarding.guide': {
      value: 'Your {title} guide',
      description: 'Onboarding email subject variant: guide',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.nurture.speeds': {
      value: 'How {title} speeds ops',
      description: 'Nurture email subject variant: speeds ops',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.nurture.proof': {
      value: 'Proof {title} works',
      description: 'Nurture email subject variant: proof',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.fallback': {
      value: '{title} update',
      description: 'Fallback email subject line',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.preview.defaultWin': {
      value: 'ship faster without policy gaps',
      description: 'Default win text for email preview',
    },
    'email.preview.template': {
      value: 'See how teams {win}.',
      description: 'Email preview text template',
      placeholders: [{ name: 'win', type: 'string' }],
    },
    'email.body.greeting': {
      value: 'Hi there,',
      description: 'Email body greeting',
    },
    'email.body.reasons': {
      value: 'Top reasons teams adopt {title}:',
      description: 'Email body reasons intro',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.cta.sandbox': {
      value: 'Spin up a sandbox',
      description: 'Default CTA: spin up a sandbox',
    },
    'email.cta.explore': {
      value: 'Explore the sandbox',
      description: 'Default CTA: explore the sandbox',
    },
    'email.hook.announcement': {
      value: '{title} is live. {summary}',
      description: 'Announcement variant hook',
      placeholders: [
        { name: 'title', type: 'string' },
        { name: 'summary', type: 'string' },
      ],
    },
    'email.hook.onboarding': {
      value: 'Here is your next step to unlock {title}.',
      description: 'Onboarding variant hook',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.hook.nurture': {
      value:
        'Operators like {role} keep asking how to automate policy checks. Here is what works.',
      description: 'Nurture variant hook',
      placeholders: [{ name: 'role', type: 'string' }],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Landing Page
    // ═════════════════════════════════════════════════════════════════════════

    'landing.eyebrow.defaultIndustry': {
      value: 'Operations',
      description: 'Default industry for landing page eyebrow',
    },
    'landing.eyebrow.template': {
      value: '{industry} teams',
      description: 'Landing page eyebrow template',
      placeholders: [{ name: 'industry', type: 'string' }],
    },
    'landing.cta.primary': {
      value: 'Launch a sandbox',
      description: 'Landing page primary CTA',
    },
    'landing.cta.secondary': {
      value: 'View docs',
      description: 'Landing page secondary CTA',
    },
    'landing.highlight.policySafe': {
      value: 'Policy-safe by default',
      description: 'Landing page highlight heading 1',
    },
    'landing.highlight.autoAdapts': {
      value: 'Auto-adapts per tenant',
      description: 'Landing page highlight heading 2',
    },
    'landing.highlight.launchReady': {
      value: 'Launch-ready in days',
      description: 'Landing page highlight heading 3',
    },
    'landing.highlight.fallback': {
      value: 'Key capability',
      description: 'Fallback highlight heading',
    },
    'landing.socialProof.heading': {
      value: 'Teams using ContractSpec',
      description: 'Social proof section heading',
    },
    'landing.socialProof.defaultQuote': {
      value:
        '"We ship compliant workflows 5x faster while cutting ops toil in half."',
      description: 'Default social proof quote',
    },
    'landing.faq.policiesEnforced.heading': {
      value: 'How does this keep policies enforced?',
      description: 'FAQ heading: policies enforced',
    },
    'landing.faq.policiesEnforced.body': {
      value:
        'All workflows compile from TypeScript specs and pass through PDP checks before execution, so no shadow logic slips through.',
      description: 'FAQ body: policies enforced',
    },
    'landing.faq.existingStack.heading': {
      value: 'Will it fit our existing stack?',
      description: 'FAQ heading: existing stack',
    },
    'landing.faq.existingStack.body': {
      value:
        'Runtime adapters plug into REST, GraphQL, or MCP. Integrations stay vendor agnostic.',
      description: 'FAQ body: existing stack',
    },
    'landing.faq.compliance.heading': {
      value: 'What about compliance requirements?',
      description: 'FAQ heading: compliance requirements',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Social Posts
    // ═════════════════════════════════════════════════════════════════════════

    'social.cta.linkedin': {
      value: 'Book a 15-min run-through',
      description: 'LinkedIn post default CTA',
    },
    'social.cta.twitter': {
      value: '\u2192 contractspec.io/sandbox',
      description: 'Twitter post default CTA',
    },
    'social.body.threads': {
      value:
        'Ops + policy can move fast. {title} automates guardrails so teams ship daily.',
      description: 'Threads post body template',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'social.body.twitter.connector': {
      value: ' in <60s. ',
      description: 'Twitter body connector between solutions',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // SEO Optimizer
    // ═════════════════════════════════════════════════════════════════════════

    'seo.metaTitle': {
      value: '{title} | ContractSpec',
      description: 'SEO meta title template',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'seo.metaDescription': {
      value: '{summary} \u2014 built for {role}{industry}.',
      description: 'SEO meta description template',
      placeholders: [
        { name: 'summary', type: 'string' },
        { name: 'role', type: 'string' },
        { name: 'industry', type: 'string' },
      ],
    },
    'seo.offer.default': {
      value: 'Start building with ContractSpec',
      description: 'Default offer description for schema markup',
    },
    'seo.audience.industry': {
      value: ' in {industry}',
      description: 'Audience industry suffix for SEO description',
      placeholders: [{ name: 'industry', type: 'string' }],
    },
  },
});
