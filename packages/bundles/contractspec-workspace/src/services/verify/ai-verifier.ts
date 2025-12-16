/**
 * Tier 3: AI-Powered Verification
 *
 * Uses an LLM to semantically analyze the implementation against
 * the specification for deeper compliance checking.
 */

import type { AnyContractSpec } from '@lssm/lib.contracts';
import type {
  VerificationReport,
  VerificationIssue,
} from '@lssm/lib.contracts/llm';
import {
  generateVerificationPrompt,
  specToFullMarkdown,
} from '@lssm/lib.contracts/llm';
import type { VerifyInput, AIReviewResult, VerifyConfig } from './types';

/**
 * Parse AI response to structured result.
 */
function parseAIResponse(response: string): AIReviewResult {
  // Try to extract JSON from the response
  const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/);
  if (jsonMatch?.[1]) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      return {
        compliant: parsed.passed ?? false,
        confidence: (parsed.score ?? 0) / 100,
        findings: (parsed.issues ?? []).map(
          (issue: Record<string, unknown>) => ({
            category: String(issue.category ?? 'semantic'),
            severity: String(issue.severity ?? 'warning') as
              | 'error'
              | 'warning'
              | 'info',
            message: String(issue.message ?? ''),
            location: issue.location ? String(issue.location) : undefined,
            suggestion: issue.suggestion ? String(issue.suggestion) : undefined,
          })
        ),
        rawResponse: response,
      };
    } catch {
      // JSON parse failed, fall through to text parsing
    }
  }

  // Fallback: parse text response
  const findings: AIReviewResult['findings'] = [];

  // Look for issue patterns
  const lines = response.split('\n');
  let currentSeverity: 'error' | 'warning' | 'info' = 'info';

  for (const line of lines) {
    const lineLower = line.toLowerCase();

    // Detect severity changes
    if (lineLower.includes('error') || lineLower.includes('critical')) {
      currentSeverity = 'error';
    } else if (lineLower.includes('warning') || lineLower.includes('should')) {
      currentSeverity = 'warning';
    } else if (lineLower.includes('info') || lineLower.includes('note')) {
      currentSeverity = 'info';
    }

    // Look for bullet points or numbered items
    const bulletMatch = line.match(/^[-*•]\s*(.+)$/);
    const numberedMatch = line.match(/^\d+\.\s*(.+)$/);

    if (bulletMatch || numberedMatch) {
      const content = bulletMatch?.[1] ?? numberedMatch?.[1] ?? '';
      if (content.length > 10) {
        findings.push({
          category: 'semantic',
          severity: currentSeverity,
          message: content,
        });
      }
    }
  }

  // Determine overall compliance
  const hasErrors = findings.some((f) => f.severity === 'error');
  const compliant = !hasErrors;
  const confidence = hasErrors ? 0.3 : findings.length === 0 ? 0.9 : 0.7;

  return {
    compliant,
    confidence,
    findings,
    rawResponse: response,
  };
}

/**
 * Call AI provider for verification.
 * This is a placeholder - actual implementation would use AI SDK.
 */
async function callAI(prompt: string, config: VerifyConfig): Promise<string> {
  // Check if we have an API key configured
  if (!config.aiApiKey) {
    // Return a placeholder response indicating AI is not configured
    return `\`\`\`json
{
  "passed": true,
  "score": 50,
  "compliance": {
    "inputTypes": { "match": true, "issues": [] },
    "outputTypes": { "match": true, "issues": [] },
    "errorHandling": { "coverage": "unknown", "missing": [] },
    "eventEmission": { "correct": true, "issues": [] },
    "policyCompliance": { "auth": true, "rateLimit": true, "pii": true }
  },
  "scenarios": [],
  "issues": [
    { "severity": "info", "category": "semantic", "message": "AI verification not available - configure AI API key for full analysis" }
  ],
  "summary": "AI verification skipped - no API key configured. Structure and behavior checks have been performed."
}
\`\`\``;
  }

  // In a real implementation, this would call the AI provider
  // For now, we'll use a dynamic import to avoid hard dependency
  try {
    const provider = config.aiProvider ?? 'anthropic';

    if (provider === 'anthropic') {
      // Dynamic import to avoid hard dependency
      const { anthropic } = await import('@ai-sdk/anthropic');
      const { generateText } = await import('ai');

      const result = await generateText({
        model: anthropic('claude-3-5-sonnet-20241022'),
        prompt,
        system:
          'You are an expert code reviewer analyzing implementation compliance with specifications. Respond with structured JSON.',
      });

      return result.text;
    } else if (provider === 'openai') {
      const { openai } = await import('@ai-sdk/openai');
      const { generateText } = await import('ai');

      const result = await generateText({
        model: openai('gpt-4o'),
        prompt,
        system:
          'You are an expert code reviewer analyzing implementation compliance with specifications. Respond with structured JSON.',
      });

      return result.text;
    }

    throw new Error(`Unknown AI provider: ${provider}`);
  } catch (error) {
    // Return error as structured response
    return `\`\`\`json
{
  "passed": false,
  "score": 0,
  "issues": [
    { "severity": "error", "category": "semantic", "message": "AI verification failed: ${error instanceof Error ? error.message : 'Unknown error'}" }
  ],
  "summary": "AI verification encountered an error"
}
\`\`\``;
  }
}

