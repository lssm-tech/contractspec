// ---------------------------------------------------------------------------
// Generate Narration -- Use ScriptGenerator to produce narration for tutorials
// ---------------------------------------------------------------------------

import { ScriptGenerator } from '@contractspec/lib.video-gen/generators/script-generator';
import type { NarrationScript } from '@contractspec/lib.video-gen/generators/script-generator';
import type { NarrationConfig } from '@contractspec/lib.contracts-integrations/integrations/providers/video';
import type { CliTutorial } from './sample-tutorials';

/** Options for narration generation. */
export interface GenerateNarrationOptions {
  /** Narration style. Default: "technical". */
  style?: NarrationConfig['style'];
}

/**
 * Generate a narration script for a single CLI tutorial.
 *
 * Uses the deterministic ScriptGenerator (no LLM) to produce
 * narration text from the tutorial's content brief.
 *
 * @example
 * ```ts
 * import { generateTutorialNarration } from "@contractspec/example.video-docs-terminal/generate-narration";
 * import { buildTutorial } from "@contractspec/example.video-docs-terminal/sample-tutorials";
 *
 * const narration = await generateTutorialNarration(buildTutorial);
 * console.log(narration.fullText);
 * console.log(narration.estimatedDurationSeconds); // ~12s
 * ```
 */
export async function generateTutorialNarration(
  tutorial: CliTutorial,
  options?: GenerateNarrationOptions
): Promise<NarrationScript> {
  const generator = new ScriptGenerator();
  const style = options?.style ?? 'technical';

  return generator.generate(tutorial.brief, { enabled: true, style });
}

/**
 * Generate narration scripts for all tutorials in a suite.
 *
 * Returns a map of tutorial ID → narration script, useful for
 * aligning narration with the multi-scene video project.
 *
 * @example
 * ```ts
 * import { generateSuiteNarration } from "@contractspec/example.video-docs-terminal/generate-narration";
 * import { allTutorials } from "@contractspec/example.video-docs-terminal/sample-tutorials";
 *
 * const narrations = await generateSuiteNarration(allTutorials);
 * // narrations.get("init")?.fullText — narration for the init tutorial
 * // narrations.get("build")?.fullText — narration for the build tutorial
 * ```
 */
export async function generateSuiteNarration(
  tutorials: CliTutorial[],
  options?: GenerateNarrationOptions
): Promise<Map<string, NarrationScript>> {
  const results = await Promise.all(
    tutorials.map(async (tutorial) => {
      const script = await generateTutorialNarration(tutorial, options);
      return [tutorial.id, script] as const;
    })
  );

  return new Map(results);
}
