import type { FindingRegion, Organ } from "./types";

const JET: [number, number, number][] = [
  [0, 0, 140],
  [0, 60, 255],
  [0, 200, 255],
  [40, 255, 140],
  [220, 255, 0],
  [255, 140, 0],
  [255, 20, 0],
];

function lerpColor(t: number): [number, number, number] {
  const x = Math.min(1, Math.max(0, t)) * (JET.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const a = JET[i];
  const b = JET[Math.min(i + 1, JET.length - 1)];
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ];
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashImageData(data: Uint8ClampedArray): number {
  let h = 2166136261;
  const step = Math.max(1, Math.floor(data.length / 40000));
  for (let i = 0; i < data.length; i += step * 4) {
    h ^= data[i] + data[i + 1] * 3 + data[i + 2] * 7;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function organBlobs(organ: Organ, rand: () => number): FindingRegion[] {
  const count = 2 + Math.floor(rand() * 2);
  const regions: FindingRegion[] = [];
  for (let i = 0; i < count; i++) {
    let cx = 0.35 + rand() * 0.3;
    let cy = 0.35 + rand() * 0.3;
    if (organ === "heart") {
      cx = 0.48 + rand() * 0.22;
      cy = 0.42 + rand() * 0.22;
    } else if (organ === "lung") {
      cx = rand() > 0.5 ? 0.28 + rand() * 0.16 : 0.56 + rand() * 0.16;
      cy = 0.3 + rand() * 0.35;
    } else {
      cx = 0.32 + rand() * 0.36;
      cy = 0.28 + rand() * 0.36;
    }
    const w = 0.16 + rand() * 0.14;
    const h = 0.14 + rand() * 0.14;
    regions.push({
      id: `r${i}`,
      label: "Region of interest",
      x: cx - w / 2,
      y: cy - h / 2,
      w,
      h,
      confidence: 0.62 + rand() * 0.32,
    });
  }
  return regions;
}

function gaussian(
  x: number,
  y: number,
  cx: number,
  cy: number,
  sx: number,
  sy: number,
) {
  const dx = (x - cx) / sx;
  const dy = (y - cy) / sy;
  return Math.exp(-0.5 * (dx * dx + dy * dy));
}

export async function renderOverlays(
  image: HTMLImageElement,
  organ: Organ,
  seed: number,
  labels: string[],
): Promise<{
  heatmapDataUrl: string;
  diseaseMapDataUrl: string;
  regions: FindingRegion[];
}> {
  const maxW = 720;
  const scale = Math.min(1, maxW / image.width);
  const w = Math.max(1, Math.round(image.width * scale));
  const h = Math.max(1, Math.round(image.height * scale));

  const src = document.createElement("canvas");
  src.width = w;
  src.height = h;
  const sctx = src.getContext("2d", { willReadFrequently: true });
  if (!sctx) throw new Error("Canvas unavailable");
  sctx.drawImage(image, 0, 0, w, h);
  const pixels = sctx.getImageData(0, 0, w, h);

  const rand = mulberry32(seed);
  const regions = organBlobs(organ, rand).map((r, i) => ({
    ...r,
    label: labels[i] ?? labels[0] ?? "Abnormality",
  }));

  const heat = document.createElement("canvas");
  heat.width = w;
  heat.height = h;
  const hctx = heat.getContext("2d");
  if (!hctx) throw new Error("Canvas unavailable");
  hctx.drawImage(src, 0, 0);
  const heatImg = hctx.getImageData(0, 0, w, h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const lum =
        (pixels.data[i] * 0.299 +
          pixels.data[i + 1] * 0.587 +
          pixels.data[i + 2] * 0.114) /
        255;
      let att = 0;
      for (const r of regions) {
        const cx = (r.x + r.w / 2) * w;
        const cy = (r.y + r.h / 2) * h;
        att += gaussian(x, y, cx, cy, r.w * w * 0.55, r.h * h * 0.55) * r.confidence;
      }
      att *= 0.55 + lum * 0.7;
      att = Math.min(1, att);
      const [cr, cg, cb] = lerpColor(att);
      const a = att * 0.72;
      heatImg.data[i] = Math.round(pixels.data[i] * (1 - a) + cr * a);
      heatImg.data[i + 1] = Math.round(pixels.data[i + 1] * (1 - a) + cg * a);
      heatImg.data[i + 2] = Math.round(pixels.data[i + 2] * (1 - a) + cb * a);
    }
  }
  hctx.putImageData(heatImg, 0, 0);

  const disease = document.createElement("canvas");
  disease.width = w;
  disease.height = h;
  const dctx = disease.getContext("2d");
  if (!dctx) throw new Error("Canvas unavailable");
  dctx.drawImage(src, 0, 0);
  dctx.lineWidth = Math.max(2, Math.round(w / 220));
  dctx.font = `${Math.max(12, Math.round(w / 42))}px "IBM Plex Sans", sans-serif`;

  regions.forEach((r, idx) => {
    const rx = r.x * w;
    const ry = r.y * h;
    const rw = r.w * w;
    const rh = r.h * h;
    dctx.strokeStyle = idx === 0 ? "#e11d48" : "#f59e0b";
    dctx.fillStyle = idx === 0 ? "rgba(225, 29, 72, 0.12)" : "rgba(245, 158, 11, 0.1)";
    dctx.beginPath();
    dctx.ellipse(rx + rw / 2, ry + rh / 2, rw / 2, rh / 2, 0, 0, Math.PI * 2);
    dctx.fill();
    dctx.stroke();
    const tag = `${r.label}  ${Math.round(r.confidence * 100)}%`;
    const pad = 6;
    const tw = dctx.measureText(tag).width;
    const ty = Math.max(18, ry - 8);
    dctx.fillStyle = idx === 0 ? "#9f1239" : "#92400e";
    dctx.fillRect(rx, ty - 16, tw + pad * 2, 22);
    dctx.fillStyle = "#fff";
    dctx.fillText(tag, rx + pad, ty);
  });

  return {
    heatmapDataUrl: heat.toDataURL("image/jpeg", 0.88),
    diseaseMapDataUrl: disease.toDataURL("image/jpeg", 0.88),
    regions,
  };
}

export function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read the image."));
    img.src = dataUrl;
  });
}
