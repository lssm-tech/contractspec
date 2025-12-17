/**
 * ContractSpec AI Chat for VS Code
 *
 * Provides an interactive chat panel for vibe coding assistance.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Chat panel instance (singleton per workspace)
 */
let chatPanel: vscode.WebviewPanel | undefined;

/**
 * Provider configuration
 */
interface ProviderConfig {
  name: string;
  apiKeyEnvVar: string;
  models: string[];
  defaultModel: string;
}

const PROVIDERS: Record<string, ProviderConfig> = {
  openai: {
    name: 'OpenAI',
    apiKeyEnvVar: 'OPENAI_API_KEY',
    models: ['gpt-4o', 'gpt-4o-mini', 'o1', 'o1-mini'],
    defaultModel: 'gpt-4o',
  },
  anthropic: {
    name: 'Anthropic',
    apiKeyEnvVar: 'ANTHROPIC_API_KEY',
    models: [
      'claude-sonnet-4-20250514',
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
    ],
    defaultModel: 'claude-sonnet-4-20250514',
  },
  mistral: {
    name: 'Mistral',
    apiKeyEnvVar: 'MISTRAL_API_KEY',
    models: ['mistral-large-latest', 'codestral-latest', 'mistral-small-latest'],
    defaultModel: 'mistral-large-latest',
  },
  gemini: {
    name: 'Google Gemini',
    apiKeyEnvVar: 'GOOGLE_API_KEY',
    models: ['gemini-2.0-flash', 'gemini-2.5-pro-preview-06-05'],
    defaultModel: 'gemini-2.0-flash',
  },
};

/**
 * Get available providers based on API keys
 */
function getAvailableProviders(): Array<{
  id: string;
  config: ProviderConfig;
  available: boolean;
}> {
  return Object.entries(PROVIDERS).map(([id, config]) => ({
    id,
    config,
    available: Boolean(process.env[config.apiKeyEnvVar]),
  }));
}

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

  // Check for available providers
  const providers = getAvailableProviders();
  const availableProviders = providers.filter((p) => p.available);

  if (availableProviders.length === 0) {
    const useProxy = await vscode.window.showWarningMessage(
      'No AI provider API keys found. Set OPENAI_API_KEY, ANTHROPIC_API_KEY, MISTRAL_API_KEY, or GOOGLE_API_KEY environment variable.',
      'Configure Settings',
      'Use Managed Keys'
    );

    if (useProxy === 'Configure Settings') {
      await vscode.commands.executeCommand(
        'workbench.action.openSettings',
        'contractspec.ai'
      );
    }
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

  // Get workspace context
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
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
    availableProviders,
    contextInfo
  );

  // Handle messages from the webview
  chatPanel.webview.onDidReceiveMessage(
    async (message) => {
      switch (message.type) {
        case 'send': {
          await handleChatMessage(
            chatPanel!,
            message.content,
            message.provider,
            message.model,
            workspaceRoot,
            outputChannel
          );
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
      }
    },
    undefined,
    context.subscriptions
  );

  // Clean up when panel is closed
  chatPanel.onDidDispose(() => {
    chatPanel = undefined;
  });
}

/**
 * Handle a chat message from the webview
 */
