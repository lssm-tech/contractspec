# Overlay Engine

`@lssm/lib.overlay-engine` is the canonical runtime for OverlaySpecs. It validates specs, tracks scope precedence, and exposes hooks for React renderers.

## Key APIs

- `defineOverlay(spec)` – helper to keep specs typed.
- `OverlayRegistry` – register signed overlays and retrieve them per context.
- `OverlayEngine` – apply overlays to renderable targets, emit audit events, and merge modifications deterministically.
- `signOverlay(spec, privateKey)` – Ed25519/RSA-PSS signer.
- `verifyOverlaySignature(overlay)` – verify public key signatures.
- `useOverlay(engine, params)` – client hook that returns `{ target, overlaysApplied }`.

## Scope Precedence

Registrations are sorted by specificity:

1. Tenant overlays
2. Role overlays
3. User overlays
4. Device overlays

Less specific overlays run first; more specific overlays override later.

## Example

```ts
const registry = new OverlayRegistry();
const engine = new OverlayEngine({
  registry,
  audit: (event) => auditLogService.record(event),
});

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

const signedOverlay = await signOverlay(overlay, privateKeyPem);
registry.register(signedOverlay);

const result = engine.apply({
  target: { fields: baseFields },
  capability: 'billing.createOrder',
  tenantId: 'acme',
  userId: 'manager-7',
});
```

`result.target.fields` now carries the hidden and renamed outputs ready for rendering.






















