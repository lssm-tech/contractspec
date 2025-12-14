import { gqlSchemaBuilder } from '../builder';
import { requireAuth } from '../types';
import {
  prisma as studioDb,
  type Invitation,
  type Member,
  type Team,
} from '@lssm/lib.database-contractspec-studio';
import { Resend } from 'resend';

export function registerTeamsSchema(builder: typeof gqlSchemaBuilder) {
  const TeamType = builder.objectRef<Team>('Team').implement({
    fields: (t) => ({
      id: t.exposeID('id'),
      name: t.exposeString('name'),
      organizationId: t.exposeString('organizationId'),
      createdAt: t.expose('createdAt', { type: 'Date' }),
      updatedAt: t.expose('updatedAt', { type: 'Date' }),
    }),
  });

  const OrganizationMemberType = builder
    .objectRef<Member>('OrganizationMember')
    .implement({
      fields: (t) => ({
        id: t.exposeID('id'),
        userId: t.exposeString('userId'),
        organizationId: t.exposeString('organizationId'),
        role: t.exposeString('role'),
        createdAt: t.expose('createdAt', { type: 'Date' }),
      }),
    });

  const InvitationType = builder.objectRef<Invitation>('OrganizationInvitation').implement({
    fields: (t) => ({
      id: t.exposeID('id'),
      organizationId: t.exposeString('organizationId'),
      email: t.exposeString('email'),
      role: t.exposeString('role', { nullable: true }),
      status: t.exposeString('status'),
      teamId: t.exposeString('teamId', { nullable: true }),
      inviterId: t.exposeString('inviterId'),
      createdAt: t.expose('createdAt', { type: 'Date' }),
      acceptedAt: t.expose('acceptedAt', { type: 'Date', nullable: true }),
      expiresAt: t.expose('expiresAt', { type: 'Date', nullable: true }),
    }),
  });

  const InviteResultType = builder
    .objectRef<{ invitationId: string; inviteUrl: string; emailSent: boolean }>(
      'InviteResult'
    )
    .implement({
      fields: (t) => ({
        invitationId: t.exposeString('invitationId'),
        inviteUrl: t.exposeString('inviteUrl'),
        emailSent: t.exposeBoolean('emailSent'),
      }),
    });

  builder.queryFields((t) => ({
    myTeams: t.field({
      type: [TeamType],
      resolve: async (_root, _args, ctx) => {
        const user = requireAuthAndGet(ctx);
        // Non-admins: only teams the user is a member of
        const member = await requireOrgMember(user.id, user.organizationId);
        if (isAdminRole(member.role)) {
          return studioDb.team.findMany({
            where: { organizationId: user.organizationId },
            orderBy: { name: 'asc' },
          });
        }
        return studioDb.team.findMany({
          where: {
            organizationId: user.organizationId,
            members: { some: { userId: user.id } },
          },
          orderBy: { name: 'asc' },
        });
      },
    }),
    projectTeams: t.field({
      type: [TeamType],
      args: { projectId: t.arg.string({ required: true }) },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        await ensureProjectAccess(args.projectId, user.id, user.organizationId);
        const links = await studioDb.studioProjectTeam.findMany({
          where: { projectId: args.projectId },
          select: { teamId: true },
        });
        const teamIds = links.map((l) => l.teamId);
        if (!teamIds.length) return [];
        return studioDb.team.findMany({
          where: { id: { in: teamIds }, organizationId: user.organizationId },
          orderBy: { name: 'asc' },
        });
      },
    }),
    organizationMembers: t.field({
      type: [OrganizationMemberType],
      resolve: async (_root, _args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const member = await requireOrgMember(user.id, user.organizationId);
        if (!isAdminRole(member.role)) {
          throw new Error('Only organization admins can list members.');
        }
        return studioDb.member.findMany({
          where: { organizationId: user.organizationId },
          orderBy: { createdAt: 'asc' },
        });
      },
    }),
    organizationInvitations: t.field({
      type: [InvitationType],
      resolve: async (_root, _args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const member = await requireOrgMember(user.id, user.organizationId);
        if (!isAdminRole(member.role)) {
          throw new Error('Only organization admins can list invitations.');
        }
        return studioDb.invitation.findMany({
          where: { organizationId: user.organizationId },
          orderBy: { createdAt: 'desc' },
          take: 100,
        });
      },
    }),
  }));

  builder.mutationFields((t) => ({
    createTeam: t.field({
      type: TeamType,
      args: { name: t.arg.string({ required: true }) },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const member = await requireOrgMember(user.id, user.organizationId);
        if (!isAdminRole(member.role)) {
          throw new Error('Only organization admins can create teams.');
        }
        const name = args.name.trim();
        if (!name) throw new Error('Team name is required.');
        return studioDb.team.create({
          data: { organizationId: user.organizationId, name },
        });
      },
    }),
    renameTeam: t.field({
      type: TeamType,
      args: {
        teamId: t.arg.string({ required: true }),
        name: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const member = await requireOrgMember(user.id, user.organizationId);
        if (!isAdminRole(member.role)) {
          throw new Error('Only organization admins can rename teams.');
        }
        const team = await studioDb.team.findFirst({
          where: { id: args.teamId, organizationId: user.organizationId },
          select: { id: true },
        });
        if (!team) throw new Error('Team not found');
        const name = args.name.trim();
        if (!name) throw new Error('Team name is required.');
        return studioDb.team.update({
          where: { id: args.teamId },
          data: { name },
        });
      },
    }),
    deleteTeam: t.field({
      type: 'Boolean',
      args: { teamId: t.arg.string({ required: true }) },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const member = await requireOrgMember(user.id, user.organizationId);
        if (!isAdminRole(member.role)) {
          throw new Error('Only organization admins can delete teams.');
        }
        const team = await studioDb.team.findFirst({
          where: { id: args.teamId, organizationId: user.organizationId },
          select: { id: true },
        });
        if (!team) return true;
        await studioDb.team.delete({ where: { id: args.teamId } });
        return true;
      },
    }),
    inviteToOrganization: t.field({
      type: InviteResultType,
      args: {
        email: t.arg.string({ required: true }),
        role: t.arg.string(),
        teamId: t.arg.string(),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const member = await requireOrgMember(user.id, user.organizationId);
        if (!isAdminRole(member.role)) {
          throw new Error('Only organization admins can invite members.');
        }
        const email = args.email.trim().toLowerCase();
        if (!email) throw new Error('Email is required.');

        if (args.teamId) {
          const team = await studioDb.team.findFirst({
            where: { id: args.teamId, organizationId: user.organizationId },
            select: { id: true },
          });
          if (!team) throw new Error('Team not found');
        }

        const invitation = await studioDb.invitation.create({
          data: {
            organizationId: user.organizationId,
            email,
            role: args.role ?? null,
            status: 'pending',
            inviterId: user.id,
            teamId: args.teamId ?? null,
          },
          select: { id: true },
        });

        const baseUrl = process.env.CONTRACTSPEC_APP_BASE_URL;
        const inviteUrl = `/invite/${invitation.id}`;
        const absoluteInviteUrl = baseUrl ? `${baseUrl}${inviteUrl}` : inviteUrl;

        const resendKey = process.env.RESEND_API_KEY;
        const from =
          process.env.CONTRACTSPEC_EMAIL_FROM || 'no-reply@contractspec.run';
        let emailSent = false;
        if (resendKey) {
          const resend = new Resend(resendKey);
          await resend.emails.send({
            from,
            to: email,
            subject: 'You have been invited to ContractSpec Studio',
            html: `<p>You have been invited to join an organization in ContractSpec Studio.</p><p><a href="${absoluteInviteUrl}">Accept invitation</a></p>`,
          });
          emailSent = true;
        }

        return { invitationId: invitation.id, inviteUrl, emailSent };
      },
    }),
    setProjectTeams: t.field({
      type: 'Boolean',
      args: {
        projectId: t.arg.string({ required: true }),
        teamIds: t.arg.stringList({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        const member = await requireOrgMember(user.id, user.organizationId);
        if (!isAdminRole(member.role)) {
          throw new Error('Only organization admins can manage project access.');
        }
        // Ensure project exists in org and not deleted
        await ensureProjectExists(args.projectId, user.organizationId);
        // Ensure all teamIds belong to org
        const teams = await studioDb.team.findMany({
          where: { id: { in: args.teamIds }, organizationId: user.organizationId },
          select: { id: true },
        });
        if (teams.length !== args.teamIds.length) {
          throw new Error('One or more teams were not found in this organization.');
        }
        // Replace links
        await studioDb.studioProjectTeam.deleteMany({
          where: { projectId: args.projectId },
        });
        if (args.teamIds.length) {
          await studioDb.studioProjectTeam.createMany({
            data: args.teamIds.map((teamId) => ({
              projectId: args.projectId,
              teamId,
            })),
            skipDuplicates: true,
          });
        }
        return true;
      },
    }),
  }));
}

