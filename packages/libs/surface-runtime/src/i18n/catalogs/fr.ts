import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const frMessages = defineTranslation({
  meta: {
    key: 'surface-runtime.messages',
    version: '1.0.0',
    domain: 'surface-runtime',
    description: 'User-facing strings for surface-runtime UI components',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'fr',
  fallback: 'en',
  messages: {
    'overlay.conflicts.title': { value: 'Conflits de superposition' },
    'overlay.conflicts.keepScope': { value: 'Conserver {scope}' },
    'patch.accept': { value: 'Accepter' },
    'patch.reject': { value: 'Rejeter' },
    'patch.addWidget': { value: 'Ajouter {title} à {slot}' },
    'patch.removeItem': { value: 'Supprimer l\'élément' },
    'patch.switchLayout': { value: 'Passer à la disposition {layoutId}' },
    'patch.showField': { value: 'Afficher le champ {fieldId}' },
    'patch.hideField': { value: 'Masquer le champ {fieldId}' },
    'patch.moveTo': { value: 'Déplacer vers {slot}' },
    'patch.replaceItem': { value: 'Remplacer l\'élément' },
    'patch.promote': { value: 'Promouvoir {actionId}' },
    'patch.changes': { value: '{count} modifications' },
  },
});
