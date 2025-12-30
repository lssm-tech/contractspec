import {
  DeploymentMode,
  DeploymentStatus,
  Environment,
  prisma as studioDb,
  ProjectTier,
  SpecType,
  type StudioDeployment,
  type StudioProject,
  type StudioSpec,
} from '@contractspec/lib.database-studio';
import { ContractSpecFeatureFlags } from '@contractspec/lib.progressive-delivery';
import type {
  CanvasVersionSnapshot,
  ComponentNode,
} from '../../../modules/visual-builder';
import { VisualBuilderModule } from '../../../modules/visual-builder';
import { CanvasVersionManager } from '../../../modules/visual-builder/versioning';
import { toInputJson, toNullableJsonValue } from '../../../utils/prisma-json';
import { DeploymentOrchestrator } from '../../deployment/orchestrator';
import { requireFeatureFlag } from '../guards/feature-flags';
import {
  ensureStudioProjectAccess,
  isOrgAdminRole,
  requireOrgMember,
} from '../guards/project-access';
import { requireAuth } from '../types';
import type { contractSpecStudioSchemaBuilder } from '../builder';

const debugGraphQL = process.env.CONTRACTSPEC_DEBUG_GRAPHQL_BUILDER === 'true';

if (debugGraphQL) {
  console.log('[graphql-studio] module loaded');
}