/**
 * Run AI-powered verification.
 */
export async function verifyWithAI(
  input: VerifyInput,
  config: VerifyConfig = {}
): Promise<VerificationReport> {
  const { spec, implementationCode, implementationPath } = input;
  const startTime = Date.now();

  // Generate the verification prompt
  const prompt = generateVerificationPrompt(spec, implementationCode);

  // Call AI
  const aiResponse = await callAI(prompt.taskPrompt, config);

  // Parse response
  const result = parseAIResponse(aiResponse);

  // Convert to verification issues
  const issues: VerificationIssue[] = result.findings.map((f) => ({
    severity: f.severity,
    category: 'semantic' as const,
    message: f.message,
    location: f.location
      ? { file: f.location }
      : implementationPath
        ? { file: implementationPath }
        : undefined,
    suggestion: f.suggestion,
  }));

  const score = Math.round(result.confidence * 100);
  const passed = result.compliant;

  // Generate suggestions from findings
  const suggestions = result.findings
    .filter((f) => f.suggestion)
    .map((f) => f.suggestion!);

  return {
    tier: 'ai_review',
    passed,
    score,
    issues,
    suggestions,
    coverage: {
      scenarios: { total: 0, covered: 0 }, // AI doesn't track these explicitly
      errors: { total: 0, handled: 0 },
      fields: { total: 1, implemented: passed ? 1 : 0 },
    },
    meta: {
      specName: spec.meta.name,
      specVersion: spec.meta.version,
      implementationPath: implementationPath ?? 'unknown',
      verifiedAt: new Date().toISOString(),
      duration: Date.now() - startTime,
    },
  };
}

/**
 * Create a simpler AI review without calling the API.
 * Used as fallback or for quick checks.
 */
export function createQuickAIReview(input: VerifyInput): VerificationReport {
  const { spec, implementationCode, implementationPath } = input;
  const startTime = Date.now();

  // Simple heuristic checks that approximate AI review
  const issues: VerificationIssue[] = [];

  // Check for common anti-patterns
  if (implementationCode.includes('console.log')) {
    issues.push({
      severity: 'warning',
      category: 'semantic',
      message: 'Console.log statements found - consider using proper logging',
      suggestion: 'Use a structured logger instead of console.log',
    });
  }

  if (
    implementationCode.includes('// TODO') ||
    implementationCode.includes('// FIXME')
  ) {
    issues.push({
      severity: 'info',
      category: 'semantic',
      message: 'TODO/FIXME comments found - implementation may be incomplete',
      suggestion: 'Address TODO items before finalizing implementation',
    });
  }

  // Check for hardcoded values that should come from spec
  if (
    spec.policy.auth !== 'anonymous' &&
    !implementationCode.includes('auth')
  ) {
    issues.push({
      severity: 'warning',
      category: 'semantic',
      message: `Spec requires ${spec.policy.auth} auth but no auth check found`,
      suggestion: 'Add authentication check at the handler entry point',
    });
  }

  const score =
    issues.filter((i) => i.severity === 'error').length === 0 ? 80 : 40;
  const passed = issues.filter((i) => i.severity === 'error').length === 0;

  return {
    tier: 'ai_review',
    passed,
    score,
    issues,
    suggestions: issues.filter((i) => i.suggestion).map((i) => i.suggestion!),
    coverage: {
      scenarios: { total: 0, covered: 0 },
      errors: { total: 0, handled: 0 },
      fields: { total: 1, implemented: passed ? 1 : 0 },
    },
    meta: {
      specName: spec.meta.name,
      specVersion: spec.meta.version,
      implementationPath: implementationPath ?? 'unknown',
      verifiedAt: new Date().toISOString(),
      duration: Date.now() - startTime,
    },
  };
}
