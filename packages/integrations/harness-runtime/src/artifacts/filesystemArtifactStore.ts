import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { HarnessArtifactStore, HarnessStoredArtifact } from "../types";

function extensionFor(contentType: string | undefined) {
  if (contentType?.includes("json")) return "json";
  if (contentType?.includes("html")) return "html";
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("plain")) return "txt";
  return "bin";
}

export class FilesystemHarnessArtifactStore implements HarnessArtifactStore {
  private readonly items = new Map<string, HarnessStoredArtifact>();

  constructor(private readonly outputDir: string) {}

  async put(artifact: HarnessStoredArtifact) {
    const runDir = join(this.outputDir, artifact.runId);
    await mkdir(runDir, { recursive: true });
    const ext = extensionFor(artifact.contentType);
    const filepath = join(runDir, `${artifact.artifactId}.${ext}`);
    await writeFile(filepath, this.serializeBody(artifact.body));
    const stored = {
      ...artifact,
      uri: filepath,
    };
    this.items.set(stored.artifactId, stored);
    return stored;
  }

  async get(artifactId: string) {
    return this.items.get(artifactId);
  }

  async list(query: { runId?: string; stepId?: string; kind?: string } = {}) {
    return [...this.items.values()].filter((artifact) => {
      if (query.runId && artifact.runId !== query.runId) return false;
      if (query.stepId && artifact.stepId !== query.stepId) return false;
      if (query.kind && artifact.kind !== query.kind) return false;
      return true;
    });
  }

  private serializeBody(body: unknown) {
    if (Buffer.isBuffer(body)) return body;
    if (typeof body === "string") return body;
    return JSON.stringify(body ?? null, null, 2);
  }
}
