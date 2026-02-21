import type { Metadata } from 'next';

/**
 * Registry pages fetch from the external registry API server at runtime,
 * so they cannot be statically generated at build time.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'agentpacks Registry | ContractSpec',
  description:
    'Discover, share, and install agentpacks — reusable AI coding agent configurations for 20+ tools.',
};

export default function RegistryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
