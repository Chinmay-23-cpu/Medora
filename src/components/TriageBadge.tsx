import type { TriageLevel } from "@/lib/types";

const styles: Record<TriageLevel, string> = {
  critical: "bg-[#fef3f2] text-[var(--critical)] border-[#fecdca]",
  urgent: "bg-[#fff6ed] text-[var(--urgent)] border-[#f9dbaf]",
  priority: "bg-[#eff8ff] text-[var(--priority)] border-[#b2ddff]",
  routine: "bg-[#ecfdf3] text-[var(--routine)] border-[#abefc6]",
};

const labels: Record<TriageLevel, string> = {
  critical: "Critical",
  urgent: "Urgent",
  priority: "Priority",
  routine: "Routine",
};

export function TriageBadge({ level }: { level: TriageLevel }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${styles[level]}`}
    >
      {labels[level]}
    </span>
  );
}
