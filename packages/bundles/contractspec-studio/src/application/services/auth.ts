import { betterAuth } from 'better-auth';
import {
  admin,
  apiKey,
  genericOAuth,
  openAPI,
  organization,
} from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@lssm/lib.database-strit';
import { expo } from '@better-auth/expo';
import { passkey } from 'better-auth/plugins/passkey';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';
import { nextCookies } from 'better-auth/next-js';
import { phoneNumber } from 'better-auth/plugins';
import * as jose from 'jose';
import type { GenericOAuthConfig } from 'better-auth/plugins/generic-oauth';
import { OrganizationType } from '@lssm/lib.database-strit/enums';
import { telnyxSMS } from './sms';

export const auth = betterAuth({
  telemetry: { enabled: false },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  trustedOrigins: [
    // Basic scheme
    'app.strit://',

    // Web support
    'https://immense-toucan-hot.ngrok-free.app',
    'https://strit.app',
    'https://www.strit.app',
    'https://strit.academy',
    'https://www.strit.academy',
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:8080',
    'http://localhost:8082',
  ],
  advanced: {
    disableCSRFCheck: true,
  },
  emailAndPassword: {
    enabled: true,
    // Send password reset email using Resend
    async sendResetPassword({ url, user }) {
      const apiKey = process.env.RESEND_API_KEY;
      const from = process.env.STRIT_EMAIL_FROM || 'no-reply@strit.app';
      if (!apiKey) {
        console.warn('RESEND_API_KEY is not set; logging reset URL');
        console.log('Reset password URL:', url);
        return;
      }
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `<p>Bonjour,</p><p>Pour réinitialiser votre mot de passe, cliquez sur le lien ci-dessous :</p><p><a href="${url}">Réinitialiser mon mot de passe</a></p><p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>`,
      });
    },
    resetPasswordTokenExpiresIn: 60 * 60, // 1h
    async onPasswordReset({ user }) {
      console.log(`Password reset for user ${user.email}`);
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  plugins: [
    nextCookies(),
    admin(),
    passkey(),
    apiKey(),
    openAPI(),
    expo() as any,
    organization({
      teams: {
        enabled: true,
        // maximumTeams: 10, // Optional: limit teams per organization
        // allowRemovingAllTeams: false // Optional: prevent removing the last team
      },
      organization: {
        additionalFields: {
          type: {
            type: 'string',
            required: true,
            input: false,
          },
        },
      },
    }),
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }, _request) => {
        // Format phoneNumber number to E.164 format
        const formattedPhone = telnyxSMS.formatPhoneNumber(phoneNumber);

        // Validate phoneNumber number
        if (!telnyxSMS.isValidPhoneNumber(formattedPhone)) {
          throw new Error('Invalid phone number format');
        }

        // Send OTP via Telnyx
        await telnyxSMS.sendOTP(formattedPhone, code);
      },
      sendPasswordResetOTP: async ({ phoneNumber, code }, _request) => {
        // Format phone number to E.164 format
        const formattedPhone = telnyxSMS.formatPhoneNumber(phoneNumber);

        // Validate phone number
        if (!telnyxSMS.isValidPhoneNumber(formattedPhone)) {
          throw new Error('Invalid phone number format');
        }

        // Send password reset OTP via Telnyx
        await telnyxSMS.sendPasswordResetOTP(formattedPhone, code);
      },
      phoneNumberValidator: (phoneNumber: string) => {
        return telnyxSMS.isValidPhoneNumber(phoneNumber);
      },
      otpLength: 6,
      expiresIn: 300, // 5 minutes
      allowedAttempts: 3,
    }),
    // Social & OIDC providers (FranceConnect+, Google, Apple, Microsoft, LinkedIn)
    genericOAuth({
      config: (function buildProviders() {
        const providers: GenericOAuthConfig[] = [];

        // FranceConnect+ (country provider)
        const fcDiscovery = process.env.STRIT_FRANCECONNECTPLUS_DISCOVERY_URL;
        const fcClientId = process.env.STRIT_FRANCECONNECTPLUS_CLIENT_ID;
        const fcClientSecret =
          process.env.STRIT_FRANCECONNECTPLUS_CLIENT_SECRET;
        const fcPrivateKeyPem =
          process.env.STRIT_FRANCECONNECTPLUS_ENC_PRIVATE_KEY_PEM;
        if (fcDiscovery && fcClientId && fcClientSecret && fcPrivateKeyPem) {
          const encPrivateKeyPromise = jose.importPKCS8(
            fcPrivateKeyPem,
            'RSA-OAEP-256'
          );
          providers.push({
            providerId: 'franceconnectplus',
            discoveryUrl: fcDiscovery,
            clientId: fcClientId,
            clientSecret: fcClientSecret,
            authentication: 'post',
            responseType: 'code',
            pkce: false,
            scopes: ['openid', 'profile', 'email', 'birth', 'identite_pivot'],
            authorizationUrlParams: {
              acr_values: 'eidas2',
              claims: JSON.stringify({
                id_token: { amr: { essential: true } },
              }),
            },
            async getUserInfo(tokens: any) {
              const discovery = tokens.discovery!;
              const jwks = jose.createRemoteJWKSet(new URL(discovery.jwks_uri));
              const privateKey = await encPrivateKeyPromise;

              // Decrypt + verify id_token (JWE->JWS)
              const decId = await jose.compactDecrypt(
                tokens.idToken!,
                privateKey
              );
              const idJws = new TextDecoder().decode(decId.plaintext);
              const { payload: idPayload } = await jose.jwtVerify(idJws, jwks, {
                issuer: discovery.issuer,
                audience: fcClientId,
                algorithms: ['ES256'],
              });
              const acr = String(idPayload.acr ?? '');
              if (!(acr === 'eidas2' || acr === 'eidas3')) {
                throw new Error(`FranceConnect+ LoA too low: acr=${acr}`);
              }

              // Fetch + decrypt + verify userinfo (JWE->JWS)
              const uiRes = await fetch(discovery.userinfo_endpoint!, {
                headers: { Authorization: `Bearer ${tokens.accessToken}` },
              });
              const jwe = await uiRes.text();
              const dec = await jose.compactDecrypt(jwe, privateKey);
              const jws = new TextDecoder().decode(dec.plaintext);
              const { payload } = await jose.jwtVerify(jws, jwks, {
                issuer: discovery.issuer,
                audience: fcClientId,
                algorithms: ['ES256'],
              });
              const p: any = payload;
              return {
                id: p.sub,
                email: p.email ?? null,
                name:
                  [p.given_name, p.family_name].filter(Boolean).join(' ') ||
                  null,
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              } as any;
            },
          });
        }

        // Private providers
        const googleId = process.env.STRIT_GOOGLE_CLIENT_ID;
        const googleSecret = process.env.STRIT_GOOGLE_CLIENT_SECRET;
        if (googleId && googleSecret) {
          providers.push({
            providerId: 'google',
            discoveryUrl:
              'https://accounts.google.com/.well-known/openid-configuration',
            clientId: googleId,
            clientSecret: googleSecret,
            scopes: ['openid', 'profile', 'email'],
          });
        }

        const appleId = process.env.STRIT_APPLE_CLIENT_ID;
        const appleSecret = process.env.STRIT_APPLE_CLIENT_SECRET;
        if (appleId && appleSecret) {
          providers.push({
            providerId: 'apple',
            discoveryUrl:
              'https://appleid.apple.com/.well-known/openid-configuration',
            clientId: appleId,
            clientSecret: appleSecret,
            scopes: ['openid', 'name', 'email'],
          });
        }

        const msId = process.env.STRIT_MICROSOFT_CLIENT_ID;
        const msSecret = process.env.STRIT_MICROSOFT_CLIENT_SECRET;
        if (msId && msSecret) {
          providers.push({
            providerId: 'microsoft',
            discoveryUrl:
              'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
            clientId: msId,
            clientSecret: msSecret,
            scopes: ['openid', 'profile', 'email'],
          });
        }

        const liId = process.env.STRIT_LINKEDIN_CLIENT_ID;
        const liSecret = process.env.STRIT_LINKEDIN_CLIENT_SECRET;
        if (liId && liSecret) {
          providers.push({
            providerId: 'linkedin',
            // LinkedIn supports OIDC discovery
            discoveryUrl:
              'https://www.linkedin.com/oauth/.well-known/openid-configuration',
            clientId: liId,
            clientSecret: liSecret,
            scopes: ['openid', 'profile', 'email'],
          });
        }

        return providers;
      })(),
    }),
  ],
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const member = await prisma.member.findFirst({
            where: { userId: session.userId },
            select: { organizationId: true },
          });

          console.log('database hook before session', member, session?.userId);

          return {
            data: {
              ...session,
              activeOrganizationId: member?.organizationId,
              // organizationType: member?.[0]?.organization.type,
            },
          };
        },
      },
    },
  },
  session: {
    additionalFields: {
      activeOrganizationId: {
        type: 'string',
        required: false,
        defaultValue: null,
        input: false,
      },
    },
  },
  user: {
    fields: {
      name: 'firstName',
    },
    additionalFields: {
      lastName: {
        type: 'string',
        required: false,
        input: true,
      },
      lang: {
        type: 'string',
        required: false,
        defaultValue: 'fr',
        input: true,
      },
      whitelistId: {
        type: 'string',
        required: false,
        defaultValue: null,
        input: false,
      },
      whitelistedAt: {
        fieldName: 'whitelistedAt',
        type: 'date',
        required: false,
        defaultValue: null,
        input: false,
      },
      onboardingCompleted: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
      onboardingStep: {
        type: 'string',
        required: false,
        defaultValue: null,
        input: false,
      },
    },
  },
});

export const requireActiveOrganization = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    redirect('/login');
  }
  const activeOrganizationId = session?.session?.activeOrganizationId;
  if (!activeOrganizationId) {
    redirect('/login');
  }
  return { session, activeOrganizationId, userId: session.user.id };
};

export const assertsActiveOrganization = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }
  const activeOrganizationId = session?.session?.activeOrganizationId;
  if (!activeOrganizationId) {
    throw new Error('User is not a member of any organization');
  }
  return { session, activeOrganizationId, userId: session.user.id };
};

const assertsPlatformAdmin = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }
  const activeOrganizationId = session?.session?.activeOrganizationId;
  if (!activeOrganizationId) {
    throw new Error('No active organization');
  }
  const org = await prisma.organization.findUnique({
    where: { id: activeOrganizationId },
    select: { type: true },
  });
  if (!org || org.type !== OrganizationType.PLATFORM_ADMIN) {
    throw new Error('Forbidden: requires PLATFORM_ADMIN');
  }
  return { session, activeOrganizationId, userId: session.user.id };
};
