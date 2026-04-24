# @contractspec/integration.provider.llm

Website: https://contractspec.io

LLM provider implementations for ContractSpec.

## Usage

Import the root entrypoint for the domain surface, or import a concrete implementation from the `./impls/*` subpaths.

## Compatibility

This package owns the llm implementation slice split out of `@contractspec/integration.providers-impls`. The legacy package continues to re-export these subpaths for existing consumers.
