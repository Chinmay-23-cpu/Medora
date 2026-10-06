import Link from "next/link";
import { TriageBadge } from "@/components/TriageBadge";
import { organLabel } from "@/lib/analysis";
import type { AnalysisResult } from "@/lib/types";

export function AnalysisResults({
  result,
  compact = false,
}: {
  result: AnalysisResult;
  compact?: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            {organLabel[result.organ]} study
          </p>
          <h2 className="serif mt-1 text-3xl">{result.suspectedCondition}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{result.icdHint}</p>
        </div>
        <div className="text-right">
          <TriageBadge level={result.triage} />
          <p className="mt-2 text-sm text-[var(--muted)]">
            Model confidence {Math.round(result.confidence * 100)}%
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <figure className="overflow-hidden rounded-3xl bg-[var(--card)] shadow-[var(--shadow)]">
          <img src={result.imageDataUrl} alt="Original scan" className="h-56 w-full object-cover" />
          <figcaption className="px-4 py-3 text-sm">Original</figcaption>
        </figure>
        <figure className="overflow-hidden rounded-3xl bg-[var(--card)] shadow-[var(--shadow)]">
          <img src={result.heatmapDataUrl} alt="Attention heatmap" className="h-56 w-full object-cover" />
          <figcaption className="px-4 py-3 text-sm">Heatmap — model attention</figcaption>
        </figure>
        <figure className="overflow-hidden rounded-3xl bg-[var(--card)] shadow-[var(--shadow)]">
          <img src={result.diseaseMapDataUrl} alt="Disease map" className="h-56 w-full object-cover" />
          <figcaption className="px-4 py-3 text-sm">Disease map — labeled regions</figcaption>
        </figure>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-3xl bg-[var(--card)] p-5 shadow-[var(--shadow)]">
          <h3 className="serif text-xl">Triage priority</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{result.triageReason}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {result.findings.map((f) => (
              <li key={f} className="border-t border-[var(--line)] pt-2">
                {f}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl bg-[var(--card)] p-5 shadow-[var(--shadow)]">
          <h3 className="serif text-xl">Clinical summary</h3>
          <p className="mt-3 text-sm leading-7">{result.clinicalSummary}</p>
          <p className="mt-4 text-xs text-[var(--muted)]">
            Suggested pathway: {result.specialistFocus}
          </p>
        </section>
      </div>

      {!compact && (
        <div className="flex flex-wrap gap-3">
          <Link
            href="/specialists"
            className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm text-white"
          >
            Find nearby specialists
          </Link>
          <Link
            href={`/reports/${result.id}`}
            className="rounded-full border border-[var(--line)] bg-[var(--card)] px-5 py-2.5 text-sm"
          >
            Open full report
          </Link>
        </div>
      )}
    </div>
  );
}
