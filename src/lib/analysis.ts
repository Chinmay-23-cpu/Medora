import { hashImageData, loadImage, renderOverlays } from "./heatmap";
import type { AnalysisResult, Organ, TriageLevel } from "./types";

interface Condition {
  name: string;
  icdHint: string;
  triage: TriageLevel;
  triageReason: string;
  findings: string[];
  summary: (organLabel: string) => string;
  labels: string[];
  specialistFocus: string;
}

const BRAIN: Condition[] = [
  {
    name: "Possible intracranial hemorrhage",
    icdHint: "I61 — Intracerebral hemorrhage (suspected)",
    triage: "critical",
    triageReason: "Acute bleed patterns warrant immediate emergency evaluation.",
    findings: [
      "Hyperdense focus with surrounding hypoattenuation",
      "Mass effect toward midline structures",
      "Attention peaks in a focal intracranial region",
    ],
    labels: ["Hyperdense focus", "Mass effect"],
    specialistFocus: "Stroke / neurosurgery",
    summary: () =>
      "The model highlights a focal high-density region with neighboring mass effect. This pattern can be seen with intracranial hemorrhage. Immediate emergency assessment is recommended; this is not a diagnosis.",
  },
  {
    name: "Possible acute ischemic change",
    icdHint: "I63 — Cerebral infarction (suspected)",
    triage: "urgent",
    triageReason: "Time-sensitive stroke pathway if symptoms correlate.",
    findings: [
      "Asymmetric hypodensity in a vascular territory",
      "Loss of gray–white differentiation in the highlighted zone",
      "No definite extra-axial collection in this view",
    ],
    labels: ["Hypodense territory", "Cortical contrast loss"],
    specialistFocus: "Stroke neurology",
    summary: () =>
      "Asymmetric attenuation in a territory-like distribution raises concern for early ischemic change. Correlate with onset time and neurologic exam. Urgent specialist review is advised.",
  },
  {
    name: "Possible intracranial mass lesion",
    icdHint: "D43 — Neoplasm of uncertain behavior, brain (suspected)",
    triage: "priority",
    triageReason: "Space-occupying lesion needs planned but prompt work-up.",
    findings: [
      "Focal mass-like density with irregular margins",
      "Adjacent tissue displacement",
      "Secondary edema-like halo in the attention map",
    ],
    labels: ["Mass-like density", "Perilesional halo"],
    specialistFocus: "Neuro-oncology",
    summary: () =>
      "A mass-like region with surrounding attention halo is flagged. Differential includes neoplasm, abscess, or chronic hematoma. Contrast MRI and specialist review are typical next steps.",
  },
  {
    name: "No acute intracranial finding flagged",
    icdHint: "Z03.89 — Encounter for observation",
    triage: "routine",
    triageReason: "No high-urgency pattern in this demonstration analysis.",
    findings: [
      "Symmetric ventricular outlines",
      "No dominant hyperdense collection",
      "Low attention outside expected anatomy",
    ],
    labels: ["Reference anatomy", "Low-attention zone"],
    specialistFocus: "Neurology",
    summary: () =>
      "No high-urgency abnormality was emphasized. Subtle disease can still be present. A clinician should interpret the original study in clinical context.",
  },
];

const HEART: Condition[] = [
  {
    name: "Possible cardiomegaly",
    icdHint: "I51.7 — Cardiomegaly (suspected)",
    triage: "priority",
    triageReason: "Enlarged cardiac silhouette needs outpatient cardiology correlation.",
    findings: [
      "Increased cardiothoracic ratio appearance",
      "Left heart border prominence",
      "Attention concentrated on the cardiac silhouette",
    ],
    labels: ["Cardiac silhouette", "Left border"],
    specialistFocus: "Cardiology",
    summary: () =>
      "The cardiac contour appears enlarged relative to the thorax in this view. Causes include true cardiomegaly, pericardial effusion, or projection. Cardiology review and comparison films are suggested.",
  },
  {
    name: "Possible pulmonary venous congestion",
    icdHint: "I50 — Heart failure (suspected radiographic pattern)",
    triage: "urgent",
    triageReason: "Congestive pattern can indicate decompensated heart failure.",
    findings: [
      "Perihilar haze overlapping the lower lung fields",
      "Blurred vascular markings",
      "Cardiac silhouette prominence",
    ],
    labels: ["Perihilar haze", "Cardiac contour"],
    specialistFocus: "Heart failure cardiology",
    summary: () =>
      "Perihilar and lower-zone attention with an enlarged silhouette can be seen in pulmonary venous hypertension. Correlate with oxygen need, edema, and BNP. Urgent clinical assessment is appropriate if symptoms are present.",
  },
  {
    name: "Possible pericardial effusion pattern",
    icdHint: "I31.3 — Pericardial effusion (suspected)",
    triage: "urgent",
    triageReason: "Water-bottle morphology needs echo if clinically suspected.",
    findings: [
      "Globular cardiac contour",
      "Sharpened cardiophrenic angles in this projection",
      "Uniform silhouette enlargement",
    ],
    labels: ["Globular contour", "Cardiophrenic angle"],
    specialistFocus: "Cardiology",
    summary: () =>
      "A globular cardiac outline is highlighted. This can represent pericardial effusion. Echocardiography is the usual confirmatory test; seek urgent care if chest pain, dyspnea, or hypotension are present.",
  },
  {
    name: "Unremarkable cardiac silhouette",
    icdHint: "Z03.89 — Encounter for observation",
    triage: "routine",
    triageReason: "No high-risk cardiac contour pattern in this demo read.",
    findings: [
      "Cardiothoracic proportion within expected range for this view",
      "No large globular enlargement",
      "Limited extracardiac attention",
    ],
    labels: ["Normal contour", "Reference field"],
    specialistFocus: "Cardiology",
    summary: () =>
      "The silhouette is not flagged as enlarged. Projection and technique still limit interpretation. Use symptoms and ECG to decide if specialist review is needed.",
  },
];

