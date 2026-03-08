import { streamText, tool } from "ai";
import { z } from "zod";

export async function planIssueWorkbenchPatch(prompt: string, currentPlan: unknown) {
  return streamText({
    model: "openai/gpt-5.2",
    prompt,
    tools: {
      getCurrentSurfaceSummary: tool({
        description: "Return the current surface plan summary.",
        inputSchema: z.object({}),
        execute: async () => currentPlan,
      }),
      proposeSurfacePatch: tool({
        description: "Return a list of schema-valid patch operations.",
        inputSchema: z.object({
          ops: z.array(
            z.object({
              op: z.string(),
              slotId: z.string().optional(),
              nodeId: z.string().optional(),
              layoutId: z.string().optional(),
            })
          ),
        }),
        execute: async ({ ops }) => ({ accepted: true, ops }),
      }),
    },
  });
}
