export type LM = { x: number; y: number; z: number; visibility?: number };
export type Sample = { t: number; angle: number; vis: number };
export type ExerciseId = "squat" | "knee_ext" | "arm_raise";

// MediaPipe Pose landmark indices
const L = { shoulder: [11, 12], elbow: [13, 14], hip: [23, 24], knee: [25, 26], ankle: [27, 28] } as const;

function angle(a: LM, b: LM, c: LM) {
  const ab = Math.atan2(a.y - b.y, a.x - b.x);
  const cb = Math.atan2(c.y - b.y, c.x - b.x);
  let d = Math.abs(((ab - cb) * 180) / Math.PI);
  if (d > 180) d = 360 - d;
  return d;
}

function bestSide(p: LM[], ids: number[][]) {
  const score = (s: 0 | 1) => ids.reduce((acc, j) => acc + (p[j[s]].visibility ?? 0), 0) / ids.length;
  const l = score(0), r = score(1);
  return l >= r ? { s: 0 as const, vis: l } : { s: 1 as const, vis: r };
}

type Exercise = {
  id: ExerciseId;
  name: string;
  jointLabel: string;
  camera: string;
  instructions: string;
  // rep = angle goes past `enter` then returns past `exit`
  enterBelow: boolean;
  enter: number;
  exit: number;
  measure: (p: LM[], t: number) => Sample | null;
};

const MIN_VIS = 0.5;

export const EXERCISES: Record<ExerciseId, Exercise> = {
  squat: {
    id: "squat", name: "Bodyweight squat", jointLabel: "Knee angle", camera: "Side view, phone at hip height",
    instructions: "Stand side-on to the camera with your whole body visible. Perform slow, controlled squats to a depth your physiotherapist has approved.",
    enterBelow: true, enter: 120, exit: 155,
    measure: (p, t) => {
      const ids = [L.hip, L.knee, L.ankle] as unknown as number[][];
      const { s, vis } = bestSide(p, ids);
      if (vis < MIN_VIS) return null;
      return { t, vis, angle: angle(p[L.hip[s]], p[L.knee[s]], p[L.ankle[s]]) };
    },
  },
  knee_ext: {
    id: "knee_ext", name: "Seated knee extension", jointLabel: "Knee angle", camera: "Side view, seated on a stable chair",
    instructions: "Sit upright on a stable chair, side-on to the camera. Slowly straighten one knee, pause, and lower it. Ideal for elderly users.",
    enterBelow: false, enter: 145, exit: 115,
    measure: (p, t) => {
      const ids = [L.hip, L.knee, L.ankle] as unknown as number[][];
      const { s, vis } = bestSide(p, ids);
      if (vis < MIN_VIS) return null;
      return { t, vis, angle: angle(p[L.hip[s]], p[L.knee[s]], p[L.ankle[s]]) };
    },
  },
  arm_raise: {
    id: "arm_raise", name: "Shoulder flexion (arm raise)", jointLabel: "Shoulder angle", camera: "Side view, standing or seated",
    instructions: "Side-on to the camera, raise your straight arm forward and up as far as comfortable, then lower slowly.",
    enterBelow: false, enter: 110, exit: 50,
    measure: (p, t) => {
      const ids = [L.hip, L.shoulder, L.elbow] as unknown as number[][];
      const { s, vis } = bestSide(p, ids);
      if (vis < MIN_VIS) return null;
      return { t, vis, angle: angle(p[L.hip[s]], p[L.shoulder[s]], p[L.elbow[s]]) };
    },
  },
};

export type SessionResult = {
  at: number; exercise: ExerciseId; reliable: boolean; coverage: number;
  reps: number; minDeg: number; maxDeg: number; rangeDeg: number;
  avgRepSec: number | null; consistency: number | null; confidence: number; observations: string[];
};

export function summarize(id: ExerciseId, raw: Sample[], frames: number, duration: number): SessionResult {
  const ex = EXERCISES[id];
  const coverage = frames ? raw.length / frames : 0;
  const base = { at: Date.now(), exercise: id, coverage, reps: 0, minDeg: 0, maxDeg: 0, rangeDeg: 0, avgRepSec: null, consistency: null, confidence: 0, observations: [] };
  if (raw.length < 15 || coverage < 0.4) return { ...base, reliable: false };

  // light smoothing (moving average of 5)
  const s = raw.map((x, i) => {
    const w = raw.slice(Math.max(0, i - 2), i + 3);
    return { ...x, angle: w.reduce((a, b) => a + b.angle, 0) / w.length };
  });
  const angles = s.map((x) => x.angle);
  const min = Math.min(...angles), max = Math.max(...angles);

  // hysteresis rep counter, tracking peak angle of each rep
  const reps: { start: number; end: number; peak: number }[] = [];
  let inRep = false, start = 0, peak = 0;
  for (const x of s) {
    const entered = ex.enterBelow ? x.angle < ex.enter : x.angle > ex.enter;
    const exited = ex.enterBelow ? x.angle > ex.exit : x.angle < ex.exit;
    if (!inRep && entered) { inRep = true; start = x.t; peak = x.angle; }
    else if (inRep) {
      peak = ex.enterBelow ? Math.min(peak, x.angle) : Math.max(peak, x.angle);
      if (exited) { reps.push({ start, end: x.t, peak }); inRep = false; }
    }
  }
  const durs = reps.map((r) => r.end - r.start);
  const avgRep = durs.length ? durs.reduce((a, b) => a + b, 0) / durs.length : null;
  let consistency: number | null = null;
  if (reps.length >= 2) {
    const peaks = reps.map((r) => r.peak);
    const m = peaks.reduce((a, b) => a + b, 0) / peaks.length;
    const sd = Math.sqrt(peaks.reduce((a, b) => a + (b - m) ** 2, 0) / peaks.length);
    consistency = Math.max(0, Math.round(100 - sd * 4));
  }
  const vis = raw.reduce((a, b) => a + b.vis, 0) / raw.length;
  const confidence = Math.round(Math.min(1, vis) * Math.min(1, coverage) * 100);

  const obs: string[] = [];
  obs.push(`Analyzed ${duration.toFixed(1)}s of video; body landmarks were measurable in ${Math.round(coverage * 100)}% of frames.`);
  if (reps.length === 0) obs.push(`No complete repetitions matched this exercise's pattern. Check that the movement passes about ${ex.enter}° and returns past ${ex.exit}°.`);
  if (avgRep !== null && avgRep < 1.2) obs.push("Repetitions looked fast. Controlled, slower movement is usually easier to review.");
  if (consistency !== null) obs.push(consistency >= 80 ? "Repetition depth was fairly consistent across the set." : "Repetition depth varied noticeably between repetitions.");
  if (confidence < 60) obs.push("Confidence is limited — improve lighting and keep the whole body in frame for more reliable estimates.");
  obs.push("Recommended: share this session with your physiotherapist for professional review.");

  return {
    ...base, reliable: true, reps: reps.length, minDeg: Math.round(min), maxDeg: Math.round(max), rangeDeg: Math.round(max - min),
    avgRepSec: avgRep !== null ? Math.round(avgRep * 10) / 10 : null, consistency, confidence, observations: obs,
  };
}
