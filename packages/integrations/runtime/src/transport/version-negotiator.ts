/**
 * Negotiates and applies API versioning for integration requests.
 */

import type { IntegrationVersionPolicy } from '@contractspec/lib.contracts-integrations/integrations/versioning';
import {
  resolveApiVersion,
  isVersionDeprecated,
} from '@contractspec/lib.contracts-integrations/integrations/versioning';

export interface VersionNegotiationResult {
  resolvedVersion: string | undefined;
  deprecated: boolean;
  versionHeaders: Record<string, string>;
  versionQueryParams: Record<string, string>;
}

/**
 * Negotiate the API version and produce headers/params to include in requests.
 */
export function negotiateVersion(
  policy: IntegrationVersionPolicy | undefined,
  connectionOverride?: string
): VersionNegotiationResult {
  if (!policy) {
    return {
      resolvedVersion: undefined,
      deprecated: false,
      versionHeaders: {},
      versionQueryParams: {},
    };
  }

  const version = resolveApiVersion(policy, connectionOverride);
  const deprecated = version ? isVersionDeprecated(policy, version) : false;

  const versionHeaders: Record<string, string> = {};
  const versionQueryParams: Record<string, string> = {};

  if (version) {
    if (policy.versionHeader) {
      versionHeaders[policy.versionHeader] = version;
    }
    if (policy.versionQueryParam) {
      versionQueryParams[policy.versionQueryParam] = version;
    }
  }

  return {
    resolvedVersion: version,
    deprecated,
    versionHeaders,
    versionQueryParams,
  };
}
