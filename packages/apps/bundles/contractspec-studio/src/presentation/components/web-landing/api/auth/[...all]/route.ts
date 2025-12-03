import { auth } from '@lssm/bundle.contractspec-studio/application/services/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth);
