/**
 * Agent Orchestrator - Coordinates between different AI agents
 * Selects the appropriate agent based on config and task requirements
 */

import { SimpleAgent } from './simple-agent';
import { CursorAgent } from './cursor-agent';
import { ClaudeCodeAgent } from './claude-code-agent';
import { OpenAICodexAgent } from './openai-codex-agent';
import type { Config } from '../../utils/config';
import type { AgentMode, AgentProvider, AgentResult, AgentTask } from './types';
import chalk from 'chalk';
import ora from 'ora';

export class AgentOrchestrator {
  private agents: Map<AgentMode, AgentProvider>;
  private defaultAgent: AgentProvider;

  constructor(private config: Config) {
    // Initialize all available agents
    this.agents = new Map();

    const simpleAgent = new SimpleAgent(config);
    const cursorAgent = new CursorAgent();
    const claudeAgent = new ClaudeCodeAgent();
    const openaiAgent = new OpenAICodexAgent();

    this.agents.set('simple', simpleAgent);
    this.agents.set('cursor', cursorAgent);
    this.agents.set('claude-code', claudeAgent);
    this.agents.set('openai-codex', openaiAgent);

    this.defaultAgent = simpleAgent;
  }

  /**
   * Execute a task using the configured agent with fallback support
   */
  async executeTask(task: AgentTask): Promise<AgentResult> {
    const agentMode = this.getAgentMode();
    const agent = this.agents.get(agentMode);

    if (!agent) {
      console.log(
        chalk.yellow(`⚠️  Agent '${agentMode}' not found, using simple agent`)
      );
      return this.defaultAgent.generate(task);
    }

    // Check if agent can handle the task
    if (!agent.canHandle(task)) {
      console.log(
        chalk.yellow(
          `⚠️  Agent '${agentMode}' cannot handle this task, falling back to simple agent`
        )
      );
      return this.defaultAgent.generate(task);
    }

    // Try primary agent
    const spinner = ora(`Executing with ${agentMode} agent...`).start();

    try {
      const result =
        task.type === 'validate'
          ? await agent.validate(task)
          : await agent.generate(task);

      if (result.success) {
        spinner.succeed(
          chalk.green(`${agentMode} agent completed successfully`)
        );
        return result;
      }

      // If primary agent failed, try fallback
      spinner.warn(
        chalk.yellow(`${agentMode} agent failed, trying fallback...`)
      );

      const fallbackMode = this.getFallbackMode(agentMode);
      if (fallbackMode && fallbackMode !== agentMode) {
        const fallbackAgent = this.agents.get(fallbackMode);
        if (fallbackAgent && fallbackAgent.canHandle(task)) {
          return task.type === 'validate'
            ? await fallbackAgent.validate(task)
            : await fallbackAgent.generate(task);
        }
      }

      // Ultimate fallback to simple agent
      spinner.info(chalk.gray('Using simple agent as ultimate fallback'));
      return task.type === 'validate'
        ? await this.defaultAgent.validate(task)
        : await this.defaultAgent.generate(task);
    } catch (error) {
      spinner.fail(chalk.red('Agent execution failed'));

      // Fallback on error
      console.log(chalk.gray('Falling back to simple agent...'));
      return task.type === 'validate'
        ? await this.defaultAgent.validate(task)
        : await this.defaultAgent.generate(task);
    }
  }

  /**
   * Generate code from specification
   */
  async generate(specCode: string, targetPath?: string): Promise<AgentResult> {
    return this.executeTask({
      type: 'generate',
      specCode,
      targetPath,
    });
  }

  /**
   * Generate tests for implementation
   */
  async generateTests(
    specCode: string,
    implementationCode: string
  ): Promise<AgentResult> {
    return this.executeTask({
      type: 'test',
      specCode,
      existingCode: implementationCode,
    });
  }

  /**
   * Validate implementation against specification
   */
  async validate(
    specCode: string,
    implementationCode: string
  ): Promise<AgentResult> {
    return this.executeTask({
      type: 'validate',
      specCode,
      existingCode: implementationCode,
    });
  }

  /**
   * Refactor existing code
   */
  async refactor(specCode: string, existingCode: string): Promise<AgentResult> {
    return this.executeTask({
      type: 'refactor',
      specCode,
      existingCode,
    });
  }

  /**
   * List available agents and their status
   */
  async getAvailableAgents(): Promise<
    { mode: AgentMode; available: boolean; reason?: string }[]
  > {
    const results = [];

    for (const [mode, agent] of this.agents) {
      const testTask: AgentTask = {
        type: 'generate',
        specCode: 'test',
      };

      const canHandle = agent.canHandle(testTask);

      results.push({
        mode,
        available: canHandle,
        reason: canHandle
          ? undefined
          : 'Not configured or dependencies missing',
      });
    }

    return results;
  }

  /**
   * Get the configured agent mode
   */
  private getAgentMode(): AgentMode {
    // Check config for agent mode
    const mode = this.config.agentMode || 'simple';
    return mode;
  }

  /**
   * Get fallback mode for an agent
   */
  private getFallbackMode(mode: AgentMode): AgentMode {
    const fallbacks: Record<AgentMode, AgentMode> = {
      cursor: 'claude-code',
      'claude-code': 'openai-codex',
      'openai-codex': 'simple',
      simple: 'simple',
    };

    return fallbacks[mode];
  }
}
