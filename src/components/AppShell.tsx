"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Calendar, LayoutDashboard, ScanLine, Stethoscope } from "lucide-react";

const links = [
  { href: "/", label: "Analyze", icon: ScanLine },
  { href: "/specialists", label: "Specialists", icon: Stethoscope },
  { href: "/appointments", label: "Appointments", icon: Calendar },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_88%,white)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent)] text-white">
              <Activity size={18} />
            </span>
            <span>
              <span className="serif block text-lg leading-none tracking-tight">Medora</span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                Imaging pathways
              </span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {links.map((l) => {
              const active = pathname === l.href;
              const Icon = l.icon;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ${
                    active
                      ? "bg-[var(--ink)] text-[var(--bg)]"
                      : "text-[var(--muted)] hover:bg-black/5"
                  }`}
                >
                  <Icon size={15} />
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      <footer className="mx-auto max-w-6xl px-5 pb-10 text-xs text-[var(--muted)]">
        Medora is a software prototype. It is not a medical device and must not be
        used for diagnosis, triage decisions, or treatment.
      </footer>
    </div>
  );
}
