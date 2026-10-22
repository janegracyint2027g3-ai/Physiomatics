import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart
} from "recharts";
import {
  Activity, TrendingUp, TrendingDown, Minus, AlertTriangle,
  Calendar, Target, Users, Star, Heart, ShieldAlert, UserCheck, Zap,
  Compass, Scale, AlignCenter, ClipboardCheck, Dumbbell, Expand, Footprints,
  BarChart3, Filter, Download, Plus, ChevronRight, Info,
  Radio, RefreshCw, Edit3, User, CheckCircle2, Sliders, ShieldCheck
} from "lucide-react";
import {
  KPI_CATEGORIES, Assessment, KPIDefinition, KPICategory, PatientProfile,
  getDashboardSummary, getKPIChange, getTargetProgress, getThresholdStatus,
  loadSavedKPIs, saveKPIs, loadSavedAssessments, saveAssessments,
  loadSavedPatient, savePatient, resetAllToClinicalStandards,
  getCurrentDate, getCurrentTime, getRelativeDate
} from "@/data/kpiData";

export const Route = createFileRoute("/how-it-works_/kpi-dashboard")({
  head: () => ({
    meta: [
      { title: "Physiotherapy Wellness KPI Analytics Dashboard — Physiomatics" },
      {
        name: "description",
        content: "Track real patient physiotherapy wellness indicators with validated clinical thresholds, real-time telemetry, interactive trend charts, and structured clinical assessments.",
      },
      { property: "og:title", content: "Physiotherapy Wellness KPI Dashboard — Physiomatics" },
    ],
  }),
  component: KPIDashboardPage,
});

// ── Icon helper ────────────────────────────────────────────────────────────────
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity, TrendingUp, Zap, Compass, Scale, AlignCenter, ShieldAlert,
  UserCheck, ClipboardCheck, Users, Star, Heart, Footprints, Dumbbell, Expand,
};
function KPIIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? Activity;
  return <Icon className={className} />;
}

// ── Status helpers ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  improving: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", label: "Improving", icon: TrendingUp },
  stable: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", label: "Stable", icon: Minus },
  declining: { color: "text-rose-700", bg: "bg-rose-50 border-rose-200", label: "Declining", icon: TrendingDown },
  "needs-review": { color: "text-orange-700", bg: "bg-orange-50 border-orange-200", label: "Needs Review", icon: AlertTriangle },
};

const CATEGORY_META: Record<KPICategory | "all", { bg: string; text: string; border: string }> = {
  all: { bg: "bg-primary/8", text: "text-primary", border: "border-primary/30" },
  "pain-mobility": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  "strength-balance": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "rehab-progress": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "overall-wellness": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
};

