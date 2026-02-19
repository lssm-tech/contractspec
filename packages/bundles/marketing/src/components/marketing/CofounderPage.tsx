'use client';

import { ButtonLink, MarketingSection } from '@contractspec/lib.design-system';
import { Box, HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import {
  H1,
  H2,
  H3,
  Lead,
  Muted,
  Small,
} from '@contractspec/lib.ui-kit-web/ui/typography';
import {
  Check,
  Clock,
  MapPin,
  MessageSquare,
  Percent,
  Rocket,
  Target,
  Users,
  X,
} from 'lucide-react';

const COFOUNDER_EMAIL = 'tboutron@contractspec.io';
const APPLY_SUBJECT = 'Co-founder application: ContractSpec';
const APPLY_BODY = `Hi Theo,

I am reaching out about co-founding ContractSpec.

LinkedIn: [your link]
Proof of work #1: [link]
Proof of work #2: [link]

Why ContractSpec:
[your answer]

What I would own in the first 90 days:
[your answer]
`;

const mailtoLink = `mailto:${COFOUNDER_EMAIL}?subject=${encodeURIComponent(APPLY_SUBJECT)}&body=${encodeURIComponent(APPLY_BODY)}`;

/* -------------------------------------------------------------------------- */
/*                              Section Components                            */
/* -------------------------------------------------------------------------- */

function HeroSection() {
  return (
    <MarketingSection tone="gradient" padding="spacious" align="center">
      <VStack gap="lg" align="center" className="text-center">
        <H1 className="text-4xl leading-tight font-bold text-balance md:text-5xl">
          Co-founder wanted
        </H1>
        <Lead className="text-muted-foreground max-w-2xl text-lg text-balance md:text-xl">
          ContractSpec is a contract-first compiler for AI-generated code.
          Define specs, enforce policies, regenerate safely. Pre-PMF. Building
          in public.
        </Lead>
        <HStack gap="md" justify="center" wrap="wrap" className="pt-2">
          <ButtonLink href={mailtoLink}>Talk about co-founding</ButtonLink>
          <ButtonLink variant="ghost" href="/contact">
            Become a design partner
          </ButtonLink>
        </HStack>
      </VStack>
    </MarketingSection>
  );
}

function WhatExistsSection() {
  const realNow = [
    'ContractSpec Core: open-source spec compiler',
    'Working CLI and TypeScript runtime',
    'Design partner pipeline open',
    'Solo founder, bootstrapped',
  ];

  const planned = [
    'ContractSpec Studio product-decision engine',
    'Auto-evolution engine',
    'Multi-tenant SaaS',
    'Integration marketplace',
  ];

  return (
    <MarketingSection padding="comfortable" align="center" maxWidth="lg">
      <VStack gap="lg">
        <H2 className="text-3xl font-bold">What exists today</H2>
        <div className="grid w-full gap-8 md:grid-cols-2">
          <VStack gap="sm" align="start">
            <H3 className="text-lg font-semibold text-emerald-400">Real now</H3>
            <ul className="space-y-2">
              {realNow.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check size={16} className="mt-1 shrink-0 text-emerald-400" />
                  <Small>{item}</Small>
                </li>
              ))}
            </ul>
          </VStack>
          <VStack gap="sm" align="start">
            <H3 className="text-lg font-semibold text-blue-400">Planned</H3>
            <ul className="space-y-2">
              {planned.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Target size={16} className="mt-1 shrink-0 text-blue-400" />
                  <Small>{item}</Small>
                </li>
              ))}
            </ul>
          </VStack>
        </div>
      </VStack>
    </MarketingSection>
  );
}

