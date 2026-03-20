import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const esMessages = defineTranslation({
	meta: {
		key: 'surface-runtime.messages',
		version: '1.0.0',
		domain: 'surface-runtime',
		description: 'User-facing strings for surface-runtime UI components',
		owners: ['platform'],
		stability: 'experimental',
	},
	locale: 'es',
	fallback: 'en',
	messages: {
		'overlay.conflicts.title': { value: 'Conflictos de superposición' },
		'overlay.conflicts.keepScope': { value: 'Mantener {scope}' },
		'patch.accept': { value: 'Aceptar' },
		'patch.reject': { value: 'Rechazar' },
		'patch.addWidget': { value: 'Añadir {title} a {slot}' },
		'patch.removeItem': { value: 'Eliminar elemento' },
		'patch.switchLayout': { value: 'Cambiar a disposición {layoutId}' },
		'patch.showField': { value: 'Mostrar campo {fieldId}' },
		'patch.hideField': { value: 'Ocultar campo {fieldId}' },
		'patch.moveTo': { value: 'Mover a {slot}' },
		'patch.replaceItem': { value: 'Reemplazar elemento' },
		'patch.promote': { value: 'Promover {actionId}' },
		'patch.changes': { value: '{count} cambios' },
	},
});
