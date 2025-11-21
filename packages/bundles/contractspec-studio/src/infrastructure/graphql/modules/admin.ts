import { gqlSchemaBuilder } from '../builder';
import {
  ComplianceBadgeStatus,
  DocumentType,
  DocumentStatus,
  OrganizationType,
  prisma,
} from '@lssm/app.cli-database-strit';
import { requirePlatformAdmin } from '../guards';

export function registerAdminSchema() {
  gqlSchemaBuilder.queryField('adminBookings', (t) =>
    t.prismaConnection({
      type: 'Booking',
      cursor: 'id',
      resolve: async (query, _root, _args, ctx) => {
        await requirePlatformAdmin(ctx);
        return prisma.booking.findMany({
          ...query,
          orderBy: { bookedAt: 'desc' },
        });
      },
    })
  );

  gqlSchemaBuilder.queryField('adminWholesaleOrders', (t) =>
    t.prismaConnection({
      type: 'WholesaleOrder',
      cursor: 'id',
      resolve: async (query, _root, _args, ctx) => {
        await requirePlatformAdmin(ctx);
        return prisma.wholesaleOrder.findMany({
          ...query,
          orderBy: { createdAt: 'desc' },
        });
      },
    })
  );

  interface AdminWaitingListRow {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    createdAt: Date;
  }
  const WaitingListRow = gqlSchemaBuilder
    .objectRef<AdminWaitingListRow>('WaitingListRow')
    .implement({
      fields: (t) => ({
        id: t.id({ resolve: (o) => o.id }),
        firstName: t.string({
          nullable: true,
          resolve: (o) => o.firstName ?? null,
        }),
        lastName: t.string({
          nullable: true,
          resolve: (o) => o.lastName ?? null,
        }),
        email: t.string({ resolve: (o) => o.email }),
        createdAt: t.field({ type: 'Date', resolve: (o) => o.createdAt }),
      }),
    });

  interface AdminWaitingListShape {
    items: AdminWaitingListRow[];
  }
  const AdminWaitingList = gqlSchemaBuilder
    .objectRef<AdminWaitingListShape>('AdminWaitingList')
    .implement({
      fields: (t) => ({
        items: t.field({ type: [WaitingListRow], resolve: (o) => o.items }),
      }),
    });

  gqlSchemaBuilder.queryField('adminWaitingList', (t) =>
    t.field({
      type: AdminWaitingList,
      resolve: async (_root, _args, ctx) => {
        await requirePlatformAdmin(ctx);
        const items = await prisma.waitingList.findMany({
          orderBy: { createdAt: 'desc' },
          take: 200,
        });
        return { items } satisfies AdminWaitingListShape;
      },
    })
  );

  // Admin users with compliance snapshot
  interface AdminUserWithComplianceShape {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    complianceBadge: ComplianceBadgeStatus;
    uploadedDocCount: number;
    lastUploadAt: Date | null;
  }
  const AdminUserWithCompliance = gqlSchemaBuilder
    .objectRef<AdminUserWithComplianceShape>('AdminUserWithCompliance')
    .implement({
      fields: (t) => ({
        id: t.id({ resolve: (o) => o.id }),
        firstName: t.string({
          nullable: true,
          resolve: (o) => o.firstName ?? null,
        }),
        lastName: t.string({
          nullable: true,
          resolve: (o) => o.lastName ?? null,
        }),
        email: t.string({ resolve: (o) => o.email }),
        complianceBadge: t.field({
          type: 'ComplianceBadgeStatus',
          resolve: (o) => o.complianceBadge,
          nullable: false,
        }),
        uploadedDocCount: t.int({ resolve: (o) => o.uploadedDocCount }),
        lastUploadAt: t.field({
          type: 'Date',
          nullable: true,
          resolve: (o) => o.lastUploadAt ?? null,
        }),
      }),
    });

  interface AdminUsersPageShape {
    items: AdminUserWithComplianceShape[];
    totalItems: number;
    totalPages: number;
  }
  const PaginatedUsers = gqlSchemaBuilder
    .objectRef<AdminUsersPageShape>('AdminUsersPage')
    .implement({
      fields: (t) => ({
        items: t.field({
          type: [AdminUserWithCompliance],
          resolve: (o) => o.items,
        }),
        totalItems: t.int({ resolve: (o) => o.totalItems }),
        totalPages: t.int({ resolve: (o) => o.totalPages }),
      }),
    });

  gqlSchemaBuilder.queryField('adminUsersWithCompliance', (t) =>
    t.field({
      type: PaginatedUsers,
      args: {
        page: t.arg.int({ required: false }),
        limit: t.arg.int({ required: false }),
      },
      resolve: async (_root, args, ctx) => {
        await requirePlatformAdmin(ctx);
        const page = args.page ?? 1;
        const limit = args.limit ?? 20;
        const totalItems = await prisma.user.count();
        const users = await prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: (page - 1) * limit,
        });
        const items: AdminUserWithComplianceShape[] = [];
        for (const u of users) {
          const membership = await prisma.member.findFirst({
            where: { userId: u.id },
            select: { organizationId: true },
          });
          let badge: ComplianceBadgeStatus = ComplianceBadgeStatus.MISSING_CORE;
          let uploadedDocCount = 0;
          let lastUploadAt: Date | null = null;
          if (membership?.organizationId) {
            const org = await prisma.organization.findUnique({
              where: { id: membership.organizationId },
              select: { complianceBadge: true },
            });
            badge = org?.complianceBadge ?? ComplianceBadgeStatus.MISSING_CORE;
            const docsAgg = await prisma.stritDocument.aggregate({
              where: { sellerId: membership.organizationId },
              _count: { _all: true },
              _max: { updatedAt: true },
            });
            uploadedDocCount = docsAgg._count._all ?? 0;
            lastUploadAt = (docsAgg._max.updatedAt as Date | null) ?? null;
          }
          items.push({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            complianceBadge: badge,
            uploadedDocCount,
            lastUploadAt,
          });
        }
        return {
          items,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        } satisfies AdminUsersPageShape;
      },
    })
  );

  // Mutations and supporting types for platform admin management
  const AdminCreateOrganizationInput = gqlSchemaBuilder.inputType(
    'AdminCreateOrganizationInput',
    {
      fields: (t) => ({
        name: t.string({ required: true }),
        type: t.field({ type: 'OrganizationType', required: true }),
        slug: t.string({ required: false }),
        siret: t.string({ required: false }),
        cityId: t.id({ required: false }),
      }),
    }
  );

  gqlSchemaBuilder.mutationField('adminCreateOrganization', (t) =>
    t.prismaField({
      type: 'Organization',
      args: {
        input: t.arg({ type: AdminCreateOrganizationInput, required: true }),
      },
      resolve: async (query, _root, args, ctx) => {
        await requirePlatformAdmin(ctx);
        const input = args.input;
        const safeSlug =
          (input.slug as string | undefined) ??
          (input.name as string)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        return prisma.organization.create({
          ...query,
          data: {
            name: input.name,
            slug: safeSlug,
            createdAt: new Date(),
            type: input.type,
            companyName: input.name,
            siret: (input.siret as string | undefined) ?? null,
            cityId: (input.cityId as string | undefined) ?? null,
            onboardingCompleted: true,
            onboardingStep: null,
          },
        });
      },
    })
  );

  const AdminCreateUserInput = gqlSchemaBuilder.inputType(
    'AdminCreateUserInput',
    {
      fields: (t) => ({
        organizationId: t.id({ required: true }),
        email: t.string({ required: true }),
        firstName: t.string({ required: true }),
        lastName: t.string({ required: true }),
        role: t.string({ required: false }),
      }),
    }
  );

  gqlSchemaBuilder.mutationField('adminCreateUser', (t) =>
    t.field({
      type: 'ID',
      args: { input: t.arg({ type: AdminCreateUserInput, required: true }) },
      resolve: async (_root, args, ctx) => {
        await requirePlatformAdmin(ctx);
        const { organizationId, email, firstName, lastName, role } = args.input;
        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            firstName,
            lastName,
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        const existing = await prisma.member.findUnique({
          where: { userId_organizationId: { userId: user.id, organizationId } },
        });
        if (!existing) {
          await prisma.member.create({
            data: {
              organizationId,
              userId: user.id,
              role: (role as string | undefined) ?? 'member',
              createdAt: new Date(),
            },
          });
        }
        return user.id;
      },
    })
  );

  const AdminInviteInput = gqlSchemaBuilder.inputType('AdminInviteInput', {
    fields: (t) => ({
      organizationId: t.id({ required: true }),
      email: t.string({ required: true }),
      role: t.string({ required: false }),
    }),
  });

  gqlSchemaBuilder.mutationField('adminInviteToCollectivity', (t) =>
    t.field({
      type: 'ID',
      args: { input: t.arg({ type: AdminInviteInput, required: true }) },
      resolve: async (_root, args, ctx) => {
        await requirePlatformAdmin(ctx);
        const { organizationId, email, role } = args.input;
        const invite = await prisma.invitation.create({
          data: {
            organizationId,
            email: String(email).toLowerCase(),
            role: (role as string | undefined) ?? 'member',
            status: 'pending',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            inviterId: ctx.user.id,
          },
        });
        return invite.id;
      },
    })
  );

  const AdminAppendCollectivityNoteInput = gqlSchemaBuilder.inputType(
    'AdminAppendCollectivityNoteInput',
    {
      fields: (t) => ({
        organizationId: t.id({ required: true }),
        author: t.string({ required: false }),
        content: t.string({ required: true }),
        stage: t.string({ required: false }),
      }),
    }
  );

  gqlSchemaBuilder.mutationField('adminAppendCollectivityNote', (t) =>
    t.boolean({
      args: {
        input: t.arg({
          type: AdminAppendCollectivityNoteInput,
          required: true,
        }),
      },
      resolve: async (_root, args, ctx) => {
        await requirePlatformAdmin(ctx);
        const { organizationId, author, content, stage } = args.input;
        const org = await prisma.organization.findUnique({
          where: { id: organizationId },
          select: { metadata: true },
        });
        const parsed = org?.metadata ? JSON.parse(org.metadata as string) : {};
        const notes = Array.isArray(parsed.collectivityNotes)
          ? parsed.collectivityNotes
          : [];
        notes.push({
          at: new Date().toISOString(),
          author: author || 'platform',
          content,
          stage: stage || 'contact',
        });
        const metadata = JSON.stringify({
          ...parsed,
          collectivityNotes: notes,
        });
        await prisma.organization.update({
          where: { id: organizationId },
          data: { metadata },
        });
        return true;
      },
    })
  );

  // Queries mirroring current REST data aggregations
  gqlSchemaBuilder.queryField('adminCollectivities', (t) =>
    t.prismaField({
      type: ['Organization'],
      resolve: async (query, _root, _args, ctx) => {
        // console.log('ctx', { user: ctx.user });
        await requirePlatformAdmin(ctx);
        const organizations = await prisma.organization.findMany({
          ...query,
          where: { type: OrganizationType.COLLECTIVITY },
          orderBy: { name: 'asc' },
        });
        return organizations;
      },
    })
  );

  const AdminCollectivityById = gqlSchemaBuilder.inputType(
    'AdminCollectivityById',
    {
      fields: (t) => ({
        id: t.id({ required: true }),
      }),
    }
  );
  gqlSchemaBuilder.queryField('adminCollectivity', (t) =>
    t.prismaField({
      args: {
        input: t.arg({
          type: AdminCollectivityById,
          required: true,
        }),
      },
      type: 'Organization',
      resolve: async (query, _root, args, ctx) => {
        // console.log('ctx', { user: ctx.user });
        await requirePlatformAdmin(ctx);
        const organization = await prisma.organization.findUnique({
          ...query,
          where: { type: OrganizationType.COLLECTIVITY, id: args.input.id },
        });
        return organization;
      },
    })
  );

  gqlSchemaBuilder.queryField('adminSellers', (t) =>
    t.prismaField({
      type: ['Organization'],
      resolve: async (query, _root, _args, ctx) => {
        // console.log('ctx', { user: ctx.user });
        await requirePlatformAdmin(ctx);
        return prisma.organization.findMany({
          ...query,
          where: { type: OrganizationType.SELLER },
          orderBy: { createdAt: 'desc' },
        });
      },
    })
  );

  // Content management (admin) — use Prisma plugin objects and fields
  const ContentTypeEnum = gqlSchemaBuilder.enumType('ContentType', {
    values: ['HELP', 'TUTORIAL', 'ACADEMY'] as const,
  });

  gqlSchemaBuilder.prismaObject('ContentLocale', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      locale: t.exposeString('locale'),
      slug: t.exposeString('slug'),
      title: t.exposeString('title'),
      summary: t.exposeString('summary', { nullable: true }),
      metaTitle: t.exposeString('metaTitle', { nullable: true }),
      metaDescription: t.exposeString('metaDescription', { nullable: true }),
      translationStatus: t.string({
        nullable: true,
        resolve: (o) => o.translationStatus ?? null,
      }),
      mtProvider: t.string({
        nullable: true,
        resolve: (o) => o.mtProvider ?? null,
      }),
      humanReviewedAt: t.field({
        type: 'Date',
        nullable: true,
        resolve: (o) => o.humanReviewedAt ?? null,
      }),
      mtAt: t.field({
        type: 'Date',
        nullable: true,
        resolve: (o) => o.mtAt ?? null,
      }),
      updatedAt: t.field({ type: 'Date', resolve: (o) => o.updatedAt }),
    }),
  });

  gqlSchemaBuilder.prismaObject('Tag', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      name: t.exposeString('name'),
    }),
  });

  gqlSchemaBuilder.prismaObject('ContentTag', {
    fields: (t) => ({
      contentId: t.exposeString('contentId'),
      tagId: t.exposeString('tagId'),
      tag: t.relation('tag'),
    }),
  });

  gqlSchemaBuilder.prismaObject('Content', {
    fields: (t) => ({
      id: t.exposeID('id', { nullable: false }),
      type: t.field({ type: ContentTypeEnum, resolve: (c) => c.type }),
      isPublished: t.exposeBoolean('isPublished'),
      publishedAt: t.field({
        type: 'Date',
        nullable: true,
        resolve: (c) => c.publishedAt,
      }),
      createdAt: t.field({ type: 'Date', resolve: (c) => c.createdAt }),
      updatedAt: t.field({ type: 'Date', resolve: (c) => c.updatedAt }),
      locales: t.relation('locales'),
      tags: t.relation('tags'),
    }),
  });

  gqlSchemaBuilder.queryField('adminContentList', (t) =>
    t.prismaField({
      type: ['Content'],
      resolve: async (query, _root, _args, ctx) => {
        await requirePlatformAdmin(ctx);
        console.log('query adminCon tent', query);
        return prisma.content.findMany({
          ...query,
          orderBy: { updatedAt: 'desc' },
          take: 200,
        });
      },
    })
  );

  const AdminContentLocaleInput = gqlSchemaBuilder.inputType(
    'AdminContentLocaleInput',
    {
      fields: (t) => ({
        locale: t.string({ required: true }),
        slug: t.string({ required: true }),
        title: t.string({ required: true }),
        summary: t.string({ required: false }),
        metaTitle: t.string({ required: false }),
        metaDescription: t.string({ required: false }),
        body_plain: t.string({ required: false }),
      }),
    }
  );

  const AdminUpsertContentInput = gqlSchemaBuilder.inputType(
    'AdminUpsertContentInput',
    {
      fields: (t) => ({
        id: t.id({ required: false }),
        type: t.field({ type: ContentTypeEnum, required: true }),
        isPublished: t.boolean({ required: false }),
        tags: t.field({ type: ['String'], required: false }),
        locales: t.field({ type: [AdminContentLocaleInput], required: true }),
      }),
    }
  );

  gqlSchemaBuilder.mutationField('adminUpsertContent', (t) =>
    t.prismaField({
      type: 'Content',
      args: { input: t.arg({ type: AdminUpsertContentInput, required: true }) },
      resolve: async (query, _root, args, ctx) => {
        await requirePlatformAdmin(ctx);
        const input = args.input;
        const now = new Date();
        let contentId: string | undefined;

        await prisma.$transaction(async (tx) => {
          const exists = input.id
            ? await tx.content.findUnique({
                where: { id: input.id },
                select: { id: true },
              })
            : null;
          if (exists) {
            contentId = exists.id;
            await tx.content.update({
              where: { id: exists.id },
              data: {
                type: input.type,
                isPublished: !!input.isPublished,
                publishedAt: input.isPublished ? now : null,
                updatedAt: now,
              },
            });
          } else {
            const created = await tx.content.create({
              data: {
                type: input.type,
                isPublished: !!input.isPublished,
                publishedAt: input.isPublished ? now : null,
                createdAt: now,
                updatedAt: now,
              },
            });
            contentId = created.id;
          }

          // Tags: connect or create by name, then reset join table
          const tagNames: string[] = Array.isArray(input.tags)
            ? (input.tags as string[]).filter((s) => !!s && s.trim().length > 0)
            : [];
          if (tagNames.length > 0) {
            const tagIds: string[] = [];
            for (const name of tagNames) {
              const tag = await tx.tag.upsert({
                where: { name },
                create: { name },
                update: {},
                select: { id: true },
              });
              tagIds.push(tag.id);
            }
            await tx.contentTag.deleteMany({ where: { contentId } });
            if (tagIds.length > 0) {
              await tx.contentTag.createMany({
                data: tagIds.map((tagId) => ({ contentId: contentId!, tagId })),
                skipDuplicates: true,
              });
            }
          } else {
            await tx.contentTag.deleteMany({
              where: { contentId: contentId! },
            });
          }

          // Locales upsert
          const locales = Array.isArray(input.locales) ? input.locales : [];
          for (const l of locales) {
            await tx.contentLocale.upsert({
              where: {
                contentId_locale: {
                  contentId: contentId!,
                  locale: String(l.locale),
                },
              },
              update: {
                slug: String(l.slug),
                title: String(l.title),
                summary: (l.summary as string | undefined) ?? null,
                metaTitle: (l.metaTitle as string | undefined) ?? null,
                metaDescription:
                  (l.metaDescription as string | undefined) ?? null,
                body_plain: (l.body_plain as string | undefined) ?? null,
                updatedAt: now,
              },
              create: {
                contentId: contentId!,
                locale: String(l.locale),
                slug: String(l.slug),
                title: String(l.title),
                summary: (l.summary as string | undefined) ?? null,
                metaTitle: (l.metaTitle as string | undefined) ?? null,
                metaDescription:
                  (l.metaDescription as string | undefined) ?? null,
                body_plain: (l.body_plain as string | undefined) ?? null,
                createdAt: now,
                updatedAt: now,
              },
            });
          }
        });

        return prisma.content.findUniqueOrThrow({
          ...query,
          where: { id: contentId },
        });
      },
    })
  );

  // DeepL-backed translation service: adminTranslateContent
  const AdminTranslateContentInput = gqlSchemaBuilder.inputType(
    'AdminTranslateContentInput',
    {
      fields: (t) => ({
        contentId: t.id({ required: true }),
        sourceLocale: t.string({ required: true }),
        targetLocale: t.string({ required: true }),
        fields: t.field({ type: ['String'], required: false }),
      }),
    }
  );

  gqlSchemaBuilder.mutationField('adminTranslateContent', (t) =>
    t.prismaField({
      type: 'Content',
      args: {
        input: t.arg({ type: AdminTranslateContentInput, required: true }),
      },
      resolve: async (query, _root, args, ctx) => {
        await requirePlatformAdmin(ctx);
        const { contentId, sourceLocale, targetLocale } = args.input;

        const source = await prisma.contentLocale.findUnique({
          where: { contentId_locale: { contentId, locale: sourceLocale } },
          select: {
            slug: true,
            title: true,
            summary: true,
            metaTitle: true,
            metaDescription: true,
            body_plain: true,
          },
        });
        if (!source) throw new Error('SOURCE_NOT_FOUND');

        // Minimal DeepL client via fetch; glossary/TM hooks can be added later
        const authKey = process.env.DEEPL_API_KEY;
        if (!authKey) throw new Error('DEEPL_API_KEY_MISSING');
        async function translate(
          text: string | null | undefined
        ): Promise<string | null> {
          const val = (text ?? '').trim();
          if (!val) return null;
          const res = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              auth_key: authKey!,
              text: val,
              target_lang: targetLocale.toUpperCase(),
            }),
          });
          const json = await res.json();
          return json.translations?.[0]?.text ?? val;
        }

        const [tTitle, tSummary, tMetaTitle, tMetaDesc, tBody] =
          await Promise.all([
            translate(source.title),
            translate(source.summary),
            translate(source.metaTitle),
            translate(source.metaDescription),
            translate(source.body_plain),
          ]);

        await prisma.contentLocale.upsert({
          where: { contentId_locale: { contentId, locale: targetLocale } },
          create: {
            contentId,
            locale: targetLocale,
            slug: source.slug,
            title: tTitle ?? '',
            summary: tSummary,
            metaTitle: tMetaTitle,
            metaDescription: tMetaDesc,
            body_plain: tBody,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          update: {
            title: tTitle ?? '',
            summary: tSummary,
            metaTitle: tMetaTitle,
            metaDescription: tMetaDesc,
            body_plain: tBody,
            updatedAt: new Date(),
          },
        });

        // Update translation metadata via raw SQL to avoid Prisma type gaps
        await prisma.$executeRawUnsafe(
          'UPDATE public.content_locale SET "translationStatus"=$1, "mtProvider"=$2, "mtAt"=NOW() WHERE "contentId"=$3 AND locale=$4',
          'MT_READY',
          'deepl',
          contentId,
          targetLocale
        );

        return prisma.content.findUniqueOrThrow({
          ...query,
          where: { id: contentId },
        });
      },
    })
  );

  // Admin view of a user's documents (for the user detail page)
  const AdminUserDocument = gqlSchemaBuilder
    .objectRef<{
      id: string;
      fileName: string;
      documentType: DocumentType;
      status: DocumentStatus;
      updatedAt: Date;
      verifiedAt: Date | null;
      reviewNotes: string | null;
    }>('AdminUserDocument')
    .implement({
      fields: (t) => ({
        id: t.id({ resolve: (o) => o.id, nullable: false }),
        fileName: t.string({ nullable: false, resolve: (o) => o.fileName }),
        documentType: t.string({
          nullable: false,
          resolve: (o) => o.documentType,
        }),
        status: t.field({
          type: 'DocumentStatus',
          nullable: false,
          resolve: (o) => o.status,
        }),
        updatedAt: t.field({
          type: 'Date',
          nullable: false,
          resolve: (o) => o.updatedAt,
        }),
        verifiedAt: t.field({
          type: 'Date',
          nullable: true,
          resolve: (o) => o.verifiedAt,
        }),
        reviewNotes: t.string({
          nullable: true,
          resolve: (o) => o.reviewNotes,
        }),
      }),
    });

  gqlSchemaBuilder.queryField('adminUserDocuments', (t) =>
    t.field({
      type: [AdminUserDocument],
      args: { userId: t.arg.id({ required: true }) },
      resolve: async (_root, args, ctx) => {
        await requirePlatformAdmin(ctx);
        const membership = await prisma.member.findFirst({
          where: { userId: args.userId as string },
          select: { organizationId: true },
        });
        if (!membership?.organizationId) return [];
        const docs = await prisma.stritDocument.findMany({
          where: { sellerId: membership.organizationId },
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            fileName: true,
            documentType: true,
            status: true,
            updatedAt: true,
            verifiedAt: true,
            reviewNotes: true,
          },
        });
        return docs;
      },
    })
  );

  // Admin: Allow waitlist entry (whitelist) and auto-create user if missing
  const AdminAllowWaitlistInput = gqlSchemaBuilder.inputType(
    'AdminAllowWaitlistInput',
    {
      fields: (t) => ({
        waitingListId: t.id({ required: true }),
      }),
    }
  );

  gqlSchemaBuilder.mutationField('adminAllowWaitlistEntry', (t) =>
    t.boolean({
      args: { input: t.arg({ type: AdminAllowWaitlistInput, required: true }) },
      resolve: async (_root, args, ctx) => {
        await requirePlatformAdmin(ctx);
        const { waitingListId } = args.input;

        const entry = await prisma.waitingList.findUnique({
          where: { id: waitingListId },
        });
        if (!entry) throw new Error('WAITLIST_NOT_FOUND');
        const now = new Date();
        await prisma.user.upsert({
          where: { email: entry.email },
          update: {
            // whitelistId: waitingListId,
            whitelistedAt: now,
            updatedAt: now,
          },
          create: {
            email: entry.email,
            firstName: entry.firstName ?? null,
            lastName: entry.lastName ?? null,
            // whitelistId: waitingListId,
            whitelistedAt: now,
            createdAt: now,
            updatedAt: now,
          },
        });
        return true;
      },
    })
  );

  // Admin User Details Query - Complete user information for admin management
  const AdminUserProfile = gqlSchemaBuilder
    .objectRef<{
      firstName: string | null;
      lastName: string | null;
      dateOfBirth: Date | null;
      address: {
        street: string | null;
        city: string | null;
        postalCode: string | null;
        country: string | null;
      } | null;
      profession: string | null;
      companyName: string | null;
      siret: string | null;
    }>('AdminUserProfile')
    .implement({
      fields: (t) => ({
        firstName: t.string({ nullable: true, resolve: (o) => o.firstName }),
        lastName: t.string({ nullable: true, resolve: (o) => o.lastName }),
        dateOfBirth: t.field({
          type: 'Date',
          nullable: true,
          resolve: (o) => o.dateOfBirth,
        }),
        address: t.field({
          type: gqlSchemaBuilder
            .objectRef<{
              street: string | null;
              city: string | null;
              postalCode: string | null;
              country: string | null;
            }>('AdminUserAddress')
            .implement({
              fields: (t) => ({
                street: t.string({ nullable: true, resolve: (o) => o.street }),
                city: t.string({ nullable: true, resolve: (o) => o.city }),
                postalCode: t.string({
                  nullable: true,
                  resolve: (o) => o.postalCode,
                }),
                country: t.string({
                  nullable: true,
                  resolve: (o) => o.country,
                }),
              }),
            }),
          nullable: true,
          resolve: (o) => o.address,
        }),
        profession: t.string({ nullable: true, resolve: (o) => o.profession }),
        companyName: t.string({
          nullable: true,
          resolve: (o) => o.companyName,
        }),
        siret: t.string({ nullable: true, resolve: (o) => o.siret }),
      }),
    });

  const AdminUserKYC = gqlSchemaBuilder
    .objectRef<{
      status: string;
      level: number;
      verifiedAt: Date | null;
      reviewedBy: string | null;
      reviewNotes: string | null;
      documents: any[];
      riskScore: number;
      lastReviewAt: Date | null;
    }>('AdminUserKYC')
    .implement({
      fields: (t) => ({
        status: t.string({ resolve: (o) => o.status }),
        level: t.int({ resolve: (o) => o.level }),
        verifiedAt: t.field({
          type: 'Date',
          nullable: true,
          resolve: (o) => o.verifiedAt,
        }),
        reviewedBy: t.string({ nullable: true, resolve: (o) => o.reviewedBy }),
        reviewNotes: t.string({
          nullable: true,
          resolve: (o) => o.reviewNotes,
        }),
        documents: t.field({
          type: [AdminUserDocument],
          resolve: (o) => o.documents,
        }),
        riskScore: t.int({ resolve: (o) => o.riskScore }),
        lastReviewAt: t.field({
          type: 'Date',
          nullable: true,
          resolve: (o) => o.lastReviewAt,
        }),
      }),
    });

  const AdminUserMetrics = gqlSchemaBuilder
    .objectRef<{
      totalLogins: number;
      lastActivityAt: Date | null;
      documentsUploaded: number;
      organizationsCount: number;
      subscriptionStatus: string | null;
      lifetimeValue: number;
    }>('AdminUserMetrics')
    .implement({
      fields: (t) => ({
        totalLogins: t.int({ resolve: (o) => o.totalLogins }),
        lastActivityAt: t.field({
          type: 'Date',
          nullable: true,
          resolve: (o) => o.lastActivityAt,
        }),
        documentsUploaded: t.int({ resolve: (o) => o.documentsUploaded }),
        organizationsCount: t.int({ resolve: (o) => o.organizationsCount }),
        subscriptionStatus: t.string({
          nullable: true,
          resolve: (o) => o.subscriptionStatus,
        }),
        lifetimeValue: t.int({ resolve: (o) => o.lifetimeValue }),
      }),
    });

  const AdminUserOrganization = gqlSchemaBuilder
    .objectRef<{
      id: string;
      name: string;
      role: string;
      joinedAt: Date;
    }>('AdminUserOrganization')
    .implement({
      fields: (t) => ({
        id: t.id({ resolve: (o) => o.id }),
        name: t.string({ resolve: (o) => o.name }),
        role: t.string({ resolve: (o) => o.role }),
        joinedAt: t.field({ type: 'Date', resolve: (o) => o.joinedAt }),
      }),
    });

  const AdminUserDetails = gqlSchemaBuilder
    .objectRef<{
      id: string;
      email: string;
      name: string | null;
      phoneNumber: string | null;
      createdAt: Date;
      updatedAt: Date;
      lastLoginAt: Date | null;
      status: string;
      emailVerified: boolean;
      phoneVerified: boolean;
      profile: any;
      kyc: any;
      metrics: any;
      organizations: any[];
    }>('AdminUserDetails')
    .implement({
      fields: (t) => ({
        id: t.id({ resolve: (o) => o.id }),
        email: t.string({ resolve: (o) => o.email }),
        name: t.string({ nullable: true, resolve: (o) => o.name }),
        phoneNumber: t.string({
          nullable: true,
          resolve: (o) => o.phoneNumber,
        }),
        createdAt: t.field({ type: 'Date', resolve: (o) => o.createdAt }),
        updatedAt: t.field({ type: 'Date', resolve: (o) => o.updatedAt }),
        lastLoginAt: t.field({
          type: 'Date',
          nullable: true,
          resolve: (o) => o.lastLoginAt,
        }),
        status: t.string({ resolve: (o) => o.status }),
        emailVerified: t.boolean({ resolve: (o) => o.emailVerified }),
        phoneVerified: t.boolean({ resolve: (o) => o.phoneVerified }),
        profile: t.field({
          type: AdminUserProfile,
          nullable: true,
          resolve: (o) => o.profile,
        }),
        kyc: t.field({
          type: AdminUserKYC,
          nullable: true,
          resolve: (o) => o.kyc,
        }),
        metrics: t.field({
          type: AdminUserMetrics,
          nullable: true,
          resolve: (o) => o.metrics,
        }),
        organizations: t.field({
          type: [AdminUserOrganization],
          resolve: (o) => o.organizations,
        }),
      }),
    });

  gqlSchemaBuilder.queryField('adminUserDetails', (t) =>
    t.field({
      type: AdminUserDetails,
      args: { userId: t.arg.id({ required: true }) },
      resolve: async (_root, args, ctx) => {
        await requirePlatformAdmin(ctx);
        const userId = args.userId as string;

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            createdAt: true,
            updatedAt: true,
            emailVerified: true,
          },
        });
        if (!user) throw new Error('User not found');

        const memberships = await prisma.member.findMany({
          where: { userId },
          include: { organization: { select: { id: true, name: true } } },
        });

        const organizations = memberships.map((m) => ({
          id: m.organization.id,
          name: m.organization.name,
          role: m.role,
          joinedAt: m.createdAt,
        }));

        const primaryMembership = memberships[0];
        let profile: any = null;
        let kyc: any = null;
        if (primaryMembership) {
          const org = await prisma.organization.findUnique({
            where: { id: primaryMembership.organizationId },
            select: { metadata: true, companyName: true, siret: true },
          });
          const metadata = org?.metadata
            ? JSON.parse(org.metadata as string)
            : {};
          profile = {
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: null,
            address: metadata.address || null,
            profession: metadata.profession || null,
            companyName: org?.companyName || null,
            siret: org?.siret || null,
          };

          const docs = await prisma.stritDocument.findMany({
            where: { sellerId: primaryMembership.organizationId },
            select: {
              id: true,
              fileName: true,
              documentType: true,
              status: true,
              updatedAt: true,
              verifiedAt: true,
              reviewNotes: true,
            },
          });
          kyc = {
            status: 'PENDING',
            level: 1,
            verifiedAt: null,
            reviewedBy: null,
            reviewNotes: null,
            documents: docs,
            riskScore: 25,
            lastReviewAt: null,
          };
        }

        const metrics = {
          totalLogins: 0,
          lastActivityAt: user.updatedAt,
          documentsUploaded: kyc?.documents?.length || 0,
          organizationsCount: organizations.length,
          subscriptionStatus: null,
          lifetimeValue: 0,
        };

        return {
          id: user.id,
          email: user.email,
          name:
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : null,
          phoneNumber: user.phoneNumber,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLoginAt: null,
          status: 'ACTIVE',
          emailVerified: user.emailVerified,
          phoneVerified: false,
          profile,
          kyc,
          metrics,
          organizations,
        };
      },
    })
  );

  // Update User Profile Mutation
  const UpdateUserProfileInput = gqlSchemaBuilder.inputType(
    'UpdateUserProfileInput',
    {
      fields: (t) => ({
        name: t.string({ required: false }),
        email: t.string({ required: false }),
        phoneNumber: t.string({ required: false }),
        status: t.string({ required: false }),
        firstName: t.string({ required: false }),
        lastName: t.string({ required: false }),
        profession: t.string({ required: false }),
        companyName: t.string({ required: false }),
        siret: t.string({ required: false }),
        street: t.string({ required: false }),
        city: t.string({ required: false }),
        postalCode: t.string({ required: false }),
        country: t.string({ required: false }),
      }),
    }
  );

  const UpdatedUserProfile = gqlSchemaBuilder
    .objectRef<{
      id: string;
      name: string | null;
      email: string;
      phoneNumber: string | null;
      status: string;
    }>('UpdatedUserProfile')
    .implement({
      fields: (t) => ({
        id: t.id({ resolve: (o) => o.id }),
        name: t.string({ nullable: true, resolve: (o) => o.name }),
        email: t.string({ resolve: (o) => o.email }),
        phoneNumber: t.string({
          nullable: true,
          resolve: (o) => o.phoneNumber,
        }),
        status: t.string({ resolve: (o) => o.status }),
      }),
    });

  gqlSchemaBuilder.mutationField('updateUserProfile', (t) =>
    t.field({
      type: UpdatedUserProfile,
      args: {
        userId: t.arg.id({ required: true }),
        input: t.arg({ type: UpdateUserProfileInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        await requirePlatformAdmin(ctx);
        const { userId, input } = args;

        const updateData: any = {};
        if (input.firstName) updateData.firstName = input.firstName;
        if (input.lastName) updateData.lastName = input.lastName;
        if (input.email) updateData.email = input.email;
        if (input.phoneNumber !== undefined)
          updateData.phoneNumber = input.phoneNumber;

        const user = await prisma.user.update({
          where: { id: userId },
          data: { ...updateData, updatedAt: new Date() },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        });

        const membership = await prisma.member.findFirst({
          where: { userId },
          select: { organizationId: true },
        });

        if (
          membership &&
          (input.companyName || input.siret || input.profession || input.street)
        ) {
          const org = await prisma.organization.findUnique({
            where: { id: membership.organizationId },
            select: { metadata: true },
          });

          const metadata = org?.metadata
            ? JSON.parse(org.metadata as string)
            : {};
          if (input.profession) metadata.profession = input.profession;
          if (input.street || input.city || input.postalCode || input.country) {
            metadata.address = {
              ...metadata.address,
              ...(input.street && { street: input.street }),
              ...(input.city && { city: input.city }),
              ...(input.postalCode && { postalCode: input.postalCode }),
              ...(input.country && { country: input.country }),
            };
          }

          const orgUpdateData: any = {
            metadata: JSON.stringify(metadata),
            updatedAt: new Date(),
          };
          if (input.companyName) orgUpdateData.companyName = input.companyName;
          if (input.siret) orgUpdateData.siret = input.siret;

          await prisma.organization.update({
            where: { id: membership.organizationId },
            data: orgUpdateData,
          });
        }

        return {
          id: user.id,
          name:
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : null,
          email: user.email,
          phoneNumber: user.phoneNumber,
          status: input.status || 'ACTIVE',
        };
      },
    })
  );

  // Review KYC Mutation
  const ReviewKYCInput = gqlSchemaBuilder.inputType('ReviewKYCInput', {
    fields: (t) => ({
      status: t.string({ required: true }),
      level: t.int({ required: true }),
      reviewNotes: t.string({ required: false }),
    }),
  });

  const ReviewedKYC = gqlSchemaBuilder
    .objectRef<{
      id: string;
      status: string;
      level: number;
      reviewNotes: string | null;
      verifiedAt: Date | null;
    }>('ReviewedKYC')
    .implement({
      fields: (t) => ({
        id: t.id({ resolve: (o) => o.id }),
        status: t.string({ resolve: (o) => o.status }),
        level: t.int({ resolve: (o) => o.level }),
        reviewNotes: t.string({
          nullable: true,
          resolve: (o) => o.reviewNotes,
        }),
        verifiedAt: t.field({
          type: 'Date',
          nullable: true,
          resolve: (o) => o.verifiedAt,
        }),
      }),
    });

  gqlSchemaBuilder.mutationField('reviewKYC', (t) =>
    t.field({
      type: ReviewedKYC,
      args: {
        userId: t.arg.id({ required: true }),
        input: t.arg({ type: ReviewKYCInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        await requirePlatformAdmin(ctx);
        const { userId, input } = args;

        const membership = await prisma.member.findFirst({
          where: { userId },
          select: { organizationId: true },
        });
        if (!membership) throw new Error('User has no organization membership');

        const org = await prisma.organization.findUnique({
          where: { id: membership.organizationId },
          select: { metadata: true },
        });

        const metadata = org?.metadata
          ? JSON.parse(org.metadata as string)
          : {};
        const now = new Date();
        metadata.kyc = {
          status: input.status,
          level: input.level,
          reviewNotes: input.reviewNotes || null,
          verifiedAt: input.status === 'APPROVED' ? now : null,
          reviewedBy: ctx.user?.id || 'admin',
          lastReviewAt: now,
        };

        await prisma.organization.update({
          where: { id: membership.organizationId },
          data: { metadata: JSON.stringify(metadata), updatedAt: now },
        });

        return {
          id: membership.organizationId,
          status: input.status,
          level: input.level,
          reviewNotes: input.reviewNotes || null,
          verifiedAt: input.status === 'APPROVED' ? now : null,
        };
      },
    })
  );
}
