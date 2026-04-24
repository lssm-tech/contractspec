# @contractspec/integration.provider.email

Website: https://contractspec.io

Email provider implementations for ContractSpec.

## Usage

Import the root entrypoint for the domain surface, or import a concrete implementation from the `./impls/*` subpaths.

## Included Providers

- `GmailInboundProvider` for thread and message sync
- `GmailOutboundProvider` for Gmail-based outbound delivery
- `PostmarkEmailProvider` for transactional email delivery

## Compatibility

This package owns the email implementation slice split out of `@contractspec/integration.providers-impls`. The legacy package continues to re-export these subpaths for existing consumers.