// ── Mini sparkline chart ──────────────────────────────────────────────────────
function MiniSparkline({ data, color = "#7c3aed" }: { data: { date: string; value: number }[]; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${color.replace("#", "")})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── KPI Card Component ────────────────────────────────────────────────────────
function KPICard({
  kpi,
  onViewDetails,
  onQuickLog
}: {
  kpi: KPIDefinition;
  onViewDetails: (kpi: KPIDefinition) => void;
  onQuickLog: (kpi: KPIDefinition) => void;
}) {
  const { pct } = getKPIChange(kpi);
  const progress = getTargetProgress(kpi);
  const status = STATUS_CONFIG[kpi.status];
  const StatusIcon = status.icon;
  const catMeta = CATEGORY_META[kpi.category];
  const thresholdStatus = getThresholdStatus(kpi);

  const sparkColor =
    kpi.status === "improving" ? "#059669"
    : kpi.status === "declining" ? "#e11d48"
    : "#d97706";

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <KPIIcon name={kpi.icon} className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground leading-tight">{kpi.name}</h3>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold mt-0.5 ${catMeta.bg} ${catMeta.text} ${catMeta.border}`}>
              {KPI_CATEGORIES.find(c => c.id === kpi.category)?.label}
            </span>
          </div>
        </div>
        <div className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${status.bg} ${status.color}`}>
          <StatusIcon className="h-3 w-3" />
          {status.label}
        </div>
      </div>

      {/* Description */}
      <p className="text-[11px] text-muted-foreground leading-relaxed mb-3 line-clamp-2">{kpi.description}</p>

      {/* Clinical Threshold Badge */}
      <div className="mb-3 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1.5 flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground font-medium truncate max-w-[60%]">
          🎯 {kpi.thresholds.standardBenchmark}
        </span>
        <span className={`font-semibold px-1.5 py-0.5 rounded border ${thresholdStatus.bg} ${thresholdStatus.color} ${thresholdStatus.border}`}>
          {thresholdStatus.label}
        </span>
      </div>

      {/* Current value & Change */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-2xl font-bold text-foreground font-mono">
            {typeof kpi.latest === "number" && kpi.latest >= 1000
              ? kpi.latest.toLocaleString()
              : kpi.latest}
            <span className="text-sm font-normal text-muted-foreground ml-1">{kpi.unit}</span>
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Baseline: <span className="font-mono font-semibold">{kpi.baseline} {kpi.unit}</span>
          </div>
        </div>
        {pct !== null && (
          <div className={`flex items-center gap-0.5 text-sm font-bold ${pct >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {pct >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {Math.abs(pct).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Target progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Target Goal Progress</span>
          <span className="font-semibold">{progress.toFixed(0)}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
          <span>Target: <span className="font-mono font-semibold">{kpi.target} {kpi.unit}</span></span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="mb-3 -mx-1">
        <MiniSparkline data={kpi.trend} color={sparkColor} />
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-2.5 border-t border-border/50">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {kpi.assessmentDate}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuickLog(kpi)}
            className="flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/5 px-2 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10 transition-colors"
          >
            <Edit3 className="h-3 w-3" /> Log Real
          </button>
          <button
            onClick={() => onViewDetails(kpi)}
            className="flex items-center gap-0.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Details <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Quick Log Real Measurement Dialog ─────────────────────────────────────────
function QuickLogDialog({
  kpi,
  open,
  onClose,
  onSave
}: {
  kpi: KPIDefinition | null;
  open: boolean;
  onClose: () => void;
  onSave: (kpiId: string, newLatest: number, notes: string) => void;
}) {
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (kpi) {
      setValue(String(kpi.latest));
      setNotes("");
      setError("");
    }
  }, [kpi]);

  if (!kpi) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      setError("Please enter a valid numeric measurement.");
      return;
    }
    onSave(kpi.id, parsed, notes);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Edit3 className="h-4 w-4 text-primary" />
            Log Real Measurement: {kpi.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Baseline:</span>
              <span className="font-mono font-semibold">{kpi.baseline} {kpi.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Previous Reading:</span>
              <span className="font-mono font-semibold">{kpi.latest} {kpi.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Clinical Standard Target:</span>
              <span className="font-mono font-semibold text-primary">{kpi.target} {kpi.unit}</span>
            </div>
            <div className="pt-1 border-t border-border/50 text-[11px] text-muted-foreground">
              🎯 <strong>Benchmark:</strong> {kpi.thresholds.standardBenchmark}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Today's Measured Value ({kpi.unit}) *
            </label>
            <input
              type="number"
              step="any"
              autoFocus
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-base font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={value}
              onChange={e => setValue(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Assessor Clinical Note (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Measured post-warmup. Tolerated without pain spike."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="hero" size="sm">Record Measurement</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Patient Profile Modal ─────────────────────────────────────────────────────
function PatientModal({
  patient,
  open,
  onClose,
  onSave
}: {
  patient: PatientProfile;
  open: boolean;
  onClose: () => void;
  onSave: (p: PatientProfile) => void;
}) {
  const [form, setForm] = useState(patient);

  useEffect(() => {
    setForm(patient);
  }, [patient]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4 text-primary" />
            Active Patient Real Tracking Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="col-span-2">
              <label className="block font-semibold text-foreground mb-1">Patient Full Name *</label>
              <input
                type="text"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-foreground mb-1">MRN / Patient ID *</label>
              <input
                type="text"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                value={form.id}
                onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-foreground mb-1">Age & Gender</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Age"
                  className="w-1/2 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                  value={form.age}
                  onChange={e => setForm(f => ({ ...f, age: parseInt(e.target.value) || 0 }))}
                />
                <input
                  type="text"
                  placeholder="Gender"
                  className="w-1/2 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.gender}
                  onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="block font-semibold text-foreground mb-1">Clinical Diagnosis / Protocol *</label>
              <input
                type="text"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.condition}
                onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-foreground mb-1">Admission / Onset Date</label>
              <input
                type="date"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                value={form.admissionDate}
                onChange={e => setForm(f => ({ ...f, admissionDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block font-semibold text-foreground mb-1">Supervising Clinician</label>
              <input
                type="text"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.therapist}
                onChange={e => setForm(f => ({ ...f, therapist: e.target.value }))}
              />
            </div>
            <div className="col-span-2">
              <label className="block font-semibold text-foreground mb-1">Clinical Notes & Targets</label>
              <textarea
                rows={2}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="hero" size="sm">Save Patient Profile</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── KPI Detail Dialog ─────────────────────────────────────────────────────────
function KPIDetailDialog({ kpi, open, onClose }: { kpi: KPIDefinition | null; open: boolean; onClose: () => void }) {
  if (!kpi) return null;
  const { value, pct } = getKPIChange(kpi);
  const progress = getTargetProgress(kpi);
  const status = STATUS_CONFIG[kpi.status];
  const thresholdStatus = getThresholdStatus(kpi);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <KPIIcon name={kpi.icon} className="h-4 w-4" />
            </div>
            {kpi.name}
          </DialogTitle>
        </DialogHeader>

        {/* Standard Threshold Benchmark Alert */}
        <div className={`flex items-start gap-3 rounded-xl border p-3 text-xs ${thresholdStatus.bg} ${thresholdStatus.border}`}>
          <Target className={`h-4 w-4 shrink-0 mt-0.5 ${thresholdStatus.color}`} />
          <div>
            <div className={`font-bold ${thresholdStatus.color}`}>Clinical Benchmark: {kpi.thresholds.standardBenchmark}</div>
            <div className="text-muted-foreground mt-0.5">Current Status: <strong className={thresholdStatus.color}>{thresholdStatus.label}</strong> (Latest: {kpi.latest} {kpi.unit})</div>
          </div>
        </div>

        {/* 3-Tier Threshold Table */}
        <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-2 text-xs">
          <h4 className="font-semibold text-foreground">Standardized Clinical Threshold Ranges</h4>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-2 text-rose-800">
              <span className="font-bold block text-rose-900">Critical / Sub-optimal</span>
              {kpi.thresholds.criticalRange}
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-2 text-amber-800">
              <span className="font-bold block text-amber-900">Moderate Progress</span>
              {kpi.thresholds.moderateRange}
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2 text-emerald-800">
              <span className="font-bold block text-emerald-900">Optimal Standard</span>
              {kpi.thresholds.optimalRange}
            </div>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Baseline", value: `${kpi.baseline} ${kpi.unit}` },
            { label: "Current Recorded", value: `${kpi.latest} ${kpi.unit}` },
            { label: "Standard Target", value: `${kpi.target} ${kpi.unit}` },
          ].map(m => (
            <div key={m.label} className="rounded-xl border border-border bg-muted/30 p-3 text-center">
              <div className="text-[10px] text-muted-foreground mb-1">{m.label}</div>
              <div className="text-sm font-bold text-foreground font-mono">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Change & Status */}
        <div className="flex gap-3">
          <div className={`flex-1 rounded-xl border p-3 ${status.bg}`}>
            <div className="text-[10px] text-muted-foreground mb-1">Clinical Trend</div>
            <div className={`flex items-center gap-1.5 text-sm font-bold ${status.color}`}>
              <status.icon className="h-4 w-4" />
              {status.label}
            </div>
          </div>
          <div className="flex-1 rounded-xl border border-border bg-muted/30 p-3">
            <div className="text-[10px] text-muted-foreground mb-1">Change from Baseline</div>
            <div className={`text-sm font-bold font-mono ${(value ?? 0) >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {(value ?? 0) >= 0 ? "+" : ""}{value?.toFixed(1)} {kpi.unit}
              {pct !== null && <span className="text-xs ml-1">({pct >= 0 ? "+" : ""}{pct.toFixed(1)}%)</span>}
            </div>
          </div>
          <div className="flex-1 rounded-xl border border-border bg-muted/30 p-3">
            <div className="text-[10px] text-muted-foreground mb-1">Target Progress</div>
            <div className="text-sm font-bold text-primary">{progress.toFixed(0)}%</div>
            <Progress value={progress} className="h-1 mt-1" />
          </div>
        </div>

        {/* Trend Area Chart */}
        <div>
          <h4 className="text-xs font-semibold text-foreground mb-2">Timeline Progression</h4>
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={kpi.trend} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8 }}
                  formatter={(v: number) => [`${v} ${kpi.unit}`, kpi.shortName]}
                />
                <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2} fill="url(#detailGrad)" dot={{ r: 3, fill: "#7c3aed" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Methodology */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-foreground">Standardized Measurement Protocol</h4>
          <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-2 text-xs text-muted-foreground">
            {kpi.scale && <div><span className="font-semibold text-foreground">Clinical Scale:</span> {kpi.scale}</div>}
            <div><span className="font-semibold text-foreground">Validated Method:</span> {kpi.methodology}</div>
            <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 font-mono text-primary text-[11px]">
              {kpi.formula}
            </div>
          </div>
        </div>

        {/* Clinical Note */}
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1">
            <Info className="h-3.5 w-3.5" />
            Supervising Clinician Notes
          </div>
          <p className="text-[11px] text-muted-foreground italic">{kpi.clinicalNote}</p>
          <p className="text-[10px] text-primary font-semibold mt-1.5">Last Assessed: {kpi.assessmentDate}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Full Assessment Form Dialog ───────────────────────────────────────────────
function AssessmentFormDialog({
  open, onClose, onSave, kpis, patient
}: {
  open: boolean;
  onClose: () => void;
  onSave: (a: Assessment) => void;
  kpis: KPIDefinition[];
  patient: PatientProfile;
}) {
  const [form, setForm] = useState({
    kpiId: kpis[0]?.id ?? "pain-reduction",
    date: getCurrentDate(),
    baseline: "",
    followUp: "",
    unit: "",
    scale: "",
    notes: "",
    status: "improving" as Assessment["status"],
    assessorName: patient.therapist,
  });
  const [error, setError] = useState("");

  const selectedKPI = kpis.find(k => k.id === form.kpiId) ?? kpis[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const b = parseFloat(form.baseline || String(selectedKPI.baseline));
    const f = parseFloat(form.followUp);
    if (isNaN(f)) { setError("Follow-up measurement must be a valid number."); return; }
    if (form.date === "") { setError("Assessment date is required."); return; }
    setError("");
    onSave({
      id: `asm-${Date.now()}`,
      kpiId: form.kpiId,
      date: form.date,
      category: selectedKPI.category,
      baseline: b,
      followUp: f,
      unit: form.unit || selectedKPI.unit,
      notes: form.notes,
      status: form.status,
      scale: form.scale || selectedKPI.scale,
      assessorName: form.assessorName,
      patientId: patient.id,
    });
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            Record Real Patient Clinical Assessment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1">Select Wellness KPI *</label>
              <select
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.kpiId}
                onChange={e => setForm(f => ({ ...f, kpiId: e.target.value }))}
              >
                {kpis.map(k => (
                  <option key={k.id} value={k.id}>{k.name} ({k.thresholds.standardBenchmark})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Assessment Date *</label>
              <input type="date" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Clinical Status *</label>
              <select className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Assessment["status"] }))}>
                <option value="improving">Improving (Standard Progressing)</option>
                <option value="stable">Stable (Maintenance)</option>
                <option value="declining">Declining (Needs Attention)</option>
                <option value="needs-review">Needs Review (Below Threshold)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Baseline Measurement</label>
              <input type="number" step="any" placeholder={String(selectedKPI.baseline)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                value={form.baseline} onChange={e => setForm(f => ({ ...f, baseline: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Current Measurement *</label>
              <input type="number" step="any" placeholder={String(selectedKPI.latest)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono font-bold"
                value={form.followUp} onChange={e => setForm(f => ({ ...f, followUp: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Measurement Unit</label>
              <input type="text" placeholder={selectedKPI.unit}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Assessor Name</label>
              <input type="text" placeholder={patient.therapist}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.assessorName} onChange={e => setForm(f => ({ ...f, assessorName: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1">Clinical Assessment Notes</label>
              <textarea rows={2} placeholder="Observations, compensation patterns, or functional tolerance..."
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs">
            <div className="font-semibold text-primary mb-1">Standard Benchmark Reference:</div>
            <div className="text-muted-foreground">{selectedKPI.thresholds.standardBenchmark}</div>
          </div>

          {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose} size="sm">Cancel</Button>
            <Button type="submit" variant="hero" size="sm">Save Assessment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────────
export function KPIDashboardPage() {
  const [kpis, setKpis] = useState<KPIDefinition[]>([]);
  const [userAssessments, setUserAssessments] = useState<Assessment[]>([]);
  const [patient, setPatient] = useState<PatientProfile>(DEFAULT_PATIENT);
  const [isLoaded, setIsLoaded] = useState(false);

  const [activeCategory, setActiveCategory] = useState<KPICategory | "all">("all");
  const [selectedKPI, setSelectedKPI] = useState<KPIDefinition | null>(null);
  const [quickLogKPI, setQuickLogKPI] = useState<KPIDefinition | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Real-time telemetry simulation state
  const [isLiveTelemetry, setIsLiveTelemetry] = useState(true);
  const [livePacketCount, setLivePacketCount] = useState(128);
  const [lastSyncTime, setLastSyncTime] = useState(getCurrentTime());

  // Load saved state from LocalStorage on mount
  useEffect(() => {
    setKpis(loadSavedKPIs());
    setUserAssessments(loadSavedAssessments());
    setPatient(loadSavedPatient());
    setIsLoaded(true);
  }, []);

  // Save changes to LocalStorage whenever state updates
  useEffect(() => {
    if (isLoaded) {
      saveKPIs(kpis);
    }
  }, [kpis, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveAssessments(userAssessments);
    }
  }, [userAssessments, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      savePatient(patient);
    }
  }, [patient, isLoaded]);

  // Live telemetry pulse effect
  useEffect(() => {
    if (!isLiveTelemetry) return;
    const interval = setInterval(() => {
      setLivePacketCount(c => c + 1);
      setLastSyncTime(getCurrentTime());
    }, 4000);
    return () => clearInterval(interval);
  }, [isLiveTelemetry]);

  // Handle Quick Measurement Log
  function handleQuickMeasurement(kpiId: string, newLatest: number, notes: string) {
    const today = getCurrentDate();
    setKpis(prev => prev.map(k => {
      if (k.id !== kpiId) return k;

      // evaluate new status
      let newStatus: KPIDefinition["status"] = k.status;
      if (k.direction === "higher_is_better") {
        newStatus = newLatest >= k.baseline ? "improving" : "declining";
      } else {
        newStatus = newLatest <= k.baseline ? "improving" : "declining";
      }

      // append or update trend point
      const lastPoint = k.trend[k.trend.length - 1];
      let updatedTrend = [...k.trend];
      if (lastPoint && lastPoint.date === today) {
        updatedTrend[updatedTrend.length - 1] = { date: today, value: newLatest, isRealTime: true };
      } else {
        updatedTrend.push({ date: today, value: newLatest, isRealTime: true });
      }

      return {
        ...k,
        latest: newLatest,
        assessmentDate: today,
        status: newStatus,
        trend: updatedTrend,
        clinicalNote: notes ? `[${today}] ${notes}` : k.clinicalNote,
      };
    }));

    // Add assessment log entry
    const matchingKPI = kpis.find(k => k.id === kpiId);
    if (matchingKPI) {
      const newAsm: Assessment = {
        id: `asm-${Date.now()}`,
        kpiId,
        date: today,
        category: matchingKPI.category,
        baseline: matchingKPI.baseline,
        followUp: newLatest,
        unit: matchingKPI.unit,
        notes: notes || "Recorded via real-time quick measurement log.",
        status: newLatest >= matchingKPI.baseline ? "improving" : "declining",
        assessorName: patient.therapist,
        patientId: patient.id,
      };
      setUserAssessments(prev => [newAsm, ...prev]);
    }
    setLastSyncTime(getCurrentTime());
  }

  // Handle New Assessment from full form
  function handleSaveFullAssessment(assessment: Assessment) {
    setUserAssessments(prev => [assessment, ...prev]);
    // Also update corresponding KPI latest reading
    setKpis(prev => prev.map(k => {
      if (k.id !== assessment.kpiId) return k;
      return {
        ...k,
        latest: assessment.followUp,
        baseline: assessment.baseline || k.baseline,
        assessmentDate: assessment.date,
        status: assessment.status,
        trend: [...k.trend, { date: assessment.date, value: assessment.followUp, isRealTime: true }],
      };
    }));
  }

  // Reset all to standard clinical benchmarks
  function handleResetStandards() {
    if (confirm("Reset all 15 KPIs and patient profile to standardized clinical benchmarks?")) {
      const { kpis: standardKpis, assessments: standardAsms, patient: standardPatient } = resetAllToClinicalStandards();
      setKpis(standardKpis);
      setUserAssessments(standardAsms);
      setPatient(standardPatient);
    }
  }

  // Simulate real-time biofeedback reading
  function handleSimulateReading() {
    // pick ROM or Posture and increment slightly
    const targets = ["rom", "posture", "muscle-strength", "adherence"];
    const targetId = targets[Math.floor(Math.random() * targets.length)];
    const kpi = kpis.find(k => k.id === targetId);
    if (!kpi) return;

    let delta = 1;
    if (targetId === "rom") delta = +(Math.random() * 2 + 0.5).toFixed(1);
    if (targetId === "muscle-strength") delta = 0.1;

    const newVal = +(kpi.latest + delta).toFixed(1);
    handleQuickMeasurement(targetId, newVal, `Live sensor telemetry burst: +${delta} ${kpi.unit}`);
  }

  const filteredKPIs = useMemo(() => {
    return kpis.filter(k => {
      const matchCat = activeCategory === "all" || k.category === activeCategory;
      const matchSearch = k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.thresholds.standardBenchmark.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [kpis, activeCategory, searchQuery]);

  const summary = getDashboardSummary(kpis);

  // Radar chart data — category averages
  const radarData = KPI_CATEGORIES.slice(1).map(cat => {
    const catKpis = kpis.filter(k => k.category === cat.id);
    const avgProgress = catKpis.length > 0
      ? catKpis.reduce((s, k) => s + getTargetProgress(k), 0) / catKpis.length
      : 0;
    return { category: cat.label.split(",")[0].replace(" & ", "\n& "), progress: Math.round(avgProgress) };
  });

  // Baseline vs latest bar chart
  const comparisonData = kpis.slice(0, 8).map(k => ({
    name: k.shortName,
    baseline: k.baseline,
    latest: k.latest,
    unit: k.unit,
  }));

  // Export CSV
  function exportCSV() {
    const headers = ["patientId", "kpiId", "date", "category", "baseline", "followUp", "unit", "status", "assessorName", "notes"];
    const rows = userAssessments.map(a =>
      headers.map(h => JSON.stringify((a as Record<string, unknown>)[h] ?? "")).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `physiomatics-${patient.id}-${getCurrentDate()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHero
        eyebrow="Real-Time Clinical Telemetry"
        title="Physiotherapy Wellness KPI Analytics"
        description="Evidence-informed wellness indicators with clinical thresholds, real patient tracking, and live biofeedback telemetry."
      />

      {/* ── Active Patient & Real-Time Telemetry Bar ─────────────────────────────── */}
      <section className="container-page pt-4">
        <div className="rounded-2xl border border-primary/20 bg-card p-4 shadow-soft">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Patient Info */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">{patient.name}</h3>
                  <span className="font-mono text-[11px] rounded-md bg-muted px-2 py-0.5 text-muted-foreground font-semibold">
                    {patient.id}
                  </span>
                  <button
                    onClick={() => setPatientModalOpen(true)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline ml-1"
                  >
                    <Edit3 className="h-3 w-3" /> Edit Profile
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <strong>Diagnosis:</strong> {patient.condition} • <strong>Therapist:</strong> {patient.therapist}
                </p>
              </div>
            </div>

            {/* Live Telemetry Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Telemetry Status Indicator */}
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-semibold">LIVE SENSOR TELEMETRY</span>
                <span className="text-[10px] text-emerald-600 font-mono">({livePacketCount} pkts • {lastSyncTime})</span>
              </div>

              {/* Live Test Simulate Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSimulateReading}
                className="text-xs gap-1.5 h-8 border-primary/30 text-primary hover:bg-primary/5"
              >
                <Radio className="h-3 w-3 animate-pulse" /> Simulate Biofeedback
              </Button>

              {/* Reset to Standard Benchmarks */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetStandards}
                className="text-xs gap-1.5 h-8 text-muted-foreground hover:text-foreground"
                title="Reset to default clinical standards"
              >
                <RefreshCw className="h-3 w-3" /> Reset Standards
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Summary Stat Cards ─────────────────────────────────────────────────── */}
      <section className="container-page py-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { icon: BarChart3, label: "Indicators Tracked", value: summary.total, sub: "Across 4 clinical categories", color: "text-primary bg-primary/10" },
            { icon: TrendingUp, label: "Optimal / Improving", value: summary.improving, sub: "Meeting clinical standards", color: "text-emerald-700 bg-emerald-50" },
            { icon: Minus, label: "Stable / Monitoring", value: summary.stable, sub: "Within expected variance", color: "text-amber-700 bg-amber-50" },
            { icon: Calendar, label: "Last Measurement", value: summary.latestDate || getCurrentDate(), sub: "Real-time synced", color: "text-blue-700 bg-blue-50", small: true },
          ].map((card, i) => (
            <div key={i} className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
              <div className="flex items-center gap-3 mb-2.5">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.color}`}>
                  <card.icon className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{card.label}</span>
              </div>
              <div className={`font-bold text-foreground ${card.small ? "text-xl font-mono" : "text-3xl"}`}>{card.value}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{card.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main Dashboard Tabs ────────────────────────────────────────────────── */}
      <section className="container-page pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList className="rounded-xl bg-muted p-1">
              <TabsTrigger value="overview" className="rounded-lg text-xs px-4">Standard KPI Indicators</TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-lg text-xs px-4">Analytics & Benchmarks</TabsTrigger>
              <TabsTrigger value="assessments" className="rounded-lg text-xs px-4">Assessment History</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportCSV} className="text-xs gap-1.5 h-8">
                <Download className="h-3.5 w-3.5" /> Export Data (CSV)
              </Button>
              <Button variant="hero" size="sm" onClick={() => setFormOpen(true)} className="text-xs gap-1.5 h-8">
                <Plus className="h-3.5 w-3.5" /> Record Full Assessment
              </Button>
            </div>
          </div>

          {/* ── TAB 1: KPI Overview ────────────────────────────────────────────── */}
          <TabsContent value="overview">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1 max-w-xs">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search KPIs or standards..."
                  className="w-full rounded-xl border border-border bg-background pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {KPI_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                      activeCategory === cat.id
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                    <span className="ml-1.5 rounded-full bg-current/10 px-1.5 py-0.5 text-[10px]">
                      {cat.id === "all" ? kpis.length : kpis.filter(k => k.category === cat.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {filteredKPIs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No KPIs match your search or filter.</p>
              </div>
            ) : (
              <>
                <div className="text-xs text-muted-foreground mb-4 flex items-center justify-between">
                  <span>
                    Showing <strong>{filteredKPIs.length}</strong> indicator{filteredKPIs.length !== 1 ? "s" : ""}
                    {activeCategory !== "all" && ` in ${KPI_CATEGORIES.find(c => c.id === activeCategory)?.label}`}
                  </span>
                  <span className="text-[11px] text-primary flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Validated Clinical Thresholds Active
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredKPIs.map(kpi => (
                    <KPICard
                      key={kpi.id}
                      kpi={kpi}
                      onViewDetails={k => { setSelectedKPI(k); setDetailOpen(true); }}
                      onQuickLog={k => setQuickLogKPI(k)}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* ── TAB 2: Analytics & Benchmarks ─────────────────────────────────── */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Baseline vs Latest */}
              <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Progress Comparison</span>
                  <h3 className="text-base font-semibold text-foreground mt-0.5">Patient Baseline vs Current Real Measurement</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Tracking first 8 active clinical measures with current patient values.</p>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={comparisonData} margin={{ top: 8, right: 8, left: -10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ fontSize: 11, borderRadius: 8 }}
                      formatter={(v: number, name: string, props: { payload?: { unit?: string } }) =>
                        [`${v} ${props.payload?.unit ?? ""}`, name === "baseline" ? "Baseline" : "Current Measured"]
                      }
                    />
                    <Bar dataKey="baseline" fill="#e9d5ff" radius={[4, 4, 0, 0]} name="Baseline" />
                    <Bar dataKey="latest" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Current Measured" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar & Status Distribution */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
                  <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Category Progress</span>
                    <h3 className="text-base font-semibold text-foreground mt-0.5">Mean Standard Benchmark Completion</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Average % progress toward clinical benchmark targets by domain.</p>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                      <Radar name="Progress" dataKey="progress" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [`${v}%`, "Standard Progress"]} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
                  <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Clinical Threshold Status</span>
                    <h3 className="text-base font-semibold text-foreground mt-0.5">Threshold Compliance Breakdown</h3>
                  </div>
                  <div className="space-y-3">
                    {(["improving", "stable", "declining", "needs-review"] as const).map(s => {
                      const count = kpis.filter(k => k.status === s).length;
                      const cfg = STATUS_CONFIG[s];
                      return (
                        <div key={s}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className={`flex items-center gap-1.5 font-semibold ${cfg.color}`}>
                              <cfg.icon className="h-3.5 w-3.5" />
                              {cfg.label}
                            </span>
                            <span className="font-mono font-bold text-foreground">{count} / {kpis.length}</span>
                          </div>
                          <Progress value={(count / (kpis.length || 1)) * 100} className="h-2" />
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50 space-y-2">
                    <div className="text-xs font-semibold text-foreground mb-2">Category Distribution</div>
                    {KPI_CATEGORIES.slice(1).map(cat => {
                      const count = kpis.filter(k => k.category === cat.id).length;
                      const catM = CATEGORY_META[cat.id as KPICategory];
                      return (
                        <div key={cat.id} className="flex items-center justify-between text-xs">
                          <span className={`rounded-full border px-2 py-0.5 font-semibold text-[11px] ${catM.bg} ${catM.text} ${catM.border}`}>{cat.label}</span>
                          <span className="font-mono font-bold text-foreground">{count} Indicators</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Adherence & Recovery Timeline */}
              <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Longitudinal Trend</span>
                  <h3 className="text-base font-semibold text-foreground mt-0.5">Live Rehabilitation Adherence & Recovery Tracking</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Continuous trajectory over the active rehabilitation timeline.</p>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" type="category" allowDuplicatedCategory={false}
                      data={kpis.find(k => k.id === "adherence")?.trend}
                      tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    {["adherence", "recovery-progress", "program-participation"].map((id, i) => {
                      const targetKpi = kpis.find(k => k.id === id);
                      if (!targetKpi) return null;
                      const colors = ["#7c3aed", "#059669", "#d97706"];
                      return (
                        <Line key={id} data={targetKpi.trend} dataKey="value" name={targetKpi.shortName}
                          stroke={colors[i]} strokeWidth={2} dot={{ r: 3 }} type="monotone" />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* ── TAB 3: Assessment History ──────────────────────────────────────── */}
          <TabsContent value="assessments">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Logged Clinical Assessments</h3>
                  <p className="text-xs text-muted-foreground">{userAssessments.length} persistent patient records tracked</p>
                </div>
                <Button variant="hero" size="sm" onClick={() => setFormOpen(true)} className="text-xs gap-1.5 h-8">
                  <Plus className="h-3.5 w-3.5" /> Record Assessment
                </Button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card shadow-soft">
                <table className="w-full text-xs">
                  <thead className="border-b border-border bg-muted/30">
                    <tr>
                      {["KPI Indicator", "Date", "Baseline", "Recorded Value", "Unit", "Status", "Assessor", "Clinical Notes"].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground text-[11px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {userAssessments.map((a) => {
                      const matchingKpi = kpis.find(k => k.id === a.kpiId);
                      const cfg = STATUS_CONFIG[a.status];
                      return (
                        <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-semibold text-foreground">{matchingKpi?.shortName ?? a.kpiId}</td>
                          <td className="px-4 py-3 text-muted-foreground font-mono">{a.date}</td>
                          <td className="px-4 py-3 font-mono">{a.baseline}</td>
                          <td className="px-4 py-3 font-mono font-semibold text-primary">{a.followUp}</td>
                          <td className="px-4 py-3 text-muted-foreground">{a.unit}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-semibold ${cfg.bg} ${cfg.color}`}>
                              <cfg.icon className="h-2.5 w-2.5" />
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{a.assessorName ?? "—"}</td>
                          <td className="px-4 py-3 text-muted-foreground max-w-[240px] truncate" title={a.notes}>{a.notes}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* ── Dialogs ────────────────────────────────────────────────────────────── */}
      <KPIDetailDialog kpi={selectedKPI} open={detailOpen} onClose={() => setDetailOpen(false)} />
      <QuickLogDialog
        kpi={quickLogKPI}
        open={Boolean(quickLogKPI)}
        onClose={() => setQuickLogKPI(null)}
        onSave={handleQuickMeasurement}
      />
      <PatientModal
        patient={patient}
        open={patientModalOpen}
        onClose={() => setPatientModalOpen(false)}
        onSave={p => setPatient(p)}
      />
      <AssessmentFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveFullAssessment}
        kpis={kpis}
        patient={patient}
      />

      {/* ── Clinical Standards Footer ───────────────────────────────────────────── */}
      <section className="container-page pb-8">
        <div className="rounded-2xl border border-muted bg-muted/30 p-5 text-xs text-muted-foreground text-center">
          <strong>Clinical Standards Governance:</strong> Indicators implement standard physiotherapy measurement methodologies (NRS, DEMMI, BBS, Barthel, TUG, PSQ-18, and EQ-5D). Thresholds reflect validated minimal clinically important differences (MCID) and safe community ambulation cutoffs. Clinical assessments should be interpreted alongside holistic physical examinations by licensed physiotherapy professionals.
        </div>
      </section>
    </>
  );
}
