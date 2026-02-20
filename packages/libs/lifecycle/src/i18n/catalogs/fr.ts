/**
 * French (fr) translation catalog for @contractspec/lib.lifecycle.
 *
 * @module i18n/catalogs/fr
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const frMessages = defineTranslation({
  meta: {
    key: 'lifecycle.messages',
    version: '1.0.0',
    domain: 'lifecycle',
    description:
      'Display labels, stage metadata, and formatter strings for the lifecycle package (French)',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'fr',
  fallback: 'en',
  messages: {
    // Stage Names
    'stage.exploration.name': {
      value: 'Exploration / Id\u00e9ation',
      description: 'Display name for the Exploration stage',
    },
    'stage.problemSolutionFit.name': {
      value: 'Ad\u00e9quation probl\u00e8me\u2013solution',
      description: 'Display name for the Problem-Solution Fit stage',
    },
    'stage.mvpEarlyTraction.name': {
      value: 'MVP et premi\u00e8re traction',
      description: 'Display name for the MVP & Early Traction stage',
    },
    'stage.productMarketFit.name': {
      value: 'Ad\u00e9quation produit\u2013march\u00e9',
      description: 'Display name for the Product-Market Fit stage',
    },
    'stage.growthScaleUp.name': {
      value: 'Croissance / Mise \u00e0 l\u2019\u00e9chelle',
      description: 'Display name for the Growth / Scale-up stage',
    },
    'stage.expansionPlatform.name': {
      value: 'Expansion / Plateforme',
      description: 'Display name for the Expansion / Platform stage',
    },
    'stage.maturityRenewal.name': {
      value: 'Maturit\u00e9 / Renouvellement',
      description: 'Display name for the Maturity / Renewal stage',
    },

    // Stage Questions
    'stage.exploration.question': {
      value: 'Y a-t-il un probl\u00e8me qui m\u00e9rite mon temps ?',
      description: 'Key question for the Exploration stage',
    },
    'stage.problemSolutionFit.question': {
      value: 'Les gens se soucient-ils assez de cette solution ?',
      description: 'Key question for the Problem-Solution Fit stage',
    },
    'stage.mvpEarlyTraction.question': {
      value: 'Peut-on obtenir une utilisation r\u00e9elle et apprendre vite ?',
      description: 'Key question for the MVP & Early Traction stage',
    },
    'stage.productMarketFit.question': {
      value: 'Est-ce que cela nous tire vers l\u2019avant ?',
      description: 'Key question for the Product-Market Fit stage',
    },
    'stage.growthScaleUp.question': {
      value: 'Peut-on faire cro\u00eetre de mani\u00e8re r\u00e9p\u00e9table ?',
      description: 'Key question for the Growth / Scale-up stage',
    },
    'stage.expansionPlatform.question': {
      value: 'Quelle est la prochaine courbe de croissance ?',
      description: 'Key question for the Expansion / Platform stage',
    },
    'stage.maturityRenewal.question': {
      value: 'Optimiser, r\u00e9inventer ou arr\u00eater ?',
      description: 'Key question for the Maturity / Renewal stage',
    },

    // Stage Signals
    'stage.exploration.signal.0': {
      value: '20+ entretiens de d\u00e9couverte',
      description: 'Signal for Exploration stage',
    },
    'stage.exploration.signal.1': {
      value: '\u00c9nonc\u00e9 clair du probl\u00e8me',
      description: 'Signal for Exploration stage',
    },
    'stage.exploration.signal.2': {
      value: 'ICP nomm\u00e9',
      description: 'Signal for Exploration stage',
    },
    'stage.problemSolutionFit.signal.0': {
      value: 'R\u00e9utilisation du prototype',
      description: 'Signal for Problem-Solution Fit stage',
    },
    'stage.problemSolutionFit.signal.1': {
      value: '\u00c9nergie de recommandation',
      description: 'Signal for Problem-Solution Fit stage',
    },
    'stage.problemSolutionFit.signal.2': {
      value: 'Int\u00e9r\u00eat de pr\u00e9paiement',
      description: 'Signal for Problem-Solution Fit stage',
    },
    'stage.mvpEarlyTraction.signal.0': {
      value: '20\u201350 utilisateurs actifs nomm\u00e9s',
      description: 'Signal for MVP & Early Traction stage',
    },
    'stage.mvpEarlyTraction.signal.1': {
      value: 'Livraisons hebdomadaires',
      description: 'Signal for MVP & Early Traction stage',
    },
    'stage.mvpEarlyTraction.signal.2': {
      value: 'Retours bruyants',
      description: 'Signal for MVP & Early Traction stage',
    },
    'stage.productMarketFit.signal.0': {
      value: 'R\u00e9tention sans h\u00e9ro\u00efsme',
      description: 'Signal for Product-Market Fit stage',
    },
    'stage.productMarketFit.signal.1': {
      value: 'Bouche-\u00e0-oreille organique',
      description: 'Signal for Product-Market Fit stage',
    },
    'stage.productMarketFit.signal.2': {
      value: 'T\u00e9moignages de valeur',
      description: 'Signal for Product-Market Fit stage',
    },
    'stage.growthScaleUp.signal.0': {
      value: 'Canaux pr\u00e9visibles',
      description: 'Signal for Growth / Scale-up stage',
    },
    'stage.growthScaleUp.signal.1': {
      value: 'Recrutements sp\u00e9cialis\u00e9s',
      description: 'Signal for Growth / Scale-up stage',
    },
    'stage.growthScaleUp.signal.2': {
      value: '\u00c9conomie unitaire en bonne voie',
      description: 'Signal for Growth / Scale-up stage',
    },
    'stage.expansionPlatform.signal.0': {
      value: 'M\u00e9triques cl\u00e9s stables',
      description: 'Signal for Expansion / Platform stage',
    },
    'stage.expansionPlatform.signal.1': {
      value: 'Demande partenaires/API',
      description: 'Signal for Expansion / Platform stage',
    },
    'stage.expansionPlatform.signal.2': {
      value: 'Attraction d\u2019\u00e9cosyst\u00e8me',
      description: 'Signal for Expansion / Platform stage',
    },
    'stage.maturityRenewal.signal.0': {
      value: 'Focus sur les marges',
      description: 'Signal for Maturity / Renewal stage',
    },
    'stage.maturityRenewal.signal.1': {
      value: 'Paris de portefeuille',
      description: 'Signal for Maturity / Renewal stage',
    },
    'stage.maturityRenewal.signal.2': {
      value: 'Rafra\u00eechissement du r\u00e9cit',
      description: 'Signal for Maturity / Renewal stage',
    },

    // Stage Traps
    'stage.exploration.trap.0': {
      value: 'Image de marque avant la d\u00e9couverte',
      description: 'Trap for Exploration stage',
    },
    'stage.exploration.trap.1': {
      value: 'D\u00e9cisions d\u2019outillage pr\u00e9matur\u00e9es',
      description: 'Trap for Exploration stage',
    },
    'stage.problemSolutionFit.trap.0': {
      value: '\u00ab Le march\u00e9 est \u00e9norme \u00bb sans utilisateurs',
      description: 'Trap for Problem-Solution Fit stage',
    },
    'stage.problemSolutionFit.trap.1': {
      value: 'Sauter les boucles qualitatives',
      description: 'Trap for Problem-Solution Fit stage',
    },
    'stage.mvpEarlyTraction.trap.0': {
      value: 'Infra surdimensionn\u00e9e pour 10 utilisateurs',
      description: 'Trap for MVP & Early Traction stage',
    },
    'stage.mvpEarlyTraction.trap.1': {
      value: 'M\u00e9trique de r\u00e9tention ind\u00e9finie',
      description: 'Trap for MVP & Early Traction stage',
    },
    'stage.productMarketFit.trap.0': {
      value: 'Croissance h\u00e9ro\u00efque non scalable',
      description: 'Trap for Product-Market Fit stage',
    },
    'stage.productMarketFit.trap.1': {
      value: 'Ignorer les signaux d\u2019attrition',
      description: 'Trap for Product-Market Fit stage',
    },
    'stage.growthScaleUp.trap.0': {
      value:
        'D\u00e9penses publicitaires masquant les probl\u00e8mes de r\u00e9tention',
      description: 'Trap for Growth / Scale-up stage',
    },
    'stage.growthScaleUp.trap.1': {
      value: 'Dette infra bloquant les lancements',
      description: 'Trap for Growth / Scale-up stage',
    },
    'stage.expansionPlatform.trap.0': {
      value: 'Th\u00e9\u00e2tre de plateforme avant que le coin soit solide',
      description: 'Trap for Expansion / Platform stage',
    },
    'stage.maturityRenewal.trap.0': {
      value: 'Supposer que le succ\u00e8s pass\u00e9 suffit',
      description: 'Trap for Maturity / Renewal stage',
    },

    // Stage Focus Areas
    'stage.exploration.focus.0': {
      value: 'D\u00e9couverte client',
      description: 'Focus area for Exploration stage',
    },
    'stage.exploration.focus.1': {
      value: 'D\u00e9finition du probl\u00e8me',
      description: 'Focus area for Exploration stage',
    },
    'stage.exploration.focus.2': {
      value: 'Clart\u00e9 du segment',
      description: 'Focus area for Exploration stage',
    },
    'stage.problemSolutionFit.focus.0': {
      value: 'Hypoth\u00e8se de solution',
      description: 'Focus area for Problem-Solution Fit stage',
    },
    'stage.problemSolutionFit.focus.1': {
      value: 'Message de valeur',
      description: 'Focus area for Problem-Solution Fit stage',
    },
    'stage.problemSolutionFit.focus.2': {
      value: 'Capture de retours',
      description: 'Focus area for Problem-Solution Fit stage',
    },
    'stage.mvpEarlyTraction.focus.0': {
      value: 'Activation',
      description: 'Focus area for MVP & Early Traction stage',
    },
    'stage.mvpEarlyTraction.focus.1': {
      value: 'Suivi de cohortes',
      description: 'Focus area for MVP & Early Traction stage',
    },
    'stage.mvpEarlyTraction.focus.2': {
      value: 'Rituels de retours',
      description: 'Focus area for MVP & Early Traction stage',
    },
    'stage.productMarketFit.focus.0': {
      value: 'R\u00e9tention',
      description: 'Focus area for Product-Market Fit stage',
    },
    'stage.productMarketFit.focus.1': {
      value: 'Fiabilit\u00e9',
      description: 'Focus area for Product-Market Fit stage',
    },
    'stage.productMarketFit.focus.2': {
      value: 'Clart\u00e9 de l\u2019ICP',
      description: 'Focus area for Product-Market Fit stage',
    },
    'stage.growthScaleUp.focus.0': {
      value: 'Syst\u00e8mes op\u00e9rationnels',
      description: 'Focus area for Growth / Scale-up stage',
    },
    'stage.growthScaleUp.focus.1': {
      value: 'Boucles de croissance',
      description: 'Focus area for Growth / Scale-up stage',
    },
    'stage.growthScaleUp.focus.2': {
      value: 'Ing\u00e9nierie de fiabilit\u00e9',
      description: 'Focus area for Growth / Scale-up stage',
    },
    'stage.expansionPlatform.focus.0': {
      value: 'Partenariats',
      description: 'Focus area for Expansion / Platform stage',
    },
    'stage.expansionPlatform.focus.1': {
      value: 'APIs',
      description: 'Focus area for Expansion / Platform stage',
    },
    'stage.expansionPlatform.focus.2': {
      value: 'Validation de nouveaux march\u00e9s',
      description: 'Focus area for Expansion / Platform stage',
    },
    'stage.maturityRenewal.focus.0': {
      value: 'Optimisation des co\u00fbts',
      description: 'Focus area for Maturity / Renewal stage',
    },
    'stage.maturityRenewal.focus.1': {
      value: 'Paris de r\u00e9invention',
      description: 'Focus area for Maturity / Renewal stage',
    },
    'stage.maturityRenewal.focus.2': {
      value: 'Planification de fin de vie',
      description: 'Focus area for Maturity / Renewal stage',
    },

    // Formatter Strings
    'formatter.stageTitle': {
      value: '\u00c9tape {order} \u00b7 {name}',
      description: 'Title template for stage summary',
    },
    'formatter.axis.product': {
      value: 'Produit : {phase}',
      description: 'Product axis label in summary',
    },
    'formatter.axis.company': {
      value: 'Entreprise : {phase}',
      description: 'Company axis label in summary',
    },
    'formatter.axis.capital': {
      value: 'Capital : {phase}',
      description: 'Capital axis label in summary',
    },
    'formatter.action.fallback': {
      value: 'Concentrez-vous sur les prochains jalons.',
      description: 'Default action copy when no top action exists',
    },
    'formatter.digest': {
      value: 'Prochaine \u00e9tape pour {name} : {actionCopy}',
      description: 'Recommendation digest template',
    },
  },
});
