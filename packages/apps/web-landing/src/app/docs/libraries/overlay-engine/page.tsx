// export const metadata: Metadata = {
//   title: 'Overlay Engine | ContractSpec',
//   description: 'Signed overlays with cryptographic safety and React hooks.',
// };

export default function OverlayEnginePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Overlay Engine</h1>
        <p className="text-muted-foreground text-lg">
          `@contractspec/lib.overlay-engine` keeps OverlaySpecs typed, signed,
          and auditable across tenants, roles, users, and devices.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Define + Sign</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { defineOverlay } from '@contractspec/lib.overlay-engine/spec';
import { signOverlay } from '@contractspec/lib.overlay-engine/signer';

const overlay = defineOverlay({
  overlayId: 'acme-order-form',
  version: '1.0.0',
  appliesTo: { capability: 'billing.createOrder', tenantId: 'acme' },
  modifications: [{ type: 'hideField', field: 'internalNotes' }],
});

const signed = await signOverlay(overlay, privateKeyPem);`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Runtime</h2>
        <p>
          `OverlayRegistry` stores signed overlays with specificity scoring.
          `OverlayEngine` merges modifications and emits audit events.
        </p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`const registry = new OverlayRegistry();
registry.register(signed);

const engine = new OverlayEngine({
  registry,
  audit: (event) => auditLog.write(event),
});

const result = engine.apply({
  target: { fields },
  capability: 'billing.createOrder',
  tenantId: 'acme',
});`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">React Hooks</h2>
        <p>Render overlays in React/React Native via `useOverlay`.</p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { useOverlay } from '@contractspec/lib.overlay-engine/react';

const { target } = useOverlay(engine, {
  target: { fields },
  capability: 'billing.createOrder',
  tenantId: 'acme',
});
`}
        </pre>
      </div>
    </div>
  );
}
