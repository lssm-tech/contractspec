import { ZodSchemaType } from '@contractspec/lib.schema';
import * as z from 'zod';
import type {
  ContractPatchIntent,
  ContractSpecPatch,
  ImpactReport,
  InsightExtraction,
  OpportunityBrief,
  TaskPack,
} from './types';
import {
  ContractPatchIntentModel,
  ContractSpecPatchModel,
  ImpactReportModel,
  InsightExtractionModel,
  OpportunityBriefModel,
  TaskPackModel,
} from './types';

const ProductIntentSpecSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  meta: z.unknown().optional(),
  insights: InsightExtractionModel.getZod().optional(),
  brief: OpportunityBriefModel.getZod().optional(),
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
export interface ProductIntentSpec<Meta = unknown> {
  /**
   * A unique identifier for this product intent. This is used when
   * storing and retrieving specs from a registry or database.
   */
  id: string;

  /**
   * The question or goal that triggered the discovery process. For
   * example: "What should we build next to improve activation?".
   */
  question: string;

  /**
   * Optional metadata defined by the caller. Use this to store
   * application-specific context such as feature flags or user info.
   */
  meta?: Meta;

  /**
   * The extracted insights grounded in evidence.
   */
  insights?: InsightExtraction;

  /**
   * The synthesized opportunity brief explaining what to build and why.
   */
  brief?: OpportunityBrief;

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
export function defineProductIntentSpec<Meta = unknown>(
  spec: ProductIntentSpec<Meta>
): ProductIntentSpec<Meta> {
  return spec;
}
