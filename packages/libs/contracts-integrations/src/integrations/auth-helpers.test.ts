import { describe, expect, it, vi, beforeAll } from "bun:test";
import { createHmac } from "node:crypto";

import {
  buildAuthHeaders,
  verifyWebhookSignature,
  isWebhookTimestampValid,
  isOAuth2TokenExpired,
  buildOAuth2AuthorizationUrl,
  refreshOAuth2Token,
  exchangeOAuth2Code,
} from "./auth-helpers";
import type { IntegrationAuthConfig, OAuth2TokenState } from "./auth";

describe("buildAuthHeaders", () => {
  it("should build api-key headers with prefix", () => {
    const config: IntegrationAuthConfig = {
      type: "api-key",
      headerName: "Authorization",
      prefix: "Bearer ",
    };
    const headers = buildAuthHeaders(config, { apiKey: "sk_test_123" });
    expect(headers).toEqual({ Authorization: "Bearer sk_test_123" });
  });

  it("should build bearer headers from accessToken", () => {
    const config: IntegrationAuthConfig = { type: "bearer" };
    const headers = buildAuthHeaders(config, {
      accessToken: "tok_abc",
    });
    expect(headers).toEqual({ Authorization: "Bearer tok_abc" });
  });

  it("should build custom header", () => {
    const config: IntegrationAuthConfig = {
      type: "header",
      headerName: "X-Api-Key",
      valuePrefix: "Key ",
    };
    const headers = buildAuthHeaders(config, {
      "X-Api-Key": "my-key",
    });
    expect(headers).toEqual({ "X-Api-Key": "Key my-key" });
  });

  it("should build basic auth headers", () => {
    const config: IntegrationAuthConfig = { type: "basic" };
    const headers = buildAuthHeaders(config, {
      username: "admin",
      password: "secret",
    });
    const expected = Buffer.from("admin:secret").toString("base64");
    expect(headers).toEqual({ Authorization: `Basic ${expected}` });
  });

  it("should build oauth2 headers from accessToken", () => {
    const config: IntegrationAuthConfig = {
      type: "oauth2",
      grantType: "authorization_code",
      tokenUrl: "https://example.com/token",
      scopes: [],
    };
    const headers = buildAuthHeaders(config, {
      accessToken: "oauth_tok",
    });
    expect(headers).toEqual({ Authorization: "Bearer oauth_tok" });
  });

  it("should return empty headers for service-account and webhook-signing", () => {
    expect(
      buildAuthHeaders(
        { type: "service-account", credentialFormat: "json-key" },
        {},
      ),
    ).toEqual({});
    expect(
      buildAuthHeaders(
        {
          type: "webhook-signing",
          algorithm: "hmac-sha256",
          signatureHeader: "x-sig",
        },
        {},
      ),
    ).toEqual({});
  });

  it("should return empty headers when secrets are missing", () => {
    const config: IntegrationAuthConfig = { type: "api-key" };
    expect(buildAuthHeaders(config, {})).toEqual({});
  });
});

describe("verifyWebhookSignature", () => {
  it("should verify valid HMAC-SHA256 signature", () => {
    const secret = "whsec_test_secret";
    const payload = '{"event":"test"}';
    const sig = createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const result = verifyWebhookSignature(
      {
        type: "webhook-signing",
        algorithm: "hmac-sha256",
        signatureHeader: "x-sig",
      },
      secret,
      payload,
      sig,
    );
    expect(result).toBe(true);
  });

  it("should reject invalid signature", () => {
    const result = verifyWebhookSignature(
      {
        type: "webhook-signing",
        algorithm: "hmac-sha256",
        signatureHeader: "x-sig",
      },
      "secret",
      "payload",
      "invalidsignature00000000000000000000000000000000000000000000000000",
    );
    expect(result).toBe(false);
  });

  it("should handle sha256=prefix format", () => {
    const secret = "test";
    const payload = "body";
    const computed = createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const result = verifyWebhookSignature(
      {
        type: "webhook-signing",
        algorithm: "hmac-sha256",
        signatureHeader: "x-sig",
      },
      secret,
      payload,
      `sha256=${computed}`,
    );
    expect(result).toBe(true);
  });

  it("should throw for ed25519 algorithm", () => {
    expect(() =>
      verifyWebhookSignature(
        {
          type: "webhook-signing",
          algorithm: "ed25519" as "hmac-sha256",
          signatureHeader: "x-sig",
        },
        "secret",
        "payload",
        "sig",
      ),
    ).toThrow("Ed25519");
  });
});

describe("isWebhookTimestampValid", () => {
  it("should accept recent timestamp", () => {
    const nowSec = Math.floor(Date.now() / 1000);
    expect(isWebhookTimestampValid(String(nowSec))).toBe(true);
  });

  it("should reject old timestamp", () => {
    const oldSec = Math.floor(Date.now() / 1000) - 600;
    expect(isWebhookTimestampValid(String(oldSec))).toBe(false);
  });

  it("should return true when no timestamp provided", () => {
    expect(isWebhookTimestampValid(undefined)).toBe(true);
  });

  it("should return false for non-numeric timestamp", () => {
    expect(isWebhookTimestampValid("not-a-number")).toBe(false);
  });
});

