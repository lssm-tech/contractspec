/**
 * Package metadata audit script
 * Checks all packages for required metadata fields
 */

import * as fs from "fs";
import * as path from "path";
import { Glob } from "bun";

interface PackageJson {
  name?: string;
  description?: string;
  keywords?: string[];
  repository?:
    | string
    | {
        type: string;
        url: string;
        directory?: string;
      };
  homepage?: string;
  license?: string;
}

interface Issue {
  pkg: string;
  name: string;
  missing: string[];
}

const glob = new Glob("packages/**/package.json");
const packages = [...glob.scanSync({ cwd: ".", absolute: true })].filter(
  (p) => !p.includes("node_modules")
);

console.log("\n=== Package Metadata Audit ===\n");

const issues: Issue[] = [];

for (const pkg of packages) {
  const content: PackageJson = JSON.parse(fs.readFileSync(pkg, "utf-8"));
  const missing: string[] = [];

  if (!content.name) missing.push("name");
  if (!content.description) missing.push("description");
  if (!content.keywords || content.keywords.length === 0)
    missing.push("keywords");
  if (!content.repository) missing.push("repository");
  if (!content.homepage) missing.push("homepage");
  if (!content.license) missing.push("license");

  // Check if repository has directory
  if (
    content.repository &&
    typeof content.repository === "object" &&
    !content.repository.directory
  ) {
    missing.push("repository.directory");
  }

  // Check for README
  const readmePath = path.join(path.dirname(pkg), "README.md");
  if (!fs.existsSync(readmePath)) {
    missing.push("README.md file");
  }

  if (missing.length > 0) {
    issues.push({ pkg: path.relative(".", pkg), name: content.name || "?", missing });
  }
}

// Group issues by missing field
const byMissing: Record<string, string[]> = {};
issues.forEach((i) => {
  i.missing.forEach((m) => {
    if (!byMissing[m]) byMissing[m] = [];
    byMissing[m].push(i.name);
  });
});

console.log("=== Packages Missing Fields ===\n");
Object.entries(byMissing).forEach(([field, pkgs]) => {
  console.log(`\n${field} (${pkgs.length} packages):`);
  pkgs.forEach((p) => console.log(`  - ${p}`));
});

console.log("\n\n=== Detailed Issues ===\n");
issues.forEach((i) => {
  console.log(`${i.name}`);
  console.log(`  Path: ${i.pkg}`);
  console.log(`  Missing: ${i.missing.join(", ")}`);
  console.log("");
});

console.log("\n=== Summary ===");
console.log("Total packages:", packages.length);
console.log("Packages with issues:", issues.length);
console.log("Packages OK:", packages.length - issues.length);
