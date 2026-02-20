/**
 * French (fr) translation catalog for @contractspec/lib.content-gen.
 *
 * @module i18n/catalogs/fr
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const frMessages = defineTranslation({
  meta: {
    key: 'content-gen.messages',
    version: '1.0.0',
    domain: 'content-gen',
    description: 'French translations for the content-gen package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'fr',
  fallback: 'en',
  messages: {
    // ═════════════════════════════════════════════════════════════════════════
    // LLM System Prompts
    // ═════════════════════════════════════════════════════════════════════════

    'prompt.blog.system': {
      value:
        'Vous \u00eates un r\u00e9dacteur marketing produit. Produisez du JSON avec title, subtitle, intro, sections[].heading/body/bullets, outro.',
      description: 'Blog generator LLM system prompt',
    },
    'prompt.email.system': {
      value:
        'R\u00e9digez un e-mail marketing produit en JSON {subject, previewText, body, cta}.',
      description: 'Email generator LLM system prompt',
    },
    'prompt.landing.system': {
      value:
        "\u00c9crivez du JSON pour une page d'atterrissage avec hero/highlights/socialProof/faq.",
      description: 'Landing page generator LLM system prompt',
    },
    'prompt.social.system': {
      value:
        'Cr\u00e9ez un tableau JSON de posts sociaux pour twitter/linkedin/threads avec body, hashtags, cta.',
      description: 'Social post generator LLM system prompt',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Blog Generator
    // ═════════════════════════════════════════════════════════════════════════

    'blog.intro': {
      value:
        'Les \u00e9quipes comme {role} font face \u00e0 {problems}. {title} change la donne gr\u00e2ce \u00e0 {summary}.',
      description: 'Blog post intro paragraph template',
      placeholders: [
        { name: 'role', type: 'string' },
        { name: 'problems', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'summary', type: 'string' },
      ],
    },
    'blog.heading.whyNow': {
      value: 'Pourquoi maintenant',
      description: 'Blog section heading: why now',
    },
    'blog.heading.whatYouGet': {
      value: 'Ce que vous obtenez',
      description: 'Blog section heading: what you get',
    },
    'blog.heading.proofItWorks': {
      value: 'La preuve que \u00e7a marche',
      description: 'Blog section heading: proof it works',
    },
    'blog.body.whatYouGet': {
      value:
        "Une pile cibl\u00e9e con\u00e7ue pour l'automatisation conforme aux politiques.",
      description: 'Blog section body: what you get',
    },
    'blog.body.proofItWorks': {
      value:
        'Les \u00e9quipes utilisant le mod\u00e8le rapportent des gains mesurables.',
      description: 'Blog section body: proof it works',
    },
    'blog.metric.launchWorkflows': {
      value: 'Lancez des workflows en quelques minutes',
      description: 'Default metric: launch workflows',
    },
    'blog.metric.cutReviewTime': {
      value: 'R\u00e9duisez le temps de revue de 60\u00a0%',
      description: 'Default metric: cut review time',
    },
    'blog.outro.default': {
      value:
        'Pr\u00eat \u00e0 voir en direct\u00a0? Lancez un bac \u00e0 sable en moins de 5 minutes.',
      description: 'Default blog outro / call to action',
    },
    'blog.whyNow': {
      value:
        'Les \u00e9quipes {audience} sont bloqu\u00e9es par {pains}. {title} fournit des garde-fous sans ralentir les livraisons.',
      description: 'Blog why-now section body template',
      placeholders: [
        { name: 'audience', type: 'string' },
        { name: 'pains', type: 'string' },
        { name: 'title', type: 'string' },
      ],
    },
    'blog.audience.industry': {
      value: ' dans le secteur {industry}',
      description: 'Audience industry suffix for blog why-now',
      placeholders: [{ name: 'industry', type: 'string' }],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Email Generator
    // ═════════════════════════════════════════════════════════════════════════

    'email.subject.announcement.launch': {
      value: 'Lancement\u00a0: {title}',
      description: 'Announcement email subject variant: launch',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.announcement.live': {
      value: '{title} est en ligne',
      description: 'Announcement email subject variant: live',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.announcement.new': {
      value: 'Nouveau\u00a0: {title}',
      description: 'Announcement email subject variant: new',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.onboarding.getStarted': {
      value: 'D\u00e9marrez avec {title}',
      description: 'Onboarding email subject variant: get started',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.onboarding.guide': {
      value: 'Votre guide {title}',
      description: 'Onboarding email subject variant: guide',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.nurture.speeds': {
      value: 'Comment {title} acc\u00e9l\u00e8re les op\u00e9rations',
      description: 'Nurture email subject variant: speeds ops',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.nurture.proof': {
      value: 'La preuve que {title} fonctionne',
      description: 'Nurture email subject variant: proof',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.fallback': {
      value: 'Mise \u00e0 jour {title}',
      description: 'Fallback email subject line',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.preview.defaultWin': {
      value: 'livrent plus vite sans lacunes de conformit\u00e9',
      description: 'Default win text for email preview',
    },
    'email.preview.template': {
      value: 'D\u00e9couvrez comment les \u00e9quipes {win}.',
      description: 'Email preview text template',
      placeholders: [{ name: 'win', type: 'string' }],
    },
    'email.body.greeting': {
      value: 'Bonjour,',
      description: 'Email body greeting',
    },
    'email.body.reasons': {
      value:
        'Les principales raisons pour lesquelles les \u00e9quipes adoptent {title}\u00a0:',
      description: 'Email body reasons intro',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.cta.sandbox': {
      value: 'Lancez un bac \u00e0 sable',
      description: 'Default CTA: spin up a sandbox',
    },
    'email.cta.explore': {
      value: 'Explorez le bac \u00e0 sable',
      description: 'Default CTA: explore the sandbox',
    },
    'email.hook.announcement': {
      value: '{title} est en ligne. {summary}',
      description: 'Announcement variant hook',
      placeholders: [
        { name: 'title', type: 'string' },
        { name: 'summary', type: 'string' },
      ],
    },
    'email.hook.onboarding': {
      value: 'Voici votre prochaine \u00e9tape pour d\u00e9bloquer {title}.',
      description: 'Onboarding variant hook',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.hook.nurture': {
      value:
        'Les op\u00e9rateurs comme {role} demandent sans cesse comment automatiser les v\u00e9rifications de conformit\u00e9. Voici ce qui fonctionne.',
      description: 'Nurture variant hook',
      placeholders: [{ name: 'role', type: 'string' }],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Landing Page
    // ═════════════════════════════════════════════════════════════════════════

    'landing.eyebrow.defaultIndustry': {
      value: 'Op\u00e9rations',
      description: 'Default industry for landing page eyebrow',
    },
    'landing.eyebrow.template': {
      value: '\u00c9quipes {industry}',
      description: 'Landing page eyebrow template',
      placeholders: [{ name: 'industry', type: 'string' }],
    },
    'landing.cta.primary': {
      value: 'Lancer un bac \u00e0 sable',
      description: 'Landing page primary CTA',
    },
    'landing.cta.secondary': {
      value: 'Voir la documentation',
      description: 'Landing page secondary CTA',
    },
    'landing.highlight.policySafe': {
      value: 'Conforme aux politiques par d\u00e9faut',
      description: 'Landing page highlight heading 1',
    },
    'landing.highlight.autoAdapts': {
      value: "S'adapte automatiquement par locataire",
      description: 'Landing page highlight heading 2',
    },
    'landing.highlight.launchReady': {
      value: 'Pr\u00eat au lancement en quelques jours',
      description: 'Landing page highlight heading 3',
    },
    'landing.highlight.fallback': {
      value: 'Capacit\u00e9 cl\u00e9',
      description: 'Fallback highlight heading',
    },
    'landing.socialProof.heading': {
      value: '\u00c9quipes utilisant ContractSpec',
      description: 'Social proof section heading',
    },
    'landing.socialProof.defaultQuote': {
      value:
        '\u00ab\u00a0Nous livrons des workflows conformes 5x plus vite tout en r\u00e9duisant de moiti\u00e9 les t\u00e2ches op\u00e9rationnelles.\u00a0\u00bb',
      description: 'Default social proof quote',
    },
    'landing.faq.policiesEnforced.heading': {
      value: 'Comment les politiques restent-elles appliqu\u00e9es\u00a0?',
      description: 'FAQ heading: policies enforced',
    },
    'landing.faq.policiesEnforced.body': {
      value:
        'Tous les workflows sont compil\u00e9s \u00e0 partir de sp\u00e9cifications TypeScript et passent par des v\u00e9rifications PDP avant ex\u00e9cution, emp\u00eachant toute logique non autoris\u00e9e.',
      description: 'FAQ body: policies enforced',
    },
    'landing.faq.existingStack.heading': {
      value: 'Est-ce compatible avec notre pile existante\u00a0?',
      description: 'FAQ heading: existing stack',
    },
    'landing.faq.existingStack.body': {
      value:
        'Les adaptateurs se connectent \u00e0 REST, GraphQL ou MCP. Les int\u00e9grations restent agnostiques vis-\u00e0-vis des fournisseurs.',
      description: 'FAQ body: existing stack',
    },
    'landing.faq.compliance.heading': {
      value: "Qu'en est-il des exigences de conformit\u00e9\u00a0?",
      description: 'FAQ heading: compliance requirements',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Social Posts
    // ═════════════════════════════════════════════════════════════════════════

    'social.cta.linkedin': {
      value: 'R\u00e9servez une d\u00e9mo de 15 min',
      description: 'LinkedIn post default CTA',
    },
    'social.cta.twitter': {
      value: '\u2192 contractspec.io/sandbox',
      description: 'Twitter post default CTA',
    },
    'social.body.threads': {
      value:
        'Ops + conformit\u00e9 peuvent avancer vite. {title} automatise les garde-fous pour que les \u00e9quipes livrent quotidiennement.',
      description: 'Threads post body template',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'social.body.twitter.connector': {
      value: ' en <60s. ',
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
      value: '{summary} \u2014 con\u00e7u pour {role}{industry}.',
      description: 'SEO meta description template',
      placeholders: [
        { name: 'summary', type: 'string' },
        { name: 'role', type: 'string' },
        { name: 'industry', type: 'string' },
      ],
    },
    'seo.offer.default': {
      value: 'Commencez \u00e0 construire avec ContractSpec',
      description: 'Default offer description for schema markup',
    },
    'seo.audience.industry': {
      value: ' dans le secteur {industry}',
      description: 'Audience industry suffix for SEO description',
      placeholders: [{ name: 'industry', type: 'string' }],
    },
  },
});
