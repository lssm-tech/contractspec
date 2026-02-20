/**
 * French (fr) translation catalog for @contractspec/module.lifecycle-advisor.
 *
 * @module i18n/catalogs/fr
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const frMessages = defineTranslation({
  meta: {
    key: 'lifecycle-advisor.messages',
    version: '1.0.0',
    domain: 'lifecycle-advisor',
    description: 'Playbook, ceremony, library, and engine strings (French)',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'fr',
  fallback: 'en',
  messages: {
    // ── Stage 0 focus ──────────────────────────────────────────────
    'playbook.stage0.focus.0': {
      value: 'Découverte',
      description: 'Stage 0 focus area: Discovery',
    },
    'playbook.stage0.focus.1': {
      value: 'Clarté du problème',
      description: 'Stage 0 focus area: Problem clarity',
    },
    'playbook.stage0.focus.2': {
      value: 'Persona',
      description: 'Stage 0 focus area: Persona',
    },

    // ── Stage 1 focus ──────────────────────────────────────────────
    'playbook.stage1.focus.0': {
      value: 'Prototype',
      description: 'Stage 1 focus area: Prototype',
    },
    'playbook.stage1.focus.1': {
      value: 'Retours',
      description: 'Stage 1 focus area: Feedback',
    },
    'playbook.stage1.focus.2': {
      value: 'Preuve de valeur',
      description: 'Stage 1 focus area: Value proof',
    },

    // ── Stage 2 focus ──────────────────────────────────────────────
    'playbook.stage2.focus.0': {
      value: 'Activation',
      description: 'Stage 2 focus area: Activation',
    },
    'playbook.stage2.focus.1': {
      value: 'Télémétrie',
      description: 'Stage 2 focus area: Telemetry',
    },
    'playbook.stage2.focus.2': {
      value: 'Retours',
      description: 'Stage 2 focus area: Feedback',
    },

    // ── Stage 3 focus ──────────────────────────────────────────────
    'playbook.stage3.focus.0': {
      value: 'Rétention',
      description: 'Stage 3 focus area: Retention',
    },
    'playbook.stage3.focus.1': {
      value: 'Fiabilité',
      description: 'Stage 3 focus area: Reliability',
    },
    'playbook.stage3.focus.2': {
      value: 'Récit',
      description: 'Stage 3 focus area: Story',
    },

    // ── Stage 4 focus ──────────────────────────────────────────────
    'playbook.stage4.focus.0': {
      value: 'Systèmes',
      description: 'Stage 4 focus area: Systems',
    },
    'playbook.stage4.focus.1': {
      value: 'Boucles de croissance',
      description: 'Stage 4 focus area: Growth loops',
    },
    'playbook.stage4.focus.2': {
      value: 'Spécialisation',
      description: 'Stage 4 focus area: Specialization',
    },

    // ── Stage 5 focus ──────────────────────────────────────────────
    'playbook.stage5.focus.0': {
      value: 'Partenaires',
      description: 'Stage 5 focus area: Partners',
    },
    'playbook.stage5.focus.1': {
      value: 'APIs',
      description: 'Stage 5 focus area: APIs',
    },
    'playbook.stage5.focus.2': {
      value: "Paris d'expansion",
      description: 'Stage 5 focus area: Expansion bets',
    },

    // ── Stage 6 focus ──────────────────────────────────────────────
    'playbook.stage6.focus.0': {
      value: 'Optimisation',
      description: 'Stage 6 focus area: Optimization',
    },
    'playbook.stage6.focus.1': {
      value: 'Renouvellement',
      description: 'Stage 6 focus area: Renewal',
    },
    'playbook.stage6.focus.2': {
      value: 'Portefeuille',
      description: 'Stage 6 focus area: Portfolio',
    },

    // ── Stage 0 actions ────────────────────────────────────────────
    'playbook.stage0.action0.title': {
      value: "Mener un sprint d'entretiens de 5 jours",
      description: 'Stage 0 action 0 title',
    },
    'playbook.stage0.action0.description': {
      value:
        'Planifier au moins 5 entretiens consécutifs et capturer les citations brutes.',
      description: 'Stage 0 action 0 description',
    },
    'playbook.stage0.action1.title': {
      value: "Rédiger l'histoire du problème",
      description: 'Stage 0 action 1 title',
    },
    'playbook.stage0.action1.description': {
      value:
        'Résumer la douleur en un paragraphe que vous pouvez répéter aux partenaires.',
      description: 'Stage 0 action 1 description',
    },

    // ── Stage 1 actions ────────────────────────────────────────────
    'playbook.stage1.action0.title': {
      value: 'Boucle de retours sur le prototype',
      description: 'Stage 1 action 0 title',
    },
    'playbook.stage1.action0.description': {
      value:
        'Livrer un prototype basse fidélité et recueillir 3 tours de réactions.',
      description: 'Stage 1 action 0 description',
    },
    'playbook.stage1.action1.title': {
      value: 'Capturer les signaux de recommandation',
      description: 'Stage 1 action 1 title',
    },
    'playbook.stage1.action1.description': {
      value: "Demander à chaque testeur qui d'autre devrait voir la démo.",
      description: 'Stage 1 action 1 description',
    },

    // ── Stage 2 actions ────────────────────────────────────────────
    'playbook.stage2.action0.title': {
      value: "Définir la checklist d'activation",
      description: 'Stage 2 action 0 title',
    },
    'playbook.stage2.action0.description': {
      value:
        'Documenter les 3 étapes que les utilisateurs doivent terminer pour obtenir de la valeur.',
      description: 'Stage 2 action 0 description',
    },
    'playbook.stage2.action1.title': {
      value: 'Synchronisation hebdomadaire avec les utilisateurs',
      description: 'Stage 2 action 1 title',
    },
    'playbook.stage2.action1.description': {
      value:
        'Organiser un appel récurrent avec vos 5 testeurs les plus actifs.',
      description: 'Stage 2 action 1 description',
    },

    // ── Stage 3 actions ────────────────────────────────────────────
    'playbook.stage3.action0.title': {
      value: 'Mener une étude de rétention',
      description: 'Stage 3 action 0 title',
    },
    'playbook.stage3.action0.description': {
      value:
        'Interviewer 3 utilisateurs retenus et publier leurs métriques avant/après.',
      description: 'Stage 3 action 0 description',
    },
    'playbook.stage3.action1.title': {
      value: "Revue légère d'incidents",
      description: 'Stage 3 action 1 title',
    },
    'playbook.stage3.action1.description': {
      value:
        'Examiner les 2 derniers incidents de fiabilité et capturer les correctifs.',
      description: 'Stage 3 action 1 description',
    },

    // ── Stage 4 actions ────────────────────────────────────────────
    'playbook.stage4.action0.title': {
      value: 'Codifier une boucle de croissance',
      description: 'Stage 4 action 0 title',
    },
    'playbook.stage4.action0.description': {
      value:
        'Choisir une boucle (SEO, recommandations, outbound) et documenter les responsables + entrées.',
      description: 'Stage 4 action 0 description',
    },
    'playbook.stage4.action1.title': {
      value: 'Créer la carte de recrutement',
      description: 'Stage 4 action 1 title',
    },
    'playbook.stage4.action1.description': {
      value:
        'Lister les rôles spécialisés nécessaires pour les 2 prochains trimestres.',
      description: 'Stage 4 action 1 description',
    },

    // ── Stage 5 actions ────────────────────────────────────────────
    'playbook.stage5.action0.title': {
      value: 'Brief de préparation partenaire',
      description: 'Stage 5 action 0 title',
    },
    'playbook.stage5.action0.description': {
      value:
        "Documenter les types de partenaires, propositions de valeur et étapes d'intégration.",
      description: 'Stage 5 action 0 description',
    },
    'playbook.stage5.action1.title': {
      value: "Portefeuille d'expériences d'expansion",
      description: 'Stage 5 action 1 title',
    },
    'playbook.stage5.action1.description': {
      value:
        'Lister les 3 principaux marchés ou lignes de produits avec les responsables.',
      description: 'Stage 5 action 1 description',
    },

    // ── Stage 6 actions ────────────────────────────────────────────
    'playbook.stage6.action0.title': {
      value: 'Mener une revue coût-valeur',
      description: 'Stage 6 action 0 title',
    },
    'playbook.stage6.action0.description': {
      value:
        'Auditer chaque surface majeure pour l\u2019impact sur les marges.',
      description: 'Stage 6 action 0 description',
    },
    'playbook.stage6.action1.title': {
      value: 'Définir le pari de renouvellement',
      description: 'Stage 6 action 1 title',
    },
    'playbook.stage6.action1.description': {
      value:
        "Choisir une piste de réinvention ou d'arrêt et définir des points de contrôle.",
      description: 'Stage 6 action 1 description',
    },

    // ── Ceremony titles & copy ─────────────────────────────────────
    'ceremony.stage0.title': {
      value: 'Étincelle de découverte',
      description: 'Stage 0 ceremony title',
    },
    'ceremony.stage0.copy': {
      value:
        'Partagez la citation la plus percutante avec votre équipe. Encadrez-la, célébrez le focus.',
      description: 'Stage 0 ceremony copy',
    },
    'ceremony.stage1.title': {
      value: 'Résonance de la solution',
      description: 'Stage 1 ceremony title',
    },
    'ceremony.stage1.copy': {
      value:
        "Enregistrez un court partage d'écran racontant l'histoire avant/après à votre futur vous.",
      description: 'Stage 1 ceremony copy',
    },
    'ceremony.stage2.title': {
      value: 'Toast à la traction',
      description: 'Stage 2 ceremony title',
    },
    'ceremony.stage2.copy': {
      value:
        'Portez un toast à vos 20 premiers vrais utilisateurs \u2014 dites leurs noms, dites-leur pourquoi ils comptent.',
      description: 'Stage 2 ceremony copy',
    },
    'ceremony.stage3.title': {
      value: 'Signal PMF',
      description: 'Stage 3 ceremony title',
    },
    'ceremony.stage3.copy': {
      value:
        "Écrivez une lettre à votre futur vous de la Série A décrivant l'attraction que vous ressentez aujourd'hui.",
      description: 'Stage 3 ceremony copy',
    },
    'ceremony.stage4.title': {
      value: "Systèmes d'échelle",
      description: 'Stage 4 ceremony title',
    },
    'ceremony.stage4.copy': {
      value:
        "Invitez l'équipe à cartographier le parcours du premier utilisateur à la machine répétable.",
      description: 'Stage 4 ceremony copy',
    },
    'ceremony.stage5.title': {
      value: 'Seuil de la plateforme',
      description: 'Stage 5 ceremony title',
    },
    'ceremony.stage5.copy': {
      value:
        'Organisez un cercle de partenaires \u2014 invitez les alliés à partager ce dont ils ont besoin de votre plateforme.',
      description: 'Stage 5 ceremony copy',
    },
    'ceremony.stage6.title': {
      value: 'Sommet du renouvellement',
      description: 'Stage 6 ceremony title',
    },
    'ceremony.stage6.copy': {
      value:
        'Faites une pause pour honorer ce qui vous a amené ici, puis engagez-vous publiquement pour la prochaine réinvention.',
      description: 'Stage 6 ceremony copy',
    },

    // ── Library descriptions ───────────────────────────────────────
    'library.stage0.item0': {
      value: 'Résumer les entretiens et synthétiser les insights IC.',
      description: 'Stage 0 library item 0',
    },
    'library.stage0.item1': {
      value: 'Créer des storyboards basse fidélité sans code personnalisé.',
      description: 'Stage 0 library item 1',
    },
    'library.stage1.item0': {
      value:
        'Contrôler les fonctionnalités prototype derrière des flags légers.',
      description: 'Stage 1 library item 0',
    },
    'library.stage1.item1': {
      value: 'Capturer les signaux de questionnaire pour un scoring précoce.',
      description: 'Stage 1 library item 1',
    },
    'library.stage2.item0': {
      value: "Instrumenter les parcours d'activation + cohortes.",
      description: 'Stage 2 library item 0',
    },
    'library.stage2.item1': {
      value: 'Collecter les traces et métriques minimales viables.',
      description: 'Stage 2 library item 1',
    },
    'library.stage3.item0': {
      value:
        'Détecter automatiquement les lacunes de contrat et améliorations de spec.',
      description: 'Stage 3 library item 0',
    },
    'library.stage3.item1': {
      value: 'Générer des conseils axés sur la rétention à grande échelle.',
      description: 'Stage 3 library item 1',
    },
    'library.stage4.item0': {
      value: "Orchestration d'expériences avec garde-fous.",
      description: 'Stage 4 library item 0',
    },
    'library.stage4.item1': {
      value:
        'Stabiliser l\u2019infra et les SLOs au fur et à mesure que les équipes se divisent.',
      description: 'Stage 4 library item 1',
    },
    'library.stage5.item0': {
      value: 'Automatiser les workflows partenaires et intégrations.',
      description: 'Stage 5 library item 0',
    },
    'library.stage5.item1': {
      value: "Exposer l'intégration partenaire gérée via Studio.",
      description: 'Stage 5 library item 1',
    },
    'library.stage6.item0': {
      value: 'Modéliser les scénarios de marge et paris de réinvestissement.',
      description: 'Stage 6 library item 0',
    },
    'library.stage6.item1': {
      value: "Standardiser les rituels de renouvellement et l'automatisation.",
      description: 'Stage 6 library item 1',
    },

    // ── Engine fallback strings ────────────────────────────────────
    'engine.fallbackAction.title': {
      value: 'Avancer sur {focus}',
      description: 'Fallback action title with focus placeholder',
    },
    'engine.fallbackAction.description': {
      value:
        'Identifier une tâche qui améliorera \u00ab\u202f{focus}\u202f\u00bb cette semaine.',
      description: 'Fallback action description with focus placeholder',
    },
  },
});
