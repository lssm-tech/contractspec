import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import {
  ChevronRight,
  FileCode,
  Scan,
  Settings,
  AlertCircle,
} from 'lucide-react';
import { StudioPrompt } from '../shared/StudioPrompt';

const supportedFrameworks = [
  {
    name: 'NestJS',
    flag: 'nestjs',
    description: 'Controllers, decorators, DTOs',
  },
  {
    name: 'Express',
    flag: 'express',
    description: 'Router methods, middleware',
  },
  {
    name: 'Fastify',
    flag: 'fastify',
    description: 'Route definitions, schemas',
  },
  {
    name: 'Hono',
    flag: 'hono',
    description: 'Route handlers, validators',
  },
  {
    name: 'Elysia',
    flag: 'elysia',
    description: 'Type-safe routes, schemas',
  },
  {
    name: 'tRPC',
    flag: 'trpc',
    description: 'Procedure definitions',
  },
  {
    name: 'Next.js',
    flag: 'next-api',
    description: 'API routes (app/api, pages/api)',
  },
];

export function GuideImportExistingCodebasesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Import Existing Codebases</h1>
        <p className="text-muted-foreground text-lg">
          Convert your existing API endpoints into ContractSpec contracts.
          Auto-detect frameworks, extract schemas, and generate spec-first
          definitions from your code.
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">What you'll learn</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>How to import existing API endpoints as ContractSpec contracts.</li>
          <li>Framework-specific patterns and auto-detection.</li>
          <li>Customizing imports with scopes, dry-run, and output options.</li>
          <li>Registering imported contracts and adding handlers.</li>
        </ul>
      </div>

      <div className="space-y-6">
        {/* Section 1: Why Import */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Why import existing code?</h2>
          <p className="text-muted-foreground text-sm">
            Instead of writing contracts from scratch, the import command
            extracts endpoint patterns from your existing codebase. This gives
            you:
          </p>
          <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
            <li>Instant spec coverage for existing APIs</li>
            <li>Type-safe schemas derived from your existing types</li>
            <li>A foundation to iterate and refine contracts</li>
            <li>Gradual adoption without rewriting code</li>
          </ul>
        </div>

        {/* Section 2: Supported Frameworks */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Supported frameworks</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {supportedFrameworks.map((fw) => (
              <div
                key={fw.flag}
                className="flex items-start gap-3 rounded-lg border border-white/10 p-4"
              >
                <FileCode className="text-violet-400" size={18} />
                <div className="space-y-1">
                  <h3 className="font-semibold">{fw.name}</h3>
                  <p className="text-muted-foreground text-xs">
                    {fw.description}
                  </p>
                  <code className="text-xs text-violet-400">--framework {fw.flag}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Quick Start */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">1) Quick start</h2>
          <p className="text-muted-foreground text-sm">
            Run the import command to auto-detect your framework and extract
            endpoints:
          </p>
          <CodeBlock
            language="bash"
            filename="import-quickstart"
            code={`# Auto-detect framework and import all endpoints
contractspec import ./src

# Preview what would be imported (dry-run)
contractspec import ./src --dry-run

# Force a specific framework
contractspec import ./src --framework nestjs`}
          />
          <p className="text-muted-foreground text-sm">
            Expected output: A summary of endpoints found, schemas extracted,
            and files generated.
          </p>
        </div>

        {/* Section 4: Framework Examples */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">2) Framework-specific patterns</h2>
          <p className="text-muted-foreground text-sm">
            The import command recognizes these patterns in each framework:
          </p>
        </div>

        {/* NestJS Example */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            <Scan size={18} className="text-blue-400" />
            NestJS
          </h3>
          <CodeBlock
            language="typescript"
            filename="src/users/users.controller.ts (before)"
            code={`@Controller('users')
export class UsersController {
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserDto> {
    return this.usersService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createUser(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(dto);
  }
}`}
          />
          <p className="text-muted-foreground text-sm">
            Detected: <code>@Controller</code>, <code>@Get</code>,{' '}
            <code>@Post</code>, <code>@Body</code>, <code>@Param</code>,{' '}
            <code>@UseGuards</code> decorators.
          </p>
        </div>

        {/* Express Example */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            <Scan size={18} className="text-green-400" />
            Express
          </h3>
          <CodeBlock
            language="typescript"
            filename="src/routes/users.ts (before)"
            code={`const router = express.Router();

router.get('/users/:id', async (req, res) => {
  const user = await getUserById(req.params.id);
  res.json(user);
});

router.post('/users', validateBody(CreateUserSchema), async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
});`}
          />
          <p className="text-muted-foreground text-sm">
            Detected: <code>router.get</code>, <code>router.post</code>,
            validation middleware, Zod schemas.
          </p>
        </div>

        {/* Next.js Example */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            <Scan size={18} className="text-purple-400" />
            Next.js API Routes
          </h3>
          <CodeBlock
            language="typescript"
            filename="app/api/users/[id]/route.ts (before)"
            code={`export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUserById(params.id);
  return Response.json(user);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await createUser(body);
  return Response.json(user, { status: 201 });
}`}
          />
          <p className="text-muted-foreground text-sm">
            Detected: <code>GET</code>, <code>POST</code> exports in{' '}
            <code>app/api/**/route.ts</code> and <code>pages/api/**/*.ts</code>.
          </p>
        </div>

        {/* Section 5: Generated Output */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">3) Understanding generated contracts</h2>
          <p className="text-muted-foreground text-sm">
            The import command generates ContractSpec operations with TODO
            placeholders for fields it cannot infer:
          </p>
          <CodeBlock
            language="typescript"
            filename=".contractspec/generated/users.operation.ts"
            code={`import { defineQuery, defineCommand } from "@contractspec/lib.contracts";
import { SchemaModel, ScalarTypeEnum } from "@contractspec/lib.schema";

export const GetUserQuery = defineQuery({
  meta: {
    key: "users.get",
    version: "1.0.0",
    description: "TODO: Add description",
    stability: "draft",
    owners: ["TODO"],
    tags: ["users"],
  },
  io: {
    input: new SchemaModel({
      name: "GetUserInput",
      fields: {
        id: { type: ScalarTypeEnum.String(), isOptional: false },
      },
    }),
    output: new SchemaModel({
      name: "GetUserOutput",
      fields: {
        // TODO: Add output fields based on your UserDto
        id: { type: ScalarTypeEnum.String(), isOptional: false },
      },
    }),
  },
  policy: { auth: "user" }, // Inferred from @UseGuards
  transport: {
    rest: { method: "GET", path: "/users/:id" },
  },
});

export const CreateUserCommand = defineCommand({
  meta: {
    key: "users.create",
    version: "1.0.0",
    description: "TODO: Add description",
    stability: "draft",
    owners: ["TODO"],
    tags: ["users"],
  },
  io: {
    input: new SchemaModel({
      name: "CreateUserInput",
      fields: {
        // TODO: Add fields from CreateUserDto
      },
    }),
    output: new SchemaModel({
      name: "CreateUserOutput",
      fields: {
        id: { type: ScalarTypeEnum.String(), isOptional: false },
      },
    }),
  },
  policy: { auth: "admin" },
  transport: {
    rest: { method: "POST", path: "/users" },
  },
});`}
          />
        </div>

        {/* Section 6: Command Options */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">4) Customizing imports</h2>
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-violet-400" />
            <h3 className="text-lg font-semibold">Available options</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-4 text-left">Option</th>
                  <th className="py-2 pr-4 text-left">Description</th>
                  <th className="py-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">
                    <code>--scope</code>
                  </td>
                  <td className="py-2 pr-4">Limit to specific directories</td>
                  <td className="py-2">
                    <code>--scope src/users src/auth</code>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">
                    <code>--framework</code>
                  </td>
                  <td className="py-2 pr-4">Force a specific framework</td>
                  <td className="py-2">
                    <code>--framework express</code>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">
                    <code>--output</code>
                  </td>
                  <td className="py-2 pr-4">Output directory</td>
                  <td className="py-2">
                    <code>--output ./contracts</code>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">
                    <code>--dry-run</code>
                  </td>
                  <td className="py-2 pr-4">Preview without writing files</td>
                  <td className="py-2">
                    <code>--dry-run</code>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">
                    <code>--analyze</code>
                  </td>
                  <td className="py-2 pr-4">Analysis only, no code generation</td>
                  <td className="py-2">
                    <code>--analyze</code>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <code>--json</code>
                  </td>
                  <td className="py-2 pr-4">Output as JSON for scripting</td>
                  <td className="py-2">
                    <code>--json</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <CodeBlock
            language="bash"
            filename="import-options"
            code={`# Import only specific modules
contractspec import ./src --scope src/users src/orders

# Preview with analysis
contractspec import ./src --dry-run --analyze

# Output to custom directory
contractspec import ./src --output ./src/contracts/generated

# Get JSON for CI/scripting
contractspec import ./src --json > import-result.json`}
          />
        </div>

        {/* Section 7: Registration */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">5) Registering imported contracts</h2>
          <p className="text-muted-foreground text-sm">
            After import, register contracts and add handlers:
          </p>
          <CodeBlock
            language="typescript"
            filename="src/contracts/registry.ts"
            code={`import {
  OperationSpecRegistry,
  installOp,
} from "@contractspec/lib.contracts/operations";
import {
  GetUserQuery,
  CreateUserCommand,
} from "./.contractspec/generated/users.operation";

export const registry = new OperationSpecRegistry();

// Add handlers to imported operations
installOp(registry, GetUserQuery, async (input) => {
  const user = await db.user.findUnique({ where: { id: input.id } });
  return user;
});

installOp(registry, CreateUserCommand, async (input) => {
  const user = await db.user.create({ data: input });
  return { id: user.id };
});`}
          />
        </div>

        {/* Section 8: Next Steps */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">6) After importing</h2>
          <ol className="text-muted-foreground list-decimal space-y-2 pl-5 text-sm">
            <li>
              <strong>Review generated contracts</strong> — Check the TODO
              placeholders and fill in descriptions, owners, and tags.
            </li>
            <li>
              <strong>Refine schemas</strong> — Add proper types, validation
              rules, and error definitions.
            </li>
            <li>
              <strong>Run validation</strong> —{' '}
              <code>contractspec validate</code> to ensure contracts are valid.
            </li>
            <li>
              <strong>Register and wire handlers</strong> — Connect contracts to
              your existing business logic.
            </li>
            <li>
              <strong>Iterate</strong> — The imported contracts are a starting
              point. Refine them as your spec matures.
            </li>
          </ol>
        </div>

        {/* Troubleshooting */}
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <AlertCircle size={20} className="text-yellow-400" />
            Troubleshooting
          </h2>
          <div className="space-y-4">
            <div className="card-subtle space-y-2 p-4">
              <h3 className="font-semibold">Framework not detected</h3>
              <p className="text-muted-foreground text-sm">
                Use <code>--framework &lt;name&gt;</code> to force a specific
                framework. Check that your entry files follow standard patterns.
              </p>
            </div>
            <div className="card-subtle space-y-2 p-4">
              <h3 className="font-semibold">Missing schemas</h3>
              <p className="text-muted-foreground text-sm">
                Schema inference works best with explicit types. If using{' '}
                <code>any</code> or dynamic types, you'll see TODO placeholders.
                Fill them in manually.
              </p>
            </div>
            <div className="card-subtle space-y-2 p-4">
              <h3 className="font-semibold">Partial imports</h3>
              <p className="text-muted-foreground text-sm">
                Some endpoints may not be detected if they use unconventional
                patterns. Use <code>--analyze</code> to see what was found, then
                add missing contracts manually.
              </p>
            </div>
          </div>
        </div>

        <StudioPrompt
          title="Want automated contract evolution?"
          body="Studio monitors your codebase and suggests contract updates when your API changes, keeping specs and code in sync."
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/docs/guides/spec-validation-and-typing"
          className="btn-primary"
        >
          Next: Spec validation + typing <ChevronRight size={16} />
        </Link>
        <Link href="/docs/guides" className="btn-ghost">
          Back to guides
        </Link>
      </div>
    </div>
  );
}
