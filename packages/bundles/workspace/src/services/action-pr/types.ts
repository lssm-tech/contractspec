export interface PrActionOptions {
  workingDirectory: string;
  contractsDir?: string;
  contractsGlob?: string;
  failOn?: string; // 'breaking' | 'drift' | 'any' | 'never'
  enableDrift?: boolean;
}

export interface WhatChangedData {
  summary?: string;
  detailsPath?: string;
}

export interface RiskData {
  status?: string;
  breaking?: number;
  nonBreaking?: number;
}

export interface ValidationData {
  status?: string;
  outputPath?: string;
}

export interface DriftData {
  status?: string;
  files?: string[];
}

export interface ContractVerificationStatus {
  name: string;
  lastVerifiedSha?: string;
  lastVerifiedDate?: string;
  surfaces: string[];
  driftMismatches: number;
}

export interface ReportData {
  whatChanged?: WhatChangedData;
  risk?: RiskData;
  validation?: ValidationData;
  drift?: DriftData;
  nextSteps?: string[];
  contracts?: ContractVerificationStatus[];
}

export interface ReportInputs {
  contractChanges: string[];
  impactJson?: ImpactJson;
  contractsJson: ContractVerificationStatus[];
  validationStatus: string; // 'pass' | 'fail' | 'skipped'
  driftStatus: string; // 'pass' | 'fail' | 'skipped'
  driftFiles: string[];
  failOn: string;
}

export interface ImpactJson {
  summary?: {
    breaking?: number;
    nonBreaking?: number;
    total?: number;
  };
  breaking?: boolean;
}

export interface FinalizeResult {
  driftDetected: boolean;
  breakingChangeDetected: boolean;
  validationFailed: boolean;
  shouldFail: boolean;
  failReasons: string[];
}
