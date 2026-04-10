export interface TemplateApolloRuntime<TApolloClient> {
	graphql: {
		apollo: TApolloClient;
	};
}

export function getTemplateApolloClient<TApolloClient>(
	runtime: TemplateApolloRuntime<TApolloClient>
): TApolloClient {
	return runtime.graphql.apollo;
}
