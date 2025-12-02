'use client';

import type React from 'react';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import DocsSidebar from '@/components/docs-sidebar';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed right-6 bottom-6 z-40 rounded-full bg-violet-500 p-3 text-white transition-colors hover:bg-violet-600 md:hidden"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="flex min-h-screen pt-24">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed z-30 transition-all duration-200 md:relative ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <DocsSidebar onItemClick={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="mx-auto px-4 py-8 md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
