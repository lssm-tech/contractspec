import { google } from 'googleapis';

export function createGmailAuthFromEnv() {
  const clientId = requireEnv('GOOGLE_CLIENT_ID');
  const clientSecret = requireEnv('GOOGLE_CLIENT_SECRET');
  const refreshToken = requireEnv('GOOGLE_REFRESH_TOKEN');
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ??
    'https://developers.google.com/oauthplayground';
  const oauth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  oauth.setCredentials({ refresh_token: refreshToken });
  return oauth;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(buildMissingEnvMessage(key));
  }
  return value;
}

function buildMissingEnvMessage(key: string): string {
  if (key !== 'GOOGLE_REFRESH_TOKEN') {
    return `Missing required env var: ${key}`;
  }
  return [
    `Missing required env var: ${key}`,
    'Get a refresh token with OAuth Playground:',
    '1) Open https://developers.google.com/oauthplayground',
    '2) Click the gear icon and enable "Use your own OAuth credentials"',
    '3) Enter GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET',
    '4) Authorize scope https://www.googleapis.com/auth/gmail.modify',
    '   (or https://www.googleapis.com/auth/gmail.readonly for inbound only)',
    '5) Exchange for tokens and copy the refresh token',
    'Do not use https://www.googleapis.com/auth/gmail.metadata for this example.',
    'If you see redirect_uri_mismatch, add https://developers.google.com/oauthplayground',
    'to the OAuth client Authorized redirect URIs in Google Cloud Console.',
    'Then export GOOGLE_REFRESH_TOKEN and rerun the script.',
  ].join('\n');
}
