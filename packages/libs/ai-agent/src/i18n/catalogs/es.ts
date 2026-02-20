/**
 * Spanish (es) translation catalog for @contractspec/lib.ai-agent.
 *
 * Translated from the English (en) reference locale.
 *
 * @module i18n/catalogs/es
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const esMessages = defineTranslation({
  meta: {
    key: 'ai-agent.messages',
    version: '1.0.0',
    domain: 'ai-agent',
    description:
      'Todas las cadenas de texto orientadas al usuario, al LLM y al desarrollador del paquete ai-agent',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'es',
  fallback: 'en',
  messages: {
    // ═══════════════════════════════════════════════════════════════════════════
    // Instrucciones y prompts del sistema para LLM
    // ═══════════════════════════════════════════════════════════════════════════

    'agent.json.rules.validJsonOnly': {
      value: 'Usted DEBE generar ÚNICAMENTE JSON válido.',
      description: 'Regla del ejecutor JSON: la salida debe ser JSON válido',
    },
    'agent.json.rules.noMarkdownFences': {
      value: 'No envuelva la salida en bloques de código markdown.',
      description: 'Regla del ejecutor JSON: sin bloques de código markdown',
    },
    'agent.json.rules.noCommentary': {
      value: 'No incluya comentarios ni explicaciones.',
      description: 'Regla del ejecutor JSON: sin texto adicional',
    },
    'agent.json.rules.doubleQuotes': {
      value:
        'Utilice comillas dobles para todas las claves y valores de cadena.',
      description: 'Regla del ejecutor JSON: solo comillas dobles',
    },
    'agent.json.rules.noTrailingCommas': {
      value: 'No incluya comas finales.',
      description: 'Regla del ejecutor JSON: sin comas finales',
    },
    'agent.json.defaultDescription': {
      value:
        'Ejecutor de agentes exclusivamente JSON para pipelines deterministas.',
      description:
        'Descripción predeterminada para la especificación del ejecutor JSON',
    },
    'agent.json.systemPrompt': {
      value: 'Usted es un generador preciso de JSON.',
      description: 'Prompt de sistema predeterminado para el ejecutor JSON',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Inyección de conocimiento
    // ═══════════════════════════════════════════════════════════════════════════

    'knowledge.header': {
      value: '# Conocimiento de referencia',
      description:
        'Encabezado para la sección de conocimiento inyectado en el prompt del sistema',
    },
    'knowledge.description': {
      value:
        'La siguiente información se proporciona como referencia. Utilícela para fundamentar sus respuestas.',
      description: 'Descripción debajo del encabezado de conocimiento',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Descripciones de herramientas (orientadas al LLM)
    // ═══════════════════════════════════════════════════════════════════════════

    'tool.knowledge.description': {
      value:
        'Consultar bases de conocimiento para obtener información relevante. Utilice esta herramienta cuando necesite buscar información específica que pueda no estar en su contexto.',
      description:
        'Descripción de la herramienta de consulta de conocimiento mostrada al LLM',
    },
    'tool.knowledge.availableSpaces': {
      value: 'Espacios de conocimiento disponibles:',
      description:
        'Etiqueta antes de listar los espacios de conocimiento disponibles',
    },
    'tool.knowledge.spaceDefault': {
      value: 'Espacio de conocimiento',
      description:
        'Descripción de respaldo para espacios de conocimiento sin nombre',
    },
    'tool.knowledge.param.query': {
      value:
        'La pregunta o consulta de búsqueda para encontrar información relevante',
      description: 'Descripción del parámetro para el campo de consulta',
    },
    'tool.knowledge.param.spaceKey': {
      value:
        'Espacio de conocimiento específico a consultar. Si se omite, busca en todos los espacios disponibles.',
      description: 'Descripción del parámetro para el campo spaceKey',
    },
    'tool.knowledge.param.topK': {
      value: 'Número máximo de resultados a devolver',
      description: 'Descripción del parámetro para el campo topK',
    },
    'tool.knowledge.noResults': {
      value:
        'No se encontró información relevante en las bases de conocimiento.',
      description: 'Mensaje cuando no se encuentran resultados de conocimiento',
    },
    'tool.knowledge.sourceLabel': {
      value: '[Fuente {index} - {space}] (relevancia: {score}%)',
      description: 'Etiqueta para cada resultado de búsqueda de conocimiento',
      placeholders: [
        {
          name: 'index',
          type: 'number',
          description: 'Índice de fuente basado en 1',
        },
        {
          name: 'space',
          type: 'string',
          description: 'Nombre del espacio de conocimiento',
        },
        {
          name: 'score',
          type: 'number',
          description: 'Porcentaje de relevancia',
        },
      ],
    },
    'tool.fallbackDescription': {
      value: 'Ejecutar {name}',
      description:
        'Descripción de respaldo cuando una herramienta no tiene descripción explícita',
      placeholders: [
        {
          name: 'name',
          type: 'string',
          description: 'Nombre de la herramienta',
        },
      ],
    },
    'tool.mcp.param.message': {
      value: 'El mensaje o consulta a enviar al agente',
      description: 'Servidor MCP: descripción del parámetro message',
    },
    'tool.mcp.param.sessionId': {
      value: 'ID de sesión opcional para continuar una conversación',
      description: 'Servidor MCP: descripción del parámetro sessionId',
    },
    'tool.mcp.agentDescription': {
      value: 'Interactuar con el agente {key}',
      description: 'Servidor MCP: descripción de la herramienta de agente',
      placeholders: [
        {
          name: 'key',
          type: 'string',
          description: 'Clave de la especificación del agente',
        },
      ],
    },
    'tool.mcp.executePrompt': {
      value:
        'Ejecute la herramienta {name} con los siguientes argumentos: {args}',
      description:
        'Servidor MCP: prompt enviado al ejecutar una herramienta individual',
      placeholders: [
        {
          name: 'name',
          type: 'string',
          description: 'Nombre de la herramienta',
        },
        {
          name: 'args',
          type: 'string',
          description: 'Argumentos serializados como JSON',
        },
      ],
    },
    'tool.mcp.toolDescription': {
      value: 'Ejecutar la herramienta {name}',
      description: 'Servidor MCP: descripción de herramienta individual',
      placeholders: [
        {
          name: 'name',
          type: 'string',
          description: 'Nombre de la herramienta',
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Interoperabilidad / Consumidor de especificaciones (prompts para LLM)
    // ═══════════════════════════════════════════════════════════════════════════

    'interop.prompt.agentIdentity': {
      value: '# Identidad del agente',
      description:
        'Encabezado de sección para la identidad del agente en el prompt del LLM',
    },
    'interop.prompt.youAre': {
      value: 'Usted es {key} (v{version}).',
      description: 'Declaración de identidad del agente en el prompt del LLM',
      placeholders: [
        { name: 'key', type: 'string' },
        { name: 'version', type: 'string' },
      ],
    },
    'interop.prompt.description': {
      value: '## Descripción',
      description: 'Encabezado de sección para la descripción',
    },
    'interop.prompt.instructions': {
      value: '## Instrucciones',
      description: 'Encabezado de sección para las instrucciones',
    },
    'interop.prompt.availableTools': {
      value: '## Herramientas disponibles',
      description: 'Encabezado de sección para las herramientas disponibles',
    },
    'interop.prompt.toolsIntro': {
      value: 'Usted tiene acceso a las siguientes herramientas:',
      description: 'Introducción antes de listar las herramientas',
    },
    'interop.prompt.parameters': {
      value: 'Parámetros:',
      description: 'Etiqueta antes del bloque de parámetros de la herramienta',
    },
    'interop.prompt.knowledgeContext': {
      value: '## Contexto de conocimiento',
      description: 'Encabezado de sección para el contexto de conocimiento',
    },
    'interop.prompt.additionalContext': {
      value: '## Contexto adicional',
      description: 'Encabezado de sección para el contexto adicional',
    },

    // Generación de Markdown (consumidor de especificaciones)
    'interop.md.toc': {
      value: '## Tabla de contenidos',
      description: 'Encabezado de tabla de contenidos',
    },
    'interop.md.overview': {
      value: '## Resumen general',
      description: 'Encabezado de resumen general',
    },
    'interop.md.tools': {
      value: '## Herramientas',
      description: 'Encabezado de herramientas',
    },
    'interop.md.knowledge': {
      value: '## Conocimiento',
      description: 'Encabezado de conocimiento',
    },
    'interop.md.policy': {
      value: '## Política',
      description: 'Encabezado de política',
    },
    'interop.md.metaKey': {
      value: '- **Clave**: `{key}`',
      description: 'Línea de metadatos para la clave',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'interop.md.metaVersion': {
      value: '- **Versión**: {version}',
      description: 'Línea de metadatos para la versión',
      placeholders: [{ name: 'version', type: 'string' }],
    },
    'interop.md.metaStability': {
      value: '- **Estabilidad**: {stability}',
      description: 'Línea de metadatos para la estabilidad',
      placeholders: [{ name: 'stability', type: 'string' }],
    },
    'interop.md.metaOwners': {
      value: '- **Propietarios**: {owners}',
      description: 'Línea de metadatos para los propietarios',
      placeholders: [{ name: 'owners', type: 'string' }],
    },
    'interop.md.metaTags': {
      value: '- **Etiquetas**: {tags}',
      description: 'Línea de metadatos para las etiquetas',
      placeholders: [{ name: 'tags', type: 'string' }],
    },
    'interop.md.schema': {
      value: '**Esquema:**',
      description: 'Etiqueta de esquema',
    },
    'interop.md.automationSafe': {
      value: '**Seguro para automatización**: {value}',
      description: 'Campo de seguridad para automatización',
      placeholders: [{ name: 'value', type: 'string' }],
    },
    'interop.md.required': {
      value: '(obligatorio)',
      description: 'Marcador de obligatorio',
    },
    'interop.md.optional': {
      value: '(opcional)',
      description: 'Marcador de opcional',
    },
    'interop.md.minConfidence': {
      value: '- **Confianza mínima**: {min}',
      description: 'Línea de política de confianza mínima',
      placeholders: [{ name: 'min', type: 'number' }],
    },
    'interop.md.escalationThreshold': {
      value: '- **Umbral de escalamiento**: {threshold}',
      description: 'Línea de política de umbral de escalamiento',
      placeholders: [{ name: 'threshold', type: 'number' }],
    },
    'interop.md.escalateToolFailure': {
      value: '- **Escalar ante fallo de herramienta**: Sí',
      description:
        'Línea de política de escalamiento ante fallo de herramienta',
    },
    'interop.md.escalateTimeout': {
      value: '- **Escalar ante tiempo de espera agotado**: Sí',
      description: 'Línea de política de escalamiento ante tiempo de espera',
    },
    'interop.md.yes': { value: 'Sí', description: 'Etiqueta de Sí' },
    'interop.md.no': { value: 'No', description: 'Etiqueta de No' },

    // ═══════════════════════════════════════════════════════════════════════════
    // Mensajes de error
    // ═══════════════════════════════════════════════════════════════════════════

    'error.jsonRunner.requiresModel': {
      value:
        'createAgentJsonRunner requiere un modelo o configuración de proveedor',
      description: 'Error cuando el ejecutor JSON no tiene modelo ni proveedor',
    },
    'error.missingToolHandler': {
      value: 'Falta el manejador para la herramienta: {name}',
      description:
        'Error cuando un manejador de herramienta no está registrado',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.unknownBackend': {
      value: 'Backend desconocido: {backend}',
      description: 'Error cuando se especifica un backend desconocido',
      placeholders: [{ name: 'backend', type: 'string' }],
    },
    'error.claudeSdk.notAvailable': {
      value:
        'Claude Agent SDK no disponible. Instale @anthropic-ai/claude-agent-sdk',
      description: 'Error cuando el Claude Agent SDK no está disponible',
    },
    'error.claudeSdk.notInstalled': {
      value:
        'Claude Agent SDK no instalado. Ejecute: npm install @anthropic-ai/claude-agent-sdk',
      description:
        'Error cuando no se encuentra el módulo del Claude Agent SDK',
    },
    'error.opencodeSdk.notAvailable': {
      value: 'OpenCode SDK no disponible. Instale @opencode-ai/sdk',
      description: 'Error cuando el OpenCode SDK no está disponible',
    },
    'error.opencodeSdk.notInstalled': {
      value: 'OpenCode SDK no instalado. Ejecute: npm install @opencode-ai/sdk',
      description: 'Error cuando no se encuentra el módulo del OpenCode SDK',
    },
    'error.providerNotInitialized': {
      value: 'Proveedor no inicializado',
      description:
        'Error cuando el proveedor no ha sido inicializado antes de su uso',
    },
    'error.agentKeyRequired': {
      value: 'La clave del agente es obligatoria',
      description: 'Error de validación: falta la clave del agente',
    },
    'error.agentMissingVersion': {
      value: 'Al agente {key} le falta una versión de tipo cadena',
      description: 'Error de validación: la versión no es una cadena de texto',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'error.agentRequiresInstructions': {
      value: 'El agente {key} requiere instrucciones',
      description: 'Error de validación: faltan instrucciones',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'error.agentRequiresTool': {
      value: 'El agente {key} debe exponer al menos una herramienta',
      description: 'Error de validación: no hay herramientas definidas',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'error.agentDuplicateTool': {
      value: 'El agente {key} tiene un nombre de herramienta duplicado: {name}',
      description: 'Error de validación: nombre de herramienta duplicado',
      placeholders: [
        { name: 'key', type: 'string' },
        { name: 'name', type: 'string' },
      ],
    },
    'error.agentSpecNotFound': {
      value: 'Especificación de agente no encontrada para {name}',
      description:
        'Error cuando la especificación del agente no está en el registro',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.specNotFound': {
      value: 'Especificación no encontrada: {specKey}',
      description: 'Error cuando no se encuentra una clave de especificación',
      placeholders: [{ name: 'specKey', type: 'string' }],
    },
    'error.toolNotFound': {
      value: 'Herramienta no encontrada: {name}',
      description: 'Error cuando no se encuentra una herramienta',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.noHandlerForTool': {
      value: 'No hay manejador registrado para la herramienta: {name}',
      description:
        'Error cuando no hay manejador registrado para una herramienta',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.noToolHandler': {
      value: 'Sin manejador para la herramienta: {name}',
      description: 'Error breve cuando no existe manejador',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.unknownExportFormat': {
      value: 'Formato de exportación desconocido: {format}',
      description: 'Error para formato de exportación no soportado',
      placeholders: [{ name: 'format', type: 'string' }],
    },
    'error.handlerNotFoundForTool': {
      value: 'Manejador no encontrado para la herramienta {name}',
      description:
        'Error en el puente de herramientas cuando falta el manejador',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.toolNotFoundOrNoHandler': {
      value:
        "Error: La herramienta '{name}' no fue encontrada o no tiene manejador",
      description:
        'Error devuelto al LLM cuando la ejecución de la herramienta falla',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.toolNoExecuteHandler': {
      value: 'La herramienta {name} no tiene manejador de ejecución',
      description:
        'Error cuando la herramienta carece de una función de ejecución',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.provider.notRegistered': {
      value: 'no registrado',
      description: 'Razón de disponibilidad del proveedor: no registrado',
    },
    'error.provider.depsNotInstalled': {
      value: 'dependencias no instaladas o no configuradas',
      description: 'Razón de disponibilidad del proveedor: faltan dependencias',
    },
    'error.provider.sdkNotConfigured': {
      value: 'SDK no instalado o clave de API no configurada',
      description: 'Razón de disponibilidad del proveedor: falta SDK o clave',
    },
    'error.provider.claudeSdkMissing': {
      value: '@anthropic-ai/claude-agent-sdk no está instalado',
      description: 'Error cuando falla require.resolve del Claude Agent SDK',
    },
    'error.provider.opencodeSdkMissing': {
      value: '@opencode-ai/sdk no está instalado',
      description: 'Error cuando falla require.resolve del OpenCode SDK',
    },
    'error.provider.sdkNotInstalled': {
      value: 'SDK no instalado',
      description: 'Error genérico del proveedor: SDK no instalado',
    },
    'error.provider.contextCreation': {
      value: 'Error al crear el contexto: {error}',
      description: 'Error durante la creación del contexto del proveedor',
      placeholders: [{ name: 'error', type: 'string' }],
    },
    'error.provider.executionFailed': {
      value: 'La ejecución falló: {error}',
      description: 'Error durante la ejecución del proveedor',
      placeholders: [{ name: 'error', type: 'string' }],
    },
    'error.provider.streamFailed': {
      value: 'El stream falló: {error}',
      description: 'Error durante el streaming del proveedor',
      placeholders: [{ name: 'error', type: 'string' }],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Cadenas del exportador (generación de Markdown)
    // ═══════════════════════════════════════════════════════════════════════════

    'export.agentConfiguration': {
      value: '# Configuración del agente',
      description: 'Encabezado Markdown',
    },
    'export.metadata': {
      value: '## Metadatos',
      description: 'Encabezado Markdown',
    },
    'export.metaName': {
      value: '- **Nombre**: {name}',
      description: 'Línea de metadatos',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'export.metaVersion': {
      value: '- **Versión**: {version}',
      description: 'Línea de metadatos',
      placeholders: [{ name: 'version', type: 'string' }],
    },
    'export.metaOwners': {
      value: '- **Propietarios**: {owners}',
      description: 'Línea de metadatos',
      placeholders: [{ name: 'owners', type: 'string' }],
    },
    'export.metaModel': {
      value: '- **Modelo**: {model}',
      description: 'Línea de metadatos',
      placeholders: [{ name: 'model', type: 'string' }],
    },
    'export.instructions': {
      value: '## Instrucciones',
      description: 'Encabezado Markdown',
    },
    'export.availableTools': {
      value: '## Herramientas disponibles',
      description: 'Encabezado Markdown',
    },
    'export.tools': {
      value: '## Herramientas',
      description: 'Encabezado Markdown',
    },
    'export.knowledgeSources': {
      value: '## Fuentes de conocimiento',
      description: 'Encabezado Markdown',
    },
    'export.policy': {
      value: '## Política',
      description: 'Encabezado Markdown',
    },
    'export.additionalContext': {
      value: '## Contexto adicional',
      description: 'Encabezado Markdown',
    },
    'export.configuration': {
      value: '## Configuración',
      description: 'Encabezado Markdown',
    },
    'export.mcpServers': {
      value: '## Servidores MCP',
      description: 'Encabezado Markdown',
    },
    'export.parameters': {
      value: '**Parámetros:**',
      description: 'Etiqueta de parámetros',
    },
    'export.requiresApproval': {
      value: 'requiere aprobación',
      description: 'Indicador de herramienta',
    },
    'export.notAutomationSafe': {
      value: 'no es seguro para automatización',
      description: 'Indicador de herramienta',
    },
    'export.requiresApprovalMd': {
      value: '*(requiere aprobación)*',
      description: 'Indicador de herramienta en Markdown',
    },
    'export.notAutomationSafeMd': {
      value: '*(no es seguro para automatización)*',
      description: 'Indicador de herramienta en Markdown',
    },
    'export.required': {
      value: '(obligatorio)',
      description: 'Marcador de obligatorio',
    },
    'export.optional': {
      value: '(opcional)',
      description: 'Marcador de opcional',
    },
    'export.minConfidence': {
      value: '- Confianza mínima: {min}',
      description: 'Línea de política',
      placeholders: [{ name: 'min', type: 'number' }],
    },
    'export.escalationConfigured': {
      value: '- La política de escalamiento está configurada',
      description: 'Línea de política para el prompt del sistema',
    },
    'export.escalationPolicyConfigured': {
      value: '- Política de escalamiento configurada',
      description: 'Línea de política para la exportación en Markdown',
    },
    'export.featureFlags': {
      value: '- Indicadores de características: {flags}',
      description: 'Línea de política de indicadores de características',
      placeholders: [{ name: 'flags', type: 'string' }],
    },
    'export.generatedFrom': {
      value: '*Generado desde ContractSpec: {key}*',
      description: 'Línea de atribución en el pie',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'export.exportedAt': {
      value: '*Exportado el: {date}*',
      description: 'Marca de tiempo en el pie',
      placeholders: [{ name: 'date', type: 'string' }],
    },
    'export.agentType': {
      value: '> Tipo de agente: **{type}**',
      description: 'Llamada de tipo de agente',
      placeholders: [{ name: 'type', type: 'string' }],
    },
    'export.noDescription': {
      value: 'Sin descripción',
      description:
        'Texto de respaldo cuando la herramienta no tiene descripción',
    },

    // Validación
    'export.validation.requiresKey': {
      value: 'La especificación debe tener una meta.key',
      description: 'Error de validación',
    },
    'export.validation.requiresInstructions': {
      value: 'La especificación debe tener instrucciones',
      description: 'Error de validación',
    },
    'export.validation.requiresTool': {
      value: 'La especificación debe tener al menos una herramienta',
      description: 'Error de validación',
    },
    'export.validation.toolRequiresName': {
      value: 'Todas las herramientas deben tener un nombre',
      description: 'Error de validación',
    },
    'export.validation.toolRequiresDescOrName': {
      value: 'La herramienta debe tener una descripción o un nombre',
      description: 'Error de validación',
    },
    'export.validation.toolInvalidName': {
      value:
        "El nombre de herramienta '{name}' debe ser un identificador válido (letras, números, guiones bajos)",
      description: 'Error de validación para nombre de herramienta inválido',
      placeholders: [{ name: 'name', type: 'string' }],
    },

    // Descripciones de tipos de agente
    'export.agentType.build': {
      value:
        'Agente principal con acceso completo a herramientas para la generación y modificación de código.',
      description: 'Descripción del tipo de agente de construcción',
    },
    'export.agentType.plan': {
      value:
        'Agente restringido para análisis y planificación. Las ediciones de archivos y los comandos bash requieren aprobación.',
      description: 'Descripción del tipo de agente de planificación',
    },
    'export.agentType.general': {
      value:
        'Subagente de propósito general para preguntas complejas y tareas de múltiples pasos.',
      description: 'Descripción del tipo de agente general',
    },
    'export.agentType.explore': {
      value:
        'Subagente rápido optimizado para exploración de código y búsqueda de patrones.',
      description: 'Descripción del tipo de agente de exploración',
    },

    // Etiquetas Markdown del puente de agentes
    'export.bridge.requiresApproval': {
      value: '(requiere aprobación)',
      description: 'Etiqueta de permiso de herramienta',
    },
    'export.bridge.askMode': {
      value: '(modo consulta)',
      description: 'Etiqueta de permiso de herramienta',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Flujo de aprobación
    // ═══════════════════════════════════════════════════════════════════════════

    'approval.toolRequiresApproval': {
      value: 'La herramienta "{name}" requiere aprobación',
      description:
        'Razón predeterminada para solicitudes de aprobación de herramientas',
      placeholders: [{ name: 'name', type: 'string' }],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Mensajes de consola / registro
    // ═══════════════════════════════════════════════════════════════════════════

    'log.unifiedAgent.fallback': {
      value: '[UnifiedAgent] {backend} falló, recurriendo a {fallback}',
      description:
        'Advertencia cuando un backend falla y se utiliza el respaldo',
      placeholders: [
        { name: 'backend', type: 'string' },
        { name: 'fallback', type: 'string' },
      ],
    },
    'log.knowledge.spaceNotAvailable': {
      value: 'El espacio de conocimiento requerido "{key}" no está disponible',
      description:
        'Advertencia cuando un espacio de conocimiento requerido no existe',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'log.knowledge.loadFailed': {
      value: 'Error al cargar el conocimiento requerido "{key}":',
      description: 'Advertencia cuando falla la carga de conocimiento',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'log.knowledge.queryFailed': {
      value: 'Error al consultar el espacio de conocimiento {space}:',
      description: 'Advertencia cuando falla la consulta de conocimiento',
      placeholders: [{ name: 'space', type: 'string' }],
    },
    'log.mcpServer.started': {
      value:
        '[MCPToolServer] Iniciado {name}@{version} con {count} herramientas',
      description:
        'Mensaje de registro cuando el servidor de herramientas MCP se inicia',
      placeholders: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'count', type: 'number' },
      ],
    },
    'log.mcpServer.stopped': {
      value: '[MCPToolServer] Detenido {name}',
      description:
        'Mensaje de registro cuando el servidor de herramientas MCP se detiene',
      placeholders: [{ name: 'name', type: 'string' }],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Errores de telemetría
    // ═══════════════════════════════════════════════════════════════════════════

    'error.telemetry.posthogAiRequired': {
      value:
        'PostHog LLM Analytics requiere que @posthog/ai esté instalado. Ejecute: npm install @posthog/ai posthog-node',
      description: 'Error when PostHog AI dependency is missing',
    },
    'error.telemetry.posthogClientOrKeyRequired': {
      value:
        'PostHog LLM Analytics requiere una instancia de cliente o una apiKey.',
      description: 'Error when PostHog client or API key is not configured',
    },
    'error.telemetry.posthogNodeRequired': {
      value:
        'PostHog LLM Analytics requiere que posthog-node esté instalado. Ejecute: npm install posthog-node',
      description: 'Error when posthog-node dependency is missing',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Disponibilidad del proveedor
    // ═══════════════════════════════════════════════════════════════════════════

    'error.provider.notAvailable': {
      value: "El proveedor '{provider}' no está disponible{reason}",
      description: 'Error when a provider is unavailable',
      placeholders: [
        { name: 'provider', type: 'string' },
        { name: 'reason', type: 'string' },
      ],
    },
  },
});
