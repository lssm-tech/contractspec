export type SpecType = 'operation' | 'event' | 'presentation' | 'form' | 'feature';

export type OpKind = 'command' | 'query';

export type PresentationKind = 'web_component' | 'markdown' | 'data';

export type Stability = 'experimental' | 'beta' | 'stable' | 'deprecated';

export interface BaseSpecData {
  name: string;
  version: number;
  description: string;
  owners: string[];
  tags: string[];
  stability: Stability;
}

export interface OperationSpecData extends BaseSpecData {
  kind: OpKind;
  goal: string;
  context: string;
  hasInput: boolean;
  hasOutput: boolean;
  auth: 'anonymous' | 'user' | 'admin';
  flags: string[];
  emitsEvents: boolean;
}

export interface EventSpecData extends BaseSpecData {
  piiFields: string[];
}

export interface PresentationSpecData extends BaseSpecData {
  presentationKind: PresentationKind;
}

export interface FormSpecData extends BaseSpecData {
  // Form-specific data
}

export interface FeatureSpecData extends BaseSpecData {
  key: string;
  operations: Array<{ name: string; version: number }>;
  events: Array<{ name: string; version: number }>;
  presentations: Array<{ name: string; version: number }>;
}

export interface AIGenerationOptions {
  provider: 'claude' | 'openai' | 'ollama' | 'custom';
  model?: string;
  endpoint?: string;
  stream?: boolean;
}

export interface GenerationResult {
  code: string;
  filePath: string;
  specType: SpecType;
}

