import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'S3-Compatible Storage Integration: ContractSpec Docs',
//   description:
//     'Store and retrieve files with S3-compatible object storage in ContractSpec.',
// };

export default function S3IntegrationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">S3-Compatible Storage</h1>
        <p className="text-muted-foreground">
          Store files, images, and documents using any S3-compatible object
          storage service including AWS S3, Scaleway Object Storage, MinIO,
          DigitalOcean Spaces, and more.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Setup</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`# .env
S3_ENDPOINT=https://s3.fr-par.scw.cloud
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=my-bucket
S3_REGION=fr-par`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Uploading files</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`capabilityId: s3-upload
provider:
  type: s3
  operation: upload

inputs:
  key:
    type: string
    description: "File path in bucket"
  file:
    type: file
  contentType:
    type: string
    optional: true
  metadata:
    type: object
    optional: true

outputs:
  url:
    type: string
  etag:
    type: string`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Generating presigned URLs</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`capabilityId: s3-presigned-url
provider:
  type: s3
  operation: getPresignedUrl

inputs:
  key:
    type: string
  expiresIn:
    type: number
    default: 3600
    description: "Expiration in seconds"

outputs:
  url:
    type: string`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Use presigned URLs for secure, temporary access</li>
          <li>Set appropriate CORS policies for browser uploads</li>
          <li>Enable versioning for important files</li>
          <li>Use lifecycle policies to archive old files</li>
          <li>Organize files with a clear key structure</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations/qdrant" className="btn-ghost">
          Previous: Qdrant
        </Link>
        <Link href="/docs/integrations/twilio" className="btn-primary">
          Next: Twilio <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
