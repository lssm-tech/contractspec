import type { LLMProvider } from '@lssm/lib.contracts/integrations/providers/llm';

export interface AudienceProfile {
  role: string;
  industry?: string;
  region?: string;
  maturity?: 'early' | 'scaleup' | 'enterprise';
  painPoints?: string[];
}

export interface ContentBrief {
  title: string;
  summary: string;
  problems: string[];
  solutions: string[];
  metrics?: string[];
  proofPoints?: string[];
  complianceNotes?: string[];
  audience: AudienceProfile;
  callToAction?: string;
  references?: Array<{ label: string; url: string }>;
}

export interface ContentBlock {
  heading: string;
  body: string;
  bullets?: string[];
  cta?: string;
}

export interface GeneratedContent {
  title: string;
  subtitle?: string;
  intro: string;
  sections: ContentBlock[];
  outro?: string;
}

export interface GeneratorOptions {
  llm?: LLMProvider;
  model?: string;
  temperature?: number;
}

export interface EmailCampaignBrief {
  brief: ContentBrief;
  variant: 'announcement' | 'onboarding' | 'nurture';
  cadenceDay?: number;
}

export interface EmailDraft {
  subject: string;
  previewText: string;
  body: string;
  cta: string;
  variant: EmailCampaignBrief['variant'];
}

export interface SocialPost {
  channel: 'twitter' | 'linkedin' | 'threads';
  body: string;
  hashtags: string[];
  cta?: string;
  link?: string;
}

export interface SeoMetadata {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
  schemaMarkup: Record<string, unknown>;
}
