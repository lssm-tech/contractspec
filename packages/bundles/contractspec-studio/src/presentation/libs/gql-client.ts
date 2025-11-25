import { type ExecutionResult } from 'graphql';
import { useMutation, useQuery } from '@tanstack/react-query';
import { API_URL_GQL } from '@lssm/lib.gql-client-contractspec-studio';
import type {
  DocumentTypeDecoration,
  ResultOf,
  VariablesOf,
} from '@graphql-typed-document-node/core';
import { authClient } from '../../presentation/providers/auth';

export const useGraphQL = <TDocument extends DocumentTypeDecoration<any, any>>(
  document: TDocument,
  ...[variables]: VariablesOf<TDocument> extends Record<string, never>
    ? []
    : [VariablesOf<TDocument>]
) => {
  const { data: sessionData } = authClient.useSession();

  return useQuery({
    queryKey: [
      document,
      // variables,
      sessionData?.session?.token
        ? `authenticated-${sessionData.session.userId}`
        : 'unauthenticated',
    ] as const,
    refetchOnMount: true,
    queryFn: async ({ queryKey }): Promise<ResultOf<TDocument>> => {
      const fetchResponse = await fetch(API_URL_GQL, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          ...(sessionData?.session?.token
            ? { Authorization: `Bearer ${sessionData.session.token}` }
            : {}),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: (queryKey[0] as any).toString(),
          variables,
        }),
      });

      const gqlResponse = (await fetchResponse.json()) as ExecutionResult<
        ResultOf<TDocument>
      >;
      if (gqlResponse.errors) {
        throw new Error(
          gqlResponse.errors.map((error) => error.message).join(', ')
        );
      }
      return gqlResponse.data as ResultOf<TDocument>;
    },
    // throwOnError: (response) => {
    //   console.error('gql error', response);
    //   return true;
    // },
  });
};

export const useGraphQLMutation = <
  TDocument extends DocumentTypeDecoration<any, any>,
>(
  document: TDocument
) => {
  const { data: sessionData } = authClient.useSession();

  return useMutation({
    mutationKey: [
      document,
      sessionData?.session?.token
        ? `authenticated-${sessionData.session.userId}`
        : 'unauthenticated',
    ] as const,
    mutationFn: async (variables: VariablesOf<TDocument>) => {
      const response = await fetch(API_URL_GQL, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          ...(sessionData?.session?.token
            ? { Authorization: `Bearer ${sessionData.session.token}` }
            : {}),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: document.toString(),
          variables,
        }),
      });

      const data = (await response.json()) as ExecutionResult<
        ResultOf<TDocument>
      >;
      if (data.errors) {
        throw new Error(data.errors.map((error) => error.message).join(', '));
      }
      return data.data as ResultOf<TDocument>;
    },
  });
};
