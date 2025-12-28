# @contractspec/lib.content-gen

Website: https://contractspec.io/


Composable generators that turn ContractSpec briefs, specs, and telemetry into publish-ready marketing artifacts: blogs, landing pages, SEO metadata, email drips, and social posts.

## Modules

- `BlogGenerator` – creates narrative posts from feature briefs and spec metadata.
- `LandingPageGenerator` – builds hero copy, feature bullets, proof points, and CTAs.
- `EmailCampaignGenerator` – drafts onboarding, announcement, and nurture emails.
- `SocialPostGenerator` – outputs multi-channel snippets with hashtags and CTAs.
- `SeoOptimizer` – extracts keywords, meta tags, slugs, and Schema.org markup.

Each generator accepts a `ContentBrief` that captures audience, value props, proof points, and compliance notes. If an `LLMProvider` is supplied, outputs blend AI creativity with deterministic templates; otherwise a deterministic fallback ensures consistent copy.

## Quickstart

```ts
import {
  BlogGenerator,
  LandingPageGenerator,
  EmailCampaignGenerator,
  SocialPostGenerator,
} from '@contractspec/lib.content-gen/generators';
import { SeoOptimizer } from '@contractspec/lib.content-gen/seo';

const brief = {
  title: 'Policy-safe Workflow Automation',
  summary: 'Automatically compiles intents into auditable workflows.',
  problems: ['Manual reviews slow compliance', 'Engineers rebuild flows for every tenant'],
  solutions: ['Spec-first workflows', 'Policy enforcement', 'Multi-tenant guardrails'],
  audience: { role: 'COO', industry: 'Fintech', maturity: 'scaleup' },
};

const blog = await new BlogGenerator().generate(brief);
const landing = await new LandingPageGenerator().generate(brief);
const email = await new EmailCampaignGenerator().generate({ brief, variant: 'announcement' });
const social = await new SocialPostGenerator().generate(brief);
const seo = new SeoOptimizer().optimize(brief);
```

Outputs return structured blocks that can be rendered directly in the marketing site or exported to CMS tools.