export function registerStudioSchema(
  builder: typeof contractSpecStudioSchemaBuilder
) {
  if (debugGraphQL) {
    console.log('[graphql-studio] registering schema');
  }
  const ProjectTierEnum = builder.enumType('ProjectTierEnum', {
    values: Object.values(ProjectTier),
  });
  const DeploymentModeEnum = builder.enumType('DeploymentModeEnum', {
    values: Object.values(DeploymentMode),
  });
  const SpecTypeEnum = builder.enumType('SpecTypeEnum', {
    values: Object.values(SpecType),
  });
  const EnvironmentEnum = builder.enumType('EnvironmentEnum', {
    values: Object.values(Environment),
  });
  const DeploymentStatusEnum = builder.enumType('DeploymentStatusEnum', {
    values: Object.values(DeploymentStatus),
  });
  const CanvasVersionStatusEnum = builder.enumType('CanvasVersionStatusEnum', {
    values: {
      DRAFT: { value: 'draft' },
      DEPLOYED: { value: 'deployed' },
    },
  });

  const StudioSpecType = builder.objectRef<StudioSpec>('StudioSpec').implement({
    fields: (t) => ({
      id: t.exposeID('id'),
      projectId: t.exposeString('projectId'),
      type: t.field({
        type: SpecTypeEnum,
        resolve: (spec) => spec.type,
      }),
      name: t.exposeString('name'),
      version: t.exposeString('version'),
      content: t.field({
        type: 'JSON',
        resolve: (spec) => spec.content,
      }),
      metadata: t.field({
        type: 'JSON',
        nullable: true,
        resolve: (spec) => spec.metadata ?? null,
      }),
      updatedAt: t.field({
        type: 'Date',
        resolve: (spec) => spec.updatedAt,
      }),
    }),
  });

  const StudioDeploymentType = builder
    .objectRef<StudioDeployment>('StudioDeployment')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        projectId: t.exposeString('projectId'),
        environment: t.field({
          type: EnvironmentEnum,
          resolve: (deployment) => deployment.environment,
        }),
        status: t.field({
          type: DeploymentStatusEnum,
          resolve: (deployment) => deployment.status,
        }),
        version: t.exposeString('version'),
        url: t.exposeString('url', { nullable: true }),
        infrastructureId: t.exposeString('infrastructureId', {
          nullable: true,
        }),
        createdAt: t.field({
          type: 'Date',
          resolve: (deployment) => deployment.createdAt,
        }),
        deployedAt: t.field({
          type: 'Date',
          nullable: true,
          resolve: (deployment) => deployment.deployedAt ?? null,
        }),
      }),
    });

  const StudioProjectType = builder
    .objectRef<StudioProject>('StudioProject')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        slug: t.exposeString('slug'),
        name: t.exposeString('name'),
        description: t.exposeString('description', { nullable: true }),
        tier: t.field({
          type: ProjectTierEnum,
          resolve: (project) => project.tier,
        }),
        deploymentMode: t.field({
          type: DeploymentModeEnum,
          resolve: (project) => project.deploymentMode,
        }),
        byokEnabled: t.exposeBoolean('byokEnabled'),
        evolutionEnabled: t.exposeBoolean('evolutionEnabled'),
        createdAt: t.field({
          type: 'Date',
          resolve: (project) => project.createdAt,
        }),
        updatedAt: t.field({
          type: 'Date',
          resolve: (project) => project.updatedAt,
        }),
        specs: t.field({
          type: [StudioSpecType],
          resolve: (project) =>
            studioDb.studioSpec.findMany({ where: { projectId: project.id } }),
        }),
        deployments: t.field({
          type: [StudioDeploymentType],
          resolve: (project) =>
            studioDb.studioDeployment.findMany({
              where: { projectId: project.id },
              orderBy: { createdAt: 'desc' },
            }),
        }),
      }),
    });

  const CanvasVersionType = builder
    .objectRef<CanvasVersionSnapshot>('CanvasVersion')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        label: t.exposeString('label'),
        status: t.field({
          type: CanvasVersionStatusEnum,
          resolve: (version) =>
            version.status === 'deployed' ? 'deployed' : 'draft',
        }),
        nodes: t.field({
          type: 'JSON',
          resolve: (version) => version.nodes,
        }),
        createdAt: t.field({
          type: 'Date',
          resolve: (version) => new Date(version.createdAt),
        }),
        createdBy: t.exposeString('createdBy', { nullable: true }),
      }),
    });

  const CreateProjectInput = builder.inputType('CreateProjectInput', {
    fields: (t) => ({
      name: t.string({ required: true }),
      description: t.string(),
      teamIds: t.stringList({ required: false }),
      tier: t.field({ type: ProjectTierEnum, required: true }),
      deploymentMode: t.field({
        type: DeploymentModeEnum,
        required: false,
      }),
      byokEnabled: t.boolean(),
      evolutionEnabled: t.boolean(),
    }),
  });

  const UpdateProjectInput = builder.inputType('UpdateProjectInput', {
    fields: (t) => ({
      name: t.string(),
      description: t.string(),
      tier: t.field({ type: ProjectTierEnum }),
      deploymentMode: t.field({ type: DeploymentModeEnum }),
      byokEnabled: t.boolean(),
      evolutionEnabled: t.boolean(),
    }),
  });

  const CreateSpecInput = builder.inputType('CreateSpecInput', {
    fields: (t) => ({
      projectId: t.string({ required: true }),
      type: t.field({ type: SpecTypeEnum, required: true }),
      name: t.string({ required: true }),
      version: t.string({ required: true }),
      content: t.field({ type: 'JSON', required: true }),
      metadata: t.field({ type: 'JSON' }),
    }),
  });

  const UpdateSpecInput = builder.inputType('UpdateSpecInput', {
    fields: (t) => ({
      name: t.string(),
      version: t.string(),
      content: t.field({ type: 'JSON' }),
      metadata: t.field({ type: 'JSON' }),
    }),
  });

  const DeployProjectInput = builder.inputType('DeployProjectInput', {
    fields: (t) => ({
      projectId: t.string({ required: true }),
      environment: t.field({ type: EnvironmentEnum, required: true }),
    }),
  });

  const SaveTemplateInput = builder.inputType('SaveTemplateInput', {
    fields: (t) => ({
      organizationId: t.string({ required: true }),
      templateId: t.string({ required: true }),
      projectName: t.string({ required: true }),
      payload: t.string({ required: true }),
      description: t.string(),
    }),
  });

  const SaveCanvasDraftInput = builder.inputType('SaveCanvasDraftInput', {
    fields: (t) => ({
      canvasId: t.string({ required: true }),
      nodes: t.field({ type: 'JSON', required: true }),
      label: t.string(),
    }),
  });

  const DeployCanvasVersionInput = builder.inputType(
    'DeployCanvasVersionInput',
    {
      fields: (t) => ({
        canvasId: t.string({ required: true }),
        versionId: t.string({ required: true }),
      }),
    }
  );

  const UndoCanvasInput = builder.inputType('UndoCanvasInput', {
    fields: (t) => ({
      canvasId: t.string({ required: true }),
    }),
  });

  const SaveTemplateResultType = builder
    .objectRef<{
      projectId: string;
      status: string;
    }>('SaveTemplateResult')
    .implement({
      fields: (t) => ({
        projectId: t.exposeString('projectId'),
        status: t.exposeString('status'),
      }),
    });

  builder.queryFields((t) => ({
    studioProject: t.field({
      type: StudioProjectType,
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        return getProjectForOrg(args.id, user.organizationId);
      },
    }),
    studioProjectBySlug: t.field({
      type: builder
        .objectRef<{
          project: StudioProject;
          canonicalSlug: string;
          wasRedirect: boolean;
        }>('StudioProjectSlugResolution')
        .implement({
          fields: (t2) => ({
            project: t2.field({
              type: StudioProjectType,
              resolve: (r) => r.project,
            }),
            canonicalSlug: t2.exposeString('canonicalSlug'),
            wasRedirect: t2.exposeBoolean('wasRedirect'),
          }),
        }),
      args: {
        slug: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const direct = await studioDb.studioProject.findFirst({
          where: {
            organizationId: user.organizationId,
            slug: args.slug,
            deletedAt: null,
          },
        });
        if (direct) {
          await ensureStudioProjectAccess({
            projectId: direct.id,
            userId: user.id,
            organizationId: user.organizationId,
          });
          return {
            project: direct,
            canonicalSlug: direct.slug,
            wasRedirect: false,
          };
        }
        const alias = await studioDb.studioProjectSlugAlias.findFirst({
          where: { organizationId: user.organizationId, slug: args.slug },
          select: { projectId: true },
        });
        if (!alias?.projectId) {
          throw new Error('Project not found');
        }
        const project = await getProjectForOrg(
          alias.projectId,
          user.organizationId
        );
        await ensureStudioProjectAccess({
          projectId: project.id,
          userId: user.id,
          organizationId: user.organizationId,
        });
        return { project, canonicalSlug: project.slug, wasRedirect: true };
      },
    }),
    myStudioProjects: t.field({
      type: [StudioProjectType],
      resolve: async (_root, _args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const member = await requireOrgMember(user.id, user.organizationId);
        if (isOrgAdminRole(member.role)) {
          return studioDb.studioProject.findMany({
            where: { organizationId: user.organizationId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
          });
        }
        // org-wide projects (no teams) OR shared with one of user's teams
        return studioDb.studioProject.findMany({
          where: {
            organizationId: user.organizationId,
            deletedAt: null,
            OR: [
              { teams: { none: {} } },
              {
                teams: {
                  some: { team: { members: { some: { userId: user.id } } } },
                },
              },
            ],
          },
          orderBy: { createdAt: 'desc' },
        });
      },
    }),
    studioSpec: t.field({
      type: StudioSpecType,
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const spec = await studioDb.studioSpec.findUnique({
          where: { id: args.id },
        });
        if (!spec) throw new Error('Spec not found');
        await ensureStudioProjectAccess({
          projectId: spec.projectId,
          userId: user.id,
          organizationId: user.organizationId,
        });
        return spec;
      },
    }),
    projectSpecs: t.field({
      type: [StudioSpecType],
      args: {
        projectId: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        await ensureStudioProjectAccess({
          projectId: args.projectId,
          userId: user.id,
          organizationId: user.organizationId,
        });
        return studioDb.studioSpec.findMany({
          where: { projectId: args.projectId },
          orderBy: { updatedAt: 'desc' },
        });
      },
    }),
    studioCanvas: t.field({
      type: 'JSON',
      args: {
        projectId: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        await ensureStudioProjectAccess({
          projectId: args.projectId,
          userId: user.id,
          organizationId: user.organizationId,
        });
        const builderModule = new VisualBuilderModule();
        return builderModule.renderCanvas(args.projectId);
      },
    }),
    canvasVersions: t.field({
      type: [CanvasVersionType],
      args: {
        canvasId: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        await ensureCanvasAccess(args.canvasId, user.organizationId);
        const manager = new CanvasVersionManager();
        return manager.list(args.canvasId);
      },
    }),
  }));

  builder.mutationFields((t) => ({
    createStudioProject: t.field({
      type: StudioProjectType,
      args: {
        input: t.arg({ type: CreateProjectInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const member = await requireOrgMember(user.id, user.organizationId);
        const slug = await allocateProjectSlug(
          user.organizationId,
          args.input.name
        );
        const project = await studioDb.studioProject.create({
          data: {
            name: args.input.name,
            slug,
            description: args.input.description ?? undefined,
            tier: args.input.tier,
            deploymentMode: args.input.deploymentMode ?? DeploymentMode.SHARED,
            byokEnabled: args.input.byokEnabled ?? false,
            evolutionEnabled: args.input.evolutionEnabled ?? true,
            organizationId: user.organizationId,
          },
        });
        // Optional initial sharing: only admins can assign teams on create
        const teamIds = (args.input as { teamIds?: unknown }).teamIds;
        if (Array.isArray(teamIds) && teamIds.length) {
          if (!isOrgAdminRole(member.role)) {
            throw new Error(
              'Only organization admins can share projects to teams.'
            );
          }
          const teams = await studioDb.team.findMany({
            where: {
              id: { in: teamIds as string[] },
              organizationId: user.organizationId,
            },
            select: { id: true },
          });
          if (teams.length !== teamIds.length) {
            throw new Error(
              'One or more teams were not found in this organization.'
            );
          }
          await studioDb.studioProjectTeam.createMany({
            data: (teamIds as string[]).map((teamId) => ({
              projectId: project.id,
              teamId,
            })),
            skipDuplicates: true,
          });
        }
        return project;
      },
    }),
    updateStudioProject: t.field({
      type: StudioProjectType,
      args: {
        id: t.arg.string({ required: true }),
        input: t.arg({ type: UpdateProjectInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        await ensureStudioProjectAccess({
          projectId: args.id,
          userId: user.id,
          organizationId: user.organizationId,
        });
        const existing = await getProjectForOrg(args.id, user.organizationId);
        const nextSlug =
          args.input.name && args.input.name !== existing.name
            ? await allocateProjectSlug(user.organizationId, args.input.name)
            : undefined;
        if (nextSlug && existing.slug !== nextSlug) {
          try {
            await studioDb.studioProjectSlugAlias.create({
              data: {
                organizationId: user.organizationId,
                projectId: existing.id,
                slug: existing.slug,
              },
            });
          } catch {
            // best-effort: alias may already exist or conflict; ignore
          }
        }
        return studioDb.studioProject.update({
          where: { id: args.id },
          data: {
            name: args.input.name ?? undefined,
            slug: nextSlug ?? undefined,
            description: args.input.description ?? undefined,
            tier: args.input.tier ?? undefined,
            deploymentMode: args.input.deploymentMode ?? undefined,
            byokEnabled: args.input.byokEnabled ?? undefined,
            evolutionEnabled: args.input.evolutionEnabled ?? undefined,
          },
        });
      },
    }),
    deleteStudioProject: t.field({
      type: StudioProjectType,
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        // Deletion is admin-only (soft delete)
        const member = await requireOrgMember(user.id, user.organizationId);
        if (!isOrgAdminRole(member.role)) {
          throw new Error('Only organization admins can delete projects.');
        }
        const existing = await getProjectForOrg(args.id, user.organizationId);
        if (existing.deletedAt) return existing;
        return studioDb.studioProject.update({
          where: { id: existing.id },
          data: { deletedAt: new Date() },
        });
      },
    }),
    createStudioSpec: t.field({
      type: StudioSpecType,
      args: {
        input: t.arg({ type: CreateSpecInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        await ensureStudioProjectAccess({
          projectId: args.input.projectId,
          userId: user.id,
          organizationId: user.organizationId,
        });
        return studioDb.studioSpec.create({
          data: {
            projectId: args.input.projectId,
            type: args.input.type,
            name: args.input.name,
            version: args.input.version,
            content: toInputJson(args.input.content),
            metadata:
              args.input.metadata === undefined
                ? undefined
                : toNullableJsonValue(args.input.metadata),
          },
        });
      },
    }),
    updateStudioSpec: t.field({
      type: StudioSpecType,
      args: {
        id: t.arg.string({ required: true }),
        input: t.arg({ type: UpdateSpecInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const spec = await studioDb.studioSpec.findUnique({
          where: { id: args.id },
        });
        if (!spec) throw new Error('Spec not found');
        await ensureStudioProjectAccess({
          projectId: spec.projectId,
          userId: user.id,
          organizationId: user.organizationId,
        });
        return studioDb.studioSpec.update({
          where: { id: args.id },
          data: {
            name: args.input.name ?? undefined,
            version: args.input.version ?? undefined,
            content:
              args.input.content === undefined
                ? undefined
                : toInputJson(args.input.content),
            metadata:
              args.input.metadata === undefined
                ? undefined
                : toNullableJsonValue(args.input.metadata),
          },
        });
      },
    }),
    saveCanvasDraft: t.field({
      type: CanvasVersionType,
      args: {
        input: t.arg({ type: SaveCanvasDraftInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        await ensureCanvasAccess(args.input.canvasId, user.organizationId);
        const nodes = toComponentNodes(args.input.nodes);
        const manager = new CanvasVersionManager();
        return manager.saveDraft(args.input.canvasId, nodes, {
          label: args.input.label ?? undefined,
          userId: ctx.user?.id,
        });
      },
    }),
    deployCanvasVersion: t.field({
      type: CanvasVersionType,
      args: {
        input: t.arg({ type: DeployCanvasVersionInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        await ensureCanvasAccess(args.input.canvasId, user.organizationId);
        const manager = new CanvasVersionManager();
        return manager.deploy(args.input.canvasId, args.input.versionId);
      },
    }),
    undoCanvasVersion: t.field({
      type: CanvasVersionType,
      nullable: true,
      args: {
        input: t.arg({ type: UndoCanvasInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        await ensureCanvasAccess(args.input.canvasId, user.organizationId);
        const manager = new CanvasVersionManager();
        return manager.undo(args.input.canvasId);
      },
    }),
    deployStudioProject: t.field({
      type: StudioDeploymentType,
      args: {
        input: t.arg({ type: DeployProjectInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        await ensureStudioProjectAccess({
          projectId: args.input.projectId,
          userId: user.id,
          organizationId: user.organizationId,
        });
        const project = await getProjectForOrg(
          args.input.projectId,
          user.organizationId
        );
        if (project.deploymentMode === DeploymentMode.DEDICATED) {
          requireFeatureFlag(
            ctx,
            ContractSpecFeatureFlags.STUDIO_DEDICATED_DEPLOYMENT,
            'Dedicated deployments are not enabled for this organization.'
          );
        }
        const orchestrator = new DeploymentOrchestrator();
        return orchestrator.deployProject(project, args.input.environment);
      },
    }),
    saveTemplateToStudio: t.field({
      type: SaveTemplateResultType,
      args: {
        input: t.arg({ type: SaveTemplateInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        if (user.organizationId !== args.input.organizationId) {
          throw new Error('Organization mismatch while saving template.');
        }

        const slug = await allocateProjectSlug(
          user.organizationId,
          args.input.projectName
        );

        const project = await studioDb.studioProject.create({
          data: {
            name: args.input.projectName,
            slug,
            description:
              args.input.description ??
              `Imported from ${args.input.templateId} template.`,
            tier: ProjectTier.STARTER,
            deploymentMode: DeploymentMode.SHARED,
            organizationId: user.organizationId,
            byokEnabled: false,
            evolutionEnabled: true,
          },
        });

        // Persist a placeholder spec so the UI has something to display.
        await studioDb.studioSpec.create({
          data: {
            projectId: project.id,
            type: SpecType.COMPONENT,
            name: `${args.input.templateId} bootstrap`,
            version: '1.0.0',
            content: toInputJson({
              source: 'template-runtime',
              payloadSize: Buffer.from(args.input.payload, 'base64').length,
            }),
          },
        });

        return {
          projectId: project.id,
          status: 'QUEUED',
        };
      },
    }),
  }));

  if (debugGraphQL) {
    console.log('[graphql-studio] schema ready');
  }
}

function requireAuthAndGet(
  ctx: Parameters<typeof requireAuth>[0]
): NonNullable<typeof ctx.user> & { organizationId: string } {
  requireAuth(ctx);
  if (!ctx.organization) {
    throw new Error('Organization context is required.');
  }
  // NOTE: Better Auth session user does not carry organizationId; it lives on ctx.organization.
  return {
    ...(ctx.user as NonNullable<typeof ctx.user>),
    organizationId: ctx.organization.id,
  };
}

async function getProjectForOrg(projectId: string, organizationId: string) {
  const project = await studioDb.studioProject.findFirst({
    where: { id: projectId, organizationId, deletedAt: null },
  });
  if (!project) {
    throw new Error('Project not found');
  }
  return project;
}

async function ensureCanvasAccess(canvasId: string, organizationId: string) {
  const overlay = await studioDb.studioOverlay.findUnique({
    where: { id: canvasId },
    select: { projectId: true },
  });
  if (!overlay) {
    throw new Error('Canvas not found');
  }
  // Note: org access is verified through ensureStudioProjectAccess at callsites.
  await getProjectForOrg(overlay.projectId, organizationId);
  return overlay.projectId;
}

function toComponentNodes(value: unknown): ComponentNode[] {
  if (!Array.isArray(value)) {
    throw new Error('Canvas nodes input must be an array');
  }
  return value as ComponentNode[];
}

async function allocateProjectSlug(organizationId: string, name: string) {
  const base = slugify(name);
  const root = base || 'project';
  const candidate = root;
  const exists = await studioDb.studioProject.findFirst({
    where: { organizationId, slug: candidate },
    select: { id: true },
  });
  if (!exists) return candidate;
  const count = await studioDb.studioProject.count({
    where: { organizationId, slug: { startsWith: `${root}-` } },
  });
  return `${root}-${count + 1}`;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
