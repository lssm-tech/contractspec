import { afterEach, describe, expect, it } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  buildSmokeInstallManifest,
  discoverPreparedTarballs,
} from "./packaged-cli-smoke-support.mjs";

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

describe("discoverPreparedTarballs", () => {
  it("maps prepared tarballs for publishable packages", () => {
    const repoRoot = createTempDir("contractspec-smoke-repo-");
    const tarballDir = createTempDir("contractspec-smoke-tarballs-");

    writeJson(path.join(repoRoot, "packages/apps-registry/contractspec/package.json"), {
      name: "contractspec",
      version: "3.7.2",
    });
    writeJson(path.join(repoRoot, "packages/apps/cli-contractspec/package.json"), {
      name: "@contractspec/app.cli-contractspec",
      version: "3.7.2",
    });
    writeJson(path.join(repoRoot, "packages/libs/schema/package.json"), {
      name: "@contractspec/lib.schema",
      version: "3.7.2",
    });
    writeJson(path.join(repoRoot, "packages/apps/private-app/package.json"), {
      name: "@contractspec/app.private",
      version: "1.0.0",
      private: true,
    });

    fs.writeFileSync(path.join(tarballDir, "contractspec-3.7.2.tgz"), "");
    fs.writeFileSync(
      path.join(tarballDir, "contractspec-app.cli-contractspec-3.7.2.tgz"),
      ""
    );
    fs.writeFileSync(
      path.join(tarballDir, "contractspec-lib.schema-3.7.2.tgz"),
      ""
    );

    expect(discoverPreparedTarballs({ repoRoot, tarballDir })).toEqual({
      contractspec: path.join(tarballDir, "contractspec-3.7.2.tgz"),
      "@contractspec/app.cli-contractspec": path.join(
        tarballDir,
        "contractspec-app.cli-contractspec-3.7.2.tgz"
      ),
      "@contractspec/lib.schema": path.join(
        tarballDir,
        "contractspec-lib.schema-3.7.2.tgz"
      ),
    });
  });
});

describe("buildSmokeInstallManifest", () => {
  it("pins direct and transitive internal packages to local tarballs", () => {
    const manifest = buildSmokeInstallManifest({
      contractspecTarball: "/tmp/contractspec-3.7.2.tgz",
      cliTarball: "/tmp/contractspec-app.cli-contractspec-3.7.2.tgz",
      overrideTarballs: {
        "@contractspec/lib.schema": "/tmp/contractspec-lib.schema-3.7.2.tgz",
      },
    });

    expect(manifest.devDependencies).toEqual({
      "@contractspec/app.cli-contractspec":
        "file:/tmp/contractspec-app.cli-contractspec-3.7.2.tgz",
      contractspec: "file:/tmp/contractspec-3.7.2.tgz",
    });
    expect(manifest.overrides).toEqual({
      "@contractspec/lib.schema": "file:/tmp/contractspec-lib.schema-3.7.2.tgz",
      "@contractspec/app.cli-contractspec":
        "file:/tmp/contractspec-app.cli-contractspec-3.7.2.tgz",
      contractspec: "file:/tmp/contractspec-3.7.2.tgz",
    });
  });
});
