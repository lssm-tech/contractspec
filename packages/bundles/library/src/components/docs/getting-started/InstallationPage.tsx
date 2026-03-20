import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function InstallationPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="font-bold text-4xl">Installation</h1>
				<p className="text-lg text-muted-foreground">
					Add ContractSpec to your existing Next.js or Bun project, or start
					fresh.
				</p>
			</div>

			<div className="space-y-6">
				<div className="space-y-3">
					<h2 className="font-bold text-2xl">Prerequisites</h2>
					<ul className="space-y-2 text-muted-foreground">
						<li>Node.js 20+ (or Bun 1.0+)</li>
						<li>Existing Next.js app or Bun HTTP server</li>
						<li>PostgreSQL database (for persistence)</li>
					</ul>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">Install Core Libraries</h2>
					<p className="text-muted-foreground">
						Add the contracts runtime and your choice of adapter:
					</p>
					<InstallCommand
						package={[
							'@contractspec/lib.contracts-spec',
							'@contractspec/lib.schema',
						]}
					/>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">For Next.js projects</h2>
					<InstallCommand package="@contractspec/lib.contracts-spec" />
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">For database models</h2>
					<InstallCommand
						package={[
							'@contractspec/app.cli-database',
							'prisma',
							'@prisma/client',
						]}
					/>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">Set up your project</h2>
					<p className="text-muted-foreground">
						Initialize a new ContractSpec project structure:
					</p>
					<CodeBlock
						language="bash"
						filename="installation-init"
						code={`bunx contractspec init
# Follow the interactive prompts to configure your project`}
					/>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">Initialize the database</h2>
					<p className="text-muted-foreground">
						If using Prisma, set up your schema and generate the client:
					</p>
					<CodeBlock
						language="bash"
						filename="installation-prisma"
						code={`bunx prisma init
# Edit prisma/schema.prisma with your models
bunx prisma generate
bunx prisma migrate dev --name init`}
					/>
				</div>

				<div className="flex items-center gap-4 pt-4">
					<Link
						href="/docs/getting-started/hello-world"
						className="btn-primary"
					>
						Next: First Operation <ChevronRight size={16} />
					</Link>
				</div>
			</div>
		</div>
	);
}
