import {
  BlogGenerator,
  LandingPageGenerator,
  EmailCampaignGenerator,
  SocialPostGenerator,
} from '@lssm/lib.content-gen/generators';
import { SeoOptimizer } from '@lssm/lib.content-gen/seo';
import type { ContentBrief } from '@lssm/lib.content-gen';

async function main() {
  const brief: ContentBrief = {
    title: 'AI-Native Operations Copilot',
    summary: 'Automates support resolutions, growth playbooks, and DevOps rituals.',
    problems: ['Support queues pile up after hours', 'Growth teams lack fresh experiments'],
    solutions: [
      'Stateful AI agents grounded in your knowledge spaces',
      'CI-safe approval workflows for human review',
      'Analytics + experimentation stack built into ContractSpec',
    ],
    metrics: ['80% auto-resolution rate', '10+ experiments shipped weekly'],
    audience: { role: 'COO', industry: 'Fintech', maturity: 'scaleup' },
    callToAction: 'Book a 15‑minute pilot run',
  };

  const blog = await new BlogGenerator().generate(brief);
  const landing = await new LandingPageGenerator().generate(brief);
  const email = await new EmailCampaignGenerator().generate({ brief, variant: 'announcement' });
  const social = await new SocialPostGenerator().generate(brief);
  const seo = new SeoOptimizer().optimize(brief);

  console.log('Blog intro:', blog.intro);
  console.log('Landing hero:', landing.hero);
  console.log('Email subject:', email.subject);
  console.log('Social posts:', social.map((post) => post.body));
  console.log('SEO metadata:', seo);
}

main();
