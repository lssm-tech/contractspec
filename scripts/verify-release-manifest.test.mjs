import { afterEach, describe, expect, it } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { verifyReleaseManifest } from "./verify-release-manifest.js";

const tempDirs = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    fs.rmSync(tempDirs.pop(), { recursive: true, force: true });
  }
});

function createTempDir(prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function createManifest() {
  return {
    version: "1.0.0",
    generatedAt: "2026-03-19T21:10:09.578Z",
    npmTag: "latest",
    dryRun: false,
    packages: [
      {
        name: "@contractspec/lib.surface-runtime",
        version: "1.2.3",
        distTag: "latest",
        status: "published",
      },
    ],
  };
}

describe("verifyReleaseManifest", () => {
  it("retries transient npm registry failures before succeeding", async () => {
    const dir = createTempDir("contractspec-release-manifest-");
    const manifestPath = path.join(dir, "release-manifest.json");
    const waits = [];
    const warnings = [];
    let attempts = 0;

    writeJson(manifestPath, createManifest());

    await expect(
      verifyReleaseManifest({
        manifestPath,
        retryCount: 2,
        retryDelayMs: 25,
        sleep: async (delayMs) => {
          waits.push(delayMs);
        },
        log: (message) => {
          warnings.push(message);
        },
        runCommand: () => {
          attempts += 1;
          if (attempts < 3) {
            return {
              status: 1,
              stdout: "",
              stderr:
                "npm error code ECONNRESET\nnpm error network Invalid response body while trying to fetch https://registry.npmjs.org/@contractspec%2flib.surface-runtime: aborted\n",
            };
          }
          return {
            status: 0,
            stdout: "{\"latest\":\"1.2.3\"}\n",
            stderr: "",
          };
        },
      })
    ).resolves.toBeUndefined();

    expect(attempts).toBe(3);
    expect(waits).toEqual([25, 50]);
    expect(warnings).toEqual([
      "[release:verify] Transient npm registry error for @contractspec/lib.surface-runtime; retry 1/2 in 25ms.",
      "[release:verify] Transient npm registry error for @contractspec/lib.surface-runtime; retry 2/2 in 50ms.",
    ]);
  });

  it("fails immediately for non-retryable npm errors", async () => {
    const dir = createTempDir("contractspec-release-manifest-");
    const manifestPath = path.join(dir, "release-manifest.json");
    let attempts = 0;

    writeJson(manifestPath, createManifest());

    await expect(
      verifyReleaseManifest({
        manifestPath,
        retryCount: 3,
        sleep: async () => {},
        log: () => {},
        runCommand: () => {
          attempts += 1;
          return {
            status: 1,
            stdout: "",
            stderr: "npm error code E404\nnpm error 404 Not Found\n",
          };
        },
      })
    ).rejects.toThrow(
      "Failed to read dist-tags for @contractspec/lib.surface-runtime"
    );

    expect(attempts).toBe(1);
  });
});
