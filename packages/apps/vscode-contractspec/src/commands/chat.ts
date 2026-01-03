/**
 * ContractSpec AI Chat for VS Code
 *
 * Provides an interactive chat panel for vibe coding assistance.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import {
  loadWorkspaceConfig,
  type Config,
  getAIProvider,
} from '@contractspec/bundle.workspace';
import {
  ChatService,
  InMemoryConversationStore,
} from '@contractspec/module.ai-chat/core';
import { getWorkspaceAdapters } from '../workspace/adapters';
import type {
  Provider,
  ProviderName,
  ProviderMode,
  ModelInfo,
} from '@contractspec/lib.ai-providers';
import type { LanguageModel } from 'ai';

class WrappedProvider implements Provider {
  constructor(
    private _model: LanguageModel,
    public name: ProviderName
  ) {}

  get model(): string {
    return (this._model as unknown as { modelId: string }).modelId || 'unknown';
  }
  readonly mode: ProviderMode = 'managed';

  getModel(): LanguageModel {
    return this._model;
  }
  async listModels(): Promise<ModelInfo[]> {
    return [];
  }
  async validate(): Promise<{ valid: boolean; error?: string }> {
    return { valid: true };
  }
}

/**
 * Chat panel instance (singleton per workspace)
 */
let chatPanel: vscode.WebviewPanel | undefined;

/**
 * Chat service instance (preserved across panel reloads if desired, but here attached to panel lifecycle)
 */
let chatService: ChatService | undefined;
let currentConversationId: string | undefined;

/**
 * Open the chat panel
 */