function RoleSection() {
  const gtmDeliverables = [
    'Run 5+ sales conversations per week',
    'Own the design partner pipeline end-to-end',
    'Write positioning copy that ships',
    'Build and maintain partnership channels',
    'Turn user feedback into roadmap signal',
  ];

  const productDeliverables = [
    'Ship UI/UX improvements weekly',
    'Define specs based on user research',
    'Own the Studio product experience',
    'Collaborate on architecture decisions',
  ];

  return (
    <MarketingSection
      // tone="subtle"
      padding="comfortable"
      align="center"
      maxWidth="lg"
    >
      <VStack gap="lg">
        <H2 className="text-3xl font-bold">The role</H2>
        <VStack gap="md" align="start" className="w-full">
          <H3 className="text-xl font-semibold">
            Option A: GTM / Sales / Partnerships
          </H3>
          <Muted>Weekly deliverables, not vague traits:</Muted>
          <ul className="space-y-2">
            {gtmDeliverables.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Rocket size={16} className="mt-1 shrink-0 text-amber-400" />
                <Small>{item}</Small>
              </li>
            ))}
          </ul>
        </VStack>
        <VStack gap="md" align="start" className="w-full pt-4">
          <H3 className="text-xl font-semibold">Option B: Product / Design</H3>
          <Muted>If this is your strength:</Muted>
          <ul className="space-y-2">
            {productDeliverables.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Rocket size={16} className="mt-1 shrink-0 text-purple-400" />
                <Small>{item}</Small>
              </li>
            ))}
          </ul>
        </VStack>
      </VStack>
    </MarketingSection>
  );
}

function IdealCofounderSection() {
  const qualities = [
    "You have shipped products people paid for — links or it didn't happen",
    'You have sold something (product, consulting, yourself)',
    'You write clearly and fast — emails, docs, copy',
    'You have taste: you know good UX when you see it',
    'You can work 6+ months without a salary',
    'You are allergic to meetings that could be docs',
    'You have built in public or contributed to open source',
    'You are based in Europe or overlap significantly with CET',
  ];

  return (
    <MarketingSection padding="comfortable" align="center" maxWidth="lg">
      <VStack gap="lg">
        <H2 className="text-3xl font-bold">The ideal co-founder</H2>
        <ul className="space-y-3">
          {qualities.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check size={16} className="mt-1 shrink-0 text-emerald-400" />
              <Small>{item}</Small>
            </li>
          ))}
        </ul>
        <Box className="border-border mt-4 rounded-lg border p-4">
          <VStack gap="sm" align="start">
            <H3 className="text-lg font-semibold">Proof of work examples</H3>
            <Muted className="text-sm">
              GitHub profile, shipped product, writing (blog/Twitter/essays),
              revenue screenshot, open-source contributions, or anything that
              shows you execute.
            </Muted>
          </VStack>
        </Box>
      </VStack>
    </MarketingSection>
  );
}

function WhatYouGetSection() {
  const benefits = [
    {
      icon: <Percent size={20} className="text-emerald-400" />,
      title: 'Equity-first',
      desc: 'Meaningful co-founder equity. Salary is minimal/zero until revenue covers it.',
    },
    {
      icon: <Users size={20} className="text-blue-400" />,
      title: 'Real ownership',
      desc: 'You own your domain. No permission-seeking. Ship and iterate.',
    },
    {
      icon: <MessageSquare size={20} className="text-amber-400" />,
      title: 'Written-first decisions',
      desc: 'We default to async, docs, and fast decisions. Meetings are last resort.',
    },
  ];

  const values = [
    'Contracts over conventions',
    'Clarity over cleverness',
    'Safety over speed (in code)',
    'Leverage over labor',
  ];

  return (
    <MarketingSection
      // tone="subtle"
      padding="comfortable"
      align="center"
      maxWidth="lg"
    >
      <VStack gap="lg">
        <H2 className="text-3xl font-bold">What you get</H2>
        <div className="grid w-full gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <VStack
              key={b.title}
              gap="sm"
              align="start"
              className="border-border rounded-lg border p-4"
            >
              {b.icon}
              <H3 className="text-lg font-semibold">{b.title}</H3>
              <Muted className="text-sm">{b.desc}</Muted>
            </VStack>
          ))}
        </div>
        <VStack gap="sm" align="start" className="w-full pt-4">
          <H3 className="text-lg font-semibold">Our values</H3>
          <HStack gap="sm" wrap="wrap">
            {values.map((v) => (
              <Box
                key={v}
                className="border-border rounded-full border px-3 py-1 text-sm"
              >
                {v}
              </Box>
            ))}
          </HStack>
        </VStack>
      </VStack>
    </MarketingSection>
  );
}

