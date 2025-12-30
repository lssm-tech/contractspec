/**
 * Workspace operations handler (repo-linked Studio projects).
 *
 * This is intentionally **read-only** in v1: list / validate / deps / diff.
 * It operates on a server-side repo cache path referenced by a Studio integration
 * (e.g. IntegrationProvider.GITHUB) and never writes back to git.
 */

import { Elysia, t } from 'elysia';
import { resolve as resolvePath } from 'node:path';
import { appLogger } from '@contractspec/bundle.studio/infrastructure';
import { auth } from '@contractspec/bundle.studio/application/services/auth';
import { IntegrationProvider, prisma } from '@contractspec/lib.database-studio';
import {
  analyzeDeps,
  compareSpecs,
  createNodeFsAdapter,
  createNodeGitAdapter,
  createNoopLoggerAdapter,
  listSpecs,
  loadWorkspaceConfig,
  validateSpecs,
} from '@contractspec/bundle.workspace';

const REPO_CACHE_BASE_DIR =
  process.env.CONTRACTSPEC_REPO_CACHE_DIR ?? '/tmp/contractspec-repos';

const organizationIdQuery = t.Object({
  organizationId: t.String(),
});

const validateBody = t.Object({
  organizationId: t.String(),
  files: t.Optional(t.Array(t.String())),
  pattern: t.Optional(t.String()),
});

const depsBody = t.Object({
  organizationId: t.String(),
  pattern: t.Optional(t.String()),
});

const diffBody = t.Object({
  organizationId: t.String(),
  specPath: t.String(),
  baseline: t.Optional(t.String()),
  spec2Path: t.Optional(t.String()),
  breakingOnly: t.Optional(t.Boolean()),
});

