/**
 * Export formatters for chat conversations
 * Pure functions to convert ChatMessage[] to Markdown, TXT, or JSON.
 */
import type {
  ChatMessage,
  ChatConversation,
  ChatSource,
  ChatToolCall,
} from './message-types';

/** Format a date for display in exports */
function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Format a date for JSON (ISO string) */
function toIsoString(date: Date): string {
  return date.toISOString();
}

/** Serialize a message for JSON export (dates as ISO strings) */
function messageToJsonSerializable(
  msg: ChatMessage
): Record<string, unknown> {
  return {
    id: msg.id,
    conversationId: msg.conversationId,
    role: msg.role,
    content: msg.content,
    status: msg.status,
    createdAt: toIsoString(msg.createdAt),
    updatedAt: toIsoString(msg.updatedAt),
    ...(msg.attachments && { attachments: msg.attachments }),
    ...(msg.codeBlocks && { codeBlocks: msg.codeBlocks }),
    ...(msg.toolCalls && { toolCalls: msg.toolCalls }),
    ...(msg.sources && { sources: msg.sources }),
    ...(msg.reasoning && { reasoning: msg.reasoning }),
    ...(msg.usage && { usage: msg.usage }),
    ...(msg.error && { error: msg.error }),
    ...(msg.metadata && { metadata: msg.metadata }),
  };
}

/** Format sources for Markdown */
function formatSourcesMarkdown(sources: ChatSource[]): string {
  if (sources.length === 0) return '';
  return (
    '\n\n**Sources:**\n' +
    sources
      .map((s) => `- [${s.title}](${s.url ?? '#'})`)
      .join('\n')
  );
}

/** Format sources for TXT */
function formatSourcesTxt(sources: ChatSource[]): string {
  if (sources.length === 0) return '';
  return (
    '\n\nSources:\n' +
    sources
      .map((s) => `- ${s.title}${s.url ? ` - ${s.url}` : ''}`)
      .join('\n')
  );
}

/** Format tool calls for Markdown */
function formatToolCallsMarkdown(toolCalls: ChatToolCall[]): string {
  if (toolCalls.length === 0) return '';
  return (
    '\n\n**Tool calls:**\n' +
    toolCalls
      .map(
        (tc) =>
          `**${tc.name}** (${tc.status})\n\`\`\`json\n${JSON.stringify(tc.args, null, 2)}\n\`\`\`` +
          (tc.result !== undefined
            ? `\nOutput:\n\`\`\`json\n${typeof tc.result === 'object' ? JSON.stringify(tc.result, null, 2) : String(tc.result)}\n\`\`\``
            : '') +
          (tc.error ? `\nError: ${tc.error}` : '')
      )
      .join('\n\n')
  );
}

/** Format tool calls for TXT */
function formatToolCallsTxt(toolCalls: ChatToolCall[]): string {
  if (toolCalls.length === 0) return '';
  return (
    '\n\nTool calls:\n' +
    toolCalls
      .map(
        (tc) =>
          `- ${tc.name} (${tc.status}): ${JSON.stringify(tc.args)}` +
          (tc.result !== undefined
            ? ` -> ${typeof tc.result === 'object' ? JSON.stringify(tc.result) : String(tc.result)}`
            : '') +
          (tc.error ? ` [Error: ${tc.error}]` : '')
      )
      .join('\n')
  );
}

/** Format usage for display */
function formatUsage(usage: { inputTokens: number; outputTokens: number }): string {
  const total = usage.inputTokens + usage.outputTokens;
  return ` (${total} tokens)`;
}

/**
 * Format messages as Markdown
 */
