import { prisma as studioDb } from '@contractspec/lib.database-studio';
import { ensureLearningJourneyTracks } from './ensure-tracks';
import { requireAuthAndGet } from './auth';
import type { createOnboardingGraphqlTypes } from './graphql-types';
import type { contractSpecStudioSchemaBuilder } from '../../builder';

type OnboardingTypes = ReturnType<typeof createOnboardingGraphqlTypes>;

export function registerOnboardingQueries(
  builder: typeof contractSpecStudioSchemaBuilder,
  types: OnboardingTypes
) {
  builder.queryFields((t) => ({
    myOnboardingTracks: t.field({
      type: types.MyOnboardingTracksType,
      args: {
        productId: t.arg.string({ required: false }),
        includeProgress: t.arg.boolean({ defaultValue: true, required: false }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        await ensureLearningJourneyTracks();

        const tracks = await studioDb.onboardingTrack.findMany({
          where: {
            isActive: true,
            productId: args.productId ?? undefined,
          },
          orderBy: { name: 'asc' },
        });

        const includeProgress = args.includeProgress ?? true;
        if (!includeProgress) {
          return { tracks, progress: [] };
        }

        const learner = await studioDb.learner.upsert({
          where: {
            userId_organizationId: {
              userId: user.id,
              organizationId: user.organizationId,
            },
          },
          create: { userId: user.id, organizationId: user.organizationId },
          update: {},
        });

        const progress = tracks.length
          ? await studioDb.onboardingProgress.findMany({
              where: {
                learnerId: learner.id,
                trackId: { in: tracks.map((t2) => t2.id) },
              },
            })
          : [];

        return { tracks, progress };
      },
    }),
    myOnboardingProgress: t.field({
      type: types.OnboardingProgressType,
      nullable: true,
      args: {
        trackKey: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const user = requireAuthAndGet(ctx);
        await ensureLearningJourneyTracks();

        const track = await studioDb.onboardingTrack.findUnique({
          where: { trackKey: args.trackKey },
          select: { id: true },
        });
        if (!track) return null;

        const learner = await studioDb.learner.upsert({
          where: {
            userId_organizationId: {
              userId: user.id,
              organizationId: user.organizationId,
            },
          },
          create: { userId: user.id, organizationId: user.organizationId },
          update: {},
        });

        return studioDb.onboardingProgress.upsert({
          where: {
            learnerId_trackId: { learnerId: learner.id, trackId: track.id },
          },
          create: {
            learnerId: learner.id,
            trackId: track.id,
            startedAt: new Date(),
          },
          update: {},
        });
      },
    }),
  }));
}
