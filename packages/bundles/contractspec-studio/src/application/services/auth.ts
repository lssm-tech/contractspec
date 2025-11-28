import { betterAuth } from 'better-auth';
import {
  admin,
  apiKey,
  genericOAuth,
  openAPI,
  organization,
} from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@lssm/lib.database-contractspec-studio';
import { expo } from '@better-auth/expo';
import { passkey } from '@better-auth/passkey';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';
import { nextCookies } from 'better-auth/next-js';
import { phoneNumber } from 'better-auth/plugins';
import type { GenericOAuthConfig } from 'better-auth/plugins/generic-oauth';
import { OrganizationType } from '@lssm/lib.database-contractspec-studio/enums';
// import { telnyxSMS } from './sms';

export const auth = betterAuth({
  telemetry: { enabled: false },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  trustedOrigins: [
    'https://contractspec.chaman.ventures',
    'https://studio.contractspec.chaman.ventures',
    'http://localhost:3000',
    'http://localhost:3002',
  ],
  advanced: {
    disableCSRFCheck: true,
  },
  emailAndPassword: {
    enabled: true,
    // Send password reset email using Resend
    async sendResetPassword({ url, user }) {
      const apiKey = process.env.RESEND_API_KEY;
      const from =
        process.env.CONTRACTSPEC_EMAIL_FROM || 'no-reply@contractspec.run';
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
    // phoneNumber({
    //   sendOTP: async ({ phoneNumber, code }, _request) => {
    //     // Format phoneNumber number to E.164 format
    //     const formattedPhone = telnyxSMS.formatPhoneNumber(phoneNumber);

    //     // Validate phoneNumber number
    //     if (!telnyxSMS.isValidPhoneNumber(formattedPhone)) {
    //       throw new Error('Invalid phone number format');
    //     }

    //     // Send OTP via Telnyx
    //     await telnyxSMS.sendOTP(formattedPhone, code);
    //   },
    //   sendPasswordResetOTP: async ({ phoneNumber, code }, _request) => {
    //     // Format phone number to E.164 format
    //     const formattedPhone = telnyxSMS.formatPhoneNumber(phoneNumber);

    //     // Validate phone number
    //     if (!telnyxSMS.isValidPhoneNumber(formattedPhone)) {
    //       throw new Error('Invalid phone number format');
    //     }

    //     // Send password reset OTP via Telnyx
    //     await telnyxSMS.sendPasswordResetOTP(formattedPhone, code);
    //   },
    //   phoneNumberValidator: (phoneNumber: string) => {
    //     return telnyxSMS.isValidPhoneNumber(phoneNumber);
    //   },
    //   otpLength: 6,
    //   expiresIn: 300, // 5 minutes
    //   allowedAttempts: 3,
    // }),
    // Social & OIDC providers (Google, Apple, Microsoft, LinkedIn)
    genericOAuth({
      config: (function buildProviders() {
        const providers: GenericOAuthConfig[] = [];

        const googleId = process.env.CONTRACTSPEC_GOOGLE_CLIENT_ID;
        const googleSecret = process.env.CONTRACTSPEC_GOOGLE_CLIENT_SECRET;
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

        const appleId = process.env.CONTRACTSPEC_APPLE_CLIENT_ID;
        const appleSecret = process.env.CONTRACTSPEC_APPLE_CLIENT_SECRET;
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

        const msId = process.env.CONTRACTSPEC_MICROSOFT_CLIENT_ID;
        const msSecret = process.env.CONTRACTSPEC_MICROSOFT_CLIENT_SECRET;
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

        const liId = process.env.CONTRACTSPEC_LINKEDIN_CLIENT_ID;
        const liSecret = process.env.CONTRACTSPEC_LINKEDIN_CLIENT_SECRET;
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
      // name: 'firstName',
    },
    additionalFields: {
      firstName: {
        type: 'string',
        required: false,
        input: true,
      },
      lastName: {
        type: 'string',
        required: false,
        input: true,
      },
      locale: {
        type: 'string',
        required: false,
        defaultValue: 'en',
        input: true,
      },
      // whitelistId: {
      //   type: 'string',
      //   required: false,
      //   defaultValue: null,
      //   input: false,
      // },
      // whitelistedAt: {
      //   fieldName: 'whitelistedAt',
      //   type: 'date',
      //   required: false,
      //   defaultValue: null,
      //   input: false,
      // },
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
    redirect('/onboarding/org-select');
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

export const assertsPlatformAdmin = async () => {
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
