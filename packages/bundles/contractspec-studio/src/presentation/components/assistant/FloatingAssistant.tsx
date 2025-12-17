'use client';

import * as React from 'react';
import { MessageSquare, X, Maximize2, Minimize2, Send, Loader2, Settings } from 'lucide-react';
import { Button } from '@lssm/lib.design-system';
import { cn } from '@lssm/lib.ui-kit-web/ui/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@lssm/lib.ui-kit-web/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lssm/lib.ui-kit-web/ui/select';
import { Badge } from '@lssm/lib.ui-kit-web/ui/badge';
import { recordLearningEvent } from '../learning/learning-events';

export interface FloatingAssistantContext {
  mode: 'studio' | 'sandbox';
  lifecycleEnabled?: boolean;
  templateId?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4o', 'gpt-4o-mini'] },
  { id: 'anthropic', name: 'Anthropic', models: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022'] },
  { id: 'mistral', name: 'Mistral', models: ['mistral-large-latest', 'codestral-latest'] },
  { id: 'gemini', name: 'Gemini', models: ['gemini-2.0-flash', 'gemini-2.5-pro-preview-06-05'] },
];

export function FloatingAssistant({ context }: { context: FloatingAssistantContext }) {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 Hi! I'm ContractSpec AI, your vibe coding assistant.\n\nI can help you with:\n- Creating and modifying specs\n- Generating code from specs\n- Explaining ContractSpec concepts\n- Suggesting improvements\n\nWhat would you like to work on?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [provider, setProvider] = React.useState('openai');
  const [model, setModel] = React.useState('gpt-4o');
  const [showSettings, setShowSettings] = React.useState(false);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update model when provider changes
  React.useEffect(() => {
    const providerInfo = PROVIDERS.find((p) => p.id === provider);
    if (providerInfo && !providerInfo.models.includes(model)) {
      setModel(providerInfo.models[0] ?? '');
    }
  }, [provider, model]);

  const selectedProvider = PROVIDERS.find((p) => p.id === provider);

  const sendMessage = React.useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    recordLearningEvent({
      name: `${context.mode}.assistant.message_sent`,
      ts: Date.now(),
    });

    try {
      // Call the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          provider,
          model,
          systemPrompt: `You are ContractSpec AI, an expert coding assistant specialized in ContractSpec development.

Your capabilities:
- Help users create, modify, and understand ContractSpec specifications
- Generate code that follows ContractSpec patterns and best practices
- Explain concepts from the ContractSpec documentation
- Suggest improvements and identify issues in specs and implementations

Guidelines:
- Be concise but thorough
- Provide code examples when helpful
- Use markdown for formatting
- When showing code, include syntax highlighting with language tags`,
          stream: false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? 'Request failed');
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: data.text ?? 'Sorry, I could not generate a response.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: `❌ Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, provider, model, context.mode]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split(/```(\w*)\n([\s\S]*?)```/g)
      .map((part, i) => {
        if (i % 3 === 1) {
          // Language tag - skip
          return null;
        }
        if (i % 3 === 2) {
          // Code block
          return (
            <pre
              key={i}
              className="bg-muted my-2 overflow-x-auto rounded-md p-3 text-sm"
            >
              <code>{part}</code>
            </pre>
          );
        }
        // Regular text
        return part.split('\n').map((line, j) => (
          <React.Fragment key={`${i}-${j}`}>
            {line}
            {j < part.split('\n').length - 1 && <br />}
          </React.Fragment>
        ));
      });
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <Sheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) {
            recordLearningEvent({
              name: `${context.mode}.assistant.opened`,
              ts: Date.now(),
            });
          }
        }}
      >
        <SheetTrigger asChild>
          <Button
            variant="default"
            className="shadow-lg"
            aria-label="Open AI assistant"
          >
            <MessageSquare className="h-4 w-4" />
            AI Chat
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className={cn(
            'flex flex-col p-0 transition-all duration-200',
            expanded ? 'w-[600px] max-w-[90vw]' : 'w-[420px] max-w-[90vw]'
          )}
        >
          {/* Header */}
          <SheetHeader className="border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-base">ContractSpec AI</SheetTitle>
                <Badge variant="outline" className="text-xs">
                  {selectedProvider?.name} · {model}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => setShowSettings(!showSettings)}
                  aria-label="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => setExpanded(!expanded)}
                  aria-label={expanded ? 'Collapse' : 'Expand'}
                >
                  {expanded ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Settings panel */}
            {showSettings && (
              <div className="mt-3 flex gap-2">
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDERS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProvider?.models.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </SheetHeader>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'max-w-[90%] rounded-lg px-4 py-3',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-muted'
                )}
              >
                <div className="text-sm">{formatContent(message.content)}</div>
              </div>
            ))}
            {isLoading && (
              <div className="bg-muted max-w-[90%] rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-muted-foreground text-sm">
                    Thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about ContractSpec..."
                className="bg-input placeholder:text-muted-foreground flex-1 resize-none rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                rows={2}
                disabled={isLoading}
              />
              <Button
                onPress={sendMessage}
                disabled={!input.trim() || isLoading}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
