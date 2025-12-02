import {
  getTemplate,
  type TemplateId,
} from '../../../../../templates/registry';

/**
 * Generate TypeScript spec code from a template's definition.
 * Converts FeatureModuleSpec contracts to TypeScript spec code.
 */
export function generateSpecFromTemplate(templateId: TemplateId): string {
  const template = getTemplate(templateId);

  if (!template) {
    return generateDefaultSpec(templateId);
  }

  // Generate spec based on template type
  switch (templateId) {
    case 'crm-pipeline':
      return generateCrmPipelineSpec(template.schema.contracts);
    case 'saas-boilerplate':
      return generateSaasBoilerplateSpec(template.schema.contracts);
    case 'agent-console':
      return generateAgentConsoleSpec(template.schema.contracts);
    case 'todos-app':
      return generateTodosSpec(template.schema.contracts);
    case 'messaging-app':
      return generateMessagingSpec(template.schema.contracts);
    case 'recipe-app-i18n':
      return generateRecipeSpec(template.schema.contracts);
    default:
      return generateDefaultSpec(templateId);
  }
}

/**
 * CRM Pipeline spec
 */
function generateCrmPipelineSpec(contracts: string[]): string {
  return `// CRM Pipeline Specs
// Contracts: ${contracts.join(', ')}

contractSpec("crm.deal.updateStage.v1", {
  goal: "Move a deal to a different pipeline stage",
  transport: { gql: { mutation: "updateDealStage" } },
  io: {
    input: { 
      dealId: "string",
      stageId: "string",
      notes: "string?"
    },
    output: { 
      deal: {
        id: "string",
        stage: "string",
        probability: "number",
        value: "number"
      }
    }
  },
  events: ["deal.stage.changed"],
  policy: { auth: "user", rbac: "org:sales" }
});

contractSpec("crm.deal.create.v1", {
  goal: "Create a new deal in the pipeline",
  transport: { gql: { mutation: "createDeal" } },
  io: {
    input: { 
      title: "string",
      value: "number",
      contactId: "string",
      stageId: "string",
      ownerId: "string?"
    },
    output: { 
      deal: {
        id: "string",
        title: "string",
        value: "number",
        stage: "string",
        createdAt: "ISO8601"
      }
    }
  },
  events: ["deal.created"]
});

contractSpec("crm.contact.list.v1", {
  goal: "List contacts with filtering and pagination",
  transport: { gql: { query: "listContacts" } },
  io: {
    input: { 
      filter: {
        search: "string?",
        companyId: "string?",
        tags: "string[]?"
      },
      pagination: {
        page: "number",
        limit: "number"
      }
    },
    output: { 
      contacts: "array<Contact>",
      total: "number",
      hasMore: "boolean"
    }
  }
});`;
}

/**
 * SaaS Boilerplate spec
 */
function generateSaasBoilerplateSpec(contracts: string[]): string {
  return `// SaaS Boilerplate Specs
// Contracts: ${contracts.join(', ')}

contractSpec("saas.project.create.v1", {
  goal: "Create a new project in an organization",
  transport: { gql: { mutation: "createProject" } },
  io: {
    input: { 
      orgId: "string",
      name: "string",
      description: "string?"
    },
    output: { 
      project: {
        id: "string",
        name: "string",
        description: "string?",
        createdAt: "ISO8601"
      }
    }
  },
  policy: { auth: "user", rbac: "org:member" }
});

contractSpec("saas.billing.recordUsage.v1", {
  goal: "Record usage for billing purposes",
  transport: { gql: { mutation: "recordUsage" } },
  io: {
    input: { 
      orgId: "string",
      metric: "enum<'api_calls'|'storage_gb'|'seats'>",
      quantity: "number",
      timestamp: "ISO8601?"
    },
    output: { 
      usage: {
        id: "string",
        metric: "string",
        quantity: "number",
        recordedAt: "ISO8601"
      }
    }
  },
  events: ["billing.usage.recorded"]
});

contractSpec("saas.settings.update.v1", {
  goal: "Update organization or user settings",
  transport: { gql: { mutation: "updateSettings" } },
  io: {
    input: { 
      scope: "enum<'org'|'user'>",
      targetId: "string",
      settings: "Record<string, unknown>"
    },
    output: { 
      settings: {
        scope: "string",
        values: "Record<string, unknown>",
        updatedAt: "ISO8601"
      }
    }
  },
  events: ["settings.updated"]
});`;
}

/**
 * Agent Console spec
 */
function generateAgentConsoleSpec(contracts: string[]): string {
  return `// Agent Console Specs
// Contracts: ${contracts.join(', ')}

contractSpec("agent.run.execute.v1", {
  goal: "Execute an agent run with specified tools",
  transport: { gql: { mutation: "executeAgentRun" } },
  io: {
    input: { 
      agentId: "string",
      input: "string",
      tools: "string[]?",
      maxSteps: "number?"
    },
    output: { 
      runId: "string",
      status: "enum<'running'|'completed'|'failed'>",
      steps: "number"
    }
  },
  events: ["run.started", "run.completed", "run.failed"]
});

contractSpec("agent.tool.create.v1", {
  goal: "Register a new tool in the tool registry",
  transport: { gql: { mutation: "createTool" } },
  io: {
    input: { 
      name: "string",
      description: "string",
      category: "enum<'code'|'data'|'api'|'file'|'custom'>",
      schema: "JSONSchema",
      handler: "string"
    },
    output: { 
      tool: {
        id: "string",
        name: "string",
        category: "string",
        createdAt: "ISO8601"
      }
    }
  },
  events: ["tool.created"]
});

contractSpec("agent.agent.create.v1", {
  goal: "Create a new AI agent configuration",
  transport: { gql: { mutation: "createAgent" } },
  io: {
    input: { 
      name: "string",
      description: "string",
      model: "string",
      systemPrompt: "string?",
      tools: "string[]?"
    },
    output: { 
      agent: {
        id: "string",
        name: "string",
        model: "string",
        toolCount: "number",
        createdAt: "ISO8601"
      }
    }
  },
  events: ["agent.created"]
});`;
}

