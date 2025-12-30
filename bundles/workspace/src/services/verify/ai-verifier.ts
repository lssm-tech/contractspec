/**
 * Tier 3: AI-Powered Verification
 *
 * Uses an LLM to semantically analyze the implementation against
 * the specification for deeper compliance checking.
 */

import type { AnyOperationSpec } from '@contractspec/lib.contracts';
import type {
  VerificationIssue,
  VerificationReport,
} from '@contractspec/lib.contracts/llm';
import { generateVerificationPrompt } from '@contractspec/lib.contracts/llm';
import type {
  AIReviewResult,
  FieldMapping,
  SemanticVerificationResult,
  VerifyConfig,
  VerifyInput,
} from './types';

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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
      specName: spec.meta.key,
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    suggestions: issues.filter((i) => i.suggestion).map((i) => i.suggestion!),
    coverage: {
      scenarios: { total: 0, covered: 0 },
      errors: { total: 0, handled: 0 },
      fields: { total: 1, implemented: passed ? 1 : 0 },
    },
    meta: {
      specName: spec.meta.key,
      specVersion: spec.meta.version,
      implementationPath: implementationPath ?? 'unknown',
      verifiedAt: new Date().toISOString(),
      duration: Date.now() - startTime,
    },
  };
}

/**
 * Generate a prompt for semantic field verification.
 */
function generateSemanticFieldPrompt(
  specFields: string,
  implCode: string
): string {
  return `You are analyzing a code implementation against its specification.

## Spec Schema Fields
${specFields}

## Implementation Code
\`\`\`typescript
${implCode}
\`\`\`

## Task
Analyze the implementation to verify it correctly implements the spec schema fields.

For each field in the spec:
1. Find the corresponding field/property in the implementation
2. Determine if the naming matches (exact, compatible synonym, or mismatch)
3. Check if the types are compatible
4. Identify any missing fields

Respond with JSON in this format:
\`\`\`json
{
  "fieldMappings": [
    {
      "specField": "nickname",
      "specType": "string",
      "implementationField": "username",
      "implementationType": "string",
      "match": "compatible",
      "aiConfidence": 0.85,
      "suggestion": "Consider renaming 'username' to 'nickname' for exact spec compliance"
    }
  ],
  "intentAlignment": {
    "score": 85,
    "issues": ["Field naming differs from spec"],
    "suggestions": ["Rename fields to match spec exactly for better maintainability"]
  },
  "semanticIssues": []
}
\`\`\`

Match types:
- "exact": Field name and type match exactly
- "compatible": Semantically similar (e.g., "email" vs "emailAddress")
- "mismatch": Different meaning despite similar naming
- "missing": Spec field not found in implementation
`;
}

/**
 * Extract field definitions from spec schema.
 */
function extractSpecFields(spec: AnyOperationSpec): string {
  const fields: string[] = [];

  /**
   * Helper to safely extract fields from a schema.
   */
  const extractFromSchema = (
    schema: unknown,
    direction: 'input' | 'output'
  ) => {
    try {
      // Cast to any to access internal Zod structure
      const schemaAny = schema as {
        _def?: { shape?: () => Record<string, unknown> };
      };
      const shapeFn = schemaAny?._def?.shape;

      if (shapeFn && typeof shapeFn === 'function') {
        const shapeObj = shapeFn();
        for (const [key, value] of Object.entries(shapeObj)) {
          const valueAny = value as { _def?: { typeName?: string } };
          const typeName = valueAny?._def?.typeName ?? 'unknown';
          fields.push(
            `- ${key}: ${String(typeName).replace('Zod', '').toLowerCase()} (${direction})`
          );
        }
      }
    } catch {
      fields.push(`- [unable to extract ${direction} fields]`);
    }
  };

  // Try to extract from input schema
  if (spec.io.input) {
    extractFromSchema(spec.io.input, 'input');
  }

  // Try to extract from output schema (skip if it's a resource ref)
  if (spec.io.output && !('resourceRef' in spec.io.output)) {
    extractFromSchema(spec.io.output, 'output');
  }

  if (fields.length === 0) {
    return '- [no schema fields could be extracted]';
  }

  return fields.join('\n');
}

/**
 * Parse semantic verification response from AI.
 */
