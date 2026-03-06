import type { BenchmarkResult } from "../types";
import { normalizeScore } from "../scoring/normalizer";
import type { BenchmarkIngester, IngesterOptions } from "./types";
import { fetchWithRetry, parseJsonSafe } from "./fetch-utils";

const DEFAULT_ARENA_URL =
  "https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard/resolve/main/results.json";

interface ArenaEntry {
  key: string;
  Model: string;
  "Arena Elo rating": number;
  Organization: string;
  License: string;
}

/**
 * Ingests Chatbot Arena (LMSYS) Elo ratings.
 *
 * Maps Elo ratings to the "reasoning" dimension since Arena
 * measures general conversational/reasoning ability.
 */
export const chatbotArenaIngester: BenchmarkIngester = {
  source: "chatbot-arena",
  displayName: "Chatbot Arena (LMSYS)",
  description: "Elo ratings from the LMSYS Chatbot Arena human preference leaderboard.",

  async ingest(options?: IngesterOptions): Promise<BenchmarkResult[]> {
    if (options?.dimensions?.length && !options.dimensions.includes("reasoning")) {
      return [];
    }

    const url = options?.sourceUrl ?? DEFAULT_ARENA_URL;
    const response = await fetchWithRetry(url, { fetch: options?.fetch });
    const text = await response.text();
    const data = parseJsonSafe<ArenaEntry[]>(text, "Chatbot Arena");
    const now = new Date();

    let entries = data.filter(
      (entry) => entry["Arena Elo rating"] != null && entry.Model,
    );

    if (options?.modelFilter?.length) {
      const filterSet = new Set(options.modelFilter);
      entries = entries.filter((e) => filterSet.has(e.key ?? e.Model));
    }

    if (options?.maxResults) {
      entries = entries.slice(0, options.maxResults);
    }

    let results = entries.map((entry): BenchmarkResult => {
      const elo = entry["Arena Elo rating"];
      const modelId = entry.key ?? entry.Model.toLowerCase().replace(/\s+/g, "-");
      const org = entry.Organization?.toLowerCase() ?? "unknown";

      return {
        id: `chatbot-arena:${modelId}:reasoning`,
        modelId,
        providerKey: mapOrganizationToProvider(org),
        source: "chatbot-arena",
        dimension: "reasoning",
        score: normalizeScore(elo, "chatbot-arena"),
        rawScore: elo,
        metadata: {
          organization: entry.Organization,
          license: entry.License,
        },
        measuredAt: now,
        ingestedAt: now,
      };
    });

    if (options?.fromDate) {
      results = results.filter((r) => r.measuredAt >= options.fromDate!);
    }
    if (options?.toDate) {
      results = results.filter((r) => r.measuredAt <= options.toDate!);
    }

    return results;
  },
};

function mapOrganizationToProvider(org: string): string {
  const normalized = org.toLowerCase();
  if (normalized.includes("openai")) return "openai";
  if (normalized.includes("anthropic")) return "anthropic";
  if (normalized.includes("google") || normalized.includes("deepmind")) return "gemini";
  if (normalized.includes("mistral")) return "mistral";
  if (normalized.includes("meta")) return "meta";
  if (normalized.includes("cohere")) return "cohere";
  return org;
}
