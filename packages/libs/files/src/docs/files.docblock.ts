import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const filesDocBlocks: DocBlock[] = [
  {
    id: 'docs.files.attachments',
    title: 'Files, Versions & Attachments',
    summary:
      'Spec-first file management with storage adapters, versioning, presigned URLs, and polymorphic attachments for any entity.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/files/attachments',
    tags: ['files', 'attachments', 'storage', 'versions'],
    body: `## Capabilities

- **Entities**: File, FileVersion, Attachment, UploadSession with retention, checksum, ACLs.
- **Contracts**: upload/update/delete/list/get files; presigned upload/download; version create/list; attach/detach/list attachments.
- **Storage**: pluggable adapters (Local, S3 placeholder + interface), in-memory for tests.
- **Events**: file.uploaded/deleted, attachment.added/removed (see events export).

## Usage

1) Compose schema
- Include \`filesSchemaContribution\` in your schema composition.

2) Register contracts/events
- Import contracts and events from \`@lssm/lib.files\` in your spec registry.

3) Wire storage
- Provide a \`StorageAdapter\` implementation (local/in-memory or S3 via custom impl).
- Use \`createStorageAdapter\` with config to instantiate.

4) Attach to domain entities
- Use \`attachment.attach\` with \`entityType/entityId\` to link files to deals, orders, runs, etc.

## Example

${'```'}ts
import {
  UploadFileContract,
  AttachFileContract,
  InMemoryStorageAdapter,
} from '@lssm/lib.files';

// storage
const storage = new InMemoryStorageAdapter();

// upload
const file = await storage.upload({
  path: 'org-1/reports/r1.pdf',
  content: Buffer.from(pdfBytes),
  mimeType: 'application/pdf',
});

// attach
await AttachFileContract; // register in spec to enable attach flows
${'```'},

## Guardrails

- Enforce size/MIME limits in your handlers; avoid storing PII in paths.
- Keep \`orgId\` scoped for multi-tenant isolation; prefer presigned URLs for public delivery.
- Persist checksums for integrity; emit audit + events for access/retention changes.
`,
  },
];

registerDocBlocks(filesDocBlocks);
