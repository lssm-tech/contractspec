/**
 * Spanish (es) translation catalog for @contractspec/lib.lifecycle.
 *
 * @module i18n/catalogs/es
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const esMessages = defineTranslation({
  meta: {
    key: 'lifecycle.messages',
    version: '1.0.0',
    domain: 'lifecycle',
    description:
      'Display labels, stage metadata, and formatter strings for the lifecycle package (Spanish)',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'es',
  fallback: 'en',
  messages: {
    // Stage Names
    'stage.exploration.name': {
      value: 'Exploraci\u00f3n / Ideaci\u00f3n',
      description: 'Display name for the Exploration stage',
    },
    'stage.problemSolutionFit.name': {
      value: 'Ajuste problema\u2013soluci\u00f3n',
      description: 'Display name for the Problem-Solution Fit stage',
    },
    'stage.mvpEarlyTraction.name': {
      value: 'MVP y tracci\u00f3n inicial',
      description: 'Display name for the MVP & Early Traction stage',
    },
    'stage.productMarketFit.name': {
      value: 'Ajuste producto\u2013mercado',
      description: 'Display name for the Product-Market Fit stage',
    },
    'stage.growthScaleUp.name': {
      value: 'Crecimiento / Escalamiento',
      description: 'Display name for the Growth / Scale-up stage',
    },
    'stage.expansionPlatform.name': {
      value: 'Expansi\u00f3n / Plataforma',
      description: 'Display name for the Expansion / Platform stage',
    },
    'stage.maturityRenewal.name': {
      value: 'Madurez / Renovaci\u00f3n',
      description: 'Display name for the Maturity / Renewal stage',
    },

    // Stage Questions
    'stage.exploration.question': {
      value: '\u00bfHay un problema que merece mi tiempo?',
      description: 'Key question for the Exploration stage',
    },
    'stage.problemSolutionFit.question': {
      value: '\u00bfLa gente se preocupa lo suficiente por esta soluci\u00f3n?',
      description: 'Key question for the Problem-Solution Fit stage',
    },
    'stage.mvpEarlyTraction.question': {
      value: '\u00bfPodemos obtener uso real y aprender r\u00e1pido?',
      description: 'Key question for the MVP & Early Traction stage',
    },
    'stage.productMarketFit.question': {
      value: '\u00bfEsto nos est\u00e1 impulsando hacia adelante?',
      description: 'Key question for the Product-Market Fit stage',
    },
    'stage.growthScaleUp.question': {
      value: '\u00bfPodemos crecer de forma repetible?',
      description: 'Key question for the Growth / Scale-up stage',
    },
    'stage.expansionPlatform.question': {
      value: '\u00bfCu\u00e1l es la pr\u00f3xima curva de crecimiento?',
      description: 'Key question for the Expansion / Platform stage',
    },
    'stage.maturityRenewal.question': {
      value: '\u00bfOptimizar, reinventar o descontinuar?',
      description: 'Key question for the Maturity / Renewal stage',
    },

    // Stage Signals
    'stage.exploration.signal.0': {
      value: '20+ entrevistas de descubrimiento',
      description: 'Signal for Exploration stage',
    },
    'stage.exploration.signal.1': {
      value: 'Planteamiento claro del problema',
      description: 'Signal for Exploration stage',
    },
    'stage.exploration.signal.2': {
      value: 'ICP identificado',
      description: 'Signal for Exploration stage',
    },
    'stage.problemSolutionFit.signal.0': {
      value: 'Reutilizaci\u00f3n del prototipo',
      description: 'Signal for Problem-Solution Fit stage',
    },
    'stage.problemSolutionFit.signal.1': {
      value: 'Energ\u00eda de recomendaci\u00f3n',
      description: 'Signal for Problem-Solution Fit stage',
    },
    'stage.problemSolutionFit.signal.2': {
      value: 'Inter\u00e9s de prepago',
      description: 'Signal for Problem-Solution Fit stage',
    },
    'stage.mvpEarlyTraction.signal.0': {
      value: '20\u201350 usuarios activos identificados',
      description: 'Signal for MVP & Early Traction stage',
    },
    'stage.mvpEarlyTraction.signal.1': {
      value: 'Lanzamientos semanales',
      description: 'Signal for MVP & Early Traction stage',
    },
    'stage.mvpEarlyTraction.signal.2': {
      value: 'Retroalimentaci\u00f3n ruidosa',
      description: 'Signal for MVP & Early Traction stage',
    },
    'stage.productMarketFit.signal.0': {
      value: 'Retenci\u00f3n sin hero\u00edsmos',
      description: 'Signal for Product-Market Fit stage',
    },
    'stage.productMarketFit.signal.1': {
      value: 'Boca a boca org\u00e1nico',
      description: 'Signal for Product-Market Fit stage',
    },
    'stage.productMarketFit.signal.2': {
      value: 'Historias de valor',
      description: 'Signal for Product-Market Fit stage',
    },
    'stage.growthScaleUp.signal.0': {
      value: 'Canales predecibles',
      description: 'Signal for Growth / Scale-up stage',
    },
    'stage.growthScaleUp.signal.1': {
      value: 'Contrataciones especializadas',
      description: 'Signal for Growth / Scale-up stage',
    },
    'stage.growthScaleUp.signal.2': {
      value: 'Econom\u00eda unitaria en camino',
      description: 'Signal for Growth / Scale-up stage',
    },
    'stage.expansionPlatform.signal.0': {
      value: 'M\u00e9tricas centrales estables',
      description: 'Signal for Expansion / Platform stage',
    },
    'stage.expansionPlatform.signal.1': {
      value: 'Demanda de socios/API',
      description: 'Signal for Expansion / Platform stage',
    },
    'stage.expansionPlatform.signal.2': {
      value: 'Atracci\u00f3n del ecosistema',
      description: 'Signal for Expansion / Platform stage',
    },
    'stage.maturityRenewal.signal.0': {
      value: 'Enfoque en m\u00e1rgenes',
      description: 'Signal for Maturity / Renewal stage',
    },
    'stage.maturityRenewal.signal.1': {
      value: 'Apuestas de portafolio',
      description: 'Signal for Maturity / Renewal stage',
    },
    'stage.maturityRenewal.signal.2': {
      value: 'Renovaci\u00f3n de la narrativa',
      description: 'Signal for Maturity / Renewal stage',
    },

    // Stage Traps
    'stage.exploration.trap.0': {
      value: 'Marca antes del descubrimiento',
      description: 'Trap for Exploration stage',
    },
    'stage.exploration.trap.1': {
      value: 'Decisiones de herramientas prematuras',
      description: 'Trap for Exploration stage',
    },
    'stage.problemSolutionFit.trap.0': {
      value: '\u00abEl mercado es enorme\u00bb sin usuarios',
      description: 'Trap for Problem-Solution Fit stage',
    },
    'stage.problemSolutionFit.trap.1': {
      value: 'Saltar los ciclos cualitativos',
      description: 'Trap for Problem-Solution Fit stage',
    },
    'stage.mvpEarlyTraction.trap.0': {
      value: 'Infraestructura sobredimensionada para 10 usuarios',
      description: 'Trap for MVP & Early Traction stage',
    },
    'stage.mvpEarlyTraction.trap.1': {
      value: 'M\u00e9trica de retenci\u00f3n indefinida',
      description: 'Trap for MVP & Early Traction stage',
    },
    'stage.productMarketFit.trap.0': {
      value: 'Crecimiento heroico que no escala',
      description: 'Trap for Product-Market Fit stage',
    },
    'stage.productMarketFit.trap.1': {
      value: 'Ignorar se\u00f1ales de abandono',
      description: 'Trap for Product-Market Fit stage',
    },
    'stage.growthScaleUp.trap.0': {
      value: 'Gasto publicitario enmascarando problemas de retenci\u00f3n',
      description: 'Trap for Growth / Scale-up stage',
    },
    'stage.growthScaleUp.trap.1': {
      value: 'Deuda de infraestructura bloqueando lanzamientos',
      description: 'Trap for Growth / Scale-up stage',
    },
    'stage.expansionPlatform.trap.0': {
      value: 'Teatro de plataforma antes de que la cu\u00f1a sea s\u00f3lida',
      description: 'Trap for Expansion / Platform stage',
    },
    'stage.maturityRenewal.trap.0': {
      value: 'Asumir que el \u00e9xito pasado es suficiente',
      description: 'Trap for Maturity / Renewal stage',
    },

    // Stage Focus Areas
    'stage.exploration.focus.0': {
      value: 'Descubrimiento de clientes',
      description: 'Focus area for Exploration stage',
    },
    'stage.exploration.focus.1': {
      value: 'Definici\u00f3n del problema',
      description: 'Focus area for Exploration stage',
    },
    'stage.exploration.focus.2': {
      value: 'Claridad del segmento',
      description: 'Focus area for Exploration stage',
    },
    'stage.problemSolutionFit.focus.0': {
      value: 'Hip\u00f3tesis de soluci\u00f3n',
      description: 'Focus area for Problem-Solution Fit stage',
    },
    'stage.problemSolutionFit.focus.1': {
      value: 'Mensaje de valor',
      description: 'Focus area for Problem-Solution Fit stage',
    },
    'stage.problemSolutionFit.focus.2': {
      value: 'Captura de retroalimentaci\u00f3n',
      description: 'Focus area for Problem-Solution Fit stage',
    },
    'stage.mvpEarlyTraction.focus.0': {
      value: 'Activaci\u00f3n',
      description: 'Focus area for MVP & Early Traction stage',
    },
    'stage.mvpEarlyTraction.focus.1': {
      value: 'Seguimiento de cohortes',
      description: 'Focus area for MVP & Early Traction stage',
    },
    'stage.mvpEarlyTraction.focus.2': {
      value: 'Rituales de retroalimentaci\u00f3n',
      description: 'Focus area for MVP & Early Traction stage',
    },
    'stage.productMarketFit.focus.0': {
      value: 'Retenci\u00f3n',
      description: 'Focus area for Product-Market Fit stage',
    },
    'stage.productMarketFit.focus.1': {
      value: 'Fiabilidad',
      description: 'Focus area for Product-Market Fit stage',
    },
    'stage.productMarketFit.focus.2': {
      value: 'Claridad del ICP',
      description: 'Focus area for Product-Market Fit stage',
    },
    'stage.growthScaleUp.focus.0': {
      value: 'Sistemas operativos',
      description: 'Focus area for Growth / Scale-up stage',
    },
    'stage.growthScaleUp.focus.1': {
      value: 'Bucles de crecimiento',
      description: 'Focus area for Growth / Scale-up stage',
    },
    'stage.growthScaleUp.focus.2': {
      value: 'Ingenier\u00eda de fiabilidad',
      description: 'Focus area for Growth / Scale-up stage',
    },
    'stage.expansionPlatform.focus.0': {
      value: 'Alianzas',
      description: 'Focus area for Expansion / Platform stage',
    },
    'stage.expansionPlatform.focus.1': {
      value: 'APIs',
      description: 'Focus area for Expansion / Platform stage',
    },
    'stage.expansionPlatform.focus.2': {
      value: 'Validaci\u00f3n de nuevos mercados',
      description: 'Focus area for Expansion / Platform stage',
    },
    'stage.maturityRenewal.focus.0': {
      value: 'Optimizaci\u00f3n de costos',
      description: 'Focus area for Maturity / Renewal stage',
    },
    'stage.maturityRenewal.focus.1': {
      value: 'Apuestas de reinvenci\u00f3n',
      description: 'Focus area for Maturity / Renewal stage',
    },
    'stage.maturityRenewal.focus.2': {
      value: 'Planificaci\u00f3n de fin de vida',
      description: 'Focus area for Maturity / Renewal stage',
    },

    // Formatter Strings
    'formatter.stageTitle': {
      value: 'Etapa {order} \u00b7 {name}',
      description: 'Title template for stage summary',
    },
    'formatter.axis.product': {
      value: 'Producto: {phase}',
      description: 'Product axis label in summary',
    },
    'formatter.axis.company': {
      value: 'Empresa: {phase}',
      description: 'Company axis label in summary',
    },
    'formatter.axis.capital': {
      value: 'Capital: {phase}',
      description: 'Capital axis label in summary',
    },
    'formatter.action.fallback': {
      value: 'Conc\u00e9ntrese en los pr\u00f3ximos hitos.',
      description: 'Default action copy when no top action exists',
    },
    'formatter.digest': {
      value: 'Pr\u00f3ximo para {name}: {actionCopy}',
      description: 'Recommendation digest template',
    },
  },
});
