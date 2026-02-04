import type {
  OpportunityBrief,
  ContractPatchIntent,
  ImpactReport,
  TaskPack,
  ContractSpecPatch,
} from "./types";

/**
 * A ProductIntentSpec describes the contract for a single product
 * opportunity. It ties together the question being asked,
 * the resulting brief, the proposed patch intent, the concrete patch,
 * the impact report and the tasks required to implement it. This
 * interface is intentionally flexible so that different
 * implementations (e.g. hackathon prototypes, production systems)
 * can fill in the pieces as they become available.
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
   * application‑specific context such as feature flags or user info.
   */
  meta?: Meta;

  /**
   * The synthesised opportunity brief explaining what to build and why.
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
 * Helper to define a ProductIntentSpec with proper type inference. This
 * function simply returns the input spec but forces the generic
 * parameter Meta to be inferred correctly in downstream code.
 */
export function defineProductIntentSpec<Meta = unknown>(spec: ProductIntentSpec<Meta>): ProductIntentSpec<Meta> {
  return spec;
}
