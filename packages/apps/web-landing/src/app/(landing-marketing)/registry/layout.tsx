import type { Metadata } from 'next';

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
