import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function LibrariesOverlayEnginePage() {
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
        <h2 className="text-2xl font-bold">Installation</h2>
        <InstallCommand package="@contractspec/lib.overlay-engine" />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Define + Sign</h2>
        <CodeBlock
          language="typescript"
          code={`import { defineOverlay } from '@contractspec/lib.overlay-engine/spec';
import { signOverlay } from '@contractspec/lib.overlay-engine/signer';

const overlay = defineOverlay({
  overlayId: 'acme-order-form',
  version: '1.0.0',
  appliesTo: { capability: 'billing.createOrder', tenantId: 'acme' },
  modifications: [{ type: 'hideField', field: 'internalNotes' }],
});

const signed = await signOverlay(overlay, privateKeyPem);`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Runtime</h2>
        <p className="text-muted-foreground">
          `OverlayRegistry` stores signed overlays with specificity scoring.
          `OverlayEngine` merges modifications and emits audit events.
        </p>
        <CodeBlock
          language="typescript"
          code={`const registry = new OverlayRegistry();
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
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">React Hooks</h2>
        <p className="text-muted-foreground">
          Render overlays in React/React Native via `useOverlay`.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { useOverlay } from '@contractspec/lib.overlay-engine/react';

const { target } = useOverlay(engine, {
  target: { fields },
  capability: 'billing.createOrder',
  tenantId: 'acme',
});`}
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries" className="btn-ghost">
          Back to Libraries
        </Link>
        <Link href="/docs/libraries/workflow-composer" className="btn-primary">
          Next: Workflow Composer <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
