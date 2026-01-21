import type { Metadata } from 'next';
import { deterministicCodegenBrief } from '@contractspec/bundle.library/components/docs/intent/intent-pages.docblocks';
import { SeoOptimizer } from '@contractspec/lib.content-gen/seo';
import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function DeterministicCodegenPage() {
  const seo = new SeoOptimizer();
  const metadata = seo.optimize(deterministicCodegenBrief);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">
          {deterministicCodegenBrief.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          {deterministicCodegenBrief.summary}
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Regeneration Challenges</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          {deterministicCodegenBrief.problems.map((problem, index) => (
            <li key={index}>{problem}</li>
          ))}
        </ul>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Deterministic Solutions</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          {deterministicCodegenBrief.solutions.map((solution, index) => (
            <li key={index}>{solution}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Protected Zones</h2>
          <p className="text-muted-foreground text-sm">
            Separate generated code from hand-written business logic with clear
            boundaries.
          </p>
          <CodeBlock
            language="typescript"
            filename="src/handlers/user-handlers.ts"
            code={`// Hand-written business logic (protected from regeneration)
export class UserService {
  async createUser(input: CreateUserInput): Promise<CreateUserOutput> {
    // Custom validation and business rules
    if (await this.emailExists(input.email)) {
      throw new Error('Email already exists');
    }
    
    // Persistence logic
    const user = await this.repository.create({
      email: input.email,
      name: input.name,
      password: await this.hashPassword(input.password),
    });
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    };
  }
  
  private async emailExists(email: string): Promise<boolean> {
    // Custom business validation
    return !!(await this.repository.findByEmail(email));
  }
}

// Generated handler wrapper (can be regenerated safely)
export const createUserHandler = wrapOperationHandler(
  UserService.prototype.createUser,
  {
    serviceName: 'UserService',
    operationName: 'createUser',
    errorMapper: mapToStandardErrors,
  }
);`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Incremental Regeneration</h2>
          <p className="text-muted-foreground text-sm">
            Regenerate only what changed while preserving custom logic.
          </p>
          <CodeBlock
            language="bash"
            filename="incremental-regen"
            code={`contractspec generate \\
  --incremental \\
  --preserve-zones ./src/handlers/*.ts \\
  --input ./src/contracts/ \\
  --output ./generated/`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Conflict Detection</h2>
          <p className="text-muted-foreground text-sm">
            Automatically detect and report conflicts during regeneration.
          </p>
          <CodeBlock
            language="bash"
            filename="check-conflicts"
            code={`contractspec generate \\
  --check-conflicts \\
  --report-conflicts ./conflicts.json`}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/docs/guides/generate-docs-clients-schemas"
          className="btn-primary"
        >
          Client Generation <ChevronRight size={16} />
        </Link>
        <Link
          href="/docs/intent/schema-validation-typescript"
          className="btn-ghost"
        >
          Type Safety
        </Link>
      </div>
    </div>
  );
}
