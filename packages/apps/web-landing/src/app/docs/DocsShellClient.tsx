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
