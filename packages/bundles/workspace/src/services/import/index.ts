/**
 * Import service module.
 *
 * Exports the import service for extracting contracts from source code.
 */

export {
  importFromSourceService,
  type ImportServiceOptions,
  type ImportServiceResult,
  type ImportServiceAdapters,
} from './import-service';

export {
  verifyImportedContracts,
  type VerifyOptions as ImportVerifyOptions,
  type VerifyResult as ImportVerifyResult,
  type EndpointVerification,
  type VerificationIssue as ImportVerificationIssue,
} from './verify-service';

export {
  generateMarkdownReport,
  generateCliReport,
  type ReportOptions,
} from './report-service';
