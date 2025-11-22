type HeaderInput = Headers | Record<string, string> | undefined;

interface AuthUser {
  id?: string;
  email?: string;
  organizationId?: string;
  [key: string]: unknown;
}

interface AuthSession {
  id?: string;
  organizationId?: string;
  [key: string]: unknown;
}

interface SessionResponse {
  user?: AuthUser | null;
  session?: AuthSession | null;
}

export const auth = {
  api: {
    async getSession(_: { headers?: HeaderInput }): Promise<SessionResponse | null> {
      return null;
    },
    async listUserAccounts(_: {
      headers?: HeaderInput;
    }): Promise<Array<{ providerId: string }>> {
      return [];
    },
    async unlinkAccount(_: {
      body: { providerId: string };
      headers?: HeaderInput;
    }): Promise<void> {
      return;
    },
  },
};

