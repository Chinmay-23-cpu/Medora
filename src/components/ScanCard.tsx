import Link from "next/link";
import { TriageBadge } from "@/components/TriageBadge";
import { organLabel } from "@/lib/analysis";
import type { AnalysisResult } from "@/lib/types";

export function ScanCard({ scan }: { scan: AnalysisResult }) {
  return (
    <Link
      href={`/reports/${scan.id}`}
      className="grid gap-3 rounded-3xl bg-[var(--card)] p-4 shadow-[var(--shadow)] md:grid-cols-[140px_1fr]"
    >
      <img
        src={scan.heatmapDataUrl}
        alt=""
        className="h-28 w-full rounded-2xl object-cover"
      />
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <TriageBadge level={scan.triage} />
          <span className="text-xs uppercase tracking-wide text-[var(--muted)]">
            {organLabel[scan.organ]}
          </span>
        </div>
        <h3 className="serif mt-2 text-lg">{scan.suspectedCondition}</h3>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {new Date(scan.createdAt).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
