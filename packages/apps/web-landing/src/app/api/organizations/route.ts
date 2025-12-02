import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@lssm/bundle.contractspec-studio/application/services/auth';
import { prisma } from '@lssm/lib.database-contractspec-studio';
import { OrganizationType } from '@lssm/lib.database-contractspec-studio/enums';

const unauthorized = () =>
  NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'workspace';

async function ensureUniqueSlug(base: string) {
  let candidate = normalizeSlug(base);
  let suffix = 1;
  while (true) {
    const existing = await prisma.organization.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing) {
      return candidate;
    }
    candidate = `${normalizeSlug(base)}-${suffix++}`;
  }
}

export async function GET() {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session?.user?.id) {
    return unauthorized();
  }

  const memberships = await prisma.member.findMany({
    where: { userId: session.user.id },
    select: {
      role: true,
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          onboardingCompleted: true,
          createdAt: true,
        },
      },
    },
    orderBy: { organization: { createdAt: 'asc' } },
  });

  return NextResponse.json({
    organizations: memberships.map((membership) => ({
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      type: membership.organization.type,
      onboardingCompleted: membership.organization.onboardingCompleted,
      role: membership.role,
    })),
  });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return unauthorized();
  }

  const { name, type } = (await request.json()) as {
    name?: string;
    type?: OrganizationType;
  };

  if (!name || typeof name !== 'string') {
    return NextResponse.json(
      { error: 'Organization name is required' },
      { status: 400 }
    );
  }

  const orgType =
    type && Object.values(OrganizationType).includes(type)
      ? type
      : OrganizationType.CONTRACT_SPEC_CUSTOMER;

  const slug = await ensureUniqueSlug(name);

  const organization = await prisma.organization.create({
    data: {
      name,
      slug,
      type: orgType,
      members: {
        create: {
          userId: session.user.id,
          role: 'owner',
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      onboardingCompleted: true,
    },
  });

  await auth.api.setActiveOrganization({
    headers: request.headers,
    body: { organizationId: organization.id },
  });

  return NextResponse.json(
    {
      organization,
    },
    { status: 201 }
  );
}
