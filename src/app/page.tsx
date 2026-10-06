"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { AnalysisResults } from "@/components/AnalysisResults";
import { useApp } from "@/context/AppContext";
import { analyzeScan, organLabel } from "@/lib/analysis";
import { makeSampleStudy } from "@/lib/sampleImage";
import type { Organ } from "@/lib/types";

const organs: Organ[] = ["brain", "heart", "lung"];

export default function HomePage() {
  const { saveScan, latestScan, scans } = useApp();
  const [organ, setOrgan] = useState<Organ>("lung");
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  async function runAnalysis() {
    if (!preview) return;
    setBusy(true);
    setError(null);
    try {
      const scan = await analyzeScan(preview, organ);
      saveScan(scan);
      setActiveId(scan.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="grid items-end gap-6 md:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            Brain · Heart · Lung
          </p>
          <h1 className="serif mt-2 text-4xl leading-tight md:text-5xl">
            Review a scan, see why the model looked there, then route care.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">
            Upload a de-identified radiograph or similar still image. Medora
            generates an attention heatmap, a labeled disease map, a triage
            band, and a clinical-style summary. Findings are simulated for
            this prototype.
          </p>
        </div>
        <aside className="rounded-3xl bg-[var(--ink)] p-5 text-[var(--bg)]">
          <p className="text-xs uppercase tracking-[0.16em] opacity-70">Safety</p>
          <p className="mt-2 text-sm leading-6">
            Do not use Medora in place of a radiologist or emergency care.
            If there is chest pain, sudden weakness, or severe breathlessness,
            seek emergency services immediately.
          </p>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="flex gap-2">
            {organs.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOrgan(o)}
                className={`rounded-full px-4 py-2 text-sm ${
                  organ === o
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--card)] text-[var(--muted)]"
                }`}
              >
                {organLabel[o]}
              </button>
            ))}
          </div>
          <ImageUploader onFile={setPreview} preview={preview} />
          <button
            type="button"
            disabled={!preview || busy}
            onClick={runAnalysis}
            className="w-full rounded-full bg-[var(--accent-2)] py-3 text-sm text-white disabled:opacity-40"
          >
            {busy ? "Generating overlays…" : "Run analysis"}
          </button>
          <button
            type="button"
            onClick={() => setPreview(makeSampleStudy(organ))}
            className="w-full rounded-full border border-[var(--line)] bg-[var(--card)] py-2.5 text-sm"
          >
            Load sample {organLabel[organ].toLowerCase()} study
          </button>
          {error && <p className="text-sm text-[var(--critical)]">{error}</p>}
        </div>
        <div>
          {(() => {
            const shown = scans.find((s) => s.id === activeId) ?? latestScan;
            return shown ? (
              <AnalysisResults result={shown} />
            ) : (
              <div className="flex h-full min-h-80 items-center rounded-3xl border border-[var(--line)] bg-[var(--card)] px-8 text-sm text-[var(--muted)]">
                Heatmap, disease map, triage, and summary will appear here after a
                scan is analyzed. Results are stored in your dashboard.
              </div>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
