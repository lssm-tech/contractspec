import { defineOverlay } from '@lssm/lib.overlay-engine/spec';
import { signOverlay } from '@lssm/lib.overlay-engine/signer';
import { OverlayEngine, OverlayRegistry } from '@lssm/lib.overlay-engine';

async function main() {
  const registry = new OverlayRegistry({ allowUnsigned: true });
  const engine = new OverlayEngine({ registry });

  const overlay = defineOverlay({
    overlayId: 'demo-overlay',
    version: '1.0.0',
    appliesTo: {
      capability: 'billing.createOrder',
      tenantId: 'demo',
    },
    modifications: [
      { type: 'hideField', field: 'internalNotes' },
      { type: 'renameLabel', field: 'customerReference', newLabel: 'PO Number' },
    ],
  });

  const signed = await signOverlay(overlay, process.env.PRIVATE_KEY_PEM ?? '');
  registry.register(signed);

  const result = engine.apply({
    target: {
      fields: [
        { key: 'customerReference', label: 'Customer Reference', visible: true },
        { key: 'internalNotes', label: 'Internal Notes', visible: true },
      ],
    },
    capability: 'billing.createOrder',
    tenantId: 'demo',
  });

  console.log(result.target.fields);
}

main();






















