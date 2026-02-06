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
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}
