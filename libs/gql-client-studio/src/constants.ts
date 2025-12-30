export const API_URL =
  process.env.NEXT_PUBLIC_STRIT_API_URL ??
  process.env.EXPO_PUBLIC_STRIT_API_URL ??
  '/api';
export const API_URL_GQL = `${API_URL}/graphql`;
