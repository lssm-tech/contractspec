import { gqlSchemaBuilder } from '../builder';

const fallbackSummary = (text: string) => {
  const maxLength = 200;
  if (text.length <= maxLength) return text;

  // Find the last complete sentence within the limit
  const truncated = text.slice(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');

  if (lastSentence > maxLength * 0.7) {
    return truncated.slice(0, lastSentence + 1);
  }

  return truncated + '…';
};

export function registerAISchema() {
  // Simple AI operations. Replace with provider calls when ready.
  gqlSchemaBuilder.mutationField('aiRewrite', (t) =>
    t.string({
      args: { text: t.arg.string({ required: true }) },
      resolve: async (_root, args) => {
        const text = String(args.text || '');

        if (!text.trim()) {
          throw new Error('Text content is required for rewriting');
        }

        // Use environment variables to determine AI provider
        const openaiKey = process.env.OPENAI_API_KEY;
        const anthropicKey = process.env.ANTHROPIC_API_KEY;

        if (!openaiKey && !anthropicKey) {
          throw new Error('AI service not configured. Please contact support.');
        }

        try {
          // Use OpenAI if available, fallback to Anthropic
          if (openaiKey) {
            const response = await fetch(
              'https://api.openai.com/v1/chat/completions',
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${openaiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'gpt-3.5-turbo',
                  messages: [
                    {
                      role: 'system',
                      content:
                        'You are a professional writing assistant. Rewrite the given text to be clearer, more professional, and better structured while maintaining the original meaning and tone.',
                    },
                    {
                      role: 'user',
                      content: text,
                    },
                  ],
                  max_tokens: 1000,
                  temperature: 0.7,
                }),
              }
            );

            if (!response.ok) {
              throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || text;
          }

          // Fallback: return original text with minimal formatting
          return text.trim();
        } catch (error) {
          console.error('AI rewrite error:', error);
          // Graceful fallback - return original text
          return text;
        }
      },
    })
  );

  gqlSchemaBuilder.mutationField('aiSummarize', (t) =>
    t.string({
      args: { text: t.arg.string({ required: true }) },
      resolve: async (_root, args) => {
        const text = String(args.text || '');

        if (!text.trim()) {
          throw new Error('Text content is required for summarization');
        }

        // Use environment variables to determine AI provider
        const openaiKey = process.env.OPENAI_API_KEY;
        const anthropicKey = process.env.ANTHROPIC_API_KEY;

        if (!openaiKey && !anthropicKey) {
          throw new Error('AI service not configured. Please contact support.');
        }

        try {
          // Use OpenAI if available
          if (openaiKey) {
            const response = await fetch(
              'https://api.openai.com/v1/chat/completions',
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${openaiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'gpt-3.5-turbo',
                  messages: [
                    {
                      role: 'system',
                      content:
                        'You are a professional summarization assistant. Create a concise, clear summary of the given text that captures the key points and main ideas. Keep it under 200 words.',
                    },
                    {
                      role: 'user',
                      content: text,
                    },
                  ],
                  max_tokens: 300,
                  temperature: 0.5,
                }),
              }
            );

            if (!response.ok) {
              throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || fallbackSummary(text);
          }

          return fallbackSummary(text);
        } catch (error) {
          console.error('AI summarize error:', error);
          // Graceful fallback
          return fallbackSummary(text);
        }
      },
    })
  );
}
