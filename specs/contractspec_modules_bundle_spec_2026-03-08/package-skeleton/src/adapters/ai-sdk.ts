export interface AiSdkBundleAdapter {
	startThread(args: {
		plannerId: string;
		systemPrompt: string;
		tools: Record<string, unknown>;
	}): unknown;
}