export function formatMessagesAsMarkdown(messages: ChatMessage[]): string {
  const parts: string[] = [];

  for (const msg of messages) {
    const roleLabel = msg.role === 'user' ? 'User' : msg.role === 'assistant' ? 'Assistant' : 'System';
    const header = `## ${roleLabel}`;
    const timestamp = `*${formatTimestamp(msg.createdAt)}*`;
    const usageSuffix = msg.usage ? formatUsage(msg.usage) : '';
    const meta = `${timestamp}${usageSuffix}\n\n`;

    let body = msg.content;
    if (msg.error) {
      body += `\n\n**Error:** ${msg.error.code} - ${msg.error.message}`;
    }
    if (msg.reasoning) {
      body += `\n\n> **Reasoning:**\n> ${msg.reasoning.replace(/\n/g, '\n> ')}`;
    }
    body += formatSourcesMarkdown(msg.sources ?? []);
    body += formatToolCallsMarkdown(msg.toolCalls ?? []);

    parts.push(`${header}\n\n${meta}${body}`);
  }

  return parts.join('\n\n---\n\n');
}

/**
 * Format messages as plain text
 */
export function formatMessagesAsTxt(messages: ChatMessage[]): string {
  const parts: string[] = [];

  for (const msg of messages) {
    const roleLabel = msg.role === 'user' ? 'User' : msg.role === 'assistant' ? 'Assistant' : 'System';
    const timestamp = `(${formatTimestamp(msg.createdAt)})`;
    const usageSuffix = msg.usage ? formatUsage(msg.usage) : '';
    const header = `[${roleLabel}] ${timestamp}${usageSuffix}\n\n`;

    let body = msg.content;
    if (msg.error) {
      body += `\n\nError: ${msg.error.code} - ${msg.error.message}`;
    }
    if (msg.reasoning) {
      body += `\n\nReasoning: ${msg.reasoning}`;
    }
    body += formatSourcesTxt(msg.sources ?? []);
    body += formatToolCallsTxt(msg.toolCalls ?? []);

    parts.push(`${header}${body}`);
  }

  return parts.join('\n\n---\n\n');
}

/**
 * Format messages as JSON with optional conversation metadata
 */
export function formatMessagesAsJson(
  messages: ChatMessage[],
  conversation?: ChatConversation | null
): string {
  const payload: Record<string, unknown> = {
    messages: messages.map(messageToJsonSerializable),
  };
  if (conversation) {
    payload.conversation = {
      id: conversation.id,
      title: conversation.title,
      status: conversation.status,
      createdAt: toIsoString(conversation.createdAt),
      updatedAt: toIsoString(conversation.updatedAt),
      provider: conversation.provider,
      model: conversation.model,
      workspacePath: conversation.workspacePath,
      contextFiles: conversation.contextFiles,
      summary: conversation.summary,
      metadata: conversation.metadata,
    };
  }
  return JSON.stringify(payload, null, 2);
}

/**
 * Generate export filename
 */
export function getExportFilename(
  format: 'markdown' | 'txt' | 'json',
  conversation?: ChatConversation | null
): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const base = conversation?.title
    ? conversation.title.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 40)
    : 'chat-export';
  const ext = format === 'markdown' ? 'md' : format === 'txt' ? 'txt' : 'json';
  return `${base}-${timestamp}.${ext}`;
}

/**
 * MIME types for export formats
 */
const MIME_TYPES: Record<'markdown' | 'txt' | 'json', string> = {
  markdown: 'text/markdown',
  txt: 'text/plain',
  json: 'application/json',
};

/**
 * Download content as a file
 */
export function downloadAsFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export messages to a file (convenience helper)
 */
export function exportToFile(
  messages: ChatMessage[],
  format: 'markdown' | 'txt' | 'json',
  conversation?: ChatConversation | null
): void {
  let content: string;
  if (format === 'markdown') {
    content = formatMessagesAsMarkdown(messages);
  } else if (format === 'txt') {
    content = formatMessagesAsTxt(messages);
  } else {
    content = formatMessagesAsJson(messages, conversation);
  }
  const filename = getExportFilename(format, conversation);
  const mimeType = MIME_TYPES[format];
  downloadAsFile(content, filename, mimeType);
}
