/**
 * Agent Console Presentations - re-exports from domain modules for backward compatibility.
 */

// Agent presentations
export {
  AgentListPresentation,
  AgentDetailPresentation,
  AgentConsoleDashboardPresentation,
} from '../agent/agent.presentation';

// Run presentations
export {
  RunListPresentation,
  RunDetailPresentation,
} from '../run/run.presentation';
// Alias: RunMetricsPresentation -> RunDetailPresentation (for backward compatibility)
export { RunDetailPresentation as RunMetricsPresentation } from '../run/run.presentation';

// Tool presentations
export {
  ToolListPresentation,
  ToolDetailPresentation,
} from '../tool/tool.presentation';
// Alias: ToolRegistryPresentation -> ToolListPresentation (for backward compatibility)
export { ToolListPresentation as ToolRegistryPresentation } from '../tool/tool.presentation';
