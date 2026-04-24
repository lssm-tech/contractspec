# @contractspec/integration.provider.messaging

Website: https://contractspec.io

Messaging provider implementations for ContractSpec.

## Usage

Import the root entrypoint for the domain surface, or import a concrete implementation from the `./impls/*` subpaths.

## Included Providers

- `TelegramMessagingProvider`
- `MetaWhatsappMessagingProvider`
- `TwilioWhatsappMessagingProvider`

## Compatibility

This package owns the messaging implementation slice split out of `@contractspec/integration.providers-impls`. The legacy package continues to re-export these subpaths for existing consumers.
