import {
  BlogGenerator,
  EmailCampaignGenerator,
  LandingPageGenerator,
  SocialPostGenerator,
} from '@contractspec/lib.content-gen/generators';
import { SeoOptimizer } from '@contractspec/lib.content-gen/seo';
import type { ContentBrief } from '@contractspec/lib.content-gen';
import { Logger, LogLevel } from '@contractspec/lib.logger';
import type { LoggerConfig } from '@contractspec/lib.logger/types';

const logger = new Logger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  environment:
    (process.env.NODE_ENV as LoggerConfig['environment']) || 'development',
  enableColors: process.env.NODE_ENV !== 'production',
});

export async function runContentGenerationExample(): Promise<void> {
  const brief: ContentBrief = {
    title: 'AI-Native Operations Copilot',
    summary:
      'Automates support resolutions, growth playbooks, and DevOps rituals.',
    problems: [
      'Support queues pile up after hours',
      'Growth teams lack fresh experiments',
    ],
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
  const email = await new EmailCampaignGenerator().generate({
    brief,
    variant: 'announcement',
  });
  const social = await new SocialPostGenerator().generate(brief);
  const seo = new SeoOptimizer().optimize(brief);

  logger.info('Generated content assets', {
    blogIntro: blog.intro,
    landingHero: landing.hero,
    emailSubject: email.subject,
    socialPosts: social.map((post) => post.body),
    seo,
  });
}
