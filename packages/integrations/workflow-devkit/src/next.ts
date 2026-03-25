import { withWorkflow } from 'workflow/next';

export function withContractSpecWorkflow<TNextConfig>(nextConfig: TNextConfig) {
	return withWorkflow(nextConfig as never) as TNextConfig;
}
