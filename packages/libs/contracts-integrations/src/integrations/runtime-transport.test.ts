import { describe, expect, it } from "bun:test";

import {
  DefaultTransportResolver,
  resolveAuthMethod,
  resolveIntegrationRequestContext,
} from "./runtime";
import type { IntegrationTransportConfig } from "./transport";
import type { IntegrationAuthConfig } from "./auth";
import type { IntegrationVersionPolicy } from "./versioning";

const transports: IntegrationTransportConfig[] = [
  { type: "rest", baseUrl: "https://api.example.com" },
  { type: "mcp", transport: "http" },
  { type: "webhook", inbound: { signatureHeader: "x-sig", signingAlgorithm: "hmac-sha256" } },
];

const authMethods: IntegrationAuthConfig[] = [
  { type: "api-key" },
  {
    type: "oauth2",
    grantType: "authorization_code",
    tokenUrl: "https://auth.example.com/token",
    scopes: ["read"],
  },
];

const versionPolicy: IntegrationVersionPolicy = {
  currentVersion: "2024-11-20",
  supportedVersions: [{ version: "2024-11-20", status: "stable" }],
  versionHeader: "API-Version",
};

describe("DefaultTransportResolver", () => {
  const resolver = new DefaultTransportResolver();

  it("should use connection override when supported", () => {
    const result = resolver.resolve(transports, "rest", "mcp");
    expect(result).toBe("mcp");
  });

  it("should fallback to preferred when no connection override", () => {
    const result = resolver.resolve(transports, "webhook", undefined);
    expect(result).toBe("webhook");
  });

  it("should fallback to first transport when no preference", () => {
    const result = resolver.resolve(transports, undefined, undefined);
    expect(result).toBe("rest");
  });

  it("should fallback to rest when no transports available", () => {
    const result = resolver.resolve([], undefined, undefined);
    expect(result).toBe("rest");
  });

  it("should ignore connection override when not in spec", () => {
    const result = resolver.resolve(
      [{ type: "rest" }],
      "rest",
      "sdk",
    );
    expect(result).toBe("rest");
  });
});

describe("resolveAuthMethod", () => {
  it("should use connection override when supported", () => {
    expect(resolveAuthMethod(authMethods, "oauth2")).toBe("oauth2");
  });

  it("should fallback to first method when no override", () => {
    expect(resolveAuthMethod(authMethods, undefined)).toBe("api-key");
  });

  it("should return connection method when no spec methods", () => {
    expect(resolveAuthMethod(undefined, "bearer")).toBe("bearer");
  });

  it("should return undefined when nothing specified", () => {
    expect(resolveAuthMethod(undefined, undefined)).toBeUndefined();
  });

  it("should ignore override not in spec methods", () => {
    expect(resolveAuthMethod(authMethods, "basic")).toBe("api-key");
  });
});

describe("resolveIntegrationRequestContext", () => {
  it("should resolve full context", () => {
    const result = resolveIntegrationRequestContext(
      {
        transports,
        preferredTransport: "rest",
        supportedAuthMethods: authMethods,
        versionPolicy,
      },
      {
        activeTransport: "mcp",
        authMethod: "oauth2",
        apiVersion: "2024-11-20",
      },
    );

    expect(result.transport).toBe("mcp");
    expect(result.authMethod).toBe("oauth2");
    expect(result.apiVersion).toBe("2024-11-20");
  });

  it("should handle empty connection", () => {
    const result = resolveIntegrationRequestContext(
      {
        transports,
        preferredTransport: "rest",
        supportedAuthMethods: authMethods,
        versionPolicy,
      },
      {},
    );

    expect(result.transport).toBe("rest");
    expect(result.authMethod).toBe("api-key");
    expect(result.apiVersion).toBe("2024-11-20");
  });

  it("should handle empty spec", () => {
    const result = resolveIntegrationRequestContext({}, {});

    expect(result.transport).toBe("rest");
    expect(result.authMethod).toBeUndefined();
    expect(result.apiVersion).toBeUndefined();
  });
});
