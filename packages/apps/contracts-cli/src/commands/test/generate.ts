import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import chalk from 'chalk';
import { GoldenTestGenerator } from '@lssm/lib.testing';
import type { TrafficSnapshot } from '@lssm/lib.testing';

export interface GenerateGoldenOptions {
  operation: string;
  output: string;
  runnerImport: string;
  runnerFn?: string;
  suiteName?: string;
  framework?: 'vitest' | 'jest';
  fromProduction?: boolean;
  days?: number;
  sampleRate?: number;
}

export async function generateGoldenTestsCommand(
  options: GenerateGoldenOptions
) {
  if (!options.operation) {
    throw new Error('Operation name is required via --operation');
  }
  if (!options.output) {
    throw new Error('Output path is required via --output');
  }
  if (!options.runnerImport) {
    throw new Error(
      '--runner-import must point to a module exporting your runner'
    );
  }

  const snapshots = options.fromProduction
    ? await fetchSnapshotsFromProduction(options)
    : [];

  if (snapshots.length === 0) {
    console.warn(
      chalk.yellow('⚠️ No traffic snapshots found. Nothing to generate.')
    );
    return;
  }

  const generator = new GoldenTestGenerator();
  const code = generator.generate(snapshots, {
    suiteName:
      options.suiteName ?? `${options.operation.replace(/\./g, '-')}-golden`,
    runnerImport: options.runnerImport,
    runnerFunction: options.runnerFn ?? 'runContract',
    framework: options.framework ?? 'vitest',
  });

  const outputPath = path.resolve(options.output);
  await writeFile(outputPath, `${code}\n`, 'utf-8');
  console.log(
    chalk.green(
      `✅ Generated ${snapshots.length} golden cases for ${options.operation} → ${outputPath}`
    )
  );
}

type TrafficSnapshotRow = {
  id: string;
  operationName: string;
  operationVersion: number;
  success: boolean;
  durationMs: number | null;
  tenantId: string | null;
  userId: string | null;
  channel: string | null;
  payload: unknown;
  recordedAt: Date;
};

async function fetchSnapshotsFromProduction(
  options: GenerateGoldenOptions
): Promise<TrafficSnapshot[]> {
  const { createPrismaClientFromEnv } = await import('@lssm/lib.database');
  const prisma = createPrismaClientFromEnv('DATABASE_URL');
  try {
    const since = options.days
      ? new Date(Date.now() - options.days * 24 * 60 * 60 * 1000)
      : undefined;
    const rows = (await prisma.trafficSnapshot.findMany({
      where: {
        operationName: options.operation,
        recordedAt: since ? { gte: since } : undefined,
      },
      orderBy: { recordedAt: 'desc' },
    })) as TrafficSnapshotRow[];
    const sampleRate =
      options.sampleRate && options.sampleRate > 0
        ? Math.min(1, options.sampleRate)
        : 1;
    return rows
      .filter(() => (sampleRate >= 1 ? true : Math.random() <= sampleRate))
      .map((row) => {
        const payload = (row.payload as Record<string, unknown>) ?? {};
        const input = payload.input ?? payload.request ?? null;
        const output = payload.output ?? payload.response;
        const error = payload.error as TrafficSnapshot['error'];
        return {
          id: row.id,
          operation: { name: row.operationName, version: row.operationVersion },
          input,
          output,
          error,
          success: row.success,
          timestamp: row.recordedAt,
          durationMs: row.durationMs ?? undefined,
          tenantId: row.tenantId ?? undefined,
          userId: row.userId ?? undefined,
          channel: row.channel ?? undefined,
          metadata: payload.metadata as Record<string, unknown> | undefined,
        } satisfies TrafficSnapshot;
      });
  } finally {
    await prisma.$disconnect();
  }
}

