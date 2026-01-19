/**
 * Framework detection utilities.
 *
 * Analyzes a project to detect which frameworks are in use.
 */

import type { ConfidenceLevel, FrameworkInfo, ProjectInfo } from './types';

/**
 * Framework detection rule.
 */
interface FrameworkDetectionRule {
  id: string;
  name: string;
  /** Package names that indicate this framework */
  packages: string[];
  /** File patterns that indicate this framework */
  filePatterns?: RegExp[];
  /** Import patterns in code that indicate this framework */
  importPatterns?: RegExp[];
}

/**
 * Built-in framework detection rules.
 */
const FRAMEWORK_RULES: FrameworkDetectionRule[] = [
  {
    id: 'nestjs',
    name: 'NestJS',
    packages: ['@nestjs/core', '@nestjs/common'],
    importPatterns: [/@nestjs\//],
  },
  {
    id: 'express',
    name: 'Express',
    packages: ['express'],
    importPatterns: [/from ['"]express['"]/],
  },
  {
    id: 'fastify',
    name: 'Fastify',
    packages: ['fastify'],
    importPatterns: [/from ['"]fastify['"]/],
  },
  {
    id: 'hono',
    name: 'Hono',
    packages: ['hono'],
    importPatterns: [/from ['"]hono['"]/],
  },
  {
    id: 'elysia',
    name: 'Elysia',
    packages: ['elysia'],
    importPatterns: [/from ['"]elysia['"]/],
  },
  {
    id: 'trpc',
    name: 'tRPC',
    packages: ['@trpc/server'],
    importPatterns: [/@trpc\/server/],
  },
  {
    id: 'next-api',
    name: 'Next.js API',
    packages: ['next'],
    filePatterns: [/app\/api\/.*\/route\.ts$/, /pages\/api\/.*\.ts$/],
  },
  {
    id: 'koa',
    name: 'Koa',
    packages: ['koa', '@koa/router'],
    importPatterns: [/from ['"]koa['"]/],
  },
  {
    id: 'hapi',
    name: 'Hapi',
    packages: ['@hapi/hapi'],
    importPatterns: [/@hapi\/hapi/],
  },
];

/**
 * Dependencies from package.json.
 */
interface PackageDependencies {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

/**
 * Detect frameworks from package.json dependencies.
 */
export function detectFrameworksFromPackageJson(
  packageJson: PackageDependencies
): FrameworkInfo[] {
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies,
  };

  const detected: FrameworkInfo[] = [];

  for (const rule of FRAMEWORK_RULES) {
    for (const pkg of rule.packages) {
      if (pkg in allDeps) {
        detected.push({
          id: rule.id,
          name: rule.name,
          version: allDeps[pkg],
          confidence: 'high',
        });
        break; // Only add once per framework
      }
    }
  }

  return detected;
}

/**
 * Detect frameworks from source code imports.
 */
export function detectFrameworksFromCode(sourceCode: string): FrameworkInfo[] {
  const detected: FrameworkInfo[] = [];
  const seenIds = new Set<string>();

  for (const rule of FRAMEWORK_RULES) {
    if (!rule.importPatterns) continue;

    for (const pattern of rule.importPatterns) {
      if (pattern.test(sourceCode) && !seenIds.has(rule.id)) {
        detected.push({
          id: rule.id,
          name: rule.name,
          confidence: 'medium',
        });
        seenIds.add(rule.id);
        break;
      }
    }
  }

  return detected;
}

/**
 * Detect frameworks from file paths.
 */
export function detectFrameworksFromPaths(
  filePaths: string[]
): FrameworkInfo[] {
  const detected: FrameworkInfo[] = [];
  const seenIds = new Set<string>();

  for (const rule of FRAMEWORK_RULES) {
    if (!rule.filePatterns) continue;

    for (const pattern of rule.filePatterns) {
      for (const filePath of filePaths) {
        if (pattern.test(filePath) && !seenIds.has(rule.id)) {
          detected.push({
            id: rule.id,
            name: rule.name,
            confidence: 'medium',
          });
          seenIds.add(rule.id);
          break;
        }
      }
    }
  }

  return detected;
}

/**
 * Merge framework detections, preferring higher confidence.
 */
export function mergeFrameworkDetections(
  ...detections: FrameworkInfo[][]
): FrameworkInfo[] {
  const byId = new Map<string, FrameworkInfo>();

  const confidenceOrder: Record<ConfidenceLevel, number> = {
    high: 3,
    medium: 2,
    low: 1,
    ambiguous: 0,
  };

  for (const group of detections) {
    for (const fw of group) {
      const existing = byId.get(fw.id);
      if (
        !existing ||
        confidenceOrder[fw.confidence] > confidenceOrder[existing.confidence]
      ) {
        byId.set(fw.id, fw);
      }
    }
  }

  return Array.from(byId.values());
}

/**
 * Detect frameworks for a project.
 * This is a convenience function that combines all detection methods.
 */
export async function detectFramework(
  rootPath: string,
  options?: {
    readFile?: (path: string) => Promise<string>;
    glob?: (pattern: string) => Promise<string[]>;
  }
): Promise<ProjectInfo> {
  const project: ProjectInfo = {
    rootPath,
    frameworks: [],
  };

  // Try to read package.json
  if (options?.readFile) {
    try {
      const packageJsonPath = `${rootPath}/package.json`;
      const content = await options.readFile(packageJsonPath);
      const packageJson = JSON.parse(content) as PackageDependencies;
      project.packageJsonPath = packageJsonPath;
      project.frameworks = detectFrameworksFromPackageJson(packageJson);
    } catch {
      // No package.json or parse error
    }
  }

  // Check for tsconfig.json
  if (options?.readFile) {
    try {
      const tsConfigPath = `${rootPath}/tsconfig.json`;
      await options.readFile(tsConfigPath);
      project.tsConfigPath = tsConfigPath;
    } catch {
      // No tsconfig.json
    }
  }

  return project;
}

/**
 * Get all supported framework IDs.
 */
export function getSupportedFrameworks(): string[] {
  return FRAMEWORK_RULES.map((r) => r.id);
}

/**
 * Check if a framework ID is supported.
 */
export function isFrameworkSupported(id: string): boolean {
  return FRAMEWORK_RULES.some((r) => r.id === id);
}
