import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CarbonProof AI",
    template: "%s | CarbonProof AI",
  },
  description:
    "Verifiable carbon evidence stored on Walrus, registered on Sui, and reviewed by AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
