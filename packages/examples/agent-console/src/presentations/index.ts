/**
 * Agent Console Presentations - re-exports from domain modules for backward compatibility.
 */

// Agent presentations
export {
	AgentConsoleDashboardPresentation,
	AgentDetailPresentation,
	AgentListPresentation,
} from '../agent/agent.presentation';
// Run presentations
// Alias: RunMetricsPresentation -> RunDetailPresentation (for backward compatibility)
export {
	RunDetailPresentation,
	RunDetailPresentation as RunMetricsPresentation,
	RunListPresentation,
} from '../run/run.presentation';
// Tool presentations
// Alias: ToolRegistryPresentation -> ToolListPresentation (for backward compatibility)
export {
	ToolDetailPresentation,
	ToolListPresentation,
	ToolListPresentation as ToolRegistryPresentation,
} from '../tool/tool.presentation';
