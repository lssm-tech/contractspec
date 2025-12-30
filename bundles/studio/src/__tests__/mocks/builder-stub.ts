import type { AuthUser, Context } from '../../infrastructure/graphql/types';

/**
 * Represents the configuration passed to field resolvers in tests
 */
export interface FieldConfig {
  type?: unknown;
  args?: Record<string, unknown>;
  resolve: (
    parent: unknown,
    args: Record<string, unknown>,
    ctx: Context
  ) => Promise<unknown>;
}

/**
 * Field builder interface for queryFields and mutationFields callbacks
 */
export interface FieldBuilder {
  field: (config: FieldConfig) => FieldConfig;
  arg?: ArgBuilder;
  string?: (config?: Record<string, unknown>) => Record<string, unknown>;
  boolean?: (config?: Record<string, unknown>) => Record<string, unknown>;
  int?: (config?: Record<string, unknown>) => Record<string, unknown>;
}

/**
 * Argument builder interface
 */
export interface ArgBuilder {
  (config?: Record<string, unknown>): Record<string, unknown>;
  string: (config?: Record<string, unknown>) => Record<string, unknown>;
  boolean: (config?: Record<string, unknown>) => Record<string, unknown>;
  int?: (config?: Record<string, unknown>) => Record<string, unknown>;
}

/**
 * Input type field builder interface
 */
export interface InputFieldBuilder {
  string: (config?: Record<string, unknown>) => Record<string, unknown>;
  stringList: (config?: Record<string, unknown>) => Record<string, unknown>;
  field: (config?: Record<string, unknown>) => Record<string, unknown>;
  boolean: (config?: Record<string, unknown>) => Record<string, unknown>;
  int: (config?: Record<string, unknown>) => Record<string, unknown>;
}

/**
 * Typed stub for Pothos builder used in tests.
 * Captures field definitions so resolvers can be tested directly.
 */
export class BuilderStub {
  queryFieldsMap: Record<string, FieldConfig> = {};
  mutationFieldsMap: Record<string, FieldConfig> = {};

  enumType(): Record<string, unknown> {
    return {};
  }

  objectRef(): { implement: () => Record<string, unknown> } {
    return { implement: () => ({}) };
  }

  objectType(): Record<string, unknown> {
    return {};
  }

  inputType(
    _name: string,
    config?: { fields: (t: InputFieldBuilder) => Record<string, unknown> }
  ): Record<string, unknown> {
    if (config?.fields) {
      const fieldBuilder: InputFieldBuilder = {
        string: () => ({}),
        stringList: () => ({}),
        field: () => ({}),
        boolean: () => ({}),
        int: () => ({}),
      };
      config.fields(fieldBuilder);
    }
    return {};
  }

  private createHelpers(): FieldBuilder {
    const argFn = ((config?: Record<string, unknown>) => config) as ArgBuilder;
    argFn.string = (config?: Record<string, unknown>) => ({
      type: 'String',
      ...config,
    });
    argFn.boolean = (config?: Record<string, unknown>) => ({
      type: 'Boolean',
      ...config,
    });
    argFn.int = (config?: Record<string, unknown>) => ({
      type: 'Int',
      ...config,
    });
    return {
      field: (config: FieldConfig) => config,
      arg: argFn,
      string: argFn.string,
      boolean: argFn.boolean,
      int: argFn.int,
    };
  }

  queryFields(cb: (t: FieldBuilder) => Record<string, FieldConfig>): void {
    const fields = cb(this.createHelpers());
    Object.assign(this.queryFieldsMap, fields);
  }

  mutationFields(cb: (t: FieldBuilder) => Record<string, FieldConfig>): void {
    const fields = cb(this.createHelpers());
    Object.assign(this.mutationFieldsMap, fields);
  }
}

/**
 * Creates a partial mock user for testing
 */
export function createMockUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: 'user-test',
    email: 'test@example.com',
    name: 'Test User',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    image: null,
    locale: 'en',
    onboardingCompleted: false,
    banned: false,
    ...overrides,
  } as AuthUser;
}

/**
 * Creates a test context with optional overrides
 */
export function createTestContext(overrides: Partial<Context> = {}): Context {
  return {
    user: createMockUser(),
    session: null,
    organization: {
      id: 'org-e2e',
      name: 'E2E Test Organization',
      slug: 'e2e-org',
      createdAt: new Date(),
    } as Context['organization'],
    logger: console as unknown as Context['logger'],
    headers: new Headers(),
    featureFlags: {},
    ...overrides,
  };
}

/**
 * Creates an anonymous context without a user for testing auth requirements
 */
export function createAnonymousContext(): Context {
  return {
    user: null,
    session: null,
    organization: null,
    logger: console as unknown as Context['logger'],
    headers: new Headers(),
    featureFlags: {},
  };
}
