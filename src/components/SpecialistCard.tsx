"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { BookingModal } from "@/components/BookingModal";
import { formatDistance, haversineKm } from "@/lib/geo";
import { hospitalById } from "@/lib/providers";
import type { Doctor, UserProfile } from "@/lib/types";

export function SpecialistCard({
  doctor,
  profile,
  reason,
}: {
  doctor: Doctor;
  profile: UserProfile;
  reason: string;
}) {
  const [open, setOpen] = useState(false);
  const hospital = hospitalById(doctor.hospitalId);
  if (!hospital) return null;
  const km =
    profile.lat != null && profile.lng != null
      ? haversineKm(profile.lat, profile.lng, hospital.lat, hospital.lng)
      : null;

  return (
    <>
      <article className="flex flex-col rounded-3xl bg-[var(--card)] p-5 shadow-[var(--shadow)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="serif text-xl">{doctor.name}</h3>
            <p className="text-sm text-[var(--accent)]">{doctor.specialty}</p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm">
            <Star size={14} /> {doctor.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{doctor.bio}</p>
        <p className="mt-4 text-sm">
          {hospital.name}
          <span className="text-[var(--muted)]">
            {" "}
            · {hospital.city}
            {km != null ? ` · ${formatDistance(km)}` : ""}
          </span>
        </p>
        <p className="text-xs text-[var(--muted)]">{hospital.address}</p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          {doctor.years} yrs · {doctor.languages.join(", ")}
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-[var(--bg)]"
        >
          Book appointment
        </button>
      </article>
      {open && (
        <BookingModal
          doctor={doctor}
          hospital={hospital}
          reason={reason}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
