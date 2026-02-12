/**
 * French (fr) translation catalog for @contractspec/lib.ai-agent.
 *
 * Translated from the English (en) reference locale.
 *
 * @module i18n/catalogs/fr
 */

import { defineTranslation } from '@contractspec/lib.contracts/translations';

export const frMessages = defineTranslation({
  meta: {
    key: 'ai-agent.messages',
    version: '1.0.0',
    domain: 'ai-agent',
    description:
      'Toutes les chaînes destinées aux utilisateurs, aux LLM et aux développeurs pour le package ai-agent',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'fr',
  fallback: 'en',
  messages: {
    // ═══════════════════════════════════════════════════════════════════════════
    // Instructions système et prompts LLM
    // ═══════════════════════════════════════════════════════════════════════════

    'agent.json.rules.validJsonOnly': {
      value: 'Vous DEVEZ produire uniquement du JSON valide.',
      description: 'JSON runner rule: output must be valid JSON',
    },
    'agent.json.rules.noMarkdownFences': {
      value: "N'encapsulez pas la sortie dans des blocs de code markdown.",
      description: 'JSON runner rule: no markdown code fences',
    },
    'agent.json.rules.noCommentary': {
      value: "N'incluez ni commentaire ni explication.",
      description: 'JSON runner rule: no extra text',
    },
    'agent.json.rules.doubleQuotes': {
      value:
        'Utilisez des guillemets doubles pour toutes les clés et valeurs de type chaîne.',
      description: 'JSON runner rule: double quotes only',
    },
    'agent.json.rules.noTrailingCommas': {
      value: "N'incluez pas de virgules finales.",
      description: 'JSON runner rule: no trailing commas',
    },
    'agent.json.defaultDescription': {
      value:
        "Exécuteur d'agent JSON uniquement pour les pipelines déterministes.",
      description: 'Default description for the JSON runner spec',
    },
    'agent.json.systemPrompt': {
      value: 'Vous êtes un générateur JSON précis.',
      description: 'Default system prompt for the JSON runner',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Injection de connaissances
    // ═══════════════════════════════════════════════════════════════════════════

    'knowledge.header': {
      value: '# Connaissances de référence',
      description: 'Header for injected knowledge section in system prompt',
    },
    'knowledge.description': {
      value:
        'Les informations suivantes sont fournies à titre de référence. Utilisez-les pour éclairer vos réponses.',
      description: 'Description below the knowledge header',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Descriptions des outils (destinées au LLM)
    // ═══════════════════════════════════════════════════════════════════════════

    'tool.knowledge.description': {
      value:
        'Interrogez les bases de connaissances pour obtenir des informations pertinentes. Utilisez cet outil lorsque vous avez besoin de rechercher des informations spécifiques qui ne sont pas dans votre contexte.',
      description: 'Description for the knowledge query tool shown to the LLM',
    },
    'tool.knowledge.availableSpaces': {
      value: 'Espaces de connaissances disponibles :',
      description: 'Label before listing available knowledge spaces',
    },
    'tool.knowledge.spaceDefault': {
      value: 'Espace de connaissances',
      description: 'Fallback description for unnamed knowledge spaces',
    },
    'tool.knowledge.param.query': {
      value:
        'La question ou la requête de recherche pour trouver des informations pertinentes',
      description: 'Parameter description for the query field',
    },
    'tool.knowledge.param.spaceKey': {
      value:
        'Espace de connaissances spécifique à interroger. Si omis, recherche dans tous les espaces disponibles.',
      description: 'Parameter description for the spaceKey field',
    },
    'tool.knowledge.param.topK': {
      value: 'Nombre maximum de résultats à retourner',
      description: 'Parameter description for the topK field',
    },
    'tool.knowledge.noResults': {
      value:
        'Aucune information pertinente trouvée dans les bases de connaissances.',
      description: 'Message when no knowledge results are found',
    },
    'tool.knowledge.sourceLabel': {
      value: '[Source {index} - {space}] (pertinence : {score} %)',
      description: 'Label for each knowledge search result',
      placeholders: [
        { name: 'index', type: 'number', description: '1-based source index' },
        { name: 'space', type: 'string', description: 'Knowledge space name' },
        { name: 'score', type: 'number', description: 'Relevance percentage' },
      ],
    },
    'tool.fallbackDescription': {
      value: 'Exécuter {name}',
      description:
        'Fallback description when a tool has no explicit description',
      placeholders: [
        { name: 'name', type: 'string', description: 'Tool name' },
      ],
    },
    'tool.mcp.param.message': {
      value: "Le message ou la requête à envoyer à l'agent",
      description: 'MCP server: message parameter description',
    },
    'tool.mcp.param.sessionId': {
      value:
        'Identifiant de session optionnel pour poursuivre une conversation',
      description: 'MCP server: sessionId parameter description',
    },
    'tool.mcp.agentDescription': {
      value: "Interagir avec l'agent {key}",
      description: 'MCP server: agent tool description',
      placeholders: [
        { name: 'key', type: 'string', description: 'Agent spec key' },
      ],
    },
    'tool.mcp.executePrompt': {
      value: "Exécutez l'outil {name} avec les arguments suivants : {args}",
      description: 'MCP server: prompt sent when executing an individual tool',
      placeholders: [
        { name: 'name', type: 'string', description: 'Tool name' },
        {
          name: 'args',
          type: 'string',
          description: 'JSON-stringified arguments',
        },
      ],
    },
    'tool.mcp.toolDescription': {
      value: "Exécuter l'outil {name}",
      description: 'MCP server: individual tool description',
      placeholders: [
        { name: 'name', type: 'string', description: 'Tool name' },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Interop / Consommateur de spec (prompts LLM)
    // ═══════════════════════════════════════════════════════════════════════════

    'interop.prompt.agentIdentity': {
      value: "# Identité de l'agent",
      description: 'Section header for agent identity in LLM prompt',
    },
    'interop.prompt.youAre': {
      value: 'Vous êtes {key} (v{version}).',
      description: 'Agent identity statement in LLM prompt',
      placeholders: [
        { name: 'key', type: 'string' },
        { name: 'version', type: 'string' },
      ],
    },
    'interop.prompt.description': {
      value: '## Description',
      description: 'Section header for description',
    },
    'interop.prompt.instructions': {
      value: '## Instructions',
      description: 'Section header for instructions',
    },
    'interop.prompt.availableTools': {
      value: '## Outils disponibles',
      description: 'Section header for available tools',
    },
    'interop.prompt.toolsIntro': {
      value: 'Vous avez accès aux outils suivants :',
      description: 'Introduction before listing tools',
    },
    'interop.prompt.parameters': {
      value: 'Paramètres :',
      description: 'Label before tool parameters block',
    },
    'interop.prompt.knowledgeContext': {
      value: '## Contexte de connaissances',
      description: 'Section header for knowledge context',
    },
    'interop.prompt.additionalContext': {
      value: '## Contexte supplémentaire',
      description: 'Section header for additional context',
    },

    // Génération Markdown (consommateur de spec)
    'interop.md.toc': {
      value: '## Table des matières',
      description: 'TOC header',
    },
    'interop.md.overview': {
      value: '## Aperçu',
      description: 'Overview header',
    },
    'interop.md.tools': { value: '## Outils', description: 'Tools header' },
    'interop.md.knowledge': {
      value: '## Connaissances',
      description: 'Knowledge header',
    },
    'interop.md.policy': {
      value: '## Politique',
      description: 'Policy header',
    },
    'interop.md.metaKey': {
      value: '- **Clé** : `{key}`',
      description: 'Metadata line for key',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'interop.md.metaVersion': {
      value: '- **Version** : {version}',
      description: 'Metadata line for version',
      placeholders: [{ name: 'version', type: 'string' }],
    },
    'interop.md.metaStability': {
      value: '- **Stabilité** : {stability}',
      description: 'Metadata line for stability',
      placeholders: [{ name: 'stability', type: 'string' }],
    },
    'interop.md.metaOwners': {
      value: '- **Propriétaires** : {owners}',
      description: 'Metadata line for owners',
      placeholders: [{ name: 'owners', type: 'string' }],
    },
    'interop.md.metaTags': {
      value: '- **Tags** : {tags}',
      description: 'Metadata line for tags',
      placeholders: [{ name: 'tags', type: 'string' }],
    },
    'interop.md.schema': {
      value: '**Schéma :**',
      description: 'Schema label',
    },
    'interop.md.automationSafe': {
      value: "**Compatible avec l'automatisation** : {value}",
      description: 'Automation safe field',
      placeholders: [{ name: 'value', type: 'string' }],
    },
    'interop.md.required': {
      value: '(obligatoire)',
      description: 'Required marker',
    },
    'interop.md.optional': {
      value: '(optionnel)',
      description: 'Optional marker',
    },
    'interop.md.minConfidence': {
      value: '- **Confiance minimale** : {min}',
      description: 'Minimum confidence policy line',
      placeholders: [{ name: 'min', type: 'number' }],
    },
    'interop.md.escalationThreshold': {
      value: "- **Seuil d'escalade** : {threshold}",
      description: 'Escalation threshold policy line',
      placeholders: [{ name: 'threshold', type: 'number' }],
    },
    'interop.md.escalateToolFailure': {
      value: "- **Escalader en cas d'échec d'outil** : Oui",
      description: 'Escalate on tool failure policy line',
    },
    'interop.md.escalateTimeout': {
      value: "- **Escalader en cas de délai d'attente dépassé** : Oui",
      description: 'Escalate on timeout policy line',
    },
    'interop.md.yes': { value: 'Oui', description: 'Yes label' },
    'interop.md.no': { value: 'Non', description: 'No label' },

    // ═══════════════════════════════════════════════════════════════════════════
    // Messages d'erreur
    // ═══════════════════════════════════════════════════════════════════════════

    'error.jsonRunner.requiresModel': {
      value:
        'createAgentJsonRunner nécessite un modèle ou une configuration de fournisseur',
      description: 'Error when JSON runner has no model or provider',
    },
    'error.missingToolHandler': {
      value: "Gestionnaire manquant pour l'outil : {name}",
      description: 'Error when a tool handler is not registered',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.unknownBackend': {
      value: 'Backend inconnu : {backend}',
      description: 'Error when an unknown backend is specified',
      placeholders: [{ name: 'backend', type: 'string' }],
    },
    'error.claudeSdk.notAvailable': {
      value:
        'Claude Agent SDK non disponible. Installez @anthropic-ai/claude-agent-sdk',
      description: 'Error when Claude Agent SDK is not available',
    },
    'error.claudeSdk.notInstalled': {
      value:
        'Claude Agent SDK non installé. Exécutez : npm install @anthropic-ai/claude-agent-sdk',
      description: 'Error when Claude Agent SDK module is not found',
    },
    'error.opencodeSdk.notAvailable': {
      value: 'OpenCode SDK non disponible. Installez @opencode-ai/sdk',
      description: 'Error when OpenCode SDK is not available',
    },
    'error.opencodeSdk.notInstalled': {
      value:
        'OpenCode SDK non installé. Exécutez : npm install @opencode-ai/sdk',
      description: 'Error when OpenCode SDK module is not found',
    },
    'error.providerNotInitialized': {
      value: 'Fournisseur non initialisé',
      description: 'Error when provider has not been initialized before use',
    },
    'error.agentKeyRequired': {
      value: "La clé de l'agent est obligatoire",
      description: 'Validation error: missing agent key',
    },
    'error.agentMissingVersion': {
      value:
        "L'agent {key} n'a pas de version sous forme de chaîne de caractères",
      description: 'Validation error: version not a string',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'error.agentRequiresInstructions': {
      value: "L'agent {key} nécessite des instructions",
      description: 'Validation error: missing instructions',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'error.agentRequiresTool': {
      value: "L'agent {key} doit exposer au moins un outil",
      description: 'Validation error: no tools defined',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'error.agentDuplicateTool': {
      value: "L'agent {key} a un nom d'outil en double : {name}",
      description: 'Validation error: duplicate tool name',
      placeholders: [
        { name: 'key', type: 'string' },
        { name: 'name', type: 'string' },
      ],
    },
    'error.agentSpecNotFound': {
      value: "Spécification d'agent introuvable pour {name}",
      description: 'Error when agent spec is not in the registry',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.specNotFound': {
      value: 'Spécification introuvable : {specKey}',
      description: 'Error when a spec key is not found',
      placeholders: [{ name: 'specKey', type: 'string' }],
    },
    'error.toolNotFound': {
      value: 'Outil introuvable : {name}',
      description: 'Error when a tool is not found',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.noHandlerForTool': {
      value: "Aucun gestionnaire enregistré pour l'outil : {name}",
      description: 'Error when no handler is registered for a tool',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.noToolHandler': {
      value: "Aucun gestionnaire pour l'outil : {name}",
      description: 'Short error when no handler exists',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.unknownExportFormat': {
      value: "Format d'export inconnu : {format}",
      description: 'Error for unsupported export format',
      placeholders: [{ name: 'format', type: 'string' }],
    },
    'error.handlerNotFoundForTool': {
      value: "Gestionnaire introuvable pour l'outil {name}",
      description: 'Error in tool bridge when handler is missing',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.toolNotFoundOrNoHandler': {
      value:
        "Erreur : L'outil « {name} » est introuvable ou n'a pas de gestionnaire",
      description: 'Error returned to LLM when tool execution fails',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.toolNoExecuteHandler': {
      value: "L'outil {name} n'a pas de gestionnaire d'exécution",
      description: 'Error when tool lacks an execute function',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.provider.notRegistered': {
      value: 'non enregistré',
      description: 'Provider availability reason: not registered',
    },
    'error.provider.depsNotInstalled': {
      value: 'dépendances non installées ou non configurées',
      description: 'Provider availability reason: deps missing',
    },
    'error.provider.sdkNotConfigured': {
      value: "SDK non installé ou clé d'API non configurée",
      description: 'Provider availability reason: SDK or key missing',
    },
    'error.provider.claudeSdkMissing': {
      value: "@anthropic-ai/claude-agent-sdk n'est pas installé",
      description: 'Error when Claude Agent SDK require.resolve fails',
    },
    'error.provider.opencodeSdkMissing': {
      value: "@opencode-ai/sdk n'est pas installé",
      description: 'Error when OpenCode SDK require.resolve fails',
    },
    'error.provider.sdkNotInstalled': {
      value: 'SDK non installé',
      description: 'Generic provider error: SDK not installed',
    },
    'error.provider.contextCreation': {
      value: 'Échec de la création du contexte : {error}',
      description: 'Error during provider context creation',
      placeholders: [{ name: 'error', type: 'string' }],
    },
    'error.provider.executionFailed': {
      value: "Échec de l'exécution : {error}",
      description: 'Error during provider execution',
      placeholders: [{ name: 'error', type: 'string' }],
    },
    'error.provider.streamFailed': {
      value: 'Échec du flux : {error}',
      description: 'Error during provider streaming',
      placeholders: [{ name: 'error', type: 'string' }],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Chaînes d'export (génération Markdown)
    // ═══════════════════════════════════════════════════════════════════════════

    'export.agentConfiguration': {
      value: "# Configuration de l'agent",
      description: 'Markdown heading',
    },
    'export.metadata': {
      value: '## Métadonnées',
      description: 'Markdown heading',
    },
    'export.metaName': {
      value: '- **Nom** : {name}',
      description: 'Metadata line',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'export.metaVersion': {
      value: '- **Version** : {version}',
      description: 'Metadata line',
      placeholders: [{ name: 'version', type: 'string' }],
    },
    'export.metaOwners': {
      value: '- **Propriétaires** : {owners}',
      description: 'Metadata line',
      placeholders: [{ name: 'owners', type: 'string' }],
    },
    'export.metaModel': {
      value: '- **Modèle** : {model}',
      description: 'Metadata line',
      placeholders: [{ name: 'model', type: 'string' }],
    },
    'export.instructions': {
      value: '## Instructions',
      description: 'Markdown heading',
    },
    'export.availableTools': {
      value: '## Outils disponibles',
      description: 'Markdown heading',
    },
    'export.tools': { value: '## Outils', description: 'Markdown heading' },
    'export.knowledgeSources': {
      value: '## Sources de connaissances',
      description: 'Markdown heading',
    },
    'export.policy': {
      value: '## Politique',
      description: 'Markdown heading',
    },
    'export.additionalContext': {
      value: '## Contexte supplémentaire',
      description: 'Markdown heading',
    },
    'export.configuration': {
      value: '## Configuration',
      description: 'Markdown heading',
    },
    'export.mcpServers': {
      value: '## Serveurs MCP',
      description: 'Markdown heading',
    },
    'export.parameters': {
      value: '**Paramètres :**',
      description: 'Parameters label',
    },
    'export.requiresApproval': {
      value: 'nécessite une approbation',
      description: 'Tool flag',
    },
    'export.notAutomationSafe': {
      value: "non compatible avec l'automatisation",
      description: 'Tool flag',
    },
    'export.requiresApprovalMd': {
      value: '*(nécessite une approbation)*',
      description: 'Markdown tool flag',
    },
    'export.notAutomationSafeMd': {
      value: "*(non compatible avec l'automatisation)*",
      description: 'Markdown tool flag',
    },
    'export.required': {
      value: '(obligatoire)',
      description: 'Required marker',
    },
    'export.optional': {
      value: '(optionnel)',
      description: 'Optional marker',
    },
    'export.minConfidence': {
      value: '- Confiance minimale : {min}',
      description: 'Policy line',
      placeholders: [{ name: 'min', type: 'number' }],
    },
    'export.escalationConfigured': {
      value: "- La politique d'escalade est configurée",
      description: 'Policy line for system prompt',
    },
    'export.escalationPolicyConfigured': {
      value: "- Politique d'escalade configurée",
      description: 'Policy line for markdown export',
    },
    'export.featureFlags': {
      value: '- Indicateurs de fonctionnalités : {flags}',
      description: 'Feature flags policy line',
      placeholders: [{ name: 'flags', type: 'string' }],
    },
    'export.generatedFrom': {
      value: '*Généré à partir de ContractSpec : {key}*',
      description: 'Footer attribution line',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'export.exportedAt': {
      value: '*Exporté le : {date}*',
      description: 'Footer timestamp',
      placeholders: [{ name: 'date', type: 'string' }],
    },
    'export.agentType': {
      value: "> Type d'agent : **{type}**",
      description: 'Agent type callout',
      placeholders: [{ name: 'type', type: 'string' }],
    },
    'export.noDescription': {
      value: 'Aucune description',
      description: 'Fallback when tool has no description',
    },

    // Validation
    'export.validation.requiresKey': {
      value: 'La spécification doit avoir une meta.key',
      description: 'Validation error',
    },
    'export.validation.requiresInstructions': {
      value: 'La spécification doit avoir des instructions',
      description: 'Validation error',
    },
    'export.validation.requiresTool': {
      value: 'La spécification doit avoir au moins un outil',
      description: 'Validation error',
    },
    'export.validation.toolRequiresName': {
      value: 'Tous les outils doivent avoir un nom',
      description: 'Validation error',
    },
    'export.validation.toolRequiresDescOrName': {
      value: "L'outil doit avoir une description ou un nom",
      description: 'Validation error',
    },
    'export.validation.toolInvalidName': {
      value:
        "Le nom d'outil « {name} » doit être un identifiant valide (lettres, chiffres, underscores)",
      description: 'Validation error for invalid tool name',
      placeholders: [{ name: 'name', type: 'string' }],
    },

    // Descriptions des types d'agents
    'export.agentType.build': {
      value:
        'Agent principal avec accès complet aux outils pour la génération et la modification de code.',
      description: 'Build agent type description',
    },
    'export.agentType.plan': {
      value:
        "Agent restreint pour l'analyse et la planification. Les modifications de fichiers et les commandes bash nécessitent une approbation.",
      description: 'Plan agent type description',
    },
    'export.agentType.general': {
      value:
        'Sous-agent généraliste pour les questions complexes et les tâches en plusieurs étapes.',
      description: 'General agent type description',
    },
    'export.agentType.explore': {
      value:
        "Sous-agent rapide optimisé pour l'exploration de la base de code et la recherche de motifs.",
      description: 'Explore agent type description',
    },

    // Libellés Markdown du pont agent
    'export.bridge.requiresApproval': {
      value: '(nécessite une approbation)',
      description: 'Tool permission label',
    },
    'export.bridge.askMode': {
      value: '(mode interrogation)',
      description: 'Tool permission label',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Flux d'approbation
    // ═══════════════════════════════════════════════════════════════════════════

    'approval.toolRequiresApproval': {
      value: "L'outil « {name} » nécessite une approbation",
      description: 'Default reason for tool approval requests',
      placeholders: [{ name: 'name', type: 'string' }],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Messages de console / journalisation
    // ═══════════════════════════════════════════════════════════════════════════

    'log.unifiedAgent.fallback': {
      value: '[UnifiedAgent] {backend} a échoué, repli sur {fallback}',
      description: 'Warning when a backend fails and fallback is used',
      placeholders: [
        { name: 'backend', type: 'string' },
        { name: 'fallback', type: 'string' },
      ],
    },
    'log.knowledge.spaceNotAvailable': {
      value: "L'espace de connaissances requis « {key} » n'est pas disponible",
      description: 'Warning when a required knowledge space is missing',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'log.knowledge.loadFailed': {
      value: 'Échec du chargement des connaissances requises « {key} » :',
      description: 'Warning when knowledge loading fails',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'log.knowledge.queryFailed': {
      value: "Échec de l'interrogation de l'espace de connaissances {space} :",
      description: 'Warning when knowledge querying fails',
      placeholders: [{ name: 'space', type: 'string' }],
    },
    'log.mcpServer.started': {
      value: '[MCPToolServer] {name}@{version} démarré avec {count} outils',
      description: 'Log message when MCP tool server starts',
      placeholders: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'count', type: 'number' },
      ],
    },
    'log.mcpServer.stopped': {
      value: '[MCPToolServer] {name} arrêté',
      description: 'Log message when MCP tool server stops',
      placeholders: [{ name: 'name', type: 'string' }],
    },
  },
});
