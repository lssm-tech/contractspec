'use client';

import type React from 'react';
import { OpenWithAI } from '@/components/open-with-ai';
import { DocsNavSidebar } from '@/app/docs/DocsNavSidebar';
import {
  SidebarInset,
  SidebarProvider,
} from '@contractspec/lib.ui-kit-web/ui/sidebar';
import Footer from '@/components/footer';

export default function DocsShellClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DocsNavSidebar />

      <SidebarInset>
        <main className="flex-1 overflow-hidden">
          <div className="mx-auto px-4 py-8 md:px-8">
            <blockquote
              className="mb-4 border-l-2 border-muted-foreground/50 pl-4 text-sm text-muted-foreground not-italic"
              cite="https://www.contractspec.io/llms.txt"
            >
              For AI agents: Documentation index at /llms.txt
            </blockquote>
            <div className="float-right mb-4 flex justify-end">
              <OpenWithAI />
            </div>
            {children}
          </div>
        </main>

        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