function RedFlagsSection() {
  const redFlags = [
    'Needs a big salary now',
    'Hates selling or talking to users',
    'Vague about past execution',
    'Wants to "advise" instead of build',
    'Needs a big team to feel productive',
    'Cannot write clearly',
  ];

  return (
    <MarketingSection padding="comfortable" align="center" maxWidth="lg">
      <VStack gap="lg">
        <H2 className="text-3xl font-bold">Non-negotiables / red flags</H2>
        <Muted>If any of these apply, this is not the right fit:</Muted>
        <ul className="space-y-2">
          {redFlags.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <X size={16} className="mt-1 shrink-0 text-red-400" />
              <Small>{item}</Small>
            </li>
          ))}
        </ul>
      </VStack>
    </MarketingSection>
  );
}

function FAQSection() {
  const faqs = [
    {
      icon: <Users size={18} />,
      q: 'Why co-founder instead of hiring?',
      a: "I need a partner who thinks like an owner, not an employee. Someone who will stay when things get hard and share in the upside when they don't.",
    },
    {
      icon: <Clock size={18} />,
      q: 'What is the timeline to revenue?',
      a: 'Design partners are converting now. Goal: paying customers in 2025. But this is startup life — timelines are best guesses.',
    },
    {
      icon: <MapPin size={18} />,
      q: 'Is this remote?',
      a: 'Yes. Async-first. Occasional in-person (Paris-based) for planning. Europe timezone overlap strongly preferred.',
    },
    {
      icon: <Percent size={18} />,
      q: 'How much equity?',
      a: 'Depends on what you bring, when you join, and how much you can commit. Expect meaningful co-founder equity with 4-year vesting. We will discuss specifics in person.',
    },
  ];

  return (
    <MarketingSection
      // tone="subtle"
      padding="comfortable"
      align="center"
      maxWidth="lg"
    >
      <VStack gap="lg">
        <H2 className="text-3xl font-bold">FAQ</H2>
        <VStack gap="md" className="w-full">
          {faqs.map((faq) => (
            <VStack
              key={faq.q}
              gap="xs"
              align="start"
              className="border-border w-full rounded-lg border p-4"
            >
              <HStack gap="sm" align="center">
                <span className="text-muted-foreground">{faq.icon}</span>
                <H3 className="text-lg font-semibold">{faq.q}</H3>
              </HStack>
              <Muted>{faq.a}</Muted>
            </VStack>
          ))}
        </VStack>
      </VStack>
    </MarketingSection>
  );
}

function FinalCtaSection() {
  return (
    <MarketingSection
      tone="gradient"
      padding="comfortable"
      align="center"
      maxWidth="lg"
    >
      <VStack gap="md" align="center" className="text-center">
        <H2 className="text-3xl font-bold md:text-4xl">Ready to talk?</H2>
        <Lead className="text-muted-foreground max-w-xl">
          Send an email with: your LinkedIn, 2 proof-of-work links, why
          ContractSpec, and what you would own in the first 90 days.
        </Lead>
        <HStack gap="md" justify="center" wrap="wrap" className="pt-2">
          <ButtonLink href={mailtoLink}>Talk about co-founding</ButtonLink>
          <ButtonLink variant="ghost" href="/contact">
            Become a design partner
          </ButtonLink>
        </HStack>
        <Muted className="pt-4 text-sm">
          CHAMAN VENTURES, SASU · RCS Paris · SIREN 989 498 902 · 229 rue
          Saint-Honoré, 75001 Paris
        </Muted>
      </VStack>
    </MarketingSection>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */

export function CofounderPage() {
  return (
    <VStack as="main" gap="none">
      <HeroSection />
      <WhatExistsSection />
      <RoleSection />
      <IdealCofounderSection />
      <WhatYouGetSection />
      <RedFlagsSection />
      <FAQSection />
      <FinalCtaSection />
    </VStack>
  );
}
