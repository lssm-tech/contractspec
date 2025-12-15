import { NextResponse } from 'next/server';
import { auth } from '@lssm/bundle.contractspec-studio/application/services/auth';
import { prisma } from '@lssm/lib.database-contractspec-studio';

const redirectToLogin = (request: Request, invitePath: string) =>
  NextResponse.redirect(
    new URL(`/login?redirect=${encodeURIComponent(invitePath)}`, request.url)
  );

export async function GET(
  request: Request,
  context: { params: Promise<{ invitationId: string }> }
) {
  const { invitationId } = await context.params;
  const invitePath = `/invite/${invitationId}`;

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return redirectToLogin(request, invitePath);
  }

  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    select: {
      id: true,
      organizationId: true,
      email: true,
      role: true,
      status: true,
      expiresAt: true,
      teamId: true,
    },
  });

  if (!invitation) {
    return NextResponse.redirect(new URL('/studio/projects', request.url));
  }

  const userEmail = session.user.email?.trim().toLowerCase();
  if (!userEmail || userEmail !== invitation.email.trim().toLowerCase()) {
    return NextResponse.json(
      { error: 'This invitation does not match your account email.' },
      { status: 403 }
    );
  }

  if (invitation.expiresAt && invitation.expiresAt.getTime() < Date.now()) {
    await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: 'expired' },
    });
    return NextResponse.json({ error: 'Invitation expired.' }, { status: 410 });
  }

  // Ensure organization membership
  const existingMember = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: invitation.organizationId,
    },
    select: { id: true },
  });
  if (!existingMember) {
    await prisma.member.create({
      data: {
        userId: session.user.id,
        organizationId: invitation.organizationId,
        role: invitation.role ?? 'member',
      },
    });
  }

  // Ensure team membership if invite scoped to a team
  if (invitation.teamId) {
    const existingTeamMember = await prisma.teamMember.findFirst({
      where: { teamId: invitation.teamId, userId: session.user.id },
      select: { id: true },
    });
    if (!existingTeamMember) {
      await prisma.teamMember.create({
        data: { teamId: invitation.teamId, userId: session.user.id },
      });
    }
  }

  if (invitation.status !== 'accepted') {
    await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: 'accepted', acceptedAt: new Date() },
    });
  }

  await auth.api.setActiveOrganization({
    headers: request.headers,
    body: { organizationId: invitation.organizationId },
  });

  return NextResponse.redirect(new URL('/studio/projects', request.url));
}



