import { describe, expect, it } from "bun:test";

import {
  findAuthConfig,
  supportsAuthMethod,
  type IntegrationAuthConfig,
} from "./auth";

const authMethods: IntegrationAuthConfig[] = [
  { type: "api-key", headerName: "Authorization", prefix: "Bearer " },
  {
    type: "oauth2",
    grantType: "authorization_code",
    tokenUrl: "https://auth.example.com/token",
    scopes: ["read", "write"],
    authorizationUrl: "https://auth.example.com/authorize",
    pkce: true,
  },
  { type: "bearer" },
  { type: "header", headerName: "X-Custom-Key" },
  { type: "basic" },
  {
    type: "webhook-signing",
    algorithm: "hmac-sha256",
    signatureHeader: "x-sig",
  },
  { type: "service-account", credentialFormat: "json-key" },
];

describe("findAuthConfig", () => {
  it("should find api-key config", () => {
    const config = findAuthConfig(authMethods, "api-key");
    expect(config).toBeDefined();
    expect(config?.type).toBe("api-key");
    if (config?.type === "api-key") {
      expect(config.headerName).toBe("Authorization");
    }
  });

  it("should find oauth2 config with grant details", () => {
    const config = findAuthConfig(authMethods, "oauth2");
    expect(config).toBeDefined();
    if (config?.type === "oauth2") {
      expect(config.grantType).toBe("authorization_code");
      expect(config.tokenUrl).toBe("https://auth.example.com/token");
      expect(config.scopes).toEqual(["read", "write"]);
      expect(config.pkce).toBe(true);
    }
  });

  it("should find webhook-signing config", () => {
    const config = findAuthConfig(authMethods, "webhook-signing");
    expect(config).toBeDefined();
    if (config?.type === "webhook-signing") {
      expect(config.algorithm).toBe("hmac-sha256");
      expect(config.signatureHeader).toBe("x-sig");
    }
  });

  it("should return undefined for unsupported type", () => {
    const apiKeyOnly: IntegrationAuthConfig[] = [{ type: "api-key" }];
    expect(findAuthConfig(apiKeyOnly, "oauth2")).toBeUndefined();
  });
});

describe("supportsAuthMethod", () => {
  it("should return true for all supported methods", () => {
    expect(supportsAuthMethod(authMethods, "api-key")).toBe(true);
    expect(supportsAuthMethod(authMethods, "oauth2")).toBe(true);
    expect(supportsAuthMethod(authMethods, "bearer")).toBe(true);
    expect(supportsAuthMethod(authMethods, "header")).toBe(true);
    expect(supportsAuthMethod(authMethods, "basic")).toBe(true);
    expect(supportsAuthMethod(authMethods, "webhook-signing")).toBe(true);
    expect(supportsAuthMethod(authMethods, "service-account")).toBe(true);
  });

  it("should return false for empty methods", () => {
    expect(supportsAuthMethod([], "api-key")).toBe(false);
  });
});