export const workspaceOpsHandler = new Elysia().group(
  '/api/workspace-ops',
  (app) =>
    app
      .get(
        '/:integrationId/config',
        async ({ params, query, request }) => {
          const session = await requireSession(request.headers);
          await requireOrgMembership(session.user.id, query.organizationId);

          const repoRoot = await getRepoRootFromIntegration(
            params.integrationId,
            query.organizationId
          );

          const fs = createNodeFsAdapter(repoRoot);
          const config = await loadWorkspaceConfig(fs);

          return {
            repoRoot,
            config,
          };
        },
        {
          query: organizationIdQuery,
          detail: {
            summary: 'Load .contractsrc.json for a repo-linked workspace',
            tags: ['workspace-ops'],
          },
        }
      )
      .get(
        '/:integrationId/specs',
        async ({ params, query, request }) => {
          const session = await requireSession(request.headers);
          await requireOrgMembership(session.user.id, query.organizationId);

          const repoRoot = await getRepoRootFromIntegration(
            params.integrationId,
            query.organizationId
          );

          const fs = createNodeFsAdapter(repoRoot);
          const specs = await listSpecs(
            { fs },
            {
              pattern: undefined,
              type: undefined,
            }
          );

          return {
            repoRoot,
            specs,
          };
        },
        {
          query: organizationIdQuery,
          detail: {
            summary: 'List ContractSpec specs in repo-linked workspace',
            tags: ['workspace-ops'],
          },
        }
      )
      .post(
        '/:integrationId/validate',
        async ({ params, body, request }) => {
          const start = performance.now();
          const session = await requireSession(request.headers);
          await requireOrgMembership(session.user.id, body.organizationId);

          const repoRoot = await getRepoRootFromIntegration(
            params.integrationId,
            body.organizationId
          );

          const fs = createNodeFsAdapter(repoRoot);
          const logger = createNoopLoggerAdapter();

          const files =
            body.files ??
            (await fs.glob({
              pattern: body.pattern,
            }));

          const results = await validateSpecs(files, { fs, logger });
          const durationMs = Math.round(performance.now() - start);

          appLogger.info('workspace.ops.validate.completed', {
            integrationId: params.integrationId,
            organizationId: body.organizationId,
            files: files.length,
            durationMs,
          });

          return {
            repoRoot,
            durationMs,
            results: Object.fromEntries(results.entries()),
          };
        },
        {
          body: validateBody,
          detail: {
            summary: 'Validate ContractSpec specs (structure)',
            tags: ['workspace-ops'],
          },
        }
      )
      .post(
        '/:integrationId/deps',
        async ({ params, body, request }) => {
          const start = performance.now();
          const session = await requireSession(request.headers);
          await requireOrgMembership(session.user.id, body.organizationId);

          const repoRoot = await getRepoRootFromIntegration(
            params.integrationId,
            body.organizationId
          );

          const fs = createNodeFsAdapter(repoRoot);
          const result = await analyzeDeps({ fs }, { pattern: body.pattern });
          const durationMs = Math.round(performance.now() - start);

          appLogger.info('workspace.ops.deps.completed', {
            integrationId: params.integrationId,
            organizationId: body.organizationId,
            total: result.total,
            cycles: result.cycles.length,
            missing: result.missing.length,
            durationMs,
          });

          return {
            repoRoot,
            durationMs,
            result,
          };
        },
        {
          body: depsBody,
          detail: {
            summary: 'Analyze ContractSpec dependency graph',
            tags: ['workspace-ops'],
          },
        }
      )
      .post(
        '/:integrationId/diff',
        async ({ params, body, request }) => {
          const start = performance.now();
          const session = await requireSession(request.headers);
          await requireOrgMembership(session.user.id, body.organizationId);

          const repoRoot = await getRepoRootFromIntegration(
            params.integrationId,
            body.organizationId
          );

          const fs = createNodeFsAdapter(repoRoot);
          const git = createNodeGitAdapter(repoRoot);

          const result = await compareSpecs(
            body.specPath,
            body.spec2Path ?? body.specPath,
            { fs, git },
            {
              baseline: body.baseline,
              breakingOnly: body.breakingOnly,
            }
          );
          const durationMs = Math.round(performance.now() - start);

          appLogger.info('workspace.ops.diff.completed', {
            integrationId: params.integrationId,
            organizationId: body.organizationId,
            specPath: body.specPath,
            baseline: body.baseline,
            durationMs,
          });

          return {
            repoRoot,
            durationMs,
            result,
          };
        },
        {
          body: diffBody,
          detail: {
            summary: 'Compute semantic diff for a spec (optionally vs git ref)',
            tags: ['workspace-ops'],
          },
        }
      )
);

async function requireSession(
  headers: Headers
): Promise<NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>> {
  const session = await auth.api.getSession({ headers });
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

async function requireOrgMembership(userId: string, organizationId: string) {
  const member = await prisma.member.findUnique({
    where: {
      userId_organizationId: { userId, organizationId },
    },
    select: { id: true },
  });
  if (!member) {
    throw new Error('Forbidden');
  }
}

async function getRepoRootFromIntegration(
  integrationId: string,
  organizationId: string
): Promise<string> {
  const integration = await prisma.studioIntegration.findFirst({
    where: {
      id: integrationId,
      organizationId,
      provider: IntegrationProvider.GITHUB,
      enabled: true,
    },
    select: {
      id: true,
      config: true,
    },
  });

  if (!integration) {
    throw new Error('Repo integration not found');
  }

  const config = (integration.config ?? {}) as Record<string, unknown>;
  const repoPath =
    typeof config.repoCachePath === 'string'
      ? config.repoCachePath
      : typeof config.localPath === 'string'
        ? config.localPath
        : typeof config.repoPath === 'string'
          ? config.repoPath
          : undefined;

  if (!repoPath) {
    throw new Error(
      'Repo integration is missing config.repoCachePath (or config.localPath)'
    );
  }

  const base = resolvePath(REPO_CACHE_BASE_DIR);
  const resolved = resolvePath(base, repoPath);

  if (!resolved.startsWith(base)) {
    throw new Error('Invalid repo path');
  }

  return resolved;
}
