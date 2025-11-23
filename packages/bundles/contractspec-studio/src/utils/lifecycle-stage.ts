import { LifecycleStage } from '@lssm/lib.lifecycle';
import { LifecycleStage as PrismaLifecycleStage } from '@lssm/lib.database-contractspec-studio';

const LIFECYCLE_TO_PRISMA: Record<LifecycleStage, PrismaLifecycleStage> = {
  [LifecycleStage.Exploration]: PrismaLifecycleStage.EXPLORATION,
  [LifecycleStage.ProblemSolutionFit]:
    PrismaLifecycleStage.PROBLEM_SOLUTION_FIT,
  [LifecycleStage.MvpEarlyTraction]: PrismaLifecycleStage.MVP_EARLY_TRACTION,
  [LifecycleStage.ProductMarketFit]: PrismaLifecycleStage.PRODUCT_MARKET_FIT,
  [LifecycleStage.GrowthScaleUp]: PrismaLifecycleStage.GROWTH_SCALE_UP,
  [LifecycleStage.ExpansionPlatform]: PrismaLifecycleStage.EXPANSION_PLATFORM,
  [LifecycleStage.MaturityRenewal]: PrismaLifecycleStage.MATURITY_OPTIMIZATION,
};

const PRISMA_TO_LIFECYCLE = Object.entries(LIFECYCLE_TO_PRISMA).reduce<
  Record<PrismaLifecycleStage, LifecycleStage>
>(
  (acc, [lifecycleKey, prismaValue]) => {
    acc[prismaValue as PrismaLifecycleStage] = Number(
      lifecycleKey
    ) as LifecycleStage;
    return acc;
  },
  {} as Record<PrismaLifecycleStage, LifecycleStage>
);

export const toPrismaLifecycleStage = (
  stage: LifecycleStage
): PrismaLifecycleStage => LIFECYCLE_TO_PRISMA[stage];

export const fromPrismaLifecycleStage = (
  stage: PrismaLifecycleStage
): LifecycleStage => PRISMA_TO_LIFECYCLE[stage];


