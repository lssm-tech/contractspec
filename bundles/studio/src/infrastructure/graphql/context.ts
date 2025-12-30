import type { Context } from './types';
import { auth } from '../../application/services/auth';
import { ContractSpecFeatureFlags } from '@contractspec/lib.progressive-delivery';

export async function createContext({
  user,
  session,
  organization,
  logger,
  headers,
  featureFlags,
}: Context): Promise<Context> {
  return {
    user: user ?? null,
    session: session ?? null,
    organization,
    headers,
    logger,
    featureFlags: buildFeatureFlagState(featureFlags),
  };
}

export const createNextjsContext = async ({
  request,
}: {
  request: Request;
}) => {
  const session = await auth.api.getSession({ headers: request.headers });
  const organization = session?.session?.activeOrganizationId
    ? await auth.api.getFullOrganization({
        query: {
          organizationId: session.session.activeOrganizationId,
          membersLimit: 0,
        },
        // This endpoint requires session cookies.
        headers: request.headers,
      })
    : null;
  const headerFlags = parseFeatureFlagPayload(
    request.headers.get('x-lssm-feature-flags')
  );
  // console.log('organization gql', organization);
  // console.log('session user gql', session?.user);
  return createContext({
    user: session?.user || null,
    session: session?.session || null,
    organization,
    logger: console as unknown as Context['logger'],
    headers: request.headers,
    featureFlags: headerFlags,
  });
};

function buildFeatureFlagState(
  overrides?: Record<string, boolean>
): Record<string, boolean> {
  const base = Object.values(ContractSpecFeatureFlags).reduce<
    Record<string, boolean>
  >((acc, flag) => {
    acc[flag] = true;
    return acc;
  }, {});

  const envOverrides = parseFeatureFlagPayload(
    process.env.STUDIO_FEATURE_FLAGS
  );

  return {
    ...base,
    ...(envOverrides ?? {}),
    ...(overrides ?? {}),
  };
}

function parseFeatureFlagPayload(
  payload?: string | null
): Record<string, boolean> | undefined {
  if (!payload) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(payload) as Record<string, boolean>;
    if (parsed && typeof parsed === 'object') {
      return Object.entries(parsed).reduce<Record<string, boolean>>(
        (acc, [key, value]) => {
          acc[key] = Boolean(value);
          return acc;
        },
        {}
      );
    }
  } catch {
    // Fallback to comma-separated list, e.g. "flag_a=true,flag_b=false"
    const entries = payload.split(',');
    const parsedEntries = entries.reduce<Record<string, boolean>>(
      (acc, entry) => {
        const [flag, value] = entry.split('=').map((part) => part.trim());
        if (!flag) return acc;
        acc[flag] = value === undefined ? true : value === 'true';
        return acc;
      },
      {}
    );
    if (Object.keys(parsedEntries).length) {
      return parsedEntries;
    }
  }

  return undefined;
}
