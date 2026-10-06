import type { Hospital } from "./types";

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function nearestCity(
  lat: number,
  lng: number,
  hospitals: Hospital[],
): string {
  const cities = Array.from(
    new Map(
      hospitals.map((h) => [h.city, { lat: h.lat, lng: h.lng, city: h.city }]),
    ).values(),
  );
  let best = cities[0];
  let bestD = Infinity;
  for (const c of cities) {
    const d = haversineKm(lat, lng, c.lat, c.lng);
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best.city;
}
