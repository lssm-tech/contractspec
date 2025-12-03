import { NextResponse } from 'next/server';
import { auth } from '@lssm/bundle.contractspec-studio/application/services/auth';
import { prisma } from '@lssm/lib.database-contractspec-studio';

const unauthorized = () =>
  NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return unauthorized();
  }

  const { organizationId } = (await request.json()) as {
    organizationId?: string;
  };

  if (!organizationId) {
    return NextResponse.json(
      { error: 'organizationId is required' },
      { status: 400 }
    );
  }

  const membership = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId,
    },
    select: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          onboardingCompleted: true,
        },
      },
    },
  });

  if (!membership) {
    return NextResponse.json(
      { error: 'Organization not found' },
      { status: 404 }
    );
  }

  await auth.api.setActiveOrganization({
    headers: request.headers,
    body: { organizationId },
  });

  return NextResponse.json({ organization: membership.organization });
}
