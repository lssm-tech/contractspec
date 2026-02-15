import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';
import { StudioPrompt } from '../shared/StudioPrompt';

export function GuideSpecValidationTypingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Spec-driven validation + typing</h1>
        <p className="text-muted-foreground text-lg">
          Define a single operation with SchemaModel, generate validation, and
          keep your existing handler logic.
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">What you'll build</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>One command spec with explicit input/output models.</li>
          <li>Validation + typing without rewriting your service layer.</li>
          <li>Clear acceptance scenarios for regression safety.</li>
        </ul>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">1) Define the spec</h2>
          <p className="text-muted-foreground text-sm">
            Create <code>src/contracts/contact-create.operation.ts</code>:
          </p>
          <CodeBlock
            language="typescript"
            filename="src/contracts/contact-create.operation.ts"
            code={`import { defineCommand } from "@contractspec/lib.contracts-spec/operations";
import { SchemaModel, ScalarTypeEnum } from "@contractspec/lib.schema";

const ContactInput = new SchemaModel({
  name: "ContactInput",
  fields: {
    email: { type: ScalarTypeEnum.Email(), isOptional: false },
    firstName: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    lastName: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
  },
});

const ContactOutput = new SchemaModel({
  name: "ContactOutput",
  fields: {
    id: { type: ScalarTypeEnum.String(), isOptional: false },
    email: { type: ScalarTypeEnum.Email(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ContactCreateCommand = defineCommand({
  meta: {
    key: "contact.create",
    version: "1.0.0",
    description: "Create a CRM contact",
    owners: ["@sales"],
    tags: ["crm", "contacts"],
  },
  io: {
    input: ContactInput,
    output: ContactOutput,
  },
  policy: {
    auth: "user",
  },
  acceptance: {
    scenarios: [
      {
        key: "create-contact",
        given: ["User is authenticated"],
        when: ["ContactCreateCommand executes"],
        then: ["Contact is persisted", "Email is validated"],
      },
    ],
  },
});`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">2) Wire the handler</h2>
          <p className="text-muted-foreground text-sm">
            Keep your existing code. Just ensure the handler returns the output
            shape defined above.
          </p>
          <CodeBlock
            language="typescript"
            filename="src/handlers/contact-create.ts"
            code={`import { ContactCreateCommand } from "@/contracts/contact-create.operation";
 
 export async function handleContactCreate(
   input: (typeof ContactCreateCommand)["io"]["input"],
   ctx: { userId: string }
 ) {
   // Your existing persistence logic
   return {
     id: "contact_123",
     email: input.email,
     createdAt: new Date().toISOString(),
   };
 }`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">3) Validate</h2>
          <CodeBlock
            language="bash"
            filename="spec-validation"
            code={`contractspec validate src/contracts/contact-create.operation.ts`}
          />
          <p className="text-muted-foreground text-sm">
            Expected output: <code>Validation passed</code>.
          </p>
        </div>

        <div className="card-subtle space-y-3 p-6">
          <h3 className="text-lg font-semibold">Example package</h3>
          <p className="text-muted-foreground text-sm">
            The CRM Pipeline example includes real specs, handlers, and
            presentations for contact + deal flows.
          </p>
          <CodeBlock
            language="bash"
            filename="crm-example"
            code={`# Build + validate the CRM pipeline example
cd packages/examples/crm-pipeline
bun install
bun run build
bun run validate`}
          />
        </div>

        <StudioPrompt
          title="Need shared validation policies?"
          body="Studio lets teams enforce validation policies and review changes before they ship."
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/docs/guides/generate-docs-clients-schemas"
          className="btn-primary"
        >
          Next: Generate docs + clients <ChevronRight size={16} />
        </Link>
        <Link href="/docs/guides" className="btn-ghost">
          Back to guides
        </Link>
      </div>
    </div>
  );
}
