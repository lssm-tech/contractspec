## Runbook – Profile Settings

### Feature flags / Env

- Better Auth configured in `src/lib/auth.ts`
- FC+ envs and JWKS exposed (see specs_france_connect_plus.md)

### Monitoring

- Sentry spans: profile.\* ops
- PostHog events: connection_linked / connection_unlinked

### Troubleshooting

- Unlink failures → check `/api/auth/connections/unlink` logs
- FC+ link issues → verify discovery URL and partner console redirects
- Phone OTP rate limit → server-side limiter in SMS service
