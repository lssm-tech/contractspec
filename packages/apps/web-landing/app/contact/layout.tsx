"use client";

import type React from "react";

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="pt-24 flex flex-col grow items-center justify-center">
      {children}
    </main>
  );
}
