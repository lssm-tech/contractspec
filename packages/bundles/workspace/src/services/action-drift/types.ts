import type {
  ContractVerificationStatus,
  ReportData,
} from '../action-pr/types';

export interface DriftActionOptions {
  workingDirectory: string;
  generateCommand: string;
  onDrift?: 'fail' | 'issue' | 'pr';
  driftPathsAllowlist?: string;
}

export interface DriftReportInputs {
  contractsJson: ContractVerificationStatus[];
  driftStatus: string; // 'pass' | 'fail' | 'skipped'
  driftFiles: string[];
  reportDataExists: boolean;
  existingReportData?: ReportData;
}

export interface FinalizeDriftResult {
  driftDetected: boolean;
  shouldFail: boolean;
}

export type { ReportData, ContractVerificationStatus };
