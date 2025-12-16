export interface BuildOptions {
  outputDir?: string;
  provider?: string;
  model?: string;
  agentMode?: string;
  noTests?: boolean;
  noAgent?: boolean;
}

export type GenerationTarget = 'handler' | 'component' | 'form';

export type TestTarget = 'handler' | 'component';



