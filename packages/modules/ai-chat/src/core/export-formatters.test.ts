import { describe, expect, it } from 'bun:test';
import {
  formatMessagesAsMarkdown,
  formatMessagesAsTxt,
  formatMessagesAsJson,
  getExportFilename,
} from './export-formatters';
import type { ChatMessage } from './message-types';

const createMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: 'msg-1',
  conversationId: 'conv-1',
  role: 'user',
  content: 'Hello',
  status: 'completed',
  createdAt: new Date('2025-03-09T10:30:00Z'),
  updatedAt: new Date('2025-03-09T10:30:00Z'),
  ...overrides,
});

describe('export-formatters', () => {
  describe('formatMessagesAsMarkdown', () => {
    it('formats user and assistant messages', () => {
      const messages: ChatMessage[] = [
        createMessage({ role: 'user', content: 'Hi' }),
        createMessage({
          id: 'msg-2',
          role: 'assistant',
          content: 'Hello! How can I help?',
        }),
      ];
      const md = formatMessagesAsMarkdown(messages);
      expect(md).toContain('## User');
      expect(md).toContain('## Assistant');
      expect(md).toContain('Hi');
      expect(md).toContain('Hello! How can I help?');
    });
  });

  describe('formatMessagesAsTxt', () => {
    it('formats messages with role labels', () => {
      const messages: ChatMessage[] = [
        createMessage({ role: 'user', content: 'Test' }),
      ];
      const txt = formatMessagesAsTxt(messages);
      expect(txt).toContain('[User]');
      expect(txt).toContain('Test');
    });
  });

  describe('formatMessagesAsJson', () => {
    it('serializes messages with ISO dates', () => {
      const messages: ChatMessage[] = [
        createMessage({ content: 'JSON test' }),
      ];
      const json = formatMessagesAsJson(messages);
      const parsed = JSON.parse(json);
      expect(parsed.messages).toHaveLength(1);
      expect(parsed.messages[0].content).toBe('JSON test');
      expect(parsed.messages[0].createdAt).toContain('2025-03-09');
    });

    it('includes conversation when provided', () => {
      const messages: ChatMessage[] = [createMessage()];
      const json = formatMessagesAsJson(messages, {
        id: 'conv-1',
        title: 'Test Conv',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        provider: 'openai',
        model: 'gpt-4o',
        messages: [],
      });
      const parsed = JSON.parse(json);
      expect(parsed.conversation).toBeDefined();
      expect(parsed.conversation.title).toBe('Test Conv');
    });
  });

  describe('getExportFilename', () => {
    it('uses chat-export when no conversation title', () => {
      const name = getExportFilename('markdown');
      expect(name).toMatch(/^chat-export-.*\.md$/);
    });

    it('uses conversation title when provided', () => {
      const name = getExportFilename('markdown', {
        id: 'c1',
        title: 'My Chat',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        provider: 'openai',
        model: 'gpt-4o',
        messages: [],
      });
      expect(name).toMatch(/^My_Chat-.*\.md$/);
    });
  });
});
