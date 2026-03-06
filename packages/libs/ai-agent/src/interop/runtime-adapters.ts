import type { AgentSessionState } from '../types';

export type AgentRuntimeAdapterKey =
  | 'langgraph'
  | 'langchain'
  | 'workflow-devkit';

export interface AgentCheckpointEnvelope {
  sessionId: string;
  threadId?: string;
  state: AgentSessionState;
  checkpointId?: string;
  createdAt: Date;
}

export interface AgentCheckpointPort {
  save(envelope: AgentCheckpointEnvelope): Promise<void>;
  load(sessionId: string): Promise<AgentCheckpointEnvelope | null>;
  delete(sessionId: string): Promise<void>;
}

export interface AgentSuspendResumePort {
  suspend(params: {
    sessionId: string;
    reason: string;
    metadata?: Record<string, string>;
  }): Promise<void>;
  resume(params: {
    sessionId: string;
    input?: string;
    metadata?: Record<string, string>;
  }): Promise<void>;
}

export interface AgentRuntimeMiddlewareHooks<TState = unknown> {
  beforeModel?: (
    state: TState
  ) => Promise<TState | undefined> | TState | undefined;
  afterModel?: (
    state: TState
  ) => Promise<TState | undefined> | TState | undefined;
}

export interface AgentRuntimeAdapterBundle<TState = unknown> {
  key: AgentRuntimeAdapterKey;
  checkpoint?: AgentCheckpointPort;
  suspendResume?: AgentSuspendResumePort;
  middleware?: AgentRuntimeMiddlewareHooks<TState>;
}
