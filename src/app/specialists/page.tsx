"use client";

import { useMemo } from "react";
import { SpecialistCard } from "@/components/SpecialistCard";
import { useApp } from "@/context/AppContext";
import { haversineKm } from "@/lib/geo";
import { doctors, hospitals } from "@/lib/providers";

export default function SpecialistsPage() {
  const { profile, latestScan, updateProfile } = useApp();

  function locate() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      updateProfile({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }

  const ranked = useMemo(() => {
    const organ = latestScan?.organ;
    const withDistance = doctors
      .filter((d) => !organ || d.organ === organ)
      .map((d) => {
        const h = hospitals.find((x) => x.id === d.hospitalId);
        const km =
          h && profile.lat != null && profile.lng != null
            ? haversineKm(profile.lat, profile.lng, h.lat, h.lng)
            : 9999;
        return { doctor: d, km };
      })
      .sort((a, b) => a.km - b.km);
    return withDistance;
  }, [latestScan, profile.lat, profile.lng]);

  const nearbyHospitals = useMemo(() => {
    const organ = latestScan?.organ;
    return hospitals
      .filter((h) => !organ || h.departments.includes(organ))
      .map((h) => ({
        hospital: h,
        km:
          profile.lat != null && profile.lng != null
            ? haversineKm(profile.lat, profile.lng, h.lat, h.lng)
            : 9999,
      }))
      .sort((a, b) => a.km - b.km);
  }, [latestScan, profile.lat, profile.lng]);

  const reason = latestScan
    ? `${latestScan.suspectedCondition}. ${latestScan.clinicalSummary.slice(0, 180)}`
    : "General consultation";

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            Care routing
          </p>
          <h1 className="serif mt-1 text-4xl">Nearby specialists and hospitals</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
            Ranked from your saved location
            {profile.city ? ` (${profile.city})` : ""}.
            {latestScan
              ? ` Filtered for ${latestScan.organ} pathways after “${latestScan.suspectedCondition}”.`
              : " Analyze a scan first to focus the list, or browse all clinicians."}
          </p>
        </div>
        <button
          type="button"
          onClick={locate}
          className="rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-2 text-sm"
        >
          Use my location
        </button>
      </header>

      <section>
        <h2 className="serif text-2xl">Hospitals</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {nearbyHospitals.map(({ hospital, km }) => (
            <article
              key={hospital.id}
              className="rounded-3xl bg-[var(--card)] p-5 shadow-[var(--shadow)]"
            >
              <h3 className="serif text-xl">{hospital.name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {hospital.address} · {hospital.city}
                {km < 9000 ? ` · ${km.toFixed(1)} km` : ""}
              </p>
              <p className="mt-2 text-sm">{hospital.phone}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-[var(--accent)]">
                {hospital.departments.join(" · ")}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="serif text-2xl">Doctors</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {ranked.map(({ doctor }) => (
            <SpecialistCard
              key={doctor.id}
              doctor={doctor}
              profile={profile}
              reason={reason}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
