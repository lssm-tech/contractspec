import { gqlSchemaBuilder } from '../../builder';
import { prisma as studioDb } from '@lssm/lib.database-contractspec-studio';
import { ensureLearningJourneyTracks } from './ensure-tracks';
import { requireAuthAndGet } from './auth';
import type { createOnboardingGraphqlTypes } from './graphql-types';

type OnboardingTypes = ReturnType<typeof createOnboardingGraphqlTypes>;

export function registerOnboardingMutations(
  builder: typeof gqlSchemaBuilder,
  types: OnboardingTypes
) {
  builder.mutationFields((t) => ({
    dismissOnboardingTrack: t.field({
      type: types.OnboardingProgressType,
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
        if (!track) {
          throw new Error('Track not found.');
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

        const progress = await studioDb.onboardingProgress.upsert({
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

        return studioDb.onboardingProgress.update({
          where: { id: progress.id },
          data: { isDismissed: true, dismissedAt: new Date() },
        });
      },
    }),
  }));
}