async function handleChatMessage(
  panel: vscode.WebviewPanel,
  content: string,
  providerId: string,
  model: string,
  workspaceRoot: string | undefined,
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const providerConfig = PROVIDERS[providerId];
  if (!providerConfig) {
    panel.webview.postMessage({
      type: 'error',
      error: `Unknown provider: ${providerId}`,
    });
    return;
  }

  const apiKey = process.env[providerConfig.apiKeyEnvVar];
  if (!apiKey) {
    panel.webview.postMessage({
      type: 'error',
      error: `API key not set: ${providerConfig.apiKeyEnvVar}`,
    });
    return;
  }

  // Build system prompt with workspace context
  const systemPrompt = buildSystemPrompt(workspaceRoot);

  try {
    // Make API call based on provider
    const response = await callLLMAPI(
      providerId,
      model,
      apiKey,
      systemPrompt,
      content
    );

    // Send response back to webview
    panel.webview.postMessage({
      type: 'response',
      content: response,
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
 * Build system prompt with workspace context
 */
function buildSystemPrompt(workspaceRoot: string | undefined): string {
  let prompt = `You are ContractSpec AI, an expert coding assistant specialized in ContractSpec development.

Your capabilities:
- Help users create, modify, and understand ContractSpec specifications
- Generate code that follows ContractSpec patterns and best practices
- Explain concepts from the ContractSpec documentation
- Suggest improvements and identify issues in specs and implementations

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
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
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
 * Call the LLM API
 */
async function callLLMAPI(
  providerId: string,
  model: string,
  apiKey: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  let url: string;
  let headers: Record<string, string>;
  let body: unknown;

  switch (providerId) {
    case 'openai':
      url = 'https://api.openai.com/v1/chat/completions';
      headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      };
      body = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
      };
      break;

    case 'anthropic':
      url = 'https://api.anthropic.com/v1/messages';
      headers = {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      };
      body = {
        model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      };
      break;

    case 'mistral':
      url = 'https://api.mistral.ai/v1/chat/completions';
      headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      };
      body = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      };
      break;

    case 'gemini':
      url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      headers = {
        'Content-Type': 'application/json',
      };
      body = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userMessage }] }],
      };
      break;

    default:
      throw new Error(`Unknown provider: ${providerId}`);
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  const data = (await response.json()) as Record<string, unknown>;

  // Extract content based on provider
  switch (providerId) {
    case 'openai':
    case 'mistral': {
      const choices = data.choices as Array<{
        message?: { content?: string };
      }>;
      return choices?.[0]?.message?.content ?? '';
    }
    case 'anthropic': {
      const content = data.content as Array<{ text?: string }>;
      return content?.[0]?.text ?? '';
    }
    case 'gemini': {
      const candidates = data.candidates as Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
      return candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    }
    default:
      return '';
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
 * Get the HTML for the chat panel
 */
function getChatPanelHtml(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  providers: Array<{ id: string; config: ProviderConfig; available: boolean }>,
  contextInfo: string
): string {
  const availableProviders = providers.filter((p) => p.available);
  const defaultProvider = availableProviders[0];

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

    .provider-select, .model-select {
      padding: 4px 8px;
      background: var(--vscode-dropdown-background);
      color: var(--vscode-dropdown-foreground);
      border: 1px solid var(--vscode-dropdown-border);
      border-radius: 4px;
      font-size: 12px;
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
    <select class="provider-select" id="provider">
      ${availableProviders
        .map(
          (p) =>
            `<option value="${p.id}" ${p.id === defaultProvider?.id ? 'selected' : ''}>${p.config.name}</option>`
        )
        .join('')}
    </select>
    <select class="model-select" id="model">
      ${defaultProvider?.config.models
        .map(
          (m) =>
            `<option value="${m}" ${m === defaultProvider?.config.defaultModel ? 'selected' : ''}>${m}</option>`
        )
        .join('')}
    </select>
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
    const providerSelect = document.getElementById('provider');
    const modelSelect = document.getElementById('model');

    const providers = ${JSON.stringify(
      Object.fromEntries(
        availableProviders.map((p) => [p.id, p.config])
      )
    )};

    // Update models when provider changes
    providerSelect.addEventListener('change', () => {
      const provider = providers[providerSelect.value];
      modelSelect.innerHTML = provider.models
        .map(m => \`<option value="\${m}" \${m === provider.defaultModel ? 'selected' : ''}>\${m}</option>\`)
        .join('');
    });

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
        provider: providerSelect.value,
        model: modelSelect.value,
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

      // Remove loading indicator
      const loading = messagesEl.querySelector('.loading');
      if (loading) loading.remove();

      sendBtn.disabled = false;

      if (message.type === 'response') {
        addMessage('assistant', message.content);
      } else if (message.type === 'error') {
        addMessage('error', '❌ Error: ' + message.error);
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

