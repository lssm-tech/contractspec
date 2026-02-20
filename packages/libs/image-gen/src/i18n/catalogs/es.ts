/**
 * Spanish (es) translation catalog for @contractspec/lib.image-gen.
 *
 * @module i18n/catalogs/es
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const esMessages = defineTranslation({
  meta: {
    key: 'image-gen.messages',
    version: '1.0.0',
    domain: 'image-gen',
    description: 'Spanish translations for the image-gen package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'es',
  fallback: 'en',
  messages: {
    'prompt.system.imagePromptEngineer': {
      value:
        'Eres un experto en ingenier\u00eda de prompts de im\u00e1genes. Dado un brief JSON que contiene t\u00edtulo, resumen, problemas, soluciones, prop\u00f3sito, estilo y tokens de estilo, produce un prompt detallado de generaci\u00f3n de im\u00e1genes. El prompt debe ser v\u00edvido, espec\u00edfico y optimizado para modelos de generaci\u00f3n de im\u00e1genes con IA. Conc\u00e9ntrate en la composici\u00f3n, iluminaci\u00f3n, paleta de colores y tema. Produce solo el texto del prompt, sin JSON.',
      description:
        'Prompt del sistema para ingenier\u00eda de prompts de im\u00e1genes por LLM',
    },

    'image.generate.description': {
      value: 'Generar una imagen {style} para {purpose}',
      description:
        'Plantilla de descripci\u00f3n para tareas de generaci\u00f3n de im\u00e1genes',
      placeholders: [
        { name: 'style', type: 'string' },
        { name: 'purpose', type: 'string' },
      ],
    },
    'image.prompt.featuring': {
      value: 'presentando {solutions}',
      description: 'Fragmento de prompt para soluciones destacadas',
      placeholders: [{ name: 'solutions', type: 'string' }],
    },
    'image.prompt.industryContext': {
      value: 'contexto de {industry}',
      description: 'Fragmento de prompt para contexto de industria',
      placeholders: [{ name: 'industry', type: 'string' }],
    },
    'image.error.noProvider': {
      value: 'No hay proveedor de im\u00e1genes configurado',
      description: 'Mensaje de error cuando no hay ImageProvider disponible',
    },
    'image.error.generationFailed': {
      value: 'La generaci\u00f3n de imagen fall\u00f3',
      description: 'Mensaje de error cuando la generaci\u00f3n de imagen falla',
    },

    'purpose.blogHero': {
      value: 'Imagen hero de blog',
      description: 'Etiqueta para el prop\u00f3sito imagen hero de blog',
    },
    'purpose.socialOg': {
      value: 'Imagen OG para redes sociales',
      description: 'Etiqueta para el prop\u00f3sito imagen Open Graph',
    },
    'purpose.socialTwitter': {
      value: 'Imagen de tarjeta Twitter',
      description: 'Etiqueta para el prop\u00f3sito imagen tarjeta Twitter',
    },
    'purpose.socialInstagram': {
      value: 'Imagen de Instagram',
      description: 'Etiqueta para el prop\u00f3sito imagen Instagram',
    },
    'purpose.landingHero': {
      value: 'Hero de p\u00e1gina de aterrizaje',
      description:
        'Etiqueta para el prop\u00f3sito imagen hero de p\u00e1gina de aterrizaje',
    },
    'purpose.videoThumbnail': {
      value: 'Miniatura de video',
      description: 'Etiqueta para el prop\u00f3sito miniatura de video',
    },
    'purpose.emailHeader': {
      value: 'Encabezado de email',
      description: 'Etiqueta para el prop\u00f3sito imagen encabezado de email',
    },
    'purpose.illustration': {
      value: 'Ilustraci\u00f3n',
      description: 'Etiqueta para el prop\u00f3sito ilustraci\u00f3n',
    },
    'purpose.icon': {
      value: 'Icono',
      description: 'Etiqueta para el prop\u00f3sito icono',
    },
  },
});
