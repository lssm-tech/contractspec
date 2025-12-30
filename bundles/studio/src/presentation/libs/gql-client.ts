import { type ExecutionResult } from 'graphql';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  API_URL_GQL,
  type TypedDocumentString,
} from '@contractspec/lib.gql-client-studio';
export {
  graphql,
  type TypedDocumentString,
} from '@contractspec/lib.gql-client-studio';
import type {
  DocumentTypeDecoration,
  ResultOf,
  VariablesOf,
} from '@graphql-typed-document-node/core';
import { authClient } from '../../presentation/providers/auth/client';

export const gqlRequest = async <TResult, TVariables>(
  document:
    | TypedDocumentString<TResult, TVariables>
    | DocumentTypeDecoration<TResult, TVariables>,
  variables: TVariables,
  headers: Record<string, string> = {}
): Promise<TResult> => {
  const fetchResponse = await fetch(API_URL_GQL, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: document.toString(),
      variables,
    }),
  });

  const gqlResponse = (await fetchResponse.json()) as ExecutionResult<TResult>;
  if (gqlResponse.errors) {
    throw new Error(
      gqlResponse.errors.map((error) => error.message).join(', ')
    );
  }
  return gqlResponse.data as TResult;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic constraint requires any
export const useGraphQL = <TDocument extends DocumentTypeDecoration<any, any>>(
  document: TDocument,
  variables: VariablesOf<TDocument>,
  options?: Omit<
    import('@tanstack/react-query').UseQueryOptions<ResultOf<TDocument>>,
    'queryKey' | 'queryFn'
  >
) => {
  const { data: sessionData } = authClient.useSession();

  return useQuery({
    ...options,
    enabled: !!sessionData?.session?.token,
    queryKey: [
      document,
      variables,
      sessionData?.session?.token
        ? `authenticated-${sessionData.session.userId}`
        : 'unauthenticated',
    ] as const,
    refetchOnMount: true,
    queryFn: async ({ queryKey }) => {
      const vars = queryKey[1] as VariablesOf<TDocument>;
      return gqlRequest(
        document,
        vars,
        sessionData?.session?.token
          ? { Authorization: `Bearer ${sessionData.session.token}` }
          : {}
      );
    },
  });
};

export const useGraphQLMutation = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic constraint requires any
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
      return gqlRequest(
        document,
        variables,
        sessionData?.session?.token
          ? { Authorization: `Bearer ${sessionData.session.token}` }
          : {}
      );
    },
  });
};
