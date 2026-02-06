import { ZodSchemaType } from '@contractspec/lib.schema';
import * as z from 'zod';
import { CitationModel } from './insights';

const ImpactDirectionSchema = z.enum(['up', 'down']);
export type ImpactDirection = z.infer<typeof ImpactDirectionSchema>;

const OpportunityConfidenceSchema = z.enum(['low', 'medium', 'high']);
export type OpportunityConfidence = z.infer<typeof OpportunityConfidenceSchema>;

const CitedTextBlockSchema = z.object({
  text: z.string().min(1),
  citations: z.array(CitationModel.getZod()),
});

export const CitedTextBlockModel = new ZodSchemaType(CitedTextBlockSchema, {
  name: 'CitedTextBlock',
});

export type CitedTextBlock = z.infer<typeof CitedTextBlockSchema>;

const RiskSchema = z.object({
  text: z.string().min(1),
  citations: z.array(CitationModel.getZod()).optional(),
});

export const RiskModel = new ZodSchemaType(RiskSchema, {
  name: 'Risk',
});

export type Risk = z.infer<typeof RiskSchema>;

const ExpectedImpactSchema = z.object({
  metric: z.string().min(1),
  direction: ImpactDirectionSchema,
  magnitudeHint: z.string().min(1).optional(),
  timeframeHint: z.string().min(1).optional(),
});

export const ExpectedImpactModel = new ZodSchemaType(ExpectedImpactSchema, {
  name: 'ExpectedImpact',
});

export type ExpectedImpact = z.infer<typeof ExpectedImpactSchema>;

const OpportunityBriefSchema = z.object({
  opportunityId: z.string().min(1),
  title: z.string().min(1),
  problem: CitedTextBlockSchema,
  who: CitedTextBlockSchema,
  proposedChange: CitedTextBlockSchema,
  expectedImpact: ExpectedImpactSchema,
  confidence: OpportunityConfidenceSchema,
  risks: z.array(RiskSchema).optional(),
});

export const OpportunityBriefModel = new ZodSchemaType(OpportunityBriefSchema, {
  name: 'OpportunityBrief',
});

export type OpportunityBrief = z.infer<typeof OpportunityBriefSchema>;
