# @contractspec/lib.source-extractors

Extract contract candidates from TypeScript source code across multiple frameworks.

## Supported Frameworks

| Framework | Detection | Routes | Schemas | Status |
|-----------|-----------|--------|---------|--------|
| NestJS | ✅ | ✅ | ✅ | Ready |
| Express | ✅ | ✅ | ✅ | Ready |
| Fastify | ✅ | ✅ | ✅ | Ready |
| Hono | ✅ | ✅ | ✅ | Ready |
| Elysia | ✅ | ✅ | ✅ | Ready |
| tRPC | ✅ | ✅ | ✅ | Ready |
| Next.js API | ✅ | ✅ | ✅ | Ready |
| Zod Schemas | ✅ | N/A | ✅ | Ready |

## Installation

```bash
bun add @contractspec/lib.source-extractors
```

## Usage

```typescript
import { detectFramework, extractFromProject } from '@contractspec/lib.source-extractors';
import { registerAllExtractors } from '@contractspec/lib.source-extractors/extractors';
import { generateOperations } from '@contractspec/lib.source-extractors/codegen';

// Register all built-in extractors
registerAllExtractors();

// Detect frameworks in a project
const project = await detectFramework('./my-project', {
  readFile: (path) => fs.readFile(path, 'utf-8'),
  glob: (pattern) => glob(pattern),
});

// Extract contract candidates
const result = await extractFromProject(project, {
  scope: ['src/controllers'], // Optional: limit scope
});

if (result.success && result.ir) {
  console.log(`Found ${result.ir.endpoints.length} endpoints`);
  console.log(`Found ${result.ir.schemas.length} schemas`);

  // Generate ContractSpec code
  const files = generateOperations(result.ir, {
    outputDir: './generated',
    defaultAuth: 'user',
  });
}
```

## IR Schema

The Intermediate Representation (IR) provides a framework-agnostic view of extracted contracts:

```typescript
interface ImportIR {
  version: '1.0';
  extractedAt: string;
  project: ProjectInfo;
  endpoints: EndpointCandidate[];
  schemas: SchemaCandidate[];
  errors: ErrorCandidate[];
  events: EventCandidate[];
  ambiguities: Ambiguity[];
  stats: { ... };
}
```

## Confidence Levels

Each extracted item has a confidence score:

- **high**: Explicit schema found (Zod, class-validator, JSON Schema)
- **medium**: TypeScript types or framework decorators present
- **low**: Inferred from naming conventions or partial information
- **ambiguous**: Requires manual review

## License

MIT
