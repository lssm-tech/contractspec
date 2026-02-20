/**
 * Typed message keys for the content-gen i18n system.
 *
 * All translatable strings in the package are referenced by these keys.
 * Organized by domain: prompt, blog, email, landing, social, seo.
 *
 * @module i18n/keys
 */

// ─────────────────────────────────────────────────────────────────────────────
// LLM System Prompts
// ─────────────────────────────────────────────────────────────────────────────

export const PROMPT_KEYS = {
  /** Blog generator system prompt */
  'prompt.blog.system': 'prompt.blog.system',
  /** Email generator system prompt */
  'prompt.email.system': 'prompt.email.system',
  /** Landing page generator system prompt */
  'prompt.landing.system': 'prompt.landing.system',
  /** Social post generator system prompt */
  'prompt.social.system': 'prompt.social.system',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Blog Generator Strings
// ─────────────────────────────────────────────────────────────────────────────

export const BLOG_KEYS = {
  /** "Operators like {role} teams face {problems}. {title} changes that by {summary}." */
  'blog.intro': 'blog.intro',
  /** "Why now" */
  'blog.heading.whyNow': 'blog.heading.whyNow',
  /** "What you get" */
  'blog.heading.whatYouGet': 'blog.heading.whatYouGet',
  /** "Proof it works" */
  'blog.heading.proofItWorks': 'blog.heading.proofItWorks',
  /** "A focused stack built for policy-safe automation." */
  'blog.body.whatYouGet': 'blog.body.whatYouGet',
  /** "Teams using the blueprint report measurable wins." */
  'blog.body.proofItWorks': 'blog.body.proofItWorks',
  /** "Launch workflows in minutes" */
  'blog.metric.launchWorkflows': 'blog.metric.launchWorkflows',
  /** "Cut review time by 60%" */
  'blog.metric.cutReviewTime': 'blog.metric.cutReviewTime',
  /** "Ready to see it live? Spin up a sandbox in under 5 minutes." */
  'blog.outro.default': 'blog.outro.default',
  /** "{audience} teams are stuck with {pains}. {title} delivers guardrails without slowing shipping." */
  'blog.whyNow': 'blog.whyNow',
  /** " in {industry}" */
  'blog.audience.industry': 'blog.audience.industry',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Email Generator Strings
// ─────────────────────────────────────────────────────────────────────────────

export const EMAIL_KEYS = {
  /** "Launch: {title}" */
  'email.subject.announcement.launch': 'email.subject.announcement.launch',
  /** "{title} is live" */
  'email.subject.announcement.live': 'email.subject.announcement.live',
  /** "New: {title}" */
  'email.subject.announcement.new': 'email.subject.announcement.new',
  /** "Get started with {title}" */
  'email.subject.onboarding.getStarted': 'email.subject.onboarding.getStarted',
  /** "Your {title} guide" */
  'email.subject.onboarding.guide': 'email.subject.onboarding.guide',
  /** "How {title} speeds ops" */
  'email.subject.nurture.speeds': 'email.subject.nurture.speeds',
  /** "Proof {title} works" */
  'email.subject.nurture.proof': 'email.subject.nurture.proof',
  /** "{title} update" */
  'email.subject.fallback': 'email.subject.fallback',
  /** "ship faster without policy gaps" */
  'email.preview.defaultWin': 'email.preview.defaultWin',
  /** "See how teams {win}." */
  'email.preview.template': 'email.preview.template',
  /** "Hi there," */
  'email.body.greeting': 'email.body.greeting',
  /** "Top reasons teams adopt {title}:" */
  'email.body.reasons': 'email.body.reasons',
  /** "Spin up a sandbox" */
  'email.cta.sandbox': 'email.cta.sandbox',
  /** "Explore the sandbox" */
  'email.cta.explore': 'email.cta.explore',
  /** "{title} is live. {summary}" */
  'email.hook.announcement': 'email.hook.announcement',
  /** "Here is your next step to unlock {title}." */
  'email.hook.onboarding': 'email.hook.onboarding',
  /** "Operators like {role} keep asking how to automate policy checks. Here is what works." */
  'email.hook.nurture': 'email.hook.nurture',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Landing Page Strings
// ─────────────────────────────────────────────────────────────────────────────

export const LANDING_KEYS = {
  /** "Operations" */
  'landing.eyebrow.defaultIndustry': 'landing.eyebrow.defaultIndustry',
  /** "{industry} teams" */
  'landing.eyebrow.template': 'landing.eyebrow.template',
  /** "Launch a sandbox" */
  'landing.cta.primary': 'landing.cta.primary',
  /** "View docs" */
  'landing.cta.secondary': 'landing.cta.secondary',
  /** "Policy-safe by default" */
  'landing.highlight.policySafe': 'landing.highlight.policySafe',
  /** "Auto-adapts per tenant" */
  'landing.highlight.autoAdapts': 'landing.highlight.autoAdapts',
  /** "Launch-ready in days" */
  'landing.highlight.launchReady': 'landing.highlight.launchReady',
  /** "Key capability" */
  'landing.highlight.fallback': 'landing.highlight.fallback',
  /** "Teams using ContractSpec" */
  'landing.socialProof.heading': 'landing.socialProof.heading',
  /** Default social proof quote */
  'landing.socialProof.defaultQuote': 'landing.socialProof.defaultQuote',
  /** "How does this keep policies enforced?" */
  'landing.faq.policiesEnforced.heading':
    'landing.faq.policiesEnforced.heading',
  /** FAQ body about policy enforcement */
  'landing.faq.policiesEnforced.body': 'landing.faq.policiesEnforced.body',
  /** "Will it fit our existing stack?" */
  'landing.faq.existingStack.heading': 'landing.faq.existingStack.heading',
  /** FAQ body about stack compatibility */
  'landing.faq.existingStack.body': 'landing.faq.existingStack.body',
  /** "What about compliance requirements?" */
  'landing.faq.compliance.heading': 'landing.faq.compliance.heading',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Social Post Strings
// ─────────────────────────────────────────────────────────────────────────────

export const SOCIAL_KEYS = {
  /** "Book a 15-min run-through" */
  'social.cta.linkedin': 'social.cta.linkedin',
  /** "→ contractspec.io/sandbox" */
  'social.cta.twitter': 'social.cta.twitter',
  /** "Ops + policy can move fast. {title} automates guardrails so teams ship daily." */
  'social.body.threads': 'social.body.threads',
  /** " in <60s. " -- twitter body connector */
  'social.body.twitter.connector': 'social.body.twitter.connector',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SEO Optimizer Strings
// ─────────────────────────────────────────────────────────────────────────────

export const SEO_KEYS = {
  /** "{title} | ContractSpec" */
  'seo.metaTitle': 'seo.metaTitle',
  /** "{summary} — built for {role}{industry}." */
  'seo.metaDescription': 'seo.metaDescription',
  /** "Start building with ContractSpec" */
  'seo.offer.default': 'seo.offer.default',
  /** " in {industry}" */
  'seo.audience.industry': 'seo.audience.industry',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Combined Keys
// ─────────────────────────────────────────────────────────────────────────────

export const I18N_KEYS = {
  ...PROMPT_KEYS,
  ...BLOG_KEYS,
  ...EMAIL_KEYS,
  ...LANDING_KEYS,
  ...SOCIAL_KEYS,
  ...SEO_KEYS,
} as const;

/** Union type of all valid content-gen i18n keys */
export type ContentGenMessageKey = keyof typeof I18N_KEYS;
