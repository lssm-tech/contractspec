import { ZodSchemaType } from '@contractspec/lib.schema';
import * as z from 'zod';
import type { OwnerShipMeta } from '../ownership';
import { StabilityEnum } from '../ownership';
import type {
  ContractPatchIntent,
  ContractSpecPatch,
  EvidenceFindingExtraction,
  ImpactReport,
  InsightExtraction,
  OpportunityBrief,
  ProblemGrouping,
  TaskPack,
  TicketCollection,
} from './types';
import {
  ContractPatchIntentModel,
  ContractSpecPatchModel,
  EvidenceFindingExtractionModel,
  ImpactReportModel,
  InsightExtractionModel,
  OpportunityBriefModel,
  ProblemGroupingModel,
  TaskPackModel,
  TicketCollectionModel,
} from './types';

const ProductIntentMetaSchema = z.object({
  key: z.string().min(1),
  version: z.string().min(1),
  description: z.string().min(1),
  stability: z.nativeEnum(StabilityEnum),
  owners: z.array(z.string().min(1)),
  tags: z.array(z.string().min(1)),
  title: z.string().min(1).optional(),
  domain: z.string().min(1).optional(),
  docId: z.array(z.string().min(1)).optional(),
  goal: z.string().min(1).optional(),
  context: z.string().min(1).optional(),
});

const ProductIntentSpecSchema = z.object({
  id: z.string().min(1),
  meta: ProductIntentMetaSchema,
  question: z.string().min(1),
  runtimeContext: z.unknown().optional(),
  findings: EvidenceFindingExtractionModel.getZod().optional(),
  insights: InsightExtractionModel.getZod().optional(),
  problems: ProblemGroupingModel.getZod().optional(),
  brief: OpportunityBriefModel.getZod().optional(),
  tickets: TicketCollectionModel.getZod().optional(),
  patchIntent: ContractPatchIntentModel.getZod().optional(),
  patch: ContractSpecPatchModel.getZod().optional(),
  impact: ImpactReportModel.getZod().optional(),
  tasks: TaskPackModel.getZod().optional(),
});

export const ProductIntentSpecModel = new ZodSchemaType(
  ProductIntentSpecSchema,
  {
    name: 'ProductIntentSpec',
  }
);

export type ProductIntentSpecData = z.infer<typeof ProductIntentSpecSchema>;

/**
 * A ProductIntentSpec describes the contract for a single product
 * opportunity. It ties together the question being asked, the
 * resulting brief, the proposed patch intent, the concrete patch, the
 * impact report and the tasks required to implement it. This interface
 * is intentionally flexible so that different implementations can fill
 * in the pieces as they become available.
 */
export interface ProductIntentMeta extends OwnerShipMeta {
  goal?: string;
  context?: string;
}

export interface ProductIntentSpec<Context = unknown> {
  /**
   * A unique identifier for this product intent. This is used when
   * storing and retrieving specs from a registry or database.
   */
  id: string;

  /**
   * Contract metadata for registry and ownership tracking.
   */
  meta: ProductIntentMeta;

  /**
   * The question or goal that triggered the discovery process. For
   * example: "What should we build next to improve activation?".
   */
  question: string;

  /**
   * Optional runtime context defined by the caller.
   */
  runtimeContext?: Context;

  /**
   * The extracted insights grounded in evidence.
   */
  insights?: InsightExtraction;

  /**
   * The evidence findings extracted from transcripts.
   */
  findings?: EvidenceFindingExtraction;

  /**
   * Grouped problem statements linked to evidence findings.
   */
  problems?: ProblemGrouping;

  /**
   * The synthesized opportunity brief explaining what to build and why.
   */
  brief?: OpportunityBrief;

  /**
   * Tickets derived from the problems and evidence findings.
   */
  tickets?: TicketCollection;

  /**
   * The intermediate patch intent derived from the brief. This is
   * converted into an actual ContractSpec patch by the runtime.
   */
  patchIntent?: ContractPatchIntent;

  /**
   * The concrete patch to apply to the ContractSpec. Produced by
   * translating the patch intent into your spec format.
   */
  patch?: ContractSpecPatch;

  /**
   * The impact report describing consequences of applying the patch.
   */
  impact?: ImpactReport;

  /**
   * The task pack enumerating discrete work items to implement the patch.
   */
  tasks?: TaskPack;
}

/**
 * Helper to define a ProductIntentSpec with proper type inference.
 */
export function defineProductIntentSpec<Context = unknown>(
  spec: ProductIntentSpec<Context>
): ProductIntentSpec<Context> {
  return spec;
}
