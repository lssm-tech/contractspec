# @lssm/lib.overlay-engine

Runtime utilities for executing **OverlaySpecs** inside ContractSpec applications. The library tracks signed overlays, validates their safety guarantees, merges multi-scope overlays, and exposes React helpers to render personalized layouts without bespoke code.

## Features

- Type-safe OverlaySpec definitions that mirror the docs.
- Cryptographic signing and verification (Ed25519, RSA-PSS).
- Registry + validator that enforces policy boundaries.
- Deterministic merge engine for tenant / role / user overlays.
- Runtime helpers + React hooks for applying overlays to form/data view field definitions.

## Usage

```ts
import {
  OverlayEngine,
  OverlayRegistry,
  defineOverlay,
  signOverlay,
} from '@lssm/lib.overlay-engine';

const registry = new OverlayRegistry();
const engine = new OverlayEngine({ registry });

const overlay = defineOverlay({
  overlayId: 'acme-order-form',
  version: '1.0.0',
  appliesTo: {
    capability: 'billing.createOrder',
    tenantId: 'acme',
  },
  modifications: [
    { type: 'hideField', field: 'internalNotes' },
    { type: 'renameLabel', field: 'customerReference', newLabel: 'PO Number' },
  ],
});

const signed = await signOverlay(overlay, PRIVATE_KEY_PEM, { keyId: 'acme' });
registry.register(signed);

const result = engine.apply({
  target: {
    fields: baseFields,
  },
  context: { tenantId: 'acme', userId: 'u_123' },
  capability: 'billing.createOrder',
});
```

See `docs/tech/personalization/overlay-engine.md` for additional details.















