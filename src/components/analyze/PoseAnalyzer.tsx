import { useEffect, useRef, useState } from "react";
import { Camera, Upload, Play, Trash2, Square, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { EXERCISES, type ExerciseId, summarize, type SessionResult, type Sample } from "@/lib/movement";

type Landmarker = { detectForVideo: (v: HTMLVideoElement, t: number) => { landmarks: { x: number; y: number; z: number; visibility?: number }[][] } };

const WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.0/wasm";
const MODEL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
const STORE = "physiomatics.sessions.v1";
const MAX_MB = 100;

export function PoseAnalyzer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef<HTMLVideoElement>(null);
  const lmRef = useRef<Landmarker | null>(null);
  const drawRef = useRef<{ utils: any; connections: any } | null>(null);
  const tsRef = useRef(0);
  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [exercise, setExercise] = useState<ExerciseId>("squat");
  const [consent, setConsent] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "analyzing" | "recording" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [liveAngle, setLiveAngle] = useState<number | null>(null);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [history, setHistory] = useState<SessionResult[]>([]);

  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem(STORE) || "[]")); } catch { /* ignore */ }
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const ex = EXERCISES[exercise];

  async function ensureModel() {
    if (lmRef.current) return lmRef.current;
    const v = await import("@mediapipe/tasks-vision");
    const fileset = await v.FilesetResolver.forVisionTasks(WASM);
    const lm = await v.PoseLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL, delegate: "GPU" },
      runningMode: "VIDEO",
      numPoses: 1,
    });
    lmRef.current = lm as unknown as Landmarker;
    drawRef.current = { utils: v.DrawingUtils, connections: v.PoseLandmarker.POSE_CONNECTIONS };
    return lmRef.current;
  }

  function onFile(f?: File) {
    setError(null); setResult(null);
    if (!f) return;
    if (!f.type.startsWith("video/")) return setError("Please choose a video file (MP4, WebM or MOV).");
    if (f.size > MAX_MB * 1024 * 1024) return setError(`Video is larger than ${MAX_MB} MB. Please trim it and try again.`);
    setSrc(URL.createObjectURL(f));
  }

  async function startRecording() {
    setError(null); setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: false });
      streamRef.current = stream;
      setStatus("recording");
      requestAnimationFrame(() => { if (liveRef.current) { liveRef.current.srcObject = stream; liveRef.current.play(); } });
      const chunks: Blob[] = [];
      const rec = new MediaRecorder(stream);
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setSrc(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || "video/webm" })));
        setStatus("idle");
      };
      rec.start();
      recRef.current = rec;
    } catch {
      setError("Camera access was blocked or isn't available. You can upload a video instead.");
      setStatus("idle");
    }
  }

  async function analyze() {
    const video = videoRef.current, canvas = canvasRef.current;
    if (!video || !canvas || !src) return;
    setError(null); setResult(null); setStatus("loading");
    let lm: Landmarker;
    try { lm = await ensureModel(); } catch {
      setStatus("idle");
      return setError("The movement model couldn't load. Check your connection and try again.");
    }
    setStatus("analyzing");
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    const D = drawRef.current!;
    const draw = new D.utils(ctx);
    const samples: Sample[] = [];
    let frames = 0;
    video.currentTime = 0; video.muted = true;
    await video.play();

    await new Promise<void>((resolve) => {
      const step = () => {
        if (video.ended || video.paused) return resolve();
        frames++;
        tsRef.current = Math.max(tsRef.current + 1, performance.now());
        const res = lm.detectForVideo(video, tsRef.current);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const pose = res.landmarks[0];
        if (pose) {
          draw.drawConnectors(pose, D.connections, { color: "#5fb3b3", lineWidth: 4 });
          draw.drawLandmarks(pose, { color: "#e8835a", radius: 4 });
          const s = ex.measure(pose, video.currentTime);
          if (s) { samples.push(s); setLiveAngle(Math.round(s.angle)); }
        }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });

    const r = summarize(exercise, samples, frames, video.duration);
    setResult(r); setStatus("done");
    if (r.reliable) {
      const next = [...history, r].slice(-30);
      setHistory(next); localStorage.setItem(STORE, JSON.stringify(next));

      // Sync completed movement telemetry to Google Sheet
      sendToGoogleSheet({
        action: "exercise_analysis",
        form_type: "movement_session",
        exercise: r.exercise,
        reps: r.reps,
        rangeDeg: r.rangeDeg,
        confidencePct: Math.round(r.confidence * 100),
        durationSec: Math.round(r.durationSec),
        peakAngleDeg: r.peakAngleDeg,
        reliable: r.reliable,
      }).catch(err => console.error("Google Sheets exercise sync error:", err));
    }
  }

  function reset() {
    if (src) URL.revokeObjectURL(src);
    setSrc(null); setResult(null); setLiveAngle(null); setStatus("idle");
    canvasRef.current?.getContext("2d")?.clearRect(0, 0, 9999, 9999);
  }

  function clearHistory() { localStorage.removeItem(STORE); setHistory([]); }

  const chartData = history.filter((h) => h.exercise === exercise).map((h, i) => ({ s: `#${i + 1}`, range: h.rangeDeg, reps: h.reps }));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="grid gap-6">
        <div className="rounded-3xl border bg-card p-5 shadow-soft">
          <div className="text-sm font-semibold">1. Choose the prescribed exercise</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {Object.values(EXERCISES).map((e) => (
              <button key={e.id} onClick={() => { setExercise(e.id); setResult(null); }} aria-pressed={exercise === e.id}
                className={`rounded-2xl border p-4 text-left transition ${exercise === e.id ? "border-primary bg-primary-soft" : "hover:bg-muted"}`}>
                <div className="font-semibold">{e.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{e.camera}</div>
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{ex.instructions}</p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-soft">
          <div className="text-sm font-semibold">2. Record or upload a video</div>
          <label className="mt-3 flex items-start gap-3 rounded-2xl bg-muted p-4 text-sm">
            <input type="checkbox" className="mt-1 size-4 accent-primary" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span><ShieldCheck className="mr-1 inline size-4 text-primary" />I understand the video is processed <strong>only in this browser</strong> — it is not uploaded — and that results are estimates for discussion with a physiotherapist, not a diagnosis.</span>
          </label>

          {status === "recording" ? (
            <div className="mt-4 grid gap-3">
              <video ref={liveRef} muted playsInline className="w-full rounded-2xl bg-ink" />
              <Button variant="destructive" onClick={() => recRef.current?.stop()}><Square /> Stop recording</Button>
            </div>
          ) : !src ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <Button disabled={!consent} onClick={startRecording}><Camera /> Record with camera</Button>
              <Button asChild variant="outline" disabled={!consent}>
                <label className={consent ? "" : "pointer-events-none opacity-50"}>
                  <Upload /> Upload video
                  <input type="file" accept="video/*" className="sr-only" disabled={!consent} onChange={(e) => onFile(e.target.files?.[0])} />
                </label>
              </Button>
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              <div className="relative overflow-hidden rounded-2xl bg-ink">
                <video ref={videoRef} src={src} playsInline controls={status !== "analyzing"} className="w-full" />
                <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
                {liveAngle !== null && status === "analyzing" && (
                  <div className="absolute left-3 top-3 rounded-full bg-card/90 px-3 py-1 text-sm font-semibold">{ex.jointLabel}: {liveAngle}°</div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="hero" onClick={analyze} disabled={status === "analyzing" || status === "loading"}>
                  {status === "loading" ? <><Loader2 className="animate-spin" /> Loading model…</> : status === "analyzing" ? <><Loader2 className="animate-spin" /> Analyzing…</> : <><Play /> Analyze movement</>}
                </Button>
                <Button variant="outline" onClick={reset} disabled={status === "analyzing"}><Trash2 /> Delete & retry</Button>
              </div>
            </div>
          )}
          {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
        </div>

        {result && (
          <div className="rounded-3xl border bg-card p-6 shadow-soft animate-rise">
            <div className="text-sm font-semibold">3. Results — {ex.name}</div>
            {!result.reliable ? (
              <div className="mt-4 flex gap-3 rounded-2xl bg-muted p-4 text-sm">
                <AlertTriangle className="size-5 shrink-0 text-warning" />
                <div>The body wasn't visible clearly enough to measure reliably ({Math.round(result.coverage * 100)}% of frames usable). No metrics are shown. Try: {ex.camera.toLowerCase()}, full body in frame, good light.</div>
              </div>
            ) : (
              <>
                <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {[
                    ["Repetitions", `${result.reps}`],
                    [`${ex.jointLabel} range`, `${result.rangeDeg}°`],
                    ["Min / max angle", `${result.minDeg}° / ${result.maxDeg}°`],
                    ["Avg rep duration", result.avgRepSec ? `${result.avgRepSec}s` : "—"],
                    ["Rep consistency", result.consistency !== null ? `${result.consistency}%` : "—"],
                    ["Analysis confidence", `${result.confidence}%`],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-2xl bg-muted p-4">
                      <dt className="text-xs text-muted-foreground">{k}</dt>
                      <dd className="mt-1 font-display text-2xl">{v}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="mt-5 grid gap-2 text-sm">
                  {result.observations.map((o) => <li key={o} className="flex gap-2"><span className="text-primary">•</span>{o}</li>)}
                </ul>
              </>
            )}
            <p className="mt-5 text-xs text-muted-foreground">Estimates from a single 2D camera in the observed plane. Angles can vary with camera position, clothing and lighting. Share results with your physiotherapist before changing your program. Stop if you feel pain.</p>
          </div>
        )}
      </div>

      <aside className="h-fit rounded-3xl border bg-card p-5 shadow-soft lg:sticky lg:top-24">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Your progress — {ex.name}</div>
          {history.length > 0 && <button onClick={clearHistory} className="text-xs text-muted-foreground underline">Clear</button>}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Saved on this device only.</p>
        {chartData.length < 1 ? (
          <p className="mt-6 text-sm text-muted-foreground">Analyze a session to start tracking your movement range across sessions.</p>
        ) : (
          <div className="mt-4 h-52">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="s" fontSize={11} />
                <YAxis fontSize={11} unit="°" />
                <Tooltip />
                <Line type="monotone" dataKey="range" name="Range" stroke="var(--primary)" strokeWidth={2.5} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="mt-4 grid gap-2">
          {history.filter((h) => h.exercise === exercise).slice(-5).reverse().map((h) => (
            <div key={h.at} className="flex justify-between rounded-xl bg-muted px-3 py-2 text-xs">
              <span>{new Date(h.at).toLocaleDateString()}</span><span>{h.reps} reps · {h.rangeDeg}°</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