describe("isOAuth2TokenExpired", () => {
  it("should return false when no expiresAt set", () => {
    const state: OAuth2TokenState = {
      accessToken: "tok",
      tokenType: "Bearer",
    };
    expect(isOAuth2TokenExpired(state)).toBe(false);
  });

  it("should return true when token is expired", () => {
    const state: OAuth2TokenState = {
      accessToken: "tok",
      tokenType: "Bearer",
      expiresAt: new Date(Date.now() - 120_000).toISOString(),
    };
    expect(isOAuth2TokenExpired(state)).toBe(true);
  });

  it("should return true when token expires within buffer", () => {
    const state: OAuth2TokenState = {
      accessToken: "tok",
      tokenType: "Bearer",
      expiresAt: new Date(Date.now() + 30_000).toISOString(),
    };
    expect(isOAuth2TokenExpired(state, 60_000)).toBe(true);
  });

  it("should return false when token is still valid", () => {
    const state: OAuth2TokenState = {
      accessToken: "tok",
      tokenType: "Bearer",
      expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
    };
    expect(isOAuth2TokenExpired(state)).toBe(false);
  });
});

describe("buildOAuth2AuthorizationUrl", () => {
  it("should build correct authorization URL", () => {
    const url = buildOAuth2AuthorizationUrl(
      {
        type: "oauth2",
        grantType: "authorization_code",
        authorizationUrl: "https://auth.example.com/authorize",
        tokenUrl: "https://auth.example.com/token",
        scopes: ["read", "write"],
        pkce: true,
      },
      {
        clientId: "client-123",
        redirectUri: "https://app.example.com/callback",
        state: "random-state",
        codeChallenge: "challenge123",
      },
    );

    const parsed = new URL(url);
    expect(parsed.origin).toBe("https://auth.example.com");
    expect(parsed.pathname).toBe("/authorize");
    expect(parsed.searchParams.get("response_type")).toBe("code");
    expect(parsed.searchParams.get("client_id")).toBe("client-123");
    expect(parsed.searchParams.get("scope")).toBe("read write");
    expect(parsed.searchParams.get("state")).toBe("random-state");
    expect(parsed.searchParams.get("code_challenge")).toBe("challenge123");
    expect(parsed.searchParams.get("code_challenge_method")).toBe("S256");
  });

  it("should throw when authorizationUrl is missing", () => {
    expect(() =>
      buildOAuth2AuthorizationUrl(
        {
          type: "oauth2",
          grantType: "authorization_code",
          tokenUrl: "https://auth.example.com/token",
          scopes: [],
        },
        {
          clientId: "c",
          redirectUri: "r",
          state: "s",
        },
      ),
    ).toThrow("authorizationUrl");
  });
});

describe("refreshOAuth2Token", () => {
  it("should refresh token successfully", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          access_token: "new-tok",
          refresh_token: "new-rt",
          token_type: "Bearer",
          expires_in: 3600,
          scope: "read write",
        }),
    });

    const result = await refreshOAuth2Token(
      {
        type: "oauth2",
        grantType: "authorization_code",
        tokenUrl: "https://auth.example.com/token",
        scopes: [],
      },
      {
        accessToken: "old-tok",
        refreshToken: "old-rt",
        tokenType: "Bearer",
      },
      { clientId: "c", clientSecret: "s" },
      mockFetch as unknown as typeof fetch,
    );

    expect(result.accessToken).toBe("new-tok");
    expect(result.refreshToken).toBe("new-rt");
    expect(result.expiresAt).toBeDefined();
  });

  it("should throw when no refresh token available", async () => {
    await expect(
      refreshOAuth2Token(
        {
          type: "oauth2",
          grantType: "authorization_code",
          tokenUrl: "https://auth.example.com/token",
          scopes: [],
        },
        { accessToken: "tok", tokenType: "Bearer" },
        { clientId: "c", clientSecret: "s" },
      ),
    ).rejects.toThrow("no refresh_token");
  });

  it("should throw on non-ok response", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve("invalid_grant"),
    });

    await expect(
      refreshOAuth2Token(
        {
          type: "oauth2",
          grantType: "authorization_code",
          tokenUrl: "https://auth.example.com/token",
          scopes: [],
        },
        {
          accessToken: "tok",
          refreshToken: "rt",
          tokenType: "Bearer",
        },
        { clientId: "c", clientSecret: "s" },
        mockFetch as unknown as typeof fetch,
      ),
    ).rejects.toThrow("token refresh failed");
  });
});

describe("exchangeOAuth2Code", () => {
  it("should exchange code for tokens", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          access_token: "at",
          refresh_token: "rt",
          token_type: "Bearer",
          expires_in: 7200,
        }),
    });

    const result = await exchangeOAuth2Code(
      {
        type: "oauth2",
        grantType: "authorization_code",
        tokenUrl: "https://auth.example.com/token",
        scopes: [],
      },
      {
        code: "auth-code",
        redirectUri: "https://app.example.com/callback",
        clientId: "c",
        clientSecret: "s",
      },
      mockFetch as unknown as typeof fetch,
    );

    expect(result.accessToken).toBe("at");
    expect(result.refreshToken).toBe("rt");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
