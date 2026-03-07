# @contractspec/lib.email

Website: https://contractspec.io/

**Transactional email delivery via Scaleway.**

Provides a typed email client built on the Scaleway Transactional Email (TEM) SDK, with configuration helpers, HTML utilities, and structured error handling.

## Installation

```bash
bun add @contractspec/lib.email
```

## Exports

- `.` -- Re-exports client, types, and utils
- `./client` -- `getEmailConfig()`, `sendEmail()` functions
- `./types` -- `EmailAddress`, `SendEmailRequest`, `EmailSendOutcome`, `EmailServiceConfig`
- `./utils` -- `escapeHtml()`, `formatMultilineHtml()` helpers

## Usage

```ts
import { getEmailConfig, sendEmail } from "@contractspec/lib.email/client";

const configResult = getEmailConfig();

if (configResult.ok) {
  const outcome = await sendEmail(configResult.config, {
    to: [{ email: "user@example.com", name: "Jane" }],
    subject: "Welcome to ContractSpec",
    text: "Your workspace is ready.",
    html: "<p>Your workspace is ready.</p>",
  });

  if (!outcome.success) {
    console.error(outcome.errorMessage);
  }
}
```
