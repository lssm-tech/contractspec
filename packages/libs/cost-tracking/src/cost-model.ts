import type { CostModel, CostSample } from './types';

export const defaultCostModel: CostModel = {
  dbReadCost: 0.000002,
  dbWriteCost: 0.00001,
  computeMsCost: 0.00000015,
  memoryMbMsCost: 0.00000002,
};

export function calculateSampleCost(sample: CostSample, model: CostModel) {
  const external = (sample.externalCalls ?? []).reduce(
    (sum, call) => sum + (call.cost ?? 0),
    0
  );

  return {
    dbReads: (sample.dbReads ?? 0) * model.dbReadCost,
    dbWrites: (sample.dbWrites ?? 0) * model.dbWriteCost,
    compute: (sample.computeMs ?? 0) * model.computeMsCost,
    memory: (sample.memoryMbMs ?? 0) * model.memoryMbMsCost,
    external,
    custom: sample.customCost ?? 0,
  };
}
