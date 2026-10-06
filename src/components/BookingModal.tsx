"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Doctor, Hospital } from "@/lib/types";

export function BookingModal({
  doctor,
  hospital,
  reason,
  onClose,
}: {
  doctor: Doctor;
  hospital: Hospital;
  reason: string;
  onClose: () => void;
}) {
  const { bookAppointment } = useApp();
  const router = useRouter();
  const [datetime, setDatetime] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [note, setNote] = useState(reason);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    bookAppointment({
      id: `appt-${Date.now()}`,
      doctorId: doctor.id,
      hospitalId: hospital.id,
      datetime: new Date(datetime).toISOString(),
      reason: note,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    });
    onClose();
    router.push("/appointments");
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl bg-[var(--card)] p-6 shadow-[var(--shadow)]"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="serif text-2xl">Book with {doctor.name}</h3>
            <p className="text-sm text-[var(--muted)]">{hospital.name}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <label className="mt-5 block text-sm">
          Date and time
          <input
            required
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-[var(--line)] bg-white px-3 py-2"
          />
        </label>
        <label className="mt-4 block text-sm">
          Reason
          <textarea
            required
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-[var(--line)] bg-white px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-[var(--accent)] py-2.5 text-sm text-white"
        >
          Confirm booking
        </button>
      </form>
    </div>
  );
}
