"use client";

import { use } from "react";
import Link from "next/link";
import { AnalysisResults } from "@/components/AnalysisResults";
import { useApp } from "@/context/AppContext";

export default function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { scans } = useApp();
  const scan = scans.find((s) => s.id === id);

  if (!scan) {
    return (
      <div className="rounded-3xl bg-[var(--card)] p-8">
        <h1 className="serif text-3xl">Report not found</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          This report is stored only in this browser.
        </p>
        <Link href="/dashboard" className="mt-4 inline-block text-sm text-[var(--accent)]">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link href="/dashboard" className="text-sm text-[var(--muted)]">
        ← Dashboard
      </Link>
      <AnalysisResults result={scan} />
    </div>
  );
}
