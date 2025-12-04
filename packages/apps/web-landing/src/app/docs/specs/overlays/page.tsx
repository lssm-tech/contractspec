import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Overlays: ContractSpec Docs',
//   description:
//     'Learn how OverlaySpecs enable safe, signed customization of UI layouts and field visibility in ContractSpec.',
// };

export default function OverlaysPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Overlays</h1>
        <p className="text-muted-foreground">
          An <strong>OverlaySpec</strong> allows tenants or users to customize
          UI layouts and field visibility without modifying the underlying
          application code. Overlays are cryptographically signed to ensure they
          respect policy boundaries and cannot introduce security
          vulnerabilities.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Why overlays matter</h2>
        <p className="text-muted-foreground">
          Different users have different needs. A power user might want to see
          all available fields and actions, while a casual user prefers a
          simplified interface. A tenant in a multi-tenant application might
          want to brand the UI or hide features they don't use.
        </p>
        <p className="text-muted-foreground">
          Traditional approaches require either building multiple UIs or adding
          complex configuration logic throughout the codebase. OverlaySpecs
          provide a safer, more maintainable solution: users can customize their
          experience, but only within the bounds allowed by the underlying specs
          and policies.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">What overlays can do</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Hide or show fields</strong> – Remove fields from forms or
            detail views (but only if the user has permission to see them in the
            first place)
          </li>
          <li>
            <strong>Reorder fields</strong> – Change the order in which fields
            appear
          </li>
          <li>
            <strong>Rename labels</strong> – Use different terminology that's
            more familiar to the user
          </li>
          <li>
            <strong>Change layouts</strong> – Switch between list, grid, or card
            views
          </li>
          <li>
            <strong>Add help text</strong> – Provide context-specific guidance
          </li>
          <li>
            <strong>Set default values</strong> – Pre-fill forms with
            tenant-specific defaults
          </li>
          <li>
            <strong>Apply branding</strong> – Customize colors, logos, and
            styling (within approved themes)
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example OverlaySpec</h2>
        <p className="text-muted-foreground">
          Here's an overlay that customizes an order form:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`overlayId: acme-order-form
version: 1.0.0
appliesTo:
  capability: createOrder
  tenantId: acme-corp
  
modifications:
  - type: hideField
    field: internalNotes
    reason: "ACME doesn't use internal notes"
    
  - type: renameLabel
    field: customerReference
    newLabel: "PO Number"
    
  - type: reorderFields
    fields:
      - customerReference
      - items
      - shippingAddress
      - billingAddress
      - paymentMethod
      
  - type: setDefault
    field: paymentMethod
    value: "net30"
    
  - type: addHelpText
    field: customerReference
    text: "Enter your purchase order number from your procurement system"
    
  - type: makeRequired
    field: customerReference
    
signature:
  algorithm: EdDSA
  publicKey: "acme-corp-overlay-key"
  signature: "base64-encoded-signature"`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Safety guarantees</h2>
        <p className="text-muted-foreground">
          Overlays are powerful, but they must not compromise security or data
          integrity. ContractSpec enforces several guarantees:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Overlays cannot grant new permissions</strong> – They can
            only hide or rearrange what the user is already allowed to see
          </li>
          <li>
            <strong>Overlays cannot bypass validation</strong> – Field types,
            constraints, and business rules from the underlying spec still apply
          </li>
          <li>
            <strong>Overlays must be signed</strong> – Only authorized parties
            (typically tenant admins) can create overlays
          </li>
          <li>
            <strong>Overlays are versioned</strong> – Changes to overlays are
            tracked and can be rolled back
          </li>
          <li>
            <strong>Overlays are audited</strong> – Every overlay application is
            logged
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Creating overlays</h2>
        <p className="text-muted-foreground">
          Overlays can be created through:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Visual editor</strong> – A drag-and-drop interface for
            non-technical users
          </li>
          <li>
            <strong>TypeScript/JSON</strong> – For developers who prefer code
          </li>
          <li>
            <strong>API</strong> – Programmatically create overlays for
            automation
          </li>
        </ul>
        <p className="text-muted-foreground">
          Once created, overlays must be signed using a private key. The
          corresponding public key is registered with ContractSpec, which
          verifies the signature before applying the overlay.
        </p>
        <p className="text-muted-foreground">
          See{' '}
          <Link
            href="/docs/libraries/overlay-engine"
            className="text-violet-400 underline"
          >
            Overlay Engine docs
          </Link>{' '}
          and the{' '}
          <Link
            href="/docs/advanced/overlay-editor"
            className="text-violet-400 underline"
          >
            Overlay Editor guide
          </Link>{' '}
          for end-to-end workflows.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Overlay scope</h2>
        <p className="text-muted-foreground">Overlays can be scoped to:</p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Tenant</strong> – All users in a tenant see the same overlay
          </li>
          <li>
            <strong>User</strong> – Individual users can have personal overlays
          </li>
          <li>
            <strong>Role</strong> – All users with a specific role see the
            overlay
          </li>
          <li>
            <strong>Device</strong> – Different overlays for mobile vs desktop
          </li>
        </ul>
        <p className="text-muted-foreground">
          If multiple overlays apply to the same user, they are merged in order
          of specificity (user overlays override role overlays, which override
          tenant overlays).
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Start with the default UI and only create overlays when users
            request specific changes.
          </li>
          <li>
            Document why each overlay modification was made—this helps when
            reviewing or updating overlays.
          </li>
          <li>
            Test overlays thoroughly to ensure they don't break workflows or
            confuse users.
          </li>
          <li>
            Use tenant-level overlays for organizational customizations and
            user-level overlays for personal preferences.
          </li>
          <li>
            Regularly review overlays to remove ones that are no longer needed.
          </li>
          <li>
            Protect overlay signing keys carefully—they control what
            customizations are allowed.
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/specs/policy" className="btn-ghost">
          Previous: Policy
        </Link>
        <Link href="/docs/safety" className="btn-primary">
          Next: Safety <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
