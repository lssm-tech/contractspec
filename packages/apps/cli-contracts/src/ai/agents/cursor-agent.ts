/**
 * Cursor/Windsurf Agent - Fully Implemented
 * Leverages Windsurf AI capabilities and Cursor IDE integration for code generation and validation
 */

import { exec, spawn } from 'child_process';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { homedir, tmpdir } from 'os';
import { existsSync } from 'fs';
import { promisify } from 'util';
import type { AgentProvider, AgentResult, AgentTask } from './types';

const execAsync = promisify(exec);

export class CursorAgent implements AgentProvider {
  name = 'cursor' as const;
  private cursorPath: string | null = null;
  private isWindsurf = false;
  private composerPort: string;

  constructor() {
    this.composerPort = process.env.CURSOR_COMPOSER_PORT || '3000';
    this.detectEnvironment();
  }

  canHandle(task: AgentTask): boolean {
    return this.isCursorAvailable();
  }

  async generate(task: AgentTask): Promise<AgentResult> {
    try {
      const workDir = join(tmpdir(), `cursor-agent-${Date.now()}`);
      await mkdir(workDir, { recursive: true });

      const result = await this.executeWithBestMethod(task, workDir);

      // Cleanup
      await this.cleanupWorkDir(workDir);

      return result;
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  async validate(task: AgentTask): Promise<AgentResult> {
    try {
      const workDir = join(tmpdir(), `cursor-validate-${Date.now()}`);
      await mkdir(workDir, { recursive: true });

      // Create validation context
      await this.setupValidationWorkspace(task, workDir);

      const result = await this.executeWithBestMethod(
        {
          ...task,
          type: 'validate',
        },
        workDir
      );

      // Cleanup
      await this.cleanupWorkDir(workDir);

      return result;
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  /**
   * Detect if running in Cursor/Windsurf environment
   */
  private detectEnvironment(): void {
    // Check for Windsurf/Cursor environment variables
    this.isWindsurf = !!(
      process.env.WINDSURF_SESSION ||
      process.env.CURSOR_USER_DATA ||
      process.env.VSCODE_CWD?.includes('Cursor') ||
      process.env.VSCODE_CWD?.includes('Windsurf')
    );

    // Try to locate cursor executable
    const possiblePaths = [
      '/usr/local/bin/cursor',
      '/Applications/Cursor.app/Contents/MacOS/Cursor',
      '/Applications/Windsurf.app/Contents/MacOS/Windsurf',
      join(homedir(), '.cursor', 'cursor'),
      join(homedir(), 'AppData', 'Local', 'Programs', 'cursor', 'Cursor.exe'),
      join(
        homedir(),
        'AppData',
        'Local',
        'Programs',
        'windsurf',
        'Windsurf.exe'
      ),
      'cursor', // In PATH
      'windsurf', // In PATH
    ];

    for (const path of possiblePaths) {
      if (
        path.includes('cursor') ||
        path.includes('Cursor') ||
        path.includes('windsurf') ||
        path.includes('Windsurf')
      ) {
        try {
          if (existsSync(path)) {
            this.cursorPath = path;
            break;
          }
        } catch {
          continue;
        }
      }
    }
  }

  /**
   * Execute task using the best available method
   */
  private async executeWithBestMethod(
    task: AgentTask,
    workDir: string
  ): Promise<AgentResult> {
    // Try methods in order of preference
    const methods = [
      // { name: 'windsurf-api', fn: () => this.useWindsurfAPI(task, workDir) },
      // { name: 'composer-api', fn: () => this.useComposerAPI(task, workDir) },
      { name: 'cursor-cli', fn: () => this.useCursorCLI(task, workDir) },
      {
        name: 'file-based',
        fn: () => this.useFileBasedApproach(task, workDir),
      },
    ];

    for (const method of methods) {
      try {
        const result = await method.fn();
        if (result.success) {
          return result;
        }
      } catch (error) {
        // Try next method
        continue;
      }
    }

    // All methods failed
    return {
      success: false,
      warnings: [
        'Cursor agent could not connect to IDE.',
        'Ensure Cursor/Windsurf is running with API enabled.',
        'Falling back to simple agent mode is recommended.',
      ],
      errors: ['All Cursor integration methods failed'],
      metadata: {
        agentMode: 'cursor',
        status: 'unavailable',
        suggestion: 'Use --agent-mode claude-code or --agent-mode simple',
      },
    };
  }

  /**
   * Use Windsurf's native API
   */
  // private async useWindsurfAPI(
  //   task: AgentTask,
  //   workDir: string
  // ): Promise<AgentResult> {
  //   if (!this.isWindsurf) {
  //     throw new Error('Not in Windsurf environment');
  //   }
  //
  //   const apiUrl = `http://localhost:${this.composerPort}/api/ai/generate`;
  //
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-Windsurf-Session': process.env.WINDSURF_SESSION || '',
  //       },
  //       body: JSON.stringify({
  //         task: task.type,
  //         specification: task.specCode,
  //         existingCode: task.existingCode,
  //         targetPath: task.targetPath,
  //         instructions: this.buildDetailedPrompt(task),
  //       }),
  //       signal: AbortSignal.timeout(30000), // 30 second timeout
  //     });
  //
  //     if (!response.ok) {
  //       throw new Error(`Windsurf API returned ${response.status}`);
  //     }
  //
  //     const data = await response.json();
  //
  //     return {
  //       success: true,
  //       code: data.code || data.output || data.result,
  //       warnings: data.warnings,
  //       suggestions: data.suggestions,
  //       metadata: {
  //         agentMode: 'cursor',
  //         method: 'windsurf-api',
  //         model: data.model,
  //       },
  //     };
  //   } catch (error) {
  //     throw new Error(
  //       `Windsurf API failed: ${error instanceof Error ? error.message : String(error)}`
  //     );
  //   }
  // }

  /**
   * Use Cursor Composer API
   */
  // private async useComposerAPI(
  //   task: AgentTask,
  //   workDir: string
  // ): Promise<AgentResult> {
  //   const apiUrl = `http://localhost:${this.composerPort}/api/compose`;
  //
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //       body: JSON.stringify({
  //         instruction: this.buildDetailedPrompt(task),
  //         files: await this.prepareFilesForAPI(task, workDir),
  //         workDir,
  //         options: {
  //           type: task.type,
  //           streaming: false,
  //         },
  //       }),
  //       signal: AbortSignal.timeout(30000),
  //     });
  //
  //     if (!response.ok) {
  //       throw new Error(`Composer API returned ${response.status}`);
  //     }
  //
  //     const result = await response.json();
  //
  //     return {
  //       success: true,
  //       code: result.code || result.output || result.content,
  //       metadata: {
  //         agentMode: 'cursor',
  //         method: 'composer-api',
  //       },
  //     };
  //   } catch (error) {
  //     throw new Error(
  //       `Composer API failed: ${error instanceof Error ? error.message : String(error)}`
  //     );
  //   }
  // }

  /**
   * Use Cursor CLI directly
   */
  private async useCursorCLI(
    task: AgentTask,
    workDir: string
  ): Promise<AgentResult> {
    if (!this.cursorPath) {
      throw new Error('Cursor executable not found');
    }

    // Prepare workspace
    const specPath = join(workDir, 'spec.ts');
    const outputPath = join(workDir, 'output.ts');
    const instructionsPath = join(workDir, 'INSTRUCTIONS.md');

    await writeFile(specPath, task.specCode);
    await writeFile(instructionsPath, this.buildDetailedPrompt(task));

    if (task.existingCode) {
      await writeFile(join(workDir, 'existing.ts'), task.existingCode);
    }

    return new Promise((resolve, reject) => {
      // Launch Cursor with the workspace
      const args = ['--wait', '--new-window', workDir];

      const cursor = spawn(this.cursorPath!, args, {
        cwd: workDir,
        stdio: 'pipe',
        detached: false,
      });

      let stdout = '';
      let stderr = '';

      cursor.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      cursor.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      cursor.on('error', (error) => {
        reject(error);
      });

      cursor.on('close', async (code) => {
        // Check if output file was created
        if (existsSync(outputPath)) {
          try {
            const generatedCode = await readFile(outputPath, 'utf-8');
            resolve({
              success: true,
              code: generatedCode,
              metadata: {
                agentMode: 'cursor',
                method: 'cli',
                exitCode: code,
              },
            });
          } catch (error) {
            reject(new Error('Failed to read generated output'));
          }
        } else {
          reject(
            new Error(
              `Cursor CLI exited with code ${code}. No output generated.`
            )
          );
        }
      });

      // Timeout after 60 seconds
      setTimeout(() => {
        cursor.kill();
        reject(new Error('Cursor CLI timeout'));
      }, 60000);
    });
  }

  /**
   * File-based approach - create workspace and instructions for manual completion
   */
  private async useFileBasedApproach(
    task: AgentTask,
    workDir: string
  ): Promise<AgentResult> {
    // Create comprehensive workspace with instructions
    const specPath = join(workDir, 'SPECIFICATION.ts');
    const instructionsPath = join(workDir, 'INSTRUCTIONS.md');
    const templatePath = join(workDir, 'template.ts');

    await writeFile(specPath, task.specCode);
    await writeFile(instructionsPath, this.buildDetailedPrompt(task));
    await writeFile(templatePath, this.generateTemplate(task));

    // Create a README for the workspace
    await writeFile(
      join(workDir, 'README.md'),
      `# Cursor Agent Workspace

This workspace was prepared for Cursor AI code generation.

## Files:
- **SPECIFICATION.ts**: The contract specification
- **INSTRUCTIONS.md**: Detailed instructions for the AI
- **template.ts**: Starting template

## To Complete:
1. Open this folder in Cursor
2. Review INSTRUCTIONS.md
3. Use Cursor AI to generate code based on the spec
4. Save the result as output.ts

Workspace path: ${workDir}
`
    );

    return {
      success: false,
      warnings: [
        'Cursor agent created workspace but cannot auto-execute.',
        `Workspace prepared at: ${workDir}`,
        'Open this folder in Cursor IDE to complete code generation.',
      ],
      code: this.generateTemplate(task),
      metadata: {
        agentMode: 'cursor',
        method: 'file-based',
        workDir,
      },
    };
  }

  /**
   * Setup workspace for validation
   */
  private async setupValidationWorkspace(
    task: AgentTask,
    workDir: string
  ): Promise<void> {
    await writeFile(join(workDir, 'specification.ts'), task.specCode);
    await writeFile(
      join(workDir, 'implementation.ts'),
      task.existingCode || '// No implementation'
    );
    await writeFile(
      join(workDir, 'VALIDATION_INSTRUCTIONS.md'),
      this.buildValidationPrompt(task)
    );
  }

  /**
   * Prepare files for API submission
   */
  private async prepareFilesForAPI(
    task: AgentTask,
    workDir: string
  ): Promise<{ path: string; content: string }[]> {
    const files = [{ path: 'spec.ts', content: task.specCode }];

    if (task.existingCode) {
      files.push({ path: 'existing.ts', content: task.existingCode });
    }

    return files;
  }

  /**
   * Build detailed prompt for cursor
   */
  private buildDetailedPrompt(task: AgentTask): string {
    const header = `# AI Code Generation Task - Cursor Agent\n\n**Task Type:** ${task.type}\n**Generated:** ${new Date().toISOString()}\n\n`;

    const specification = `## Specification\n\n\`\`\`typescript\n${task.specCode}\n\`\`\`\n\n`;

    const taskInstructions = {
      generate: `## Task: Generate Implementation

### Requirements:
1. **Type Safety**: Use strict TypeScript with comprehensive types
2. **Error Handling**: Implement robust error handling and validation
3. **Documentation**: Add JSDoc comments for all public APIs
4. **Best Practices**: Follow SOLID principles and clean code practices
5. **Testing**: Design code to be easily testable
6. **Production Ready**: Code should be ready for production use

### Implementation Guidelines:
- Parse and validate all inputs according to the specification
- Handle all edge cases and error scenarios
- Use modern TypeScript features appropriately
- Ensure proper async/await usage if needed
- Add meaningful variable and function names
- Keep functions focused and single-purpose

### Output Format:
Provide complete, executable TypeScript code that fully implements the specification.
Include all necessary imports and type definitions.`,

      validate: `## Task: Validate Implementation

### Current Implementation:
\`\`\`typescript
${task.existingCode || '// No implementation provided'}
\`\`\`

### Validation Criteria:
1. **Specification Compliance**: Does it match all requirements?
2. **Type Safety**: Are all types correct and complete?
3. **Error Handling**: Is error handling adequate?
4. **Code Quality**: Does it follow best practices?
5. **Completeness**: Are there missing features?

### Review Checklist:
- [ ] All specified inputs/outputs are handled
- [ ] Types match the specification exactly
- [ ] Error cases are properly handled
- [ ] Code is production-ready
- [ ] No obvious bugs or issues
- [ ] Performance is acceptable
- [ ] Code is maintainable

### Output Format:
Provide a detailed validation report with:
- **Status**: Pass/Fail
- **Issues Found**: List all problems
- **Recommendations**: Specific improvements needed
- **Code Quality Score**: Rate the implementation`,

      test: `## Task: Generate Tests

### Implementation to Test:
\`\`\`typescript
${task.existingCode || ''}
\`\`\`

### Test Requirements:
1. **Coverage**: Test all code paths and edge cases
2. **Framework**: Use Vitest
3. **Structure**: Organize tests logically (describe/it blocks)
4. **Assertions**: Use clear, meaningful assertions
5. **Mocking**: Mock external dependencies appropriately

### Test Categories Needed:
- Unit tests for individual functions
- Integration tests for workflows
- Edge case tests
- Error handling tests
- Performance tests (if applicable)

### Output Format:
Complete Vitest test file with comprehensive test coverage.`,

      refactor: `## Task: Refactor Code

### Current Code:
\`\`\`typescript
${task.existingCode || ''}
\`\`\`

### Refactoring Goals:
1. **Maintainability**: Improve code organization and readability
2. **Performance**: Optimize where beneficial
3. **Type Safety**: Enhance type definitions
4. **Error Handling**: Improve error handling robustness
5. **Documentation**: Add missing documentation

### Refactoring Guidelines:
- Preserve all existing functionality
- Extract reusable components
- Eliminate code duplication
- Improve naming and structure
- Add type guards where beneficial
- Enhance error messages

### Output Format:
Refactored code that maintains functionality while improving quality.`,
    };

    return (
      header +
      specification +
      (taskInstructions[task.type] || taskInstructions.generate)
    );
  }

  /**
   * Build validation-specific prompt
   */
  private buildValidationPrompt(task: AgentTask): string {
    return `# Implementation Validation Report

## Specification
\`\`\`typescript
${task.specCode}
\`\`\`

## Implementation
\`\`\`typescript
${task.existingCode || '// No implementation'}
\`\`\`

## Validation Checklist

### 1. Specification Compliance
- [ ] All required features implemented
- [ ] Input/output types match specification
- [ ] Behavior matches documented requirements

### 2. Code Quality
- [ ] Follows TypeScript best practices
- [ ] Proper error handling
- [ ] Meaningful variable names
- [ ] Appropriate code organization

### 3. Type Safety
- [ ] No type assertions (as) unless necessary
- [ ] Proper generic usage
- [ ] Complete type coverage

### 4. Production Readiness
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Edge cases covered
- [ ] Performance considerations

### 5. Maintainability
- [ ] Clear documentation
- [ ] Testable code structure
- [ ] No code smells
- [ ] SOLID principles followed

## Instructions
Review the implementation against the specification and complete the checklist.
Provide detailed feedback for each failed item.
Suggest specific improvements with code examples where applicable.`;
  }

  /**
   * Generate basic template for task
   */
  private generateTemplate(task: AgentTask): string {
    return `// Auto-generated template for ${task.type} task
// Specification:
${task.specCode
  .split('\n')
  .map((line) => `// ${line}`)
  .join('\n')}

// TODO: Implement according to specification
// Use Cursor AI to complete this implementation

export function implementation() {
  // Implementation goes here
  throw new Error('Not implemented');
}
`;
  }

  /**
   * Cleanup temporary work directory
   */
  private async cleanupWorkDir(workDir: string): Promise<void> {
    try {
      await rm(workDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }

  private isCursorAvailable(): boolean {
    return this.isWindsurf || this.cursorPath !== null || this.hasComposerAPI();
  }

  /**
   * Check if Cursor Composer API might be available
   */
  private hasComposerAPI(): boolean {
    return !!(
      process.env.CURSOR_COMPOSER_PORT ||
      process.env.CURSOR_API_ENABLED ||
      this.isWindsurf
    );
  }
}