/**
 * Todos App spec
 */
function generateTodosSpec(contracts: string[]): string {
  return `// To-dos App Specs
// Contracts: ${contracts.join(', ')}

contractSpec("tasks.board.v1", {
  goal: "Assign and approve craft work",
  transport: { gql: { field: "tasksBoard" } },
  io: {
    input: { 
      tenantId: "string", 
      assignee: "string?",
      status: "enum<'pending'|'in_progress'|'completed'>?"
    },
    output: { 
      tasks: "array<Task>",
      summary: {
        total: "number",
        completed: "number",
        overdue: "number"
      }
    }
  }
});

contractSpec("tasks.create.v1", {
  goal: "Create a new task",
  transport: { gql: { mutation: "createTask" } },
  io: {
    input: { 
      title: "string",
      description: "string?",
      assignee: "string?",
      priority: "enum<'low'|'medium'|'high'>",
      dueDate: "ISO8601?"
    },
    output: { 
      task: {
        id: "string",
        title: "string",
        status: "string",
        createdAt: "ISO8601"
      }
    }
  },
  events: ["task.created"]
});

contractSpec("tasks.complete.v1", {
  goal: "Mark a task as completed",
  transport: { gql: { mutation: "completeTask" } },
  io: {
    input: { taskId: "string" },
    output: { 
      task: {
        id: "string",
        status: "string",
        completedAt: "ISO8601"
      }
    }
  },
  events: ["task.completed"]
});`;
}

/**
 * Messaging App spec
 */
function generateMessagingSpec(contracts: string[]): string {
  return `// Messaging App Specs
// Contracts: ${contracts.join(', ')}

contractSpec("messaging.send.v1", {
  goal: "Deliver intent-rich updates",
  io: {
    input: { 
      conversationId: "string", 
      body: "richtext",
      attachments: "array<Attachment>?"
    },
    output: { 
      messageId: "string", 
      deliveredAt: "ISO8601"
    }
  },
  events: ["message.sent", "message.delivered"]
});

contractSpec("messaging.conversation.create.v1", {
  goal: "Start a new conversation",
  transport: { gql: { mutation: "createConversation" } },
  io: {
    input: { 
      participants: "string[]",
      title: "string?",
      type: "enum<'direct'|'group'>"
    },
    output: { 
      conversation: {
        id: "string",
        title: "string?",
        participantCount: "number",
        createdAt: "ISO8601"
      }
    }
  },
  events: ["conversation.created"]
});

contractSpec("messaging.read.v1", {
  goal: "Mark messages as read",
  transport: { gql: { mutation: "markRead" } },
  io: {
    input: { 
      conversationId: "string",
      messageIds: "string[]"
    },
    output: { 
      readCount: "number",
      readAt: "ISO8601"
    }
  },
  events: ["message.read"]
});`;
}

/**
 * Recipe App spec
 */
function generateRecipeSpec(contracts: string[]): string {
  return `// Recipe App (i18n) Specs
// Contracts: ${contracts.join(', ')}

contractSpec("recipes.lookup.v1", {
  goal: "Serve bilingual rituals",
  io: {
    input: { 
      locale: "enum<'EN'|'FR'>", 
      slug: "string" 
    },
    output: { 
      title: "string", 
      content: "markdown",
      ingredients: "array<Ingredient>",
      instructions: "array<Instruction>"
    }
  }
});

contractSpec("recipes.list.v1", {
  goal: "Browse recipes with filtering",
  transport: { gql: { query: "listRecipes" } },
  io: {
    input: { 
      locale: "enum<'EN'|'FR'>",
      category: "string?",
      search: "string?",
      favorites: "boolean?"
    },
    output: { 
      recipes: "array<RecipeSummary>",
      categories: "array<Category>",
      total: "number"
    }
  }
});

contractSpec("recipes.favorite.toggle.v1", {
  goal: "Toggle recipe favorite status",
  transport: { gql: { mutation: "toggleFavorite" } },
  io: {
    input: { recipeId: "string" },
    output: { 
      isFavorite: "boolean",
      totalFavorites: "number"
    }
  },
  events: ["recipe.favorited", "recipe.unfavorited"]
});`;
}

/**
 * Default spec for unknown templates
 */
function generateDefaultSpec(templateId: TemplateId): string {
  return `// ${templateId} Specs

contractSpec("${templateId}.main.v1", {
  goal: "Main operation for ${templateId}",
  transport: { gql: { query: "main" } },
  io: {
    input: { 
      id: "string"
    },
    output: { 
      result: "unknown"
    }
  }
});`;
}
