import type { Metadata } from "next";
import { IBM_Plex_Sans, Fraunces } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const serif = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Medora — Imaging & Care Pathways",
  description:
    "Demo platform for brain, heart, and lung image review, triage summaries, and specialist booking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable} grain antialiased`}>
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
