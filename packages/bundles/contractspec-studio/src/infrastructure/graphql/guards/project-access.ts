import { prisma as studioDb } from '@lssm/lib.database-contractspec-studio';

export type OrgRole = 'owner' | 'admin' | 'member' | string;

export function isOrgAdminRole(role: OrgRole) {
  return role === 'admin' || role === 'owner';
}

export async function requireOrgMember(userId: string, organizationId: string) {
  const member = await studioDb.member.findFirst({
    where: { userId, organizationId },
    select: { role: true },
  });
  if (!member) throw new Error('Unauthorized');
  return member;
}

export async function ensureStudioProjectAccess(input: {
  projectId: string;
  userId: string;
  organizationId: string;
}) {
  const member = await requireOrgMember(input.userId, input.organizationId);

  const project = await studioDb.studioProject.findFirst({
    where: {
      id: input.projectId,
      organizationId: input.organizationId,
      deletedAt: null,
    },
    select: { id: true },
  });
  if (!project) throw new Error('Project not found');

  if (isOrgAdminRole(member.role)) return;

  // If no team restrictions, project is org-wide
  const linkCount = await studioDb.studioProjectTeam.count({
    where: { projectId: input.projectId },
  });
  if (linkCount === 0) return;

  // Must belong to at least one team linked to the project
  const allowed = await studioDb.studioProjectTeam.findFirst({
    where: {
      projectId: input.projectId,
      team: { members: { some: { userId: input.userId } } },
    },
    select: { id: true },
  });
  if (!allowed) throw new Error('Forbidden');
}










