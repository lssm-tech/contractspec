import { gqlSchemaBuilder } from '../builder';
import { OrganizationType, Prisma, prisma } from '@lssm/app.cli-database-strit';

export function registerOnboardingSchema() {
  // Draft metadata type
  const DraftMetadata = gqlSchemaBuilder
    .objectRef<{
      createdAt: Date;
      updatedAt: Date;
      daysSinceUpdate: number;
    }>('OnboardingDraftMetadata')
    .implement({
      fields: (t) => ({
        createdAt: t.field({ type: 'Date', resolve: (o) => o.createdAt }),
        updatedAt: t.field({ type: 'Date', resolve: (o) => o.updatedAt }),
        daysSinceUpdate: t.int({ resolve: (o) => o.daysSinceUpdate }),
      }),
    });

  // Draft payload type
  const OnboardingDraftPayload = gqlSchemaBuilder
    .objectRef<{
      data: unknown | null;
      metadata: {
        createdAt: Date;
        updatedAt: Date;
        daysSinceUpdate: number;
      } | null;
    }>('OnboardingDraftPayload')
    .implement({
      fields: (t) => ({
        data: t.field({
          type: 'JSON',
          nullable: true,
          resolve: (o) => o.data,
        }),
        metadata: t.field({
          type: DraftMetadata,
          nullable: true,
          resolve: (o) => o.metadata,
        }),
      }),
    });

  // Get onboarding draft for active organization
  gqlSchemaBuilder.queryField('onboardingDraft', (t) =>
    t.field({
      type: OnboardingDraftPayload,
      resolve: async (_root, _args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        // Resolve active organization from session or first membership
        let activeOrganizationId = ctx.session?.activeOrganizationId;
        if (!activeOrganizationId) {
          const m = await prisma.member.findFirst({
            where: { userId: ctx.user.id },
            orderBy: { createdAt: 'asc' },
            select: { organizationId: true },
          });
          activeOrganizationId = m?.organizationId;
        }
        if (!activeOrganizationId) return { data: null, metadata: null };
        const draft = await prisma.onboardingDraft.findUnique({
          where: { organizationId: activeOrganizationId },
        });
        if (!draft) return { data: null, metadata: null };
        const now = new Date();
        const daysSinceUpdate = Math.floor(
          (now.getTime() - draft.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        return {
          data: draft.data as unknown,
          metadata: {
            createdAt: draft.createdAt,
            updatedAt: draft.updatedAt,
            daysSinceUpdate,
          },
        };
      },
    })
  );

  // Save onboarding draft for active organization
  gqlSchemaBuilder.mutationField('saveOnboardingDraft', (t) =>
    t.field({
      type: OnboardingDraftPayload,
      args: { data: t.arg({ type: 'JSON', required: true }) },
      resolve: async (_root, args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        let activeOrganizationId = ctx.session?.activeOrganizationId as
          | string
          | undefined;
        if (!activeOrganizationId) {
          const m = await prisma.member.findFirst({
            where: { userId: ctx.user.id },
            orderBy: { createdAt: 'asc' },
            select: { organizationId: true },
          });
          activeOrganizationId = m?.organizationId;
        }
        if (!activeOrganizationId) throw new Error('NO_ORG');
        const saved = await prisma.onboardingDraft.upsert({
          where: { organizationId: activeOrganizationId },
          update: {
            data: args.data as Prisma.InputJsonValue,
            updatedAt: new Date(),
          },
          create: {
            organizationId: activeOrganizationId,
            data: args.data as Prisma.InputJsonValue,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        return {
          data: saved.data as unknown,
          metadata: {
            createdAt: saved.createdAt,
            updatedAt: saved.updatedAt,
            daysSinceUpdate: 0,
          },
        };
      },
    })
  );

  // Delete onboarding draft
  gqlSchemaBuilder.mutationField('deleteOnboardingDraft', (t) =>
    t.boolean({
      resolve: async (_root, _args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        let activeOrganizationId = ctx.session?.activeOrganizationId as
          | string
          | undefined;
        if (!activeOrganizationId) {
          const m = await prisma.member.findFirst({
            where: { userId: ctx.user.id },
            orderBy: { createdAt: 'asc' },
            select: { organizationId: true },
          });
          activeOrganizationId = m?.organizationId;
        }
        if (!activeOrganizationId) return true;
        await prisma.onboardingDraft.deleteMany({
          where: { organizationId: activeOrganizationId },
        });
        return true;
      },
    })
  );

  // Complete onboarding
  const CompleteOnboardingResult = gqlSchemaBuilder
    .objectRef<{
      success: boolean;
      message: string;
      userType: string;
      organizationId: string | null;
      createdNewOrganization: boolean;
      invitationsSent: number;
    }>('CompleteOnboardingResult')
    .implement({
      fields: (t) => ({
        success: t.boolean({ resolve: (o) => o.success }),
        message: t.string({ resolve: (o) => o.message }),
        userType: t.string({ resolve: (o) => o.userType }),
        organizationId: t.id({
          nullable: true,
          resolve: (o) => o.organizationId ?? null,
        }),
        createdNewOrganization: t.boolean({
          resolve: (o) => o.createdNewOrganization,
        }),
        invitationsSent: t.int({ resolve: (o) => o.invitationsSent }),
      }),
    });

  gqlSchemaBuilder.mutationField('completeOnboarding', (t) =>
    t.field({
      type: CompleteOnboardingResult,
      args: { input: t.arg({ type: 'JSON', required: true }) },
      resolve: async (_root, args, ctx) => {
        if (!ctx.user) throw new Error('Unauthorized');
        const input = (args.input || {}) as any;
        const userType = input.userType || OrganizationType.SELLER;
        const firstName = String(input.firstName || '');
        const lastName = String(input.lastName || '');
        const email = String(input.email || '');
        const phoneNumber = String(input.phoneNumber || '');

        if (!firstName || !lastName || !email || !phoneNumber) {
          return {
            success: false,
            message: 'Missing required fields',
            userType,
            organizationId: null,
            createdNewOrganization: false,
            invitationsSent: 0,
          };
        }

        // Update user basic fields
        await prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            firstName,
            lastName,
            email,
            phoneNumber,
            onboardingCompleted: true,
            onboardingStep: null,
          },
        });

        let organizationId: string | null =
          ctx.session?.activeOrganizationId ?? null;
        let createdNewOrganization = false;

        if (!organizationId) {
          // Create new organization
          const orgName =
            userType === OrganizationType.SELLER
              ? input.companyName || 'Organisation'
              : input.firmName || 'Collectivity';
          const safeSlug = orgName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

          const newOrg = await prisma.organization.create({
            data: {
              id: crypto.randomUUID(),
              name: orgName,
              slug: safeSlug,
              createdAt: new Date(),
              type: userType,
              onboardingCompleted: true,
              onboardingStep: null,
              companyName: orgName,
              siret:
                userType === OrganizationType.SELLER
                  ? input.siret || null
                  : input.firmSiret || null,
            },
          });

          await prisma.member.create({
            data: {
              id: crypto.randomUUID(),
              organizationId: newOrg.id,
              userId: ctx.user.id,
              role: 'owner',
              createdAt: new Date(),
            },
          });

          organizationId = newOrg.id;
          createdNewOrganization = true;
        } else {
          // Update existing organization
          await prisma.organization.update({
            where: { id: organizationId },
            data: {
              name:
                userType === OrganizationType.SELLER
                  ? input.companyName || undefined
                  : input.firmName || undefined,
              onboardingCompleted: true,
              onboardingStep: null,
              type: userType,
              companyName:
                userType === OrganizationType.SELLER
                  ? input.companyName || undefined
                  : input.firmName || undefined,
              siret:
                userType === OrganizationType.SELLER
                  ? input.siret || null
                  : input.firmSiret || null,
            },
          });
        }

        // Optional invitations
        let invitationsSent = 0;
        if (Array.isArray(input.teamMembers) && organizationId) {
          for (const invite of input.teamMembers) {
            if (invite?.email && String(invite.email).trim()) {
              try {
                await prisma.invitation.create({
                  data: {
                    id: crypto.randomUUID(),
                    email: String(invite.email).toLowerCase().trim(),
                    role: (invite.role as string | undefined) || 'member',
                    organizationId,
                    inviterId: ctx.user.id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    status: 'pending',
                  },
                });
                invitationsSent++;
              } catch {}
            }
          }
        }

        return {
          success: true,
          message: 'Onboarding completed successfully',
          userType,
          organizationId,
          createdNewOrganization,
          invitationsSent,
        };
      },
    })
  );
}