export async function openChatPanel(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel
): Promise<void> {
  // If panel already exists, reveal it
  if (chatPanel) {
    chatPanel.reveal(vscode.ViewColumn.Beside);
    return;
  }

  const adapters = getWorkspaceAdapters();
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

  // Load config to check for AI provider
  let config: Config;
  try {
    config = await loadWorkspaceConfig(adapters.fs, workspaceRoot);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to load workspace config: ${error}`);
    return;
  }

  // Create the panel
  chatPanel = vscode.window.createWebviewPanel(
    'contractspecChat',
    'ContractSpec AI Chat',
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [context.extensionUri],
    }
  );

  const currentFile = vscode.window.activeTextEditor?.document.uri.fsPath;

  // Build context info
  let contextInfo = '';
  if (workspaceRoot) {
    contextInfo += `Workspace: ${path.basename(workspaceRoot)}\n`;
  }
  if (currentFile) {
    contextInfo += `Current file: ${path.relative(workspaceRoot ?? '', currentFile)}\n`;
  }

  // Set the HTML content
  chatPanel.webview.html = getChatPanelHtml(
    chatPanel.webview,
    context.extensionUri,
    config,
    contextInfo
  );

  // Initialize Chat Service
  const provider = getAIProvider(config);

  // Build system prompt with workspace context
  const systemPrompt = buildSystemPrompt(workspaceRoot);

  // Create provider wrapper
  // We assume 'custom' maps to openai-compatible, others map directly if possible
  const providerName =
    config.aiProvider === 'custom'
      ? 'openai'
      : (config.aiProvider as ProviderName);
  const wrappedProvider = new WrappedProvider(provider, providerName);

  chatService = new ChatService({
    provider: wrappedProvider,
    store: new InMemoryConversationStore(),
    systemPrompt,
    onUsage: (usage) => {
      outputChannel.appendLine(
        `[AI Chat] Tokens: ${usage.inputTokens} in / ${usage.outputTokens} out`
      );
    },
  });

  // Reset conversation ID when panel is opened (fresh session)
  // Or could be persistent if we moved store out of openChatPanel
  currentConversationId = undefined;

  // Handle messages from the webview
  chatPanel.webview.onDidReceiveMessage(
    async (message) => {
      switch (message.type) {
        case 'send': {
          if (chatPanel && chatService) {
            await handleChatMessage(
              chatPanel,
              chatService,
              message.content,
              outputChannel
            );
          }
          break;
        }
        case 'insert': {
          await insertCodeAtCursor(message.code);
          break;
        }
        case 'copy': {
          await vscode.env.clipboard.writeText(message.text);
          vscode.window.showInformationMessage('Copied to clipboard');
          break;
        }
        case 'clear': {
          currentConversationId = undefined;
          // Optionally clear store or start fresh
          break;
        }
      }
    },
    undefined,
    context.subscriptions
  );

  // Clean up when panel is closed
  chatPanel.onDidDispose(() => {
    chatPanel = undefined;
    chatService = undefined;
    currentConversationId = undefined;
  });
}

/**
 * Handle a chat message from the webview
 */
async function handleChatMessage(
  panel: vscode.WebviewPanel,
  service: ChatService,
  content: string,
  outputChannel: vscode.OutputChannel
): Promise<void> {
  try {
    // Stream response
    const result = await service.stream({
      conversationId: currentConversationId,
      content,
    });

    currentConversationId = result.conversationId;

    let fullResponse = '';

    for await (const chunk of result.stream) {
      if (chunk.type === 'text') {
        // Some providers/wrappers might offer 'text' property directly
        fullResponse += chunk.content || ''; // Adjust based on strict ChatStreamChunk type
        panel.webview.postMessage({
          type: 'chunk',
          chunk: chunk.content || '',
          fullText: fullResponse,
        });
      }
      // Handle tool calls or other events if necessary
    }

    // Final message to confirm completion
    panel.webview.postMessage({
      type: 'response',
      content: fullResponse,
    });
  } catch (error) {
    outputChannel.appendLine(
      `Chat error: ${error instanceof Error ? error.message : String(error)}`
    );
    panel.webview.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Insert code at cursor position
 */
async function insertCodeAtCursor(code: string): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor to insert code');
    return;
  }

  await editor.edit((editBuilder) => {
    editBuilder.insert(editor.selection.active, code);
  });
}

/**
 * Build system prompt with workspace context
 */
function buildSystemPrompt(workspaceRoot: string | undefined): string {
  let prompt = `You are ContractSpec AI, an expert coding assistant specialized in ContractSpec development.

Your capabilities:
- Help users create, modify, and understand ContractSpec specifications
- Generate code that follows ContractSpec patterns and best practices
- Explain concepts from the ContractSpec documentation
- Suggest improvements and identify issues in specs and implementations
- Ask clarifying questions when context is missing

Guidelines:
- Be concise but thorough
- Provide code examples when helpful
- Use markdown for formatting
- When showing code, include syntax highlighting with language tags`;

  if (workspaceRoot) {
    prompt += `\n\nWorkspace: ${path.basename(workspaceRoot)}`;

    // Try to read package.json for project info
    const packageJsonPath = path.join(workspaceRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, 'utf-8')
        );
        prompt += `\nProject: ${packageJson.name ?? 'unknown'}`;
        if (packageJson.description) {
          prompt += `\nDescription: ${packageJson.description}`;
        }
      } catch {
        // Ignore parse errors
      }
    }
  }

  return prompt;
}

/**
 * Get the HTML for the chat panel
 */
function getChatPanelHtml(
  _webview: vscode.Webview,
  _extensionUri: vscode.Uri,
  config: Config,
  contextInfo: string
): string {
  const providerName = config.aiProvider || 'configured';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ContractSpec AI Chat</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--vscode-panel-border);
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--vscode-sideBar-background);
    }

    .header h1 {
      font-size: 14px;
      font-weight: 600;
      flex: 1;
    }

    .provider-badge {
      padding: 2px 8px;
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      border-radius: 10px;
      font-size: 11px;
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .message {
      padding: 12px 16px;
      border-radius: 8px;
      max-width: 90%;
    }

    .message.user {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      align-self: flex-end;
    }

    .message.assistant {
      background: var(--vscode-editor-inactiveSelectionBackground);
      align-self: flex-start;
    }

    .message.error {
      background: var(--vscode-inputValidation-errorBackground);
      border: 1px solid var(--vscode-inputValidation-errorBorder);
    }

    .message pre {
      background: var(--vscode-textCodeBlock-background);
      padding: 12px;
      border-radius: 4px;
      overflow-x: auto;
      margin: 8px 0;
      font-family: var(--vscode-editor-font-family);
      font-size: 13px;
    }

    .message code {
      font-family: var(--vscode-editor-font-family);
      background: var(--vscode-textCodeBlock-background);
      padding: 2px 4px;
      border-radius: 3px;
    }

    .message pre code {
      background: none;
      padding: 0;
    }

    .code-actions {
      margin-top: 8px;
      display: flex;
      gap: 8px;
    }

    .code-actions button {
      padding: 4px 8px;
      font-size: 11px;
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .code-actions button:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }

    .input-area {
      padding: 12px 16px;
      border-top: 1px solid var(--vscode-panel-border);
      background: var(--vscode-sideBar-background);
    }

    .input-container {
      display: flex;
      gap: 8px;
    }

    .input-container textarea {
      flex: 1;
      padding: 10px 12px;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      border-radius: 6px;
      resize: none;
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      min-height: 44px;
      max-height: 150px;
    }

    .input-container textarea:focus {
      outline: none;
      border-color: var(--vscode-focusBorder);
    }

    .send-button {
      padding: 0 16px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    .send-button:hover {
      background: var(--vscode-button-hoverBackground);
    }

    .send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .context-info {
      padding: 8px 16px;
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      background: var(--vscode-sideBar-background);
      border-bottom: 1px solid var(--vscode-panel-border);
    }

    .loading {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
    }

    .loading span {
      width: 8px;
      height: 8px;
      background: var(--vscode-progressBar-background);
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out;
    }

    .loading span:nth-child(1) { animation-delay: -0.32s; }
    .loading span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🤖 ContractSpec AI</h1>
    <span class="provider-badge">${providerName}</span>
  </div>

  ${contextInfo ? `<div class="context-info">${contextInfo.replace(/\n/g, ' • ')}</div>` : ''}

  <div class="messages" id="messages">
    <div class="message assistant">
      <p>👋 Hi! I'm ContractSpec AI, your vibe coding assistant.</p>
      <p style="margin-top: 8px;">I can help you create specs, generate code, explain concepts, and more. What would you like to work on?</p>
    </div>
  </div>

  <div class="input-area">
    <div class="input-container">
      <textarea
        id="input"
        placeholder="Ask me anything about ContractSpec..."
        rows="1"
      ></textarea>
      <button class="send-button" id="send">Send</button>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    const messagesEl = document.getElementById('messages');
    const inputEl = document.getElementById('input');
    const sendBtn = document.getElementById('send');
    let currentAssistantMessage = null;

    // Auto-resize textarea
    inputEl.addEventListener('input', () => {
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.min(inputEl.scrollHeight, 150) + 'px';
    });

    // Send on Enter (Shift+Enter for newline)
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    sendBtn.addEventListener('click', sendMessage);

    function sendMessage() {
      const content = inputEl.value.trim();
      if (!content) return;

      // Add user message
      addMessage('user', content);
      inputEl.value = '';
      inputEl.style.height = 'auto';

      // Show loading
      const loadingEl = document.createElement('div');
      loadingEl.className = 'loading';
      loadingEl.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(loadingEl);
      messagesEl.scrollTop = messagesEl.scrollHeight;

      sendBtn.disabled = true;

      // Send to extension
      vscode.postMessage({
        type: 'send',
        content,
      });
    }

    function addMessage(role, content) {
      const div = document.createElement('div');
      div.className = 'message ' + role;
      div.innerHTML = formatContent(content, role === 'assistant');
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function formatContent(content, isAssistant) {
      // Convert markdown code blocks
      let html = content
        .replace(/\`\`\`(\\w+)?\\n([\\s\\S]*?)\`\`\`/g, (_, lang, code) => {
          const actions = isAssistant ? \`
            <div class="code-actions">
              <button onclick="copyCode(this)">Copy</button>
              <button onclick="insertCode(this)">Insert at Cursor</button>
            </div>
          \` : '';
          return \`<pre><code class="language-\${lang || 'text'}">\${escapeHtml(code.trim())}</code></pre>\${actions}\`;
        })
        .replace(/\`([^\`]+)\`/g, '<code>$1</code>')
        .replace(/\\n/g, '<br>');

      return html;
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    window.copyCode = function(btn) {
      const code = btn.parentElement.previousElementSibling.textContent;
      vscode.postMessage({ type: 'copy', text: code });
    };

    window.insertCode = function(btn) {
      const code = btn.parentElement.previousElementSibling.textContent;
      vscode.postMessage({ type: 'insert', code });
    };

    // Handle messages from extension
    window.addEventListener('message', (e) => {
      const message = e.data;

      // Remove loading indicator on first chunk or response
      const loading = messagesEl.querySelector('.loading');
      if (loading) loading.remove();

      sendBtn.disabled = false;

      if (message.type === 'response') {
        // Final complete message (optional if using chunks)
         if (currentAssistantMessage) {
            currentAssistantMessage.innerHTML = formatContent(message.content, true);
         } else {
            addMessage('assistant', message.content);
         }
         currentAssistantMessage = null; // Reset for next turn
      } else if (message.type === 'chunk') {
        if (!currentAssistantMessage) {
            // Create container for streaming response
             const div = document.createElement('div');
             div.className = 'message assistant';
             messagesEl.appendChild(div);
             currentAssistantMessage = div;
        }
        // Update content. Note: fullText is the accumulated text so far.
        currentAssistantMessage.innerHTML = formatContent(message.fullText, true);
        messagesEl.scrollTop = messagesEl.scrollHeight;
      } else if (message.type === 'error') {
        addMessage('error', '❌ Error: ' + message.error);
        currentAssistantMessage = null;
      }
    });

    // Focus input
    inputEl.focus();
  </script>
</body>
</html>`;
}

/**
 * Register chat commands
 */
export function registerChatCommands(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel,
  telemetry?: {
    sendTelemetryEvent: (name: string, props: Record<string, string>) => void;
  }
): void {
  // Open chat panel
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.chat', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'chat',
      });
      await openChatPanel(context, outputChannel);
    })
  );
}
