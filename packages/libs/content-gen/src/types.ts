import type { LLMProvider } from '@contractspec/lib.contracts-integrations';
import type { ModelSelector, ModelSelectionContext } from '@contractspec/lib.ai-providers/selector-types';

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
  references?: { label: string; url: string }[];
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
  /** Locale for generated content and LLM prompts (defaults to "en") */
  locale?: string;
  /** Ranking-driven model selector for dynamic model routing */
  modelSelector?: ModelSelector;
  /** Per-call selection context override */
  selectionContext?: ModelSelectionContext;
  /** Transport mode for the LLM provider. */
  transport?: "rest" | "mcp" | "sdk";
  /** Auth method for the LLM provider. */
  authMethod?: "api-key" | "oauth2" | "bearer";
  /** Custom auth headers for the LLM provider. */
  authHeaders?: Record<string, string>;
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
