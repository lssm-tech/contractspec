import type { ConnectContractRef } from './types';

export const CONTROL_PLANE_INTENT_SUBMIT_REF: ConnectContractRef = {
	key: 'controlPlane.intent.submit',
	version: '1.0.0',
	kind: 'command',
};

export const CONTROL_PLANE_PLAN_COMPILE_REF: ConnectContractRef = {
	key: 'controlPlane.plan.compile',
	version: '1.0.0',
	kind: 'command',
};

export const CONTROL_PLANE_PLAN_VERIFY_REF: ConnectContractRef = {
	key: 'controlPlane.plan.verify',
	version: '1.0.0',
	kind: 'command',
};

export const CONTROL_PLANE_TRACE_GET_REF: ConnectContractRef = {
	key: 'controlPlane.trace.get',
	version: '1.0.0',
	kind: 'query',
};

export const CONTROL_PLANE_POLICY_EXPLAIN_REF: ConnectContractRef = {
	key: 'controlPlane.policy.explain',
	version: '1.0.0',
	kind: 'query',
};

export const CONTROL_PLANE_EXECUTION_APPROVE_REF: ConnectContractRef = {
	key: 'controlPlane.execution.approve',
	version: '1.0.0',
	kind: 'command',
};

export const ACP_FS_ACCESS_REF: ConnectContractRef = {
	key: 'acp.fs.access',
	version: '1.0.0',
	kind: 'command',
};

export const ACP_TERMINAL_EXEC_REF: ConnectContractRef = {
	key: 'acp.terminal.exec',
	version: '1.0.0',
	kind: 'command',
};

export const AGENT_APPROVALS_REF: ConnectContractRef = {
	key: 'agent.approvals',
	version: '1.0.0',
	kind: 'command',
};
