import type { BenchmarkSource } from "../types";
import type { BenchmarkIngester } from "./types";
import { chatbotArenaIngester } from "./chatbot-arena";
import { artificialAnalysisIngester } from "./artificial-analysis";
import { sweBenchIngester } from "./swe-bench";
import { openLlmLeaderboardIngester } from "./open-llm-leaderboard";

/**
 * Registry of available benchmark ingesters.
 * Allows discovery and lookup by source key.
 */
export class IngesterRegistry {
  private ingesters = new Map<BenchmarkSource, BenchmarkIngester>();

  register(ingester: BenchmarkIngester): this {
    this.ingesters.set(ingester.source, ingester);
    return this;
  }

  get(source: BenchmarkSource): BenchmarkIngester | undefined {
    return this.ingesters.get(source);
  }

  list(): BenchmarkIngester[] {
    return Array.from(this.ingesters.values());
  }

  has(source: BenchmarkSource): boolean {
    return this.ingesters.has(source);
  }
}

/**
 * Pre-configured registry with all built-in ingesters.
 */
export function createDefaultIngesterRegistry(): IngesterRegistry {
  return new IngesterRegistry()
    .register(chatbotArenaIngester)
    .register(artificialAnalysisIngester)
    .register(sweBenchIngester)
    .register(openLlmLeaderboardIngester);
}
