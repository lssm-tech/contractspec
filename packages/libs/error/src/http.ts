import { ErrorCode } from './codes';

/**
 * Map known error codes to HTTP status codes.
 */
export function httpStatus(code: ErrorCode): number {
  switch (code) {
    case ErrorCode.UNAUTHENTICATED:
      return 401;
    case ErrorCode.FORBIDDEN:
    case ErrorCode.POLICY_DENIED:
      return 403;
    case ErrorCode.NOT_FOUND:
      return 404;
    case ErrorCode.INVALID_INPUT:
      return 400;
    case ErrorCode.CONFLICT:
      return 409;
    case ErrorCode.RATE_LIMITED:
      return 429;
    default:
      return 500;
  }
}

/**
 * Convert AppError or unknown error into a Problem JSON response body and status code.
 */
// export function toHttpResponse(err: unknown): { status: number; body: any } {
//   if (isAppError(err)) {
//     const status = httpStatus(err.code);
//     return {
//       status,
//       body: {
//         type: `https://api.chaman.dev/errors/${err.code.toLowerCase()}`,
//         title: err.message,
//         detail: err.details ?? null,
//         status,
//       },
//     };
//   }
//   // Unknown error: hide internal details
//   return {
//     status: 500,
//     body: {
//       type: 'https://api.chaman.dev/errors/server_error',
//       title: 'Unexpected Error',
//       detail: null,
//       status: 500,
//     },
//   };
// }
