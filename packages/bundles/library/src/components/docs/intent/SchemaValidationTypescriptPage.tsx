import type { Metadata } from 'next';
import { schemaValidationTypescriptBrief } from '@contractspec/bundle.library/components/docs/intent/intent-pages.docblocks';
import { SeoOptimizer } from '@contractspec/lib.content-gen/seo';
import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function SchemaValidationTypescriptPage() {
  const seo = new SeoOptimizer();
  const metadata = seo.optimize(schemaValidationTypescriptBrief);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">
          {schemaValidationTypescriptBrief.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          {schemaValidationTypescriptBrief.summary}
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Validation Pain Points</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          {schemaValidationTypescriptBrief.problems.map((problem, index) => (
            <li key={index}>{problem}</li>
          ))}
        </ul>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Type-safe Solutions</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          {schemaValidationTypescriptBrief.solutions.map((solution, index) => (
            <li key={index}>{solution}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Contract Schema</h2>
          <p className="text-muted-foreground text-sm">
            Define data models with automatic TypeScript generation.
          </p>
          <CodeBlock
            language="typescript"
            filename="src/contracts/user.schema.ts"
            code={`import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

export const UserSchema = new SchemaModel({
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      required: true,
      description: 'Unique user identifier',
    },
    email: {
      type: 'string',
      format: 'email',
      required: true,
      description: 'User email address',
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      required: true,
      description: 'Display name for the user',
    },
    role: {
      type: 'string',
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
      description: 'User role in the system',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      required: true,
      description: 'Account creation timestamp',
    },
  },
  required: ['id', 'email', 'name', 'createdAt'],
  metadata: {
    name: 'User',
    description: 'User account information',
  },
});`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Generated Types</h2>
          <p className="text-muted-foreground text-sm">
            TypeScript types are automatically generated with proper validation.
          </p>
          <CodeBlock
            language="typescript"
            filename="generated/types/user.ts"
            code={`// Auto-generated from UserSchema
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
}

// Auto-generated Zod schema for runtime validation
export const UserSchemaZod = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['user', 'admin', 'moderator']).default('user'),
  createdAt: z.string().datetime(),
});

// Generated validation utilities
export function validateUser(data: unknown): User {
  return UserSchemaZod.parse(data);
}

export function isUser(data: unknown): data is User {
  return UserSchemaZod.safeParse(data).success;
}`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Runtime Validation</h2>
          <p className="text-muted-foreground text-sm">
            Use generated validation in your API handlers with zero boilerplate.
          </p>
          <CodeBlock
            language="typescript"
            filename="src/handlers/user-handler.ts"
            code={`import { validateUser } from '../generated/types/user';

export async function createUserHandler(request: Request) {
  try {
    const input = validateUser(await request.json());
    
    // input is now fully typed as User
    const user = await db.users.create({
      data: {
        ...input,
        createdAt: new Date().toISOString(),
      },
    });
    
    return Response.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { 
          error: 'Validation failed',
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    throw error;
  }
}`}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/docs/guides/spec-validation-and-typing"
          className="btn-primary"
        >
          Type Safety Guide <ChevronRight size={16} />
        </Link>
        <Link
          href="/docs/intent/generate-client-from-schema"
          className="btn-ghost"
        >
          Client Generation
        </Link>
      </div>
    </div>
  );
}