function requireAuthAndGet(
  ctx: Parameters<typeof requireAuth>[0]
): NonNullable<typeof ctx.user> & { organizationId: string } {
  requireAuth(ctx);
  if (!ctx.organization) {
    throw new Error('Organization context is required.');
  }
  // NOTE: Better Auth session user does not carry organizationId; it lives on ctx.organization.
  // We attach it here to keep downstream code explicit and consistent.
  return {
    ...(ctx.user as NonNullable<typeof ctx.user>),
    organizationId: ctx.organization.id,
  };
}

async function requireOrgMember(userId: string, organizationId: string) {
  const member = await studioDb.member.findFirst({
    where: { userId, organizationId },
    select: { role: true },
  });
  if (!member) throw new Error('Unauthorized');
  return member;
}

function isAdminRole(role: string) {
  return role === 'admin' || role === 'owner';
}

async function ensureProjectExists(projectId: string, organizationId: string) {
  const project = await studioDb.studioProject.findFirst({
    where: { id: projectId, organizationId, deletedAt: null },
    select: { id: true },
  });
  if (!project) throw new Error('Project not found');
}

async function ensureProjectAccess(
  projectId: string,
  userId: string,
  organizationId: string
) {
  const member = await requireOrgMember(userId, organizationId);
  if (isAdminRole(member.role)) {
    await ensureProjectExists(projectId, organizationId);
    return;
  }

  const project = await studioDb.studioProject.findFirst({
    where: { id: projectId, organizationId, deletedAt: null },
    select: { id: true },
  });
  if (!project) throw new Error('Project not found');

  const linkCount = await studioDb.studioProjectTeam.count({
    where: { projectId },
  });
  if (linkCount === 0) {
    return; // org-wide project
  }

  const hasTeamAccess = await studioDb.studioProjectTeam.findFirst({
    where: {
      projectId,
      team: { members: { some: { userId } } },
    },
    select: { id: true },
  });
  if (!hasTeamAccess) {
    throw new Error('Forbidden');
  }
}


