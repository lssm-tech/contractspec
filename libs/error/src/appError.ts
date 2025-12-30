import { ErrorCode } from './codes';

/**
 * Generic application error with code and optional details.
 */
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'AppError';
  }
}

/** Type guard to detect AppError */
export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}
