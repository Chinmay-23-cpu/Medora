import type { Organ } from "./types";

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

export function makeSampleStudy(organ: Organ): string {
  const w = 512;
  const h = 560;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const rand = mulberry32(organ === "brain" ? 42 : organ === "heart" ? 99 : 7);

  const g = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w * 0.7);
  g.addColorStop(0, "#9aa3ad");
  g.addColorStop(1, "#1a1d22");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#0b0d10";
  ctx.fillRect(0, 0, w, 28);
  ctx.fillRect(0, h - 28, w, 28);

  if (organ === "brain") {
    ctx.fillStyle = "#6f7782";
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, 170, 200, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8b93a0";
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, 120, 150, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c5ccd4";
    ctx.beginPath();
    ctx.ellipse(w / 2 - 30, h / 2 - 10, 28, 40, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d8dee6";
    ctx.beginPath();
    ctx.ellipse(w / 2 + 55, h / 2 + 20, 36, 32, -0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (organ === "heart") {
    ctx.fillStyle = "#2a313a";
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2 + 10, 190, 210, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7d868f";
    ctx.beginPath();
    ctx.ellipse(w / 2 + 30, h / 2 + 20, 110, 95, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#a8b0b8";
    ctx.beginPath();
    ctx.ellipse(w / 2 + 48, h / 2 + 8, 70, 58, 0.15, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = "#2c333c";
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2 + 20, 200, 220, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#88919c";
    ctx.beginPath();
    ctx.ellipse(w / 2 - 80, h / 2, 90, 160, 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w / 2 + 80, h / 2, 90, 160, -0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c4ccd4";
    ctx.beginPath();
    ctx.ellipse(w / 2 - 70, h / 2 + 30, 40, 50, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const img = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rand() - 0.5) * 22;
    img.data[i] = Math.max(0, Math.min(255, img.data[i] + n));
    img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n));
    img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);
  ctx.fillStyle = "#d6dde4";
  ctx.font = "12px sans-serif";
  ctx.fillText(`SAMPLE ${organ.toUpperCase()} STUDY — NOT A REAL PATIENT`, 16, h - 10);
  return canvas.toDataURL("image/png");
}
