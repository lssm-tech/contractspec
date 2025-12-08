'use client';

import type React from 'react';
import { OpenWithAI } from '@/components/open-with-ai';
import { DocsNavSidebar } from '@/app/docs/DocsNavSidebar';
import { SidebarInset, SidebarProvider } from '@lssm/lib.ui-kit-web/ui/sidebar';
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from '@lssm/lib.ui-kit-web/ui/breadcrumb';
// import { Separator } from '@lssm/lib.ui-kit-web/ui/separator';
import Footer from '@/components/footer';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DocsNavSidebar />

      <SidebarInset>
        {/*<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">*/}
        {/*  <SidebarTrigger className="-ml-1" />*/}
        {/*  <Separator*/}
        {/*    orientation="vertical"*/}
        {/*    className="mr-2 data-[orientation=vertical]:h-4"*/}
        {/*  />*/}
        {/*  <Breadcrumb>*/}
        {/*    <BreadcrumbList>*/}
        {/*      <BreadcrumbItem className="hidden md:block">*/}
        {/*        <BreadcrumbLink href="#">*/}
        {/*          Building Your Application*/}
        {/*        </BreadcrumbLink>*/}
        {/*      </BreadcrumbItem>*/}
        {/*      <BreadcrumbSeparator className="hidden md:block" />*/}
        {/*      <BreadcrumbItem>*/}
        {/*        <BreadcrumbPage>Data Fetching</BreadcrumbPage>*/}
        {/*      </BreadcrumbItem>*/}
        {/*    </BreadcrumbList>*/}
        {/*  </Breadcrumb>*/}
        {/*</header>*/}

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
