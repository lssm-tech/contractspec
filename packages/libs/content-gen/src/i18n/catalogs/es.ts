/**
 * Spanish (es) translation catalog for @contractspec/lib.content-gen.
 *
 * @module i18n/catalogs/es
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const esMessages = defineTranslation({
  meta: {
    key: 'content-gen.messages',
    version: '1.0.0',
    domain: 'content-gen',
    description: 'Spanish translations for the content-gen package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'es',
  fallback: 'en',
  messages: {
    // ═════════════════════════════════════════════════════════════════════════
    // LLM System Prompts
    // ═════════════════════════════════════════════════════════════════════════

    'prompt.blog.system': {
      value:
        'Eres un redactor de marketing de producto. Produce JSON con title, subtitle, intro, sections[].heading/body/bullets, outro.',
      description: 'Blog generator LLM system prompt',
    },
    'prompt.email.system': {
      value:
        'Redacta un correo de marketing de producto en JSON {subject, previewText, body, cta}.',
      description: 'Email generator LLM system prompt',
    },
    'prompt.landing.system': {
      value:
        'Escribe JSON para una p\u00e1gina de aterrizaje con hero/highlights/socialProof/faq.',
      description: 'Landing page generator LLM system prompt',
    },
    'prompt.social.system': {
      value:
        'Crea un array JSON de publicaciones sociales para twitter/linkedin/threads con body, hashtags, cta.',
      description: 'Social post generator LLM system prompt',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Blog Generator
    // ═════════════════════════════════════════════════════════════════════════

    'blog.intro': {
      value:
        'Equipos como {role} enfrentan {problems}. {title} cambia eso gracias a {summary}.',
      description: 'Blog post intro paragraph template',
      placeholders: [
        { name: 'role', type: 'string' },
        { name: 'problems', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'summary', type: 'string' },
      ],
    },
    'blog.heading.whyNow': {
      value: 'Por qu\u00e9 ahora',
      description: 'Blog section heading: why now',
    },
    'blog.heading.whatYouGet': {
      value: 'Lo que obtienes',
      description: 'Blog section heading: what you get',
    },
    'blog.heading.proofItWorks': {
      value: 'Prueba de que funciona',
      description: 'Blog section heading: proof it works',
    },
    'blog.body.whatYouGet': {
      value:
        'Una pila enfocada construida para la automatizaci\u00f3n segura con pol\u00edticas.',
      description: 'Blog section body: what you get',
    },
    'blog.body.proofItWorks': {
      value: 'Los equipos que usan el modelo reportan logros medibles.',
      description: 'Blog section body: proof it works',
    },
    'blog.metric.launchWorkflows': {
      value: 'Lanza flujos de trabajo en minutos',
      description: 'Default metric: launch workflows',
    },
    'blog.metric.cutReviewTime': {
      value: 'Reduce el tiempo de revisi\u00f3n en un 60\u00a0%',
      description: 'Default metric: cut review time',
    },
    'blog.outro.default': {
      value:
        '\u00bfListo para verlo en vivo? Lanza un sandbox en menos de 5 minutos.',
      description: 'Default blog outro / call to action',
    },
    'blog.whyNow': {
      value:
        'Los equipos de {audience} est\u00e1n atascados con {pains}. {title} ofrece barreras de protecci\u00f3n sin ralentizar las entregas.',
      description: 'Blog why-now section body template',
      placeholders: [
        { name: 'audience', type: 'string' },
        { name: 'pains', type: 'string' },
        { name: 'title', type: 'string' },
      ],
    },
    'blog.audience.industry': {
      value: ' en el sector {industry}',
      description: 'Audience industry suffix for blog why-now',
      placeholders: [{ name: 'industry', type: 'string' }],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Email Generator
    // ═════════════════════════════════════════════════════════════════════════

    'email.subject.announcement.launch': {
      value: 'Lanzamiento: {title}',
      description: 'Announcement email subject variant: launch',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.announcement.live': {
      value: '{title} ya est\u00e1 disponible',
      description: 'Announcement email subject variant: live',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.announcement.new': {
      value: 'Nuevo: {title}',
      description: 'Announcement email subject variant: new',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.onboarding.getStarted': {
      value: 'Empieza con {title}',
      description: 'Onboarding email subject variant: get started',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.onboarding.guide': {
      value: 'Tu gu\u00eda de {title}',
      description: 'Onboarding email subject variant: guide',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.nurture.speeds': {
      value: 'C\u00f3mo {title} acelera las operaciones',
      description: 'Nurture email subject variant: speeds ops',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.nurture.proof': {
      value: 'Prueba de que {title} funciona',
      description: 'Nurture email subject variant: proof',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.subject.fallback': {
      value: 'Actualizaci\u00f3n de {title}',
      description: 'Fallback email subject line',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.preview.defaultWin': {
      value: 'entregan m\u00e1s r\u00e1pido sin brechas de cumplimiento',
      description: 'Default win text for email preview',
    },
    'email.preview.template': {
      value: 'Descubre c\u00f3mo los equipos {win}.',
      description: 'Email preview text template',
      placeholders: [{ name: 'win', type: 'string' }],
    },
    'email.body.greeting': {
      value: 'Hola,',
      description: 'Email body greeting',
    },
    'email.body.reasons': {
      value: 'Principales razones por las que los equipos adoptan {title}:',
      description: 'Email body reasons intro',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.cta.sandbox': {
      value: 'Lanza un sandbox',
      description: 'Default CTA: spin up a sandbox',
    },
    'email.cta.explore': {
      value: 'Explora el sandbox',
      description: 'Default CTA: explore the sandbox',
    },
    'email.hook.announcement': {
      value: '{title} ya est\u00e1 disponible. {summary}',
      description: 'Announcement variant hook',
      placeholders: [
        { name: 'title', type: 'string' },
        { name: 'summary', type: 'string' },
      ],
    },
    'email.hook.onboarding': {
      value: 'Aqu\u00ed tienes tu siguiente paso para desbloquear {title}.',
      description: 'Onboarding variant hook',
      placeholders: [{ name: 'title', type: 'string' }],
    },
    'email.hook.nurture': {
      value:
        'Operadores como {role} siguen preguntando c\u00f3mo automatizar las verificaciones de cumplimiento. Esto es lo que funciona.',
      description: 'Nurture variant hook',
      placeholders: [{ name: 'role', type: 'string' }],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Landing Page
    // ═════════════════════════════════════════════════════════════════════════

    'landing.eyebrow.defaultIndustry': {
      value: 'Operaciones',
      description: 'Default industry for landing page eyebrow',
    },
    'landing.eyebrow.template': {
      value: 'Equipos de {industry}',
      description: 'Landing page eyebrow template',
      placeholders: [{ name: 'industry', type: 'string' }],
    },
    'landing.cta.primary': {
      value: 'Lanzar un sandbox',
      description: 'Landing page primary CTA',
    },
    'landing.cta.secondary': {
      value: 'Ver documentaci\u00f3n',
      description: 'Landing page secondary CTA',
    },
    'landing.highlight.policySafe': {
      value: 'Conforme a pol\u00edticas por defecto',
      description: 'Landing page highlight heading 1',
    },
    'landing.highlight.autoAdapts': {
      value: 'Se adapta autom\u00e1ticamente por inquilino',
      description: 'Landing page highlight heading 2',
    },
    'landing.highlight.launchReady': {
      value: 'Listo para lanzar en d\u00edas',
      description: 'Landing page highlight heading 3',
    },
    'landing.highlight.fallback': {
      value: 'Capacidad clave',
      description: 'Fallback highlight heading',
    },
    'landing.socialProof.heading': {
      value: 'Equipos que usan ContractSpec',
      description: 'Social proof section heading',
    },
    'landing.socialProof.defaultQuote': {
      value:
        '\u00ab\u00a0Entregamos flujos de trabajo conformes 5 veces m\u00e1s r\u00e1pido reduciendo a la mitad las tareas operativas.\u00a0\u00bb',
      description: 'Default social proof quote',
    },
    'landing.faq.policiesEnforced.heading': {
      value: '\u00bfC\u00f3mo se mantienen las pol\u00edticas aplicadas?',
      description: 'FAQ heading: policies enforced',
    },
    'landing.faq.policiesEnforced.body': {
      value:
        'Todos los flujos se compilan desde especificaciones TypeScript y pasan verificaciones PDP antes de ejecutarse, evitando l\u00f3gica no autorizada.',
      description: 'FAQ body: policies enforced',
    },
    'landing.faq.existingStack.heading': {
      value: '\u00bfEs compatible con nuestra pila existente?',
      description: 'FAQ heading: existing stack',
    },
    'landing.faq.existingStack.body': {
      value:
        'Los adaptadores se conectan a REST, GraphQL o MCP. Las integraciones son agnósticas respecto al proveedor.',
      description: 'FAQ body: existing stack',
    },
    'landing.faq.compliance.heading': {
      value: '\u00bfQu\u00e9 pasa con los requisitos de cumplimiento?',
      description: 'FAQ heading: compliance requirements',
    },

    // ═════════════════════════════════════════════════════════════════════════
    // Social Posts
    // ═════════════════════════════════════════════════════════════════════════

    'social.cta.linkedin': {
      value: 'Reserva una demo de 15 min',
      description: 'LinkedIn post default CTA',
    },
    'social.cta.twitter': {
      value: '\u2192 contractspec.io/sandbox',
      description: 'Twitter post default CTA',
    },
    'social.body.threads': {
      value:
        'Ops + cumplimiento pueden avanzar r\u00e1pido. {title} automatiza las barreras para que los equipos entreguen a diario.',
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
      value: '{summary} \u2014 dise\u00f1ado para {role}{industry}.',
      description: 'SEO meta description template',
      placeholders: [
        { name: 'summary', type: 'string' },
        { name: 'role', type: 'string' },
        { name: 'industry', type: 'string' },
      ],
    },
    'seo.offer.default': {
      value: 'Empieza a construir con ContractSpec',
      description: 'Default offer description for schema markup',
    },
    'seo.audience.industry': {
      value: ' en el sector {industry}',
      description: 'Audience industry suffix for SEO description',
      placeholders: [{ name: 'industry', type: 'string' }],
    },
  },
});
