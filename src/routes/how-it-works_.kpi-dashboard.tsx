import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Area, AreaChart
} from "recharts";
import {
  Activity, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2,
  Calendar, Target, Users, Star, Heart, ShieldAlert, UserCheck, Zap,
  Compass, Scale, AlignCenter, ClipboardCheck, Dumbbell, Expand, Footprints,
  BarChart3, Filter, Download, Plus, ChevronRight, FlaskConical, Info
} from "lucide-react";
import {
  KPI_DEFINITIONS, KPI_CATEGORIES, SAMPLE_ASSESSMENTS, Assessment,
  KPIDefinition, KPICategory, getDashboardSummary, getKPIChange, getTargetProgress
} from "@/data/kpiData";

export const Route = createFileRoute("/how-it-works_/kpi-dashboard")({
  head: () => ({
    meta: [
      { title: "Physiotherapy Wellness KPI Analytics Dashboard — Physiomatics" },
      {
        name: "description",
        content: "Monitor 15 physiotherapy wellness KPIs including pain reduction, mobility improvement, ROM, balance, adherence, and quality of life. Interactive charts, assessment forms, and progress reports.",
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
  improving: { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", label: "Improving", icon: TrendingUp },
  stable: { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", label: "Stable", icon: Minus },
  declining: { color: "text-rose-600", bg: "bg-rose-50 border-rose-200", label: "Declining", icon: TrendingDown },
  "needs-review": { color: "text-orange-600", bg: "bg-orange-50 border-orange-200", label: "Needs Review", icon: AlertTriangle },
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
            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${color.replace("#", "")})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KPICard({ kpi, onViewDetails }: { kpi: KPIDefinition; onViewDetails: (kpi: KPIDefinition) => void }) {
  const { pct } = getKPIChange(kpi);
  const progress = getTargetProgress(kpi);
  const status = STATUS_CONFIG[kpi.status];
  const StatusIcon = status.icon;
  const catMeta = CATEGORY_META[kpi.category];

  const sparkColor =
    kpi.status === "improving" ? "#059669"
    : kpi.status === "declining" ? "#e11d48"
    : "#d97706";

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lift">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
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

      {/* Current value */}
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
          <span>Target Progress</span>
          <span className="font-semibold">{progress.toFixed(0)}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
        <div className="text-[10px] text-muted-foreground mt-0.5">
          Target: <span className="font-mono font-semibold">{kpi.target} {kpi.unit}</span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="mb-3 -mx-1">
        <MiniSparkline data={kpi.trend} color={sparkColor} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {kpi.assessmentDate}
        </div>
        <button
          onClick={() => onViewDetails(kpi)}
          className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          View Details <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// ── KPI Detail Dialog ─────────────────────────────────────────────────────────
function KPIDetailDialog({ kpi, open, onClose }: { kpi: KPIDefinition | null; open: boolean; onClose: () => void }) {
  if (!kpi) return null;
  const { value, pct } = getKPIChange(kpi);
  const progress = getTargetProgress(kpi);
  const status = STATUS_CONFIG[kpi.status];

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

        {/* Demo badge */}
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <FlaskConical className="h-3.5 w-3.5 shrink-0" />
          <span><strong>Sample Demonstration Data:</strong> All values shown are illustrative examples only, not real patient outcomes.</span>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Baseline", value: `${kpi.baseline} ${kpi.unit}` },
            { label: "Latest", value: `${kpi.latest} ${kpi.unit}` },
            { label: "Target", value: `${kpi.target} ${kpi.unit}` },
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
            <div className="text-[10px] text-muted-foreground mb-1">Status</div>
            <div className={`flex items-center gap-1.5 text-sm font-bold ${status.color}`}>
              <status.icon className="h-4 w-4" />
              {status.label}
            </div>
          </div>
          <div className="flex-1 rounded-xl border border-border bg-muted/30 p-3">
            <div className="text-[10px] text-muted-foreground mb-1">Change from Baseline</div>
            <div className={`text-sm font-bold font-mono ${(value ?? 0) >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {(value ?? 0) >= 0 ? "+" : ""}{value?.toFixed(2)} {kpi.unit}
              {pct !== null && <span className="text-xs ml-1">({pct >= 0 ? "+" : ""}{pct.toFixed(1)}%)</span>}
            </div>
          </div>
          <div className="flex-1 rounded-xl border border-border bg-muted/30 p-3">
            <div className="text-[10px] text-muted-foreground mb-1">Target Progress</div>
            <div className="text-sm font-bold text-primary">{progress.toFixed(0)}%</div>
            <Progress value={progress} className="h-1 mt-1" />
          </div>
        </div>

        {/* Historical Chart */}
        <div>
          <h4 className="text-xs font-semibold text-foreground mb-2">Historical Trend (Sample Data)</h4>
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={kpi.trend} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
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
          <h4 className="text-xs font-semibold text-foreground">Measurement Methodology</h4>
          <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-2 text-xs text-muted-foreground">
            {kpi.scale && <div><span className="font-semibold text-foreground">Scale:</span> {kpi.scale}</div>}
            <div><span className="font-semibold text-foreground">Method:</span> {kpi.methodology}</div>
            <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 font-mono text-primary text-[11px]">
              {kpi.formula}
            </div>
          </div>
        </div>

        {/* Clinical note */}
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1">
            <Info className="h-3.5 w-3.5" />
            Assessor Note
          </div>
          <p className="text-[11px] text-muted-foreground italic">{kpi.clinicalNote}</p>
          <p className="text-[10px] text-amber-600 mt-1.5">Assessment Date: {kpi.assessmentDate}</p>
        </div>

        {/* Clinical disclaimer */}
        <div className="rounded-xl border border-border/50 bg-muted/30 p-3 text-[10px] text-muted-foreground">
          <strong className="text-foreground">Clinical Disclaimer:</strong> These KPI calculations are demonstration examples only. They do not constitute medical diagnoses or clinical recommendations. All assessments must be conducted and interpreted by qualified physiotherapy professionals using validated clinical tools appropriate to the patient's condition.
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Assessment Form Dialog ────────────────────────────────────────────────────
function AssessmentFormDialog({
  open, onClose, onSave
}: {
  open: boolean;
  onClose: () => void;
  onSave: (a: Assessment) => void;
}) {
  const [form, setForm] = useState({
    kpiId: KPI_DEFINITIONS[0].id,
    date: new Date().toISOString().split("T")[0],
    baseline: "",
    followUp: "",
    unit: "",
    scale: "",
    notes: "",
    status: "improving" as Assessment["status"],
    assessorName: "",
  });
  const [error, setError] = useState("");

  const selectedKPI = KPI_DEFINITIONS.find(k => k.id === form.kpiId)!;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const b = parseFloat(form.baseline);
    const f = parseFloat(form.followUp);
    if (isNaN(b) || isNaN(f)) { setError("Baseline and follow-up must be valid numbers."); return; }
    if (form.date === "") { setError("Assessment date is required."); return; }
    setError("");
    onSave({
      id: `user-${Date.now()}`,
      kpiId: form.kpiId,
      date: form.date,
      category: selectedKPI.category,
      baseline: b,
      followUp: f,
      unit: form.unit || selectedKPI.unit,
      notes: form.notes,
      status: form.status,
      scale: form.scale,
      assessorName: form.assessorName,
    });
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            New Assessment Record
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 mb-2">
          <strong>Demo Mode:</strong> Assessments are saved to local state only. For production use with real patient data, server-side storage with appropriate authentication and HIPAA/GDPR controls must be implemented.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1">KPI *</label>
              <select
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.kpiId}
                onChange={e => setForm(f => ({ ...f, kpiId: e.target.value }))}
              >
                {KPI_DEFINITIONS.map(k => (
                  <option key={k.id} value={k.id}>{k.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Assessment Date *</label>
              <input type="date" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Status *</label>
              <select className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Assessment["status"] }))}>
                <option value="improving">Improving</option>
                <option value="stable">Stable</option>
                <option value="declining">Declining</option>
                <option value="needs-review">Needs Review</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Baseline Measurement *</label>
              <input type="number" step="any" placeholder={`e.g. ${selectedKPI.baseline}`}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.baseline} onChange={e => setForm(f => ({ ...f, baseline: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Follow-up Measurement *</label>
              <input type="number" step="any" placeholder={`e.g. ${selectedKPI.latest}`}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.followUp} onChange={e => setForm(f => ({ ...f, followUp: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Unit</label>
              <input type="text" placeholder={selectedKPI.unit}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Assessment Scale</label>
              <input type="text" placeholder={selectedKPI.scale}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.scale} onChange={e => setForm(f => ({ ...f, scale: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1">Assessor Name</label>
              <input type="text" placeholder="Physiotherapist name"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.assessorName} onChange={e => setForm(f => ({ ...f, assessorName: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1">Clinical Notes</label>
              <textarea rows={3} placeholder="Relevant observations, context, or limitations..."
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>

          {/* Formula preview */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
            <div className="text-[10px] font-semibold text-primary mb-1">Calculation Formula</div>
            <div className="font-mono text-[11px] text-muted-foreground">{selectedKPI.formula}</div>
          </div>

          {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose} size="sm">Cancel</Button>
            <Button type="submit" variant="hero" size="sm">Save Assessment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function KPIDashboardPage() {
  const [activeCategory, setActiveCategory] = useState<KPICategory | "all">("all");
  const [selectedKPI, setSelectedKPI] = useState<KPIDefinition | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [userAssessments, setUserAssessments] = useState<Assessment[]>(SAMPLE_ASSESSMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const filteredKPIs = useMemo(() => {
    return KPI_DEFINITIONS.filter(k => {
      const matchCat = activeCategory === "all" || k.category === activeCategory;
      const matchSearch = k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const summary = getDashboardSummary(KPI_DEFINITIONS);

  function handleViewDetails(kpi: KPIDefinition) {
    setSelectedKPI(kpi);
    setDetailOpen(true);
  }

  function handleSaveAssessment(assessment: Assessment) {
    setUserAssessments(prev => [...prev, assessment]);
  }

  // Radar chart data — category averages
  const radarData = KPI_CATEGORIES.slice(1).map(cat => {
    const kpis = KPI_DEFINITIONS.filter(k => k.category === cat.id);
    const avgProgress = kpis.reduce((s, k) => s + getTargetProgress(k), 0) / kpis.length;
    return { category: cat.label.split(",")[0].replace(" & ", "\n& "), progress: Math.round(avgProgress) };
  });

  // Baseline vs latest bar chart
  const comparisonData = KPI_DEFINITIONS.slice(0, 8).map(k => ({
    name: k.shortName,
    baseline: k.baseline,
    latest: k.latest,
    unit: k.unit,
  }));

  // Export assessments as CSV
  function exportCSV() {
    const headers = ["id", "kpiId", "date", "category", "baseline", "followUp", "unit", "status", "scale", "assessorName", "notes"];
    const rows = userAssessments.map(a =>
      headers.map(h => JSON.stringify((a as Record<string, unknown>)[h] ?? "")).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `physiomatics-kpi-assessments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHero
        eyebrow="Physiotherapy Analytics"
        title="Wellness KPI Analytics Dashboard"
        description="Monitor 15 evidence-informed physiotherapy wellness indicators with interactive charts, baseline comparisons, and structured assessment tracking."
      />

      {/* Demo Mode Banner */}
      <section className="container-page pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800">
          <FlaskConical className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <strong>Demo Mode — Sample Data Only.</strong> All KPI values, trends, and assessments shown are illustrative examples. They do not represent real patient outcomes and must not be used for clinical decision-making.
            Data is stored in local state only. See methodology documentation in each KPI card for clinical implementation guidance.
          </div>
        </div>
      </section>

      {/* Analytics Overview Cards */}
      <section className="container-page py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { icon: BarChart3, label: "KPIs Tracked", value: summary.total, sub: "Across 4 categories", color: "text-primary bg-primary/10" },
            { icon: TrendingUp, label: "Improving", value: summary.improving, sub: "Positive trend", color: "text-emerald-600 bg-emerald-50" },
            { icon: Minus, label: "Stable", value: summary.stable, sub: "Monitoring", color: "text-amber-600 bg-amber-50" },
            { icon: Calendar, label: "Latest Assessment", value: summary.latestDate, sub: "Most recent record", color: "text-blue-600 bg-blue-50", small: true },
          ].map((card, i) => (
            <div key={i} className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.color}`}>
                  <card.icon className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{card.label}</span>
              </div>
              <div className={`font-bold text-foreground ${card.small ? "text-xl" : "text-3xl"}`}>{card.value}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{card.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Tabs */}
      <section className="container-page pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList className="rounded-xl bg-muted p-1">
              <TabsTrigger value="overview" className="rounded-lg text-xs px-4">KPI Overview</TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-lg text-xs px-4">Analytics</TabsTrigger>
              <TabsTrigger value="assessments" className="rounded-lg text-xs px-4">Assessments</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportCSV} className="text-xs gap-1.5">
                <Download className="h-3.5 w-3.5" /> Export CSV
              </Button>
              <Button variant="hero" size="sm" onClick={() => setFormOpen(true)} className="text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Assessment
              </Button>
            </div>
          </div>

          {/* ── TAB 1: KPI Overview ──────────────────────────────────── */}
          <TabsContent value="overview">
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1 max-w-xs">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search KPIs..."
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
                      {cat.id === "all" ? KPI_DEFINITIONS.length : KPI_DEFINITIONS.filter(k => k.category === cat.id).length}
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
                <div className="text-xs text-muted-foreground mb-4">
                  Showing <strong>{filteredKPIs.length}</strong> KPI{filteredKPIs.length !== 1 ? "s" : ""}
                  {activeCategory !== "all" && ` in ${KPI_CATEGORIES.find(c => c.id === activeCategory)?.label}`}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredKPIs.map(kpi => (
                    <KPICard key={kpi.id} kpi={kpi} onViewDetails={handleViewDetails} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* ── TAB 2: Analytics ─────────────────────────────────────── */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Baseline vs Latest */}
              <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Comparison</span>
                  <h3 className="text-base font-semibold text-foreground mt-0.5">Baseline vs Latest Assessment (Sample — First 8 KPIs)</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Note: Units vary across KPIs. This chart compares raw values, not normalised scores. Do not interpret as a combined wellness index.</p>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={comparisonData} margin={{ top: 8, right: 8, left: -10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ fontSize: 11, borderRadius: 8 }}
                      formatter={(v: number, name: string, props: { payload?: { unit?: string } }) =>
                        [`${v} ${props.payload?.unit ?? ""}`, name === "baseline" ? "Baseline" : "Latest"]
                      }
                    />
                    <Bar dataKey="baseline" fill="#e9d5ff" radius={[4, 4, 0, 0]} name="Baseline" />
                    <Bar dataKey="latest" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Latest" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar — Category Progress */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
                  <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Category Overview</span>
                    <h3 className="text-base font-semibold text-foreground mt-0.5">Mean Target Progress by Category</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Average % progress toward individual targets. Sample data.</p>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                      <Radar name="Progress" dataKey="progress" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [`${v}%`, "Progress"]} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Status Distribution */}
                <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
                  <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Status Distribution</span>
                    <h3 className="text-base font-semibold text-foreground mt-0.5">KPI Status Breakdown</h3>
                  </div>
                  <div className="space-y-3">
                    {(["improving", "stable", "declining", "needs-review"] as const).map(s => {
                      const count = KPI_DEFINITIONS.filter(k => k.status === s).length;
                      const cfg = STATUS_CONFIG[s];
                      return (
                        <div key={s}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className={`flex items-center gap-1.5 font-semibold ${cfg.color}`}>
                              <cfg.icon className="h-3.5 w-3.5" />
                              {cfg.label}
                            </span>
                            <span className="font-mono font-bold text-foreground">{count} / {KPI_DEFINITIONS.length}</span>
                          </div>
                          <Progress value={(count / KPI_DEFINITIONS.length) * 100} className="h-2" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Per-category counts */}
                  <div className="mt-6 pt-4 border-t border-border/50 space-y-2">
                    <div className="text-xs font-semibold text-foreground mb-2">KPIs per Category</div>
                    {KPI_CATEGORIES.slice(1).map(cat => {
                      const count = KPI_DEFINITIONS.filter(k => k.category === cat.id).length;
                      const catM = CATEGORY_META[cat.id as KPICategory];
                      return (
                        <div key={cat.id} className="flex items-center justify-between text-xs">
                          <span className={`rounded-full border px-2 py-0.5 font-semibold text-[11px] ${catM.bg} ${catM.text} ${catM.border}`}>{cat.label}</span>
                          <span className="font-mono font-bold text-foreground">{count} KPIs</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Trend lines for all categories */}
              <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Trend Analysis</span>
                  <h3 className="text-base font-semibold text-foreground mt-0.5">Rehabilitation Adherence & Recovery Progress Over Time</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Sample trend data — illustrative only, not real patient records.</p>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" type="category" allowDuplicatedCategory={false}
                      data={KPI_DEFINITIONS.find(k => k.id === "adherence")?.trend}
                      tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    {["adherence", "recovery-progress", "program-participation"].map((id, i) => {
                      const kpi = KPI_DEFINITIONS.find(k => k.id === id)!;
                      const colors = ["#7c3aed", "#059669", "#d97706"];
                      return (
                        <Line key={id} data={kpi.trend} dataKey="value" name={kpi.shortName}
                          stroke={colors[i]} strokeWidth={2} dot={{ r: 3 }} type="monotone" />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* ── TAB 3: Assessments ───────────────────────────────────── */}
          <TabsContent value="assessments">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Assessment Records</h3>
                  <p className="text-xs text-muted-foreground">{userAssessments.length} records (sample data + any you add)</p>
                </div>
                <Button variant="hero" size="sm" onClick={() => setFormOpen(true)} className="text-xs gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> New Assessment
                </Button>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
                <strong>Demo Mode:</strong> Sample assessments are pre-loaded for demonstration. Add your own records using the form above. Records persist only in browser session.
              </div>

              <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card shadow-soft">
                <table className="w-full text-xs">
                  <thead className="border-b border-border bg-muted/30">
                    <tr>
                      {["KPI", "Date", "Baseline", "Follow-up", "Unit", "Status", "Assessor", "Notes"].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground text-[11px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {userAssessments.map((a) => {
                      const kpi = KPI_DEFINITIONS.find(k => k.id === a.kpiId);
                      const cfg = STATUS_CONFIG[a.status];
                      return (
                        <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-semibold text-foreground">{kpi?.shortName ?? a.kpiId}</td>
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
                          <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate" title={a.notes}>{a.notes}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Clinical disclaimer */}
              <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 text-[11px] text-muted-foreground">
                <strong className="text-foreground">Clinical Data Notice:</strong> Before using this dashboard with real patient information, implement appropriate authentication, authorization, consent management, secure transmission (TLS), access controls, data retention policies, and audit logging. Patient assessment data is sensitive health information and must be handled in compliance with applicable regulations (HIPAA, GDPR, or local equivalent). This demo uses no persistent storage and collects no real patient data.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Dialogs */}
      <KPIDetailDialog kpi={selectedKPI} open={detailOpen} onClose={() => setDetailOpen(false)} />
      <AssessmentFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSaveAssessment} />

      {/* Clinical Disclaimer Footer */}
      <section className="container-page pb-8">
        <div className="rounded-2xl border border-muted bg-muted/40 p-5 text-xs text-muted-foreground text-center">
          <strong>Clinical Disclaimer:</strong> This dashboard is a demonstration tool for educational and illustrative purposes only. All KPI values, trend data, and assessment records are sample data. KPI calculations implement standard physiotherapy measurement methodologies, but individual clinical scales must be applied by qualified physiotherapists in appropriate clinical contexts. This tool does not provide diagnoses, clinical recommendations, or treatment guidance. Always consult a qualified healthcare professional for clinical assessment and management.
        </div>
      </section>
    </>
  );
}
