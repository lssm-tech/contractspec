/**
 * Presentation descriptors for agent-console
 *
 * These define how data can be rendered across different targets (React, Markdown, JSON).
 */

// Agent presentations
export { AgentListPresentation, AgentDetailPresentation } from './agent-list';

// Run presentations
export {
  RunListPresentation,
  RunDetailPresentation,
  RunMetricsPresentation,
} from './run-list';

// Tool presentations
export {
  ToolRegistryPresentation,
  ToolDetailPresentation,
} from './tool-registry';

// Dashboard
export { AgentConsoleDashboardPresentation } from './dashboard';

// Re-export all presentations as an array for easy registration
import { AgentListPresentation, AgentDetailPresentation } from './agent-list';
import {
  RunListPresentation,
  RunDetailPresentation,
  RunMetricsPresentation,
} from './run-list';
import {
  ToolRegistryPresentation,
  ToolDetailPresentation,
} from './tool-registry';
import { AgentConsoleDashboardPresentation } from './dashboard';

export const AgentConsolePresentations = [
  AgentConsoleDashboardPresentation,
  AgentListPresentation,
  AgentDetailPresentation,
  RunListPresentation,
  RunDetailPresentation,
  RunMetricsPresentation,
  ToolRegistryPresentation,
  ToolDetailPresentation,
];
