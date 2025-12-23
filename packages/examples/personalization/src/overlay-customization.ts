import { defineOverlay } from '@lssm/lib.overlay-engine/spec';
import { signOverlay } from '@lssm/lib.overlay-engine/signer';
import { OverlayEngine, OverlayRegistry } from '@lssm/lib.overlay-engine';
import { Logger, LogLevel } from '@lssm/lib.logger';

const logger = new Logger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  environment: process.env.NODE_ENV || 'development',
  enableColors: process.env.NODE_ENV !== 'production',
});

export async function runOverlayCustomizationExample(): Promise<void> {
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
      {
        type: 'renameLabel',
        field: 'customerReference',
        newLabel: 'PO Number',
      },
    ],
  });

  const signed = await signOverlay(overlay, process.env.PRIVATE_KEY_PEM ?? '');
  registry.register(signed);

  const result = engine.apply({
    target: {
      fields: [
        {
          key: 'customerReference',
          label: 'Customer Reference',
          visible: true,
        },
        { key: 'internalNotes', label: 'Internal Notes', visible: true },
      ],
    },
    capability: 'billing.createOrder',
    tenantId: 'demo',
  });

  logger.info('Overlay applied', { fields: result.target.fields });
}
