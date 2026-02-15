import type { Metadata } from 'next';
import { generateClientFromSchemaBrief } from '@contractspec/bundle.library/components/docs/intent/intent-pages.docblocks';
import { SeoOptimizer } from '@contractspec/lib.content-gen/seo';
import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = new SeoOptimizer().optimize(
  generateClientFromSchemaBrief
);

export function GenerateClientFromSchemaPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">
          {generateClientFromSchemaBrief.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          {generateClientFromSchemaBrief.summary}
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Client Development Problems</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          {generateClientFromSchemaBrief.problems.map((problem, index) => (
            <li key={index}>{problem}</li>
          ))}
        </ul>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Automated Solutions</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          {generateClientFromSchemaBrief.solutions.map((solution, index) => (
            <li key={index}>{solution}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Contract Definition</h2>
          <p className="text-muted-foreground text-sm">
            Define your API contract once, generate clients for any language.
          </p>
          <CodeBlock
            language="typescript"
            filename="src/contracts/api.contract.ts"
            code={`import { defineContract } from '@contractspec/lib.contracts-spec';
import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

export const ApiContract = defineContract({
  name: 'MyAPI',
  version: '1.0.0',
  baseUrl: 'https://api.example.com',
  operations: {
    getUsers: {
      goal: 'Retrieve paginated list of users',
      method: 'GET',
      path: '/users',
      input: new SchemaModel({
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        },
      }),
      output: new SchemaModel({
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', required: true },
                email: { type: 'string', required: true },
                name: { type: 'string', required: true },
              },
            },
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer', required: true },
              limit: { type: 'integer', required: true },
              total: { type: 'integer', required: true },
            },
          },
        },
      }),
    },
    createUser: {
      goal: 'Create a new user account',
      method: 'POST',
      path: '/users',
      input: new SchemaModel({
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', required: true },
          name: { type: 'string', minLength: 1, required: true },
        },
      }),
      output: new SchemaModel({
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          email: { type: 'string', required: true },
          name: { type: 'string', required: true },
          createdAt: { type: 'string', format: 'date-time', required: true },
        },
      }),
    },
  },
  metadata: {
    description: 'User management API with authentication',
    tags: ['users', 'authentication'],
  },
});`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Generate Multiple Clients</h2>
          <p className="text-muted-foreground text-sm">
            Generate type-safe clients for any language from the same contract.
          </p>
          <CodeBlock
            language="bash"
            filename="generate-clients"
            code={`# Generate all supported language clients
contractspec generate clients \\
  --contract ./src/contracts/api.contract.ts \\
  --output ./generated/clients \\
  --languages typescript,python,go,java,csharp

# Generate specific language client
contractspec generate clients \\
  --contract ./src/contracts/api.contract.ts \\
  --output ./generated/clients \\
  --languages typescript \\
  --format npm-package

# Options
# --with-types: Include TypeScript definitions
# --with-tests: Generate client test suites
# --with-docs: Include client documentation
# --framework: Use specific HTTP client framework`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Generated Client Examples</h2>
          <p className="text-muted-foreground text-sm">
            Each generated client is fully type-safe and idiomatic.
          </p>

          <div className="space-y-4">
            <div className="card-subtle p-4">
              <h4 className="text-lg font-semibold">TypeScript Client</h4>
              <CodeBlock
                language="typescript"
                filename="generated/clients/typescript/index.ts"
                code={`import { MyAPIClient } from './client';

const client = new MyAPIClient({
  baseUrl: 'https://api.example.com',
  apiKey: process.env.API_KEY,
});

// Type-safe method calls
const users = await client.getUsers({
  page: 1,
  limit: 10,
});

const newUser = await client.createUser({
  email: 'user@example.com',
  name: 'John Doe',
});

// Full type inference
// users: GetUsersResponse
// newUser: CreateUserResponse`}
              />
            </div>

            <div className="card-subtle p-4">
              <h4 className="text-lg font-semibold">Python Client</h4>
              <CodeBlock
                language="python"
                filename="generated/clients/python/index.py"
                code={`from myapi_client import MyAPIClient

client = MyAPIClient(
    base_url='https://api.example.com',
    api_key=os.getenv('API_KEY')
)

# Type-safe method calls
users = await client.get_users(
    page=1,
    limit=10
)

new_user = await client.create_user(
    email='user@example.com',
    name='John Doe'
)

# Full type hints
# users: GetUsersResponse
# new_user: CreateUserResponse`}
              />
            </div>

            <div className="card-subtle p-4">
              <h4 className="text-lg font-semibold">Go Client</h4>
              <CodeBlock
                language="go"
                filename="generated/clients/go/client.go"
                code={`package main

import (
    "context"
    "myapi_client"
)

func main() {
    client := myapi_client.NewMyAPIClient(
        myapi_client.WithBaseURL("https://api.example.com"),
        myapi_client.WithAPIKey(os.Getenv("API_KEY")),
    )
    
    // Type-safe method calls
    users, err := client.GetUsers(&myapi_client.GetUsersParams{
        Page: 1,
        Limit: 10,
    })
    
    newUser, err := client.CreateUser(&myapi_client.CreateUserParams{
        Email: "user@example.com",
        Name:  "John Doe",
    })
    
    // Full type checking at compile time
    // users: *GetUsersResponse
    // newUser: *CreateUserResponse
}`}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Advanced Features</h2>
          <p className="text-muted-foreground text-sm">
            Generated clients include enterprise-grade features out of the box.
          </p>
          <CodeBlock
            language="typescript"
            filename="client-features.ts"
            code={`// Advanced client features
const client = new MyAPIClient({
  baseUrl: 'https://api.example.com',
  apiKey: 'your-api-key',
  
  // Retry configuration
  retryConfig: {
    maxRetries: 3,
    backoffMultiplier: 2,
    maxDelay: 30000,
  },
  
  // Request/Response interceptors
  interceptors: {
    request: [(config) => {
      // Add authentication headers
      config.headers.Authorization = \`Bearer \${await getAuthToken()}\`;
      return config;
    }],
    response: [(response) => {
      // Log API calls
      console.log(\`API Call: \${response.config.method} \${response.config.url}\`);
      return response;
    }],
  },
  
  // Error handling
  errorHandler: (error) => {
    if (error.status === 401) {
      // Refresh token and retry
      return refreshTokenAndRetry(error.originalRequest);
    }
    throw error;
  },
});

// Automatic request deduplication
const user1 = client.getUser({ id: '123' });
const user2 = client.getUser({ id: '123' }); // Uses cached result

// Request cancellation
const controller = new AbortController();
const promise = client.getUsers({ page: 1, signal: controller.signal });
controller.abort(); // Cancels the request`}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/docs/guides/generate-docs-clients-schemas"
          className="btn-primary"
        >
          Client Generation Guide <ChevronRight size={16} />
        </Link>
        <Link href="/docs/intent/contract-first-api" className="btn-ghost">
          Contract-first API
        </Link>
      </div>
    </div>
  );
}
