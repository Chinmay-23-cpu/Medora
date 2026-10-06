"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { doctorById, hospitalById } from "@/lib/providers";

export default function AppointmentsPage() {
  const { appointments } = useApp();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="serif text-4xl">Appointments</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Bookings are stored on this device for the prototype.
        </p>
      </header>
      {appointments.length === 0 ? (
        <div className="rounded-3xl bg-[var(--card)] p-8 text-sm text-[var(--muted)]">
          No appointments yet.{" "}
          <Link href="/specialists" className="text-[var(--accent)] underline">
            Choose a specialist
          </Link>
          .
        </div>
      ) : (
        <ul className="space-y-4">
          {appointments.map((a) => {
            const doctor = doctorById(a.doctorId);
            const hospital = hospitalById(a.hospitalId);
            return (
              <li
                key={a.id}
                className="rounded-3xl bg-[var(--card)] p-5 shadow-[var(--shadow)]"
              >
                <p className="text-xs uppercase tracking-wide text-[var(--accent)]">
                  {a.status}
                </p>
                <h2 className="serif mt-1 text-2xl">{doctor?.name ?? "Clinician"}</h2>
                <p className="text-sm text-[var(--muted)]">
                  {doctor?.specialty} · {hospital?.name}
                </p>
                <p className="mt-3 text-sm">
                  {new Date(a.datetime).toLocaleString()}
                </p>
                <p className="mt-2 text-sm leading-6">{a.reason}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
