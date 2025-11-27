import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us: ContractSpec",
  description:
    "Book a 15-minute call with our team to learn more about ContractSpec.",
  openGraph: {
    title: "Contact Us: ContractSpec",
    description: "Schedule a call with our team.",
    url: "https://contractspec.chaman.ventures/contact",
  },
  alternates: {
    canonical: "https://contractspec.chaman.ventures/contact",
  },
};

import ContactClient from "./contactClient";

export default function ContactPage() {
  return <ContactClient />;
}
