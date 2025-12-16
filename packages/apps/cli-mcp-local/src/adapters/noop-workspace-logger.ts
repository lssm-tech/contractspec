import type {
  LoggerAdapter,
  ProgressReporter,
} from '@lssm/bundle.contractspec-workspace';

export function createNoopWorkspaceLoggerAdapter(): LoggerAdapter {
  const noop = () => {
    // no-op
  };

  const progress: ProgressReporter = {
    start: noop,
    update: noop,
    succeed: noop,
    fail: noop,
    warn: noop,
    stop: noop,
  };

  return {
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
    createProgress: () => progress,
  };
}
