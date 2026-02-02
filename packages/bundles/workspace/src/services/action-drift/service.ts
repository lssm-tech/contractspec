import type {
  DriftReportInputs,
  FinalizeDriftResult,
  ReportData,
} from './types';

export class DriftActionService {
  buildReportData(inputs: DriftReportInputs): ReportData {
    // Start with existing data or empty structure
    const reportData: ReportData = inputs.existingReportData || {};

    // Update with latest contracts data
    reportData.contracts = inputs.contractsJson;

    // Set specific drift-check values
    reportData.whatChanged = {
      summary: 'Drift check completed.',
      detailsPath: '',
      ...reportData.whatChanged, // Preserve if existing, though usually overwritten by specific action logic
    };

    // Reset risk/validation as this action focuses on drift
    reportData.risk = {
      status: 'unknown',
      breaking: 0,
      nonBreaking: 0,
      ...reportData.risk,
    };

    reportData.validation = {
      status: 'skipped',
      outputPath: '',
      ...reportData.validation,
    };

    reportData.drift = {
      status: inputs.driftStatus,
      files: inputs.driftFiles,
    };

    if (!reportData.nextSteps) {
      reportData.nextSteps = [];
    }

    if (inputs.driftStatus === 'fail') {
      reportData.nextSteps.push(
        'Run the generate command locally and commit drift fixes.'
      );
    }

    return reportData;
  }

  finalizeResults(data: ReportData, onDrift: string): FinalizeDriftResult {
    const driftDetected = data.drift?.status === 'fail';
    let shouldFail = false;

    if (driftDetected && onDrift === 'fail') {
      shouldFail = true;
    }

    return {
      driftDetected,
      shouldFail,
    };
  }
}
