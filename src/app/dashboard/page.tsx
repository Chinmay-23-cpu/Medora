"use client";

import { useState } from "react";
import { ProfileForm } from "@/components/ProfileForm";
import { ScanCard } from "@/components/ScanCard";
import { useApp } from "@/context/AppContext";

export default function DashboardPage() {
  const { profile, history, scans, addHistory } = useApp();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          Patient workspace
        </p>
        <h1 className="serif mt-1 text-4xl">
          {profile.name ? `${profile.name}'s dashboard` : "Your dashboard"}
        </h1>
      </header>

      <section className="rounded-3xl bg-[var(--card)] p-6 shadow-[var(--shadow)]">
        <h2 className="serif text-2xl">Profile</h2>
        <p className="mb-4 mt-1 text-sm text-[var(--muted)]">
          Name, address, age, and gender used for specialist routing.
        </p>
        <ProfileForm />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-[var(--card)] p-6 shadow-[var(--shadow)]">
          <h2 className="serif text-2xl">Medical history</h2>
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim()) return;
              addHistory({
                id: `mh-${Date.now()}`,
                date: new Date().toISOString().slice(0, 10),
                title: title.trim(),
                detail: detail.trim(),
              });
              setTitle("");
              setDetail("");
            }}
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Condition or visit"
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-3 py-2 text-sm"
            />
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Notes"
              rows={2}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-[var(--bg)]"
            >
              Add entry
            </button>
          </form>
          <ul className="mt-5 space-y-3">
            {history.map((h) => (
              <li key={h.id} className="border-t border-[var(--line)] pt-3 text-sm">
                <p className="text-xs text-[var(--muted)]">{h.date}</p>
                <p className="font-medium">{h.title}</p>
                <p className="text-[var(--muted)]">{h.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="serif text-2xl">Scan history & previous reports</h2>
          <div className="mt-4 space-y-3">
            {scans.length === 0 ? (
              <p className="rounded-3xl bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
                No scans yet. Analyze an image on the home page.
              </p>
            ) : (
              scans.map((s) => <ScanCard key={s.id} scan={s} />)
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
