export enum ProductPhase {
  Sketch = 'Sketch',
  Prototype = 'Prototype',
  Mvp = 'MVP',
  V1 = 'V1',
  Ecosystem = 'Ecosystem',
}

export enum CompanyPhase {
  Solo = 'Solo',
  TinyTeam = 'TinyTeam',
  FunctionalOrg = 'FunctionalOrg',
  MultiTeam = 'MultiTeam',
  Bureaucratic = 'Bureaucratic',
}

export enum CapitalPhase {
  Bootstrapped = 'Bootstrapped',
  PreSeed = 'PreSeed',
  Seed = 'Seed',
  SeriesAorB = 'SeriesAorB',
  LateStage = 'LateStage',
}

export type LifecycleAxis = 'product' | 'company' | 'capital';

export interface LifecycleAxes {
  product: ProductPhase;
  company: CompanyPhase;
  capital: CapitalPhase;
}

export interface LifecycleAxisSnapshot {
  axis: LifecycleAxis;
  phase: ProductPhase | CompanyPhase | CapitalPhase;
  rationale?: string;
  confidence: number; // 0-1
}

