import { OrganizationType, prisma } from '@contractspec/lib.database-studio';
import { auth } from '../../../application/services/auth';
import type { contractSpecStudioSchemaBuilder } from '../builder';

const debugGraphQL = process.env.CONTRACTSPEC_DEBUG_GRAPHQL_BUILDER === 'true';

if (debugGraphQL) {
  console.log('[graphql-auth] module loaded');
}

export function registerAuthSchema(
  builder: typeof contractSpecStudioSchemaBuilder
) {
  if (debugGraphQL) {
    console.log('[graphql-auth] registering schema');
  }
  const OrganizationTypeEnum = builder.enumType('OrganizationType', {
    values: Object.values(OrganizationType),
  });

  builder.prismaObject('User', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      firstName: t.exposeString('firstName', { nullable: true }),
      lastName: t.exposeString('lastName', { nullable: true }),
      email: t.exposeString('email'),
      image: t.exposeString('image', { nullable: true }),
      metadata: t.string({
        nullable: true,
        resolve: (o) => (o.metadata ? JSON.stringify(o.metadata) : null),
      }),
      onboardingCompleted: t.exposeBoolean('onboardingCompleted'),
      onboardingStep: t.exposeString('onboardingStep', { nullable: true }),
      emailVerified: t.exposeBoolean('emailVerified'),
      createdAt: t.field({
        type: 'Date',
        resolve: (user) => user.createdAt,
      }),
      updatedAt: t.field({
        type: 'Date',
        resolve: (user) => user.updatedAt,
      }),
      // userProfile: t.relation('userProfile', {
      //   nullable: true,
      // }),
    }),
  });

  // Organization
  builder.prismaObject('Organization', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      name: t.exposeString('name', { nullable: false }),
      slug: t.exposeString('slug', { nullable: true }),
      type: t.expose('type', { type: OrganizationTypeEnum }),
      logo: t.exposeString('logo', { nullable: true }),
      description: t.exposeString('description', { nullable: true }),
      metadata: t.string({
        nullable: true,
        resolve: (o) => (o.metadata ? JSON.stringify(o.metadata) : null),
      }),
      createdAt: t.field({ type: 'Date', resolve: (o) => o.createdAt }),
      updatedAt: t.field({ type: 'Date', resolve: (o) => o.updatedAt }),
    }),
  });

  builder.queryField('me', (t) =>
    t.prismaField({
      type: 'User',
      resolve: async (query, _root, _args, ctx) => {
        if (!ctx.user) {
          console.log('User not found', { user: ctx.user });
          throw new Error('User not found');
        }
        ctx.logger?.info('User profile requested', { userId: ctx.user.id });
        return prisma.user.findUniqueOrThrow({
          ...query,
          where: { id: ctx.user.id },
          // include: { userProfile: true },
        });
      },
    })
  );

  builder.queryField('myActiveOrganization', (t) =>
    t.prismaField({
      type: 'Organization',
      nullable: true,
      resolve: async (query, _root, _args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        const session = await prisma.session.findFirst({
          where: { userId: ctx.user.id },
          orderBy: { createdAt: 'desc' },
        });
        if (!session?.activeOrganizationId) return null;
        return prisma.organization.findUnique({
          ...query,
          where: { id: session.activeOrganizationId },
        });
      },
    })
  );

  const UpdateProfileInput = builder.inputType('UpdateProfileInput', {
    fields: (t) => ({
      name: t.string({ required: false }),
      image: t.string({ required: false }),
    }),
  });

  builder.mutationField('updateProfile', (t) =>
    t.prismaField({
      type: 'User',
      args: { input: t.arg({ type: UpdateProfileInput, required: true }) },
      resolve: async (query, _root, args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        const input = {
          name: args.input.name ?? undefined,
          image: args.input.image ?? undefined,
        };
        return prisma.user.update({
          ...query,
          where: { id: ctx.user.id },
          data: input,
        });
      },
    })
  );

  builder.queryField('myOrganizations', (t) =>
    t.prismaField({
      type: ['Organization'],
      resolve: async (_query, _root, _args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        return prisma.organization.findMany({
          where: { members: { some: { userId: ctx.user.id } } },
        });
      },
    })
  );

  // Lightweight user metadata accessors (JSON string)
  // builder.queryField('userMetadata', (t) =>
  //   t.field({
  //     type: 'String',
  //     nullable: true,
  //     resolve: async (_root, _args, ctx) => {
  //       if (!ctx.user) throw new Error('Unauthorized');
  //       const user = await prisma.user.findUnique({
  //         where: { id: ctx.user.id },
  //         select: { metadata: true },
  //       });
  //       return user?.metadata ?? null;
  //     },
  //   })
  // );

  builder.mutationField('setUserMetadata', (t) =>
    t.boolean({
      args: { json: t.arg.string({ required: true }) },
      resolve: async (_root, args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        // Shallow-merge stringified JSON with existing
        const current = await prisma.user.findUnique({
          where: { id: ctx.user.id },
          select: { metadata: true },
        });
        let currentMeta: Record<string, unknown> = {};
        try {
          currentMeta = current?.metadata
            ? JSON.parse(current.metadata as string)
            : {};
        } catch {
          currentMeta = {};
        }
        let incoming: Record<string, unknown> = {};
        try {
          incoming = JSON.parse(args.json as string);
        } catch {
          incoming = {};
        }
        const nextMeta = { ...currentMeta, ...incoming };
        await prisma.user.update({
          where: { id: ctx.user.id },
          data: { metadata: JSON.stringify(nextMeta) },
        });
        return true;
      },
    })
  );

  // Connections (BetterAuth) – query linked providers and unlink provider
  const ConnectionStatus = builder
    .objectRef<{ linkedProviders: string[] }>('ConnectionStatus')
    .implement({
      fields: (t) => ({
        linkedProviders: t.field({
          type: ['String'],
          resolve: (o) => o.linkedProviders,
        }),
      }),
    });

  builder.queryField('connectionStatus', (t) =>
    t.field({
      type: ConnectionStatus,
      resolve: async (_root, _args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        const accounts = await auth.api.listUserAccounts({
          headers: ctx.headers,
        });
        const linkedProviders: string[] = Array.isArray(accounts)
          ? accounts.map((a) => a.providerId).filter(Boolean)
          : [];
        return { linkedProviders };
      },
    })
  );

  builder.mutationField('unlinkProvider', (t) =>
    t.boolean({
      args: { providerId: t.arg.string({ required: true }) },
      resolve: async (_root, args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        await auth.api.unlinkAccount({
          body: { providerId: args.providerId },
          headers: ctx.headers,
        });
        return true;
      },
    })
  );

  if (debugGraphQL) {
    console.log('[graphql-auth] schema ready');
  }
}
