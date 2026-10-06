"use client";

import { useApp } from "@/context/AppContext";
import type { Gender } from "@/lib/types";

export function ProfileForm() {
  const { profile, updateProfile } = useApp();

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
      <label className="text-sm">
        Name
        <input
          value={profile.name}
          onChange={(e) => updateProfile({ name: e.target.value })}
          className="mt-1 w-full rounded-2xl border border-[var(--line)] bg-white px-3 py-2"
          placeholder="Full name"
        />
      </label>
      <label className="text-sm">
        Age
        <input
          value={profile.age}
          onChange={(e) => updateProfile({ age: e.target.value })}
          className="mt-1 w-full rounded-2xl border border-[var(--line)] bg-white px-3 py-2"
          placeholder="Years"
        />
      </label>
      <label className="text-sm">
        Gender
        <select
          value={profile.gender}
          onChange={(e) => updateProfile({ gender: e.target.value as Gender })}
          className="mt-1 w-full rounded-2xl border border-[var(--line)] bg-white px-3 py-2"
        >
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      </label>
      <label className="text-sm">
        City
        <input
          value={profile.city}
          onChange={(e) => updateProfile({ city: e.target.value })}
          className="mt-1 w-full rounded-2xl border border-[var(--line)] bg-white px-3 py-2"
        />
      </label>
      <label className="text-sm md:col-span-2">
        Address
        <input
          value={profile.address}
          onChange={(e) => updateProfile({ address: e.target.value })}
          className="mt-1 w-full rounded-2xl border border-[var(--line)] bg-white px-3 py-2"
          placeholder="Street, area"
        />
      </label>
    </form>
  );
}
