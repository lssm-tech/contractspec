# OverlaySpec Implementation

OverlaySpecs allow tenants/users to adapt presentation without duplicating code. Implementation lives in `@lssm/lib.overlay-engine`.

## Structure

```ts
interface OverlaySpec {
  overlayId: string;
  version: string;
  appliesTo: {
    capability?: string;
    workflow?: string;
    dataView?: string;
    presentation?: string;
    tenantId?: string;
    userId?: string;
    role?: string;
    device?: string;
  };
  modifications: OverlayModification[];
}
```

Supported modifications:

- `hideField`
- `renameLabel`
- `reorderFields`
- `setDefault`
- `addHelpText`
- `makeRequired`

## Signing

Overlays must be signed. Use the signer helper:

```ts
import { signOverlay } from '@lssm/lib.overlay-engine/signer';

const signed = await signOverlay(overlay, privateKeyPem);
registry.register(signed);
```

Keys are stored in `OverlaySigningKey` (Prisma) and referenced by the `Overlay` model for auditing.






