const LUNG: Condition[] = [
  {
    name: "Possible pneumothorax",
    icdHint: "J93 — Pneumothorax (suspected)",
    triage: "critical",
    triageReason: "Suspected pneumothorax can be immediately life-threatening.",
    findings: [
      "Peripheral lucency without lung markings",
      "Possible visceral pleural line analog in the overlay",
      "Asymmetric lung-field attention",
    ],
    labels: ["Peripheral lucency", "Pleural line"],
    specialistFocus: "Pulmonary critical care",
    summary: () =>
      "A peripheral lucent zone without markings is highlighted. This pattern can indicate pneumothorax. If the patient is short of breath or hypoxic, treat as an emergency while awaiting a formal radiology read.",
  },
  {
    name: "Possible consolidation / pneumonia",
    icdHint: "J18 — Pneumonia, unspecified (suspected)",
    triage: "urgent",
    triageReason: "Focal opacity with clinical infection signs needs prompt treatment.",
    findings: [
      "Focal airspace opacity",
      "Air-bronchogram-like texture in the region of interest",
      "Unilateral dominance of the attention map",
    ],
    labels: ["Airspace opacity", "Bronchial markings"],
    specialistFocus: "Pulmonology",
    summary: () =>
      "Focal opacity with high model attention is consistent with consolidation, including pneumonia. Correlate with fever, cough, and oxygen saturation. Same-day clinical evaluation is recommended.",
  },
  {
    name: "Possible pulmonary nodule",
    icdHint: "R91.1 — Solitary pulmonary nodule (suspected)",
    triage: "priority",
    triageReason: "Nodules need interval imaging, not usually same-hour emergency care.",
    findings: [
      "Discrete rounded density",
      "Limited surrounding consolidation",
      "Focal high-attention island",
    ],
    labels: ["Nodule candidate", "Surrounding parenchyma"],
    specialistFocus: "Pulmonology / nodule clinic",
    summary: () =>
      "A discrete rounded density is marked. Nodules may be infectious, inflammatory, or neoplastic. Specialist follow-up and comparison with prior CTs (when available) are the usual next steps.",
  },
  {
    name: "Possible apical fibro-cavitary pattern",
    icdHint: "A15 — Respiratory tuberculosis (suspected pattern)",
    triage: "urgent",
    triageReason: "TB-pattern opacities need isolation decisions and specialist input.",
    findings: [
      "Upper-zone opacity with irregular texture",
      "Volume-loss-like crowding",
      "Asymmetric apical attention",
    ],
    labels: ["Apical opacity", "Volume loss"],
    specialistFocus: "Respiratory medicine",
    summary: () =>
      "Upper-zone irregular opacity can be seen in post-primary tuberculosis or chronic fungal disease. Public-health precautions depend on symptoms. Urgent pulmonology review is appropriate.",
  },
];

const CATALOG: Record<Organ, Condition[]> = {
  brain: BRAIN,
  heart: HEART,
  lung: LUNG,
};

function statsFromPixels(data: Uint8ClampedArray) {
  let sum = 0;
  let sumSq = 0;
  let n = 0;
  const step = 16;
  for (let i = 0; i < data.length; i += step) {
    const y = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    sum += y;
    sumSq += y * y;
    n += 1;
  }
  const mean = sum / n;
  const variance = Math.max(0, sumSq / n - mean * mean);
  return { mean, std: Math.sqrt(variance) };
}

export async function analyzeScan(
  imageDataUrl: string,
  organ: Organ,
): Promise<AnalysisResult> {
  const image = await loadImage(imageDataUrl);
  const probe = document.createElement("canvas");
  probe.width = Math.min(160, image.width);
  probe.height = Math.min(160, image.height);
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(image, 0, 0, probe.width, probe.height);
  const pixels = ctx.getImageData(0, 0, probe.width, probe.height);
  const seed = hashImageData(pixels.data);
  const { mean, std } = statsFromPixels(pixels.data);

  const list = CATALOG[organ];
  let idx = seed % list.length;
  if (std < 28 && list.length > 1) idx = list.length - 1;
  if (mean < 55) idx = 0;
  if (mean > 190 && organ === "lung") idx = 0;
  const condition = list[idx];

  const overlays = await renderOverlays(
    image,
    organ,
    seed,
    condition.labels,
  );

  const confidence = Math.min(
    0.93,
    0.58 + (std / 180) + ((seed % 17) / 100),
  );

  return {
    id: `scan-${Date.now()}-${seed.toString(16)}`,
    createdAt: new Date().toISOString(),
    organ,
    imageDataUrl,
    heatmapDataUrl: overlays.heatmapDataUrl,
    diseaseMapDataUrl: overlays.diseaseMapDataUrl,
    suspectedCondition: condition.name,
    icdHint: condition.icdHint,
    confidence,
    triage: condition.triage,
    triageReason: condition.triageReason,
    findings: condition.findings,
    clinicalSummary: condition.summary(organ),
    regions: overlays.regions,
    specialistFocus: condition.specialistFocus,
  };
}

export const organLabel: Record<Organ, string> = {
  brain: "Brain",
  heart: "Heart",
  lung: "Lung",
};