function parseSemanticResponse(response: string): SemanticVerificationResult {
  // Try to extract JSON
  const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/);
  if (jsonMatch?.[1]) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      return {
        fieldMappings: (parsed.fieldMappings ?? []).map(
          (m: Record<string, unknown>) => ({
            specField: String(m.specField ?? ''),
            specType: String(m.specType ?? 'unknown'),
            implementationField: m.implementationField
              ? String(m.implementationField)
              : undefined,
            implementationType: m.implementationType
              ? String(m.implementationType)
              : undefined,
            match: (m.match ?? 'missing') as FieldMapping['match'],
            aiConfidence:
              typeof m.aiConfidence === 'number' ? m.aiConfidence : 0.5,
            suggestion: m.suggestion ? String(m.suggestion) : undefined,
          })
        ),
        intentAlignment: {
          score:
            typeof parsed.intentAlignment?.score === 'number'
              ? parsed.intentAlignment.score
              : 50,
          issues: Array.isArray(parsed.intentAlignment?.issues)
            ? parsed.intentAlignment.issues
            : [],
          suggestions: Array.isArray(parsed.intentAlignment?.suggestions)
            ? parsed.intentAlignment.suggestions
            : [],
        },
        semanticIssues: (parsed.semanticIssues ?? []).map(
          (i: Record<string, unknown>) => ({
            category: String(i.category ?? 'semantic'),
            severity: (i.severity ?? 'warning') as 'error' | 'warning' | 'info',
            message: String(i.message ?? ''),
            suggestion: i.suggestion ? String(i.suggestion) : undefined,
          })
        ),
        rawResponse: response,
      };
    } catch {
      // Fall through to default
    }
  }

  // Default result if parsing fails
  return {
    fieldMappings: [],
    intentAlignment: {
      score: 50,
      issues: ['Unable to parse AI response for semantic analysis'],
      suggestions: [],
    },
    semanticIssues: [],
    rawResponse: response,
  };
}

/**
 * Run semantic field-level verification using AI.
 */
export async function verifySemanticFields(
  input: VerifyInput,
  config: VerifyConfig = {}
): Promise<SemanticVerificationResult> {
  const { spec, implementationCode } = input;

  // Extract spec fields
  const specFields = extractSpecFields(spec);

  // Generate prompt
  const prompt = generateSemanticFieldPrompt(specFields, implementationCode);

  // Call AI
  const aiResponse = await callAI(prompt, config);

  // Parse response
  return parseSemanticResponse(aiResponse);
}

/**
 * Run enhanced AI verification with semantic field analysis.
 */
export async function verifyWithAIEnhanced(
  input: VerifyInput,
  config: VerifyConfig = {}
): Promise<VerificationReport> {
  const {
    spec: _spec,
    implementationCode: _implementationCode,
    implementationPath: _implementationPath,
  } = input;
  const startTime = Date.now();

  // Run standard AI verification
  const baseReport = await verifyWithAI(input, config);

  // Run semantic field verification if AI is available
  let semanticResult: SemanticVerificationResult | undefined;
  if (config.aiApiKey) {
    try {
      semanticResult = await verifySemanticFields(input, config);
    } catch {
      // Semantic verification failed, continue with base report
    }
  }

  // Merge semantic issues into base report
  if (semanticResult) {
    const semanticIssues: VerificationIssue[] = [];

    // Add field mapping issues
    for (const mapping of semanticResult.fieldMappings) {
      if (mapping.match === 'missing') {
        semanticIssues.push({
          severity: 'error',
          category: 'semantic',
          message: `Missing field: '${mapping.specField}' (${mapping.specType}) not found in implementation`,
          suggestion:
            mapping.suggestion ??
            `Add field '${mapping.specField}' to implementation`,
        });
      } else if (mapping.match === 'mismatch') {
        semanticIssues.push({
          severity: 'warning',
          category: 'semantic',
          message: `Field mismatch: '${mapping.specField}' has incorrect implementation as '${mapping.implementationField}'`,
          suggestion: mapping.suggestion,
        });
      } else if (mapping.match === 'compatible' && mapping.aiConfidence < 0.8) {
        semanticIssues.push({
          severity: 'info',
          category: 'semantic',
          message: `Field naming: '${mapping.specField}' implemented as '${mapping.implementationField}' (compatible but not exact)`,
          suggestion: mapping.suggestion,
        });
      }
    }

    // Add intent alignment issues
    for (const issue of semanticResult.intentAlignment.issues) {
      semanticIssues.push({
        severity: 'warning',
        category: 'semantic',
        message: issue,
      });
    }

    // Add other semantic issues
    for (const issue of semanticResult.semanticIssues) {
      semanticIssues.push({
        severity: issue.severity,
        category: 'semantic',
        message: issue.message,
        suggestion: issue.suggestion,
      });
    }

    // Merge issues
    baseReport.issues = [...baseReport.issues, ...semanticIssues];

    // Update score based on field coverage
    const totalFields = semanticResult.fieldMappings.length;
    const implementedFields = semanticResult.fieldMappings.filter(
      (m) => m.match === 'exact' || m.match === 'compatible'
    ).length;

    if (totalFields > 0) {
      const fieldScore = Math.round((implementedFields / totalFields) * 100);
      baseReport.score = Math.round((baseReport.score + fieldScore) / 2);
      baseReport.coverage.fields = {
        total: totalFields,
        implemented: implementedFields,
      };
    }

    // Update pass status
    const hasFieldErrors = semanticIssues.some((i) => i.severity === 'error');
    if (hasFieldErrors) {
      baseReport.passed = false;
    }

    // Add semantic suggestions
    baseReport.suggestions = [
      ...baseReport.suggestions,
      ...semanticResult.intentAlignment.suggestions,
    ];
  }

  // Update duration
  baseReport.meta = {
    ...baseReport.meta,
    duration: Date.now() - startTime,
  };

  return baseReport;
}
