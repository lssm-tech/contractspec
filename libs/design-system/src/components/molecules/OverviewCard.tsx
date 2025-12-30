'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@contractspec/lib.ui-kit-web/ui/dialog';

interface OverviewCardProps {
  title: string;
  summary: string;
  href: string;
  preview?: React.ReactNode;
  ctaLabel: string;
}

export function OverviewCard({
  title,
  summary,
  href,
  preview,
  ctaLabel,
}: OverviewCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-background/50 hover:bg-accent/40 rounded-md border p-4 text-left shadow-2xs transition">
          <div className="text-lg font-medium">{title}</div>
          <div className="text-foreground/80">{summary}</div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {preview}
          <div>
            <Link
              href={href}
              className="bg-primary text-primary-foreground inline-flex rounded-md px-4 py-2"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
