/**
 * Physiotherapy Wellness KPI Data Model
 * WARNING: ALL VALUES ARE SAMPLE/DEMONSTRATION DATA ONLY
 * These are NOT real patient outcomes. For illustrative purposes only.
 */

export type KPIDirection = "higher_is_better" | "lower_is_better";
export type KPICategory = "pain-mobility" | "strength-balance" | "rehab-progress" | "overall-wellness";
export type TrendPoint = { date: string; value: number };
export type AssessmentStatus = "improving" | "stable" | "declining" | "needs-review";

export interface KPIDefinition {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  category: KPICategory;
  description: string;
  unit: string;
  direction: KPIDirection;
  scale?: string;
  methodology: string;
  formula: string;
  baseline: number;
  latest: number;
  target: number;
  trend: TrendPoint[];
  assessmentDate: string;
  status: AssessmentStatus;
  clinicalNote: string;
}

export interface Assessment {
  id: string;
  kpiId: string;
  date: string;
  category: KPICategory;
  baseline: number;
  followUp: number;
  unit: string;
  notes: string;
  status: AssessmentStatus;
  assessorName?: string;
  scale?: string;
}

export const KPI_CATEGORIES: { id: KPICategory | "all"; label: string; description: string; color: string }[] = [
  { id: "all", label: "All KPIs", description: "View all 15 physiotherapy wellness indicators", color: "bg-primary/10 text-primary" },
  { id: "pain-mobility", label: "Pain & Mobility", description: "Pain levels, mobility range, and flexibility indicators", color: "bg-rose-100 text-rose-700" },
  { id: "strength-balance", label: "Strength, Balance & Movement", description: "Muscle strength, balance, posture, and fall risk metrics", color: "bg-amber-100 text-amber-700" },
  { id: "rehab-progress", label: "Rehabilitation Progress", description: "Adherence, independence, and recovery rate indicators", color: "bg-emerald-100 text-emerald-700" },
  { id: "overall-wellness", label: "Overall Wellness", description: "Quality of life, satisfaction, and physical activity metrics", color: "bg-blue-100 text-blue-700" },
];

// SAMPLE DEMONSTRATION DATA - NOT REAL PATIENT OUTCOMES
export const KPI_DEFINITIONS: KPIDefinition[] = [
  // Category A: Pain & Mobility
  {
    id: "pain-reduction",
    name: "Pain Reduction Rate",
    shortName: "Pain Reduction",
    icon: "Zap",
    category: "pain-mobility",
    description: "Measures the percentage decrease in self-reported pain intensity from baseline using a validated numeric rating scale (NRS 0-10).",
    unit: "%",
    direction: "higher_is_better",
    scale: "NRS 0-10 (0 = no pain, 10 = worst pain)",
    methodology: "Numeric Rating Scale (NRS). Lower NRS scores indicate less pain. Reduction is calculated as percentage decrease from baseline NRS to follow-up NRS.",
    formula: "Pain Reduction (%) = ((Baseline NRS - Follow-up NRS) / Baseline NRS) x 100",
    baseline: 7.5,
    latest: 3.2,
    target: 2.0,
    trend: [
      { date: "2024-07-01", value: 0 },
      { date: "2024-07-15", value: 12 },
      { date: "2024-08-01", value: 28 },
      { date: "2024-08-15", value: 41 },
      { date: "2024-09-01", value: 52 },
      { date: "2024-09-15", value: 57 },
    ],
    assessmentDate: "2024-09-15",
    status: "improving",
    clinicalNote: "SAMPLE DATA: Patient reports consistent reduction in resting pain. Functional tolerance improving.",
  },
  {
    id: "mobility-improvement",
    name: "Mobility Improvement Rate",
    shortName: "Mobility",
    icon: "Activity",
    category: "pain-mobility",
    description: "Tracks the percentage improvement in functional mobility using validated clinical mobility scales (e.g., DEMMI or Timed Up and Go Test).",
    unit: "%",
    direction: "higher_is_better",
    scale: "DEMMI 0-100 or TUG (seconds, lower is better)",
    methodology: "De Morton Mobility Index (DEMMI) or Timed Up and Go (TUG). For DEMMI, higher score = better mobility.",
    formula: "Mobility Improvement (%) = ((Follow-up Score - Baseline Score) / Baseline Score) x 100",
    baseline: 42,
    latest: 68,
    target: 80,
    trend: [
      { date: "2024-07-01", value: 0 },
      { date: "2024-07-15", value: 8 },
      { date: "2024-08-01", value: 22 },
      { date: "2024-08-15", value: 38 },
      { date: "2024-09-01", value: 52 },
      { date: "2024-09-15", value: 62 },
    ],
    assessmentDate: "2024-09-15",
    status: "improving",
    clinicalNote: "SAMPLE DATA: Functional mobility improving steadily. Stair negotiation improving.",
  },
  {
    id: "flexibility",
    name: "Flexibility Improvement",
    shortName: "Flexibility",
    icon: "Expand",
    category: "pain-mobility",
    description: "Measures improvement in muscle and joint flexibility using standardized clinical assessments (e.g., sit-and-reach, Thomas test).",
    unit: "%",
    direction: "higher_is_better",
    scale: "Standardized flexibility test (cm or degrees)",
    methodology: "Sit-and-reach test or goniometric assessment. Results converted to percentage improvement from baseline.",
    formula: "Flexibility Improvement (%) = ((Follow-up Measure - Baseline Measure) / |Baseline Measure|) x 100",
    baseline: 18,
    latest: 27,
    target: 35,
    trend: [
      { date: "2024-07-01", value: 0 },
      { date: "2024-07-15", value: 10 },
      { date: "2024-08-01", value: 22 },
      { date: "2024-08-15", value: 33 },
      { date: "2024-09-01", value: 42 },
      { date: "2024-09-15", value: 50 },
    ],
    assessmentDate: "2024-09-15",
    status: "improving",
    clinicalNote: "SAMPLE DATA: Hamstring and hip flexor flexibility showing consistent gains.",
  },
  {
    id: "rom",
    name: "Range of Motion (ROM)",
    shortName: "ROM",
    icon: "Compass",
    category: "pain-mobility",
    description: "Measures joint range of motion in degrees using clinical goniometry. Reported per joint and movement direction.",
    unit: "deg",
    direction: "higher_is_better",
    scale: "Degrees of arc (joint-specific reference norms apply)",
    methodology: "Standard goniometric measurement. Joint: Knee (flexion). Clinician-administered using a universal goniometer.",
    formula: "ROM Change (deg) = Follow-up ROM - Baseline ROM",
    baseline: 78,
    latest: 112,
    target: 135,
    trend: [
      { date: "2024-07-01", value: 78 },
      { date: "2024-07-15", value: 88 },
      { date: "2024-08-01", value: 96 },
      { date: "2024-08-15", value: 104 },
      { date: "2024-09-01", value: 109 },
      { date: "2024-09-15", value: 112 },
    ],
    assessmentDate: "2024-09-15",
    status: "improving",
    clinicalNote: "SAMPLE DATA: Knee flexion ROM improving post-TKA. Approaching functional threshold (>=110 deg for stair climbing).",
  },
  // Category B: Strength, Balance & Movement
  {
    id: "muscle-strength",
    name: "Muscle Strength Improvement",
    shortName: "Strength",
    icon: "Dumbbell",
    category: "strength-balance",
    description: "Tracks percentage improvement in muscle strength using validated scales (MRC 0-5 or handheld dynamometry in kg).",
    unit: "%",
    direction: "higher_is_better",
    scale: "MRC Scale 0-5 or Dynamometry (kg)",
    methodology: "Medical Research Council (MRC) muscle grading or handheld dynamometer. Percentage improvement calculated from baseline.",
    formula: "Strength Improvement (%) = ((Follow-up Strength - Baseline Strength) / Baseline Strength) x 100",
    baseline: 3.2,
    latest: 4.1,
    target: 5.0,
    trend: [
      { date: "2024-07-01", value: 0 },
      { date: "2024-07-15", value: 6 },
      { date: "2024-08-01", value: 15 },
      { date: "2024-08-15", value: 20 },
      { date: "2024-09-01", value: 24 },
      { date: "2024-09-15", value: 28 },
    ],
    assessmentDate: "2024-09-15",
    status: "improving",
    clinicalNote: "SAMPLE DATA: Quadriceps strengthening progressing. Resistance increased from theraband to 2kg weight.",
  },
  {
    id: "balance-coordination",
    name: "Balance & Coordination Score",
    shortName: "Balance",
    icon: "Scale",
    category: "strength-balance",
    description: "Assesses static and dynamic balance using validated tools such as the Berg Balance Scale (0-56) or Tinetti POMA.",
    unit: "/ 56",
    direction: "higher_is_better",
    scale: "Berg Balance Scale 0-56 (>=45 = low fall risk)",
    methodology: "Berg Balance Scale (BBS). 14 tasks, each scored 0-4. Maximum score 56. Higher scores indicate better balance.",
    formula: "BBS Change = Follow-up BBS Score - Baseline BBS Score",
    baseline: 32,
    latest: 44,
    target: 50,
    trend: [
      { date: "2024-07-01", value: 32 },
      { date: "2024-07-15", value: 36 },
      { date: "2024-08-01", value: 39 },
      { date: "2024-08-15", value: 41 },
      { date: "2024-09-01", value: 43 },
      { date: "2024-09-15", value: 44 },
    ],
    assessmentDate: "2024-09-15",
    status: "improving",
    clinicalNote: "SAMPLE DATA: Approaching low fall-risk threshold. Single-leg stance improving.",
  },
  {
    id: "posture",
    name: "Posture Improvement Score",
    shortName: "Posture",
    icon: "AlignCenter",
    category: "strength-balance",
    description: "Measures postural alignment improvements using clinical postural assessment tools or validated postural grids.",
    unit: "%",
    direction: "higher_is_better",
    scale: "Clinician-administered postural grid assessment (0-100%)",
    methodology: "Postural assessment grid. Areas assessed: head position, shoulder symmetry, spinal curvature, pelvic tilt.",
    formula: "Posture Improvement (%) = ((Follow-up Score - Baseline Score) / Baseline Score) x 100",
    baseline: 48,
    latest: 67,
    target: 80,
    trend: [
      { date: "2024-07-01", value: 0 },
      { date: "2024-07-15", value: 8 },
      { date: "2024-08-01", value: 18 },
      { date: "2024-08-15", value: 28 },
      { date: "2024-09-01", value: 34 },
      { date: "2024-09-15", value: 40 },
    ],
    assessmentDate: "2024-09-15",
    status: "improving",
    clinicalNote: "SAMPLE DATA: Cervical forward head posture improving with core strengthening.",
  },
  {
    id: "fall-risk",
    name: "Fall Risk Reduction",
    shortName: "Fall Risk",
    icon: "ShieldAlert",
    category: "strength-balance",
    description: "Tracks reduction in fall risk using validated tools (e.g., STRATIFY Fall Risk Assessment or TUG test time).",
    unit: "%",
    direction: "higher_is_better",
    scale: "TUG <12s = normal; STRATIFY 0-5 (lower = lower risk)",
    methodology: "Timed Up and Go (TUG) test. Shorter TUG time = lower fall risk. Risk reduction percentage calculated from baseline TUG time.",
    formula: "Fall Risk Reduction (%) = ((Baseline TUG - Follow-up TUG) / Baseline TUG) x 100",
    baseline: 18.4,
    latest: 11.2,
    target: 10.0,
    trend: [
      { date: "2024-07-01", value: 0 },
      { date: "2024-07-15", value: 8 },
      { date: "2024-08-01", value: 19 },
      { date: "2024-08-15", value: 30 },
      { date: "2024-09-01", value: 36 },
      { date: "2024-09-15", value: 39 },
    ],
    assessmentDate: "2024-09-15",
    status: "improving",
    clinicalNote: "SAMPLE DATA: TUG improving. Near functional threshold. Home hazard assessment completed.",
  },
  // Category C: Rehabilitation Progress
  {
    id: "functional-independence",
    name: "Functional Independence Score",
    shortName: "Independence",
    icon: "UserCheck",
    category: "rehab-progress",
    description: "Measures ability to perform activities of daily living independently (Barthel Index 0-100 or FIM).",
    unit: "/ 100",
    direction: "higher_is_better",
    scale: "Barthel Index 0-100 (100 = fully independent)",
    methodology: "Barthel Index. 10 ADL domains scored. Higher scores indicate greater functional independence.",
    formula: "Barthel Change = Follow-up Score - Baseline Score",
    baseline: 55,
    latest: 78,
    target: 90,
    trend: [
      { date: "2024-07-01", value: 55 },
      { date: "2024-07-15", value: 60 },
      { date: "2024-08-01", value: 65 },
      { date: "2024-08-15", value: 70 },
      { date: "2024-09-01", value: 75 },
      { date: "2024-09-15", value: 78 },
    ],
    assessmentDate: "2024-09-15",
    status: "improving",
    clinicalNote: "SAMPLE DATA: Bathing and dressing now semi-independent. Transfers improving.",
  },
  {
    id: "adherence",
    name: "Rehabilitation Adherence Rate",
    shortName: "Adherence",
    icon: "ClipboardCheck",
    category: "rehab-progress",
    description: "Percentage of prescribed physiotherapy sessions and home exercises completed by the patient over the assessment period.",
    unit: "%",
    direction: "higher_is_better",
    scale: "0-100% (100% = full adherence to all prescribed sessions)",
    methodology: "Session log review. Counts completed sessions (in-clinic + home exercises) divided by total prescribed.",
    formula: "Adherence (%) = (Completed Sessions / Total Prescribed Sessions) x 100",
    baseline: 0,
    latest: 84,
    target: 90,
    trend: [
      { date: "2024-07-01", value: 60 },
      { date: "2024-07-15", value: 70 },
      { date: "2024-08-01", value: 75 },
      { date: "2024-08-15", value: 82 },
      { date: "2024-09-01", value: 84 },
      { date: "2024-09-15", value: 84 },
    ],
    assessmentDate: "2024-09-15",
    status: "stable",
    clinicalNote: "SAMPLE DATA: Adherence plateauing. Motivational interview conducted. Home program simplified.",
  },
  {
    id: "recovery-progress",
    name: "Recovery Progress Rate",
    shortName: "Recovery",
    icon: "TrendingUp",
    category: "rehab-progress",
    description: "Composite percentage of goals achieved toward the clinician-defined rehabilitation endpoint at the current assessment date.",
    unit: "%",
    direction: "higher_is_better",
    scale: "0-100% of rehabilitation goals achieved",
    methodology: "Goal Attainment Scaling (GAS) or clinician-defined milestone completion percentage.",
    formula: "Recovery Progress (%) = (Goals Achieved / Total Goals Defined) x 100",
    baseline: 0,
    latest: 65,
    target: 100,
    trend: [
      { date: "2024-07-01", value: 10 },
      { date: "2024-07-15", value: 22 },
      { date: "2024-08-01", value: 35 },
      { date: "2024-08-15", value: 48 },
      { date: "2024-09-01", value: 58 },
      { date: "2024-09-15", value: 65 },
    ],
    assessmentDate: "2024-09-15",
    status: "improving",
    clinicalNote: "SAMPLE DATA: 4 of 6 rehabilitation milestones met. On track for discharge planning.",
  },
  {
    id: "program-participation",
    name: "Wellness Program Participation Rate",
    shortName: "Participation",
    icon: "Users",
    category: "rehab-progress",
    description: "Percentage of scheduled wellness and physiotherapy program activities attended by the patient or group.",
    unit: "%",
    direction: "higher_is_better",
    scale: "0-100% attendance across all scheduled sessions",
    methodology: "Attendance tracking. Sessions attended divided by sessions scheduled over the period.",
    formula: "Participation (%) = (Sessions Attended / Sessions Scheduled) x 100",
    baseline: 0,
    latest: 78,
    target: 85,
    trend: [
      { date: "2024-07-01", value: 55 },
      { date: "2024-07-15", value: 65 },
      { date: "2024-08-01", value: 72 },
      { date: "2024-08-15", value: 75 },
      { date: "2024-09-01", value: 78 },
      { date: "2024-09-15", value: 78 },
    ],
    assessmentDate: "2024-09-15",
    status: "stable",
    clinicalNote: "SAMPLE DATA: Participation stable. Schedule adjustments made to reduce missed group sessions.",
  },
  // Category D: Overall Wellness
  {
    id: "patient-satisfaction",
    name: "Patient Satisfaction Score",
    shortName: "Satisfaction",
    icon: "Star",
    category: "overall-wellness",
    description: "Measures patient satisfaction with their physiotherapy care using validated questionnaires (e.g., PSQ-18 or RAND-9).",
    unit: "/ 5",
    direction: "higher_is_better",
    scale: "Likert 1-5 (5 = very satisfied). Mean score across domains.",
    methodology: "Patient Satisfaction Questionnaire (PSQ-18 subset). Domains: communication, technical quality, interpersonal care, accessibility.",
    formula: "Satisfaction Score = Mean of domain item scores (Likert 1-5)",
    baseline: 3.1,
    latest: 4.4,
    target: 4.5,
    trend: [
      { date: "2024-07-01", value: 3.1 },
      { date: "2024-07-15", value: 3.5 },
      { date: "2024-08-01", value: 3.8 },
      { date: "2024-08-15", value: 4.1 },
      { date: "2024-09-01", value: 4.3 },
      { date: "2024-09-15", value: 4.4 },
    ],
    assessmentDate: "2024-09-15",
    status: "improving",
    clinicalNote: "SAMPLE DATA: High satisfaction with communication and technique. Accessibility rated lower.",
  },
  {
    id: "quality-of-life",
    name: "Quality of Life Improvement",
    shortName: "Quality of Life",
    icon: "Heart",
    category: "overall-wellness",
    description: "Tracks improvement in health-related quality of life using validated instruments such as SF-12, SF-36, or EQ-5D.",
    unit: "%",
    direction: "higher_is_better",
    scale: "EQ-5D VAS 0-100 or SF-36 domain scores",
    methodology: "EQ-5D Visual Analogue Scale (VAS) 0-100. Percentage improvement from baseline VAS score.",
    formula: "QoL Improvement (%) = ((Follow-up VAS - Baseline VAS) / Baseline VAS) x 100",
    baseline: 42,
    latest: 68,
    target: 80,
    trend: [
      { date: "2024-07-01", value: 0 },
      { date: "2024-07-15", value: 8 },
      { date: "2024-08-01", value: 18 },
      { date: "2024-08-15", value: 32 },
      { date: "2024-09-01", value: 48 },
      { date: "2024-09-15", value: 62 },
    ],
    assessmentDate: "2024-09-15",
    status: "improving",
    clinicalNote: "SAMPLE DATA: Patient reports meaningful improvement in daily function and emotional well-being.",
  },
  {
    id: "physical-activity",
    name: "Physical Activity Level",
    shortName: "Activity Level",
    icon: "Footprints",
    category: "overall-wellness",
    description: "Tracks the patient's daily physical activity level (steps/day or active minutes) using self-report or wearable device data.",
    unit: "steps/day",
    direction: "higher_is_better",
    scale: "Daily step count (target: >=7,500 steps/day for adults)",
    methodology: "Patient-reported activity log or wearable device data. Mean daily step count over 7-day rolling window.",
    formula: "Activity Level = Mean daily steps over assessment week",
    baseline: 2400,
    latest: 5800,
    target: 7500,
    trend: [
      { date: "2024-07-01", value: 2400 },
      { date: "2024-07-15", value: 3100 },
      { date: "2024-08-01", value: 3900 },
      { date: "2024-08-15", value: 4600 },
      { date: "2024-09-01", value: 5200 },
      { date: "2024-09-15", value: 5800 },
    ],
    assessmentDate: "2024-09-15",
    status: "improving",
    clinicalNote: "SAMPLE DATA: Activity significantly increased. Graduated walking program contributing positively.",
  },
];

// Sample Assessments - SAMPLE DEMONSTRATION DATA - NOT REAL PATIENT OUTCOMES
export const SAMPLE_ASSESSMENTS: Assessment[] = [
  {
    id: "a001",
    kpiId: "pain-reduction",
    date: "2024-09-15",
    category: "pain-mobility",
    baseline: 7.5,
    followUp: 3.2,
    unit: "NRS score (0-10)",
    notes: "SAMPLE DATA: Resting pain at 3.2. Functional pain still 5-6 during stairs.",
    status: "improving",
    scale: "NRS 0-10",
    assessorName: "Sample Physiotherapist",
  },
  {
    id: "a002",
    kpiId: "rom",
    date: "2024-09-15",
    category: "pain-mobility",
    baseline: 78,
    followUp: 112,
    unit: "degrees",
    notes: "SAMPLE DATA: Knee flexion (right). Functional ROM for stairs >=110 deg.",
    status: "improving",
    scale: "Goniometry (degrees)",
    assessorName: "Sample Physiotherapist",
  },
  {
    id: "a003",
    kpiId: "balance-coordination",
    date: "2024-09-15",
    category: "strength-balance",
    baseline: 32,
    followUp: 44,
    unit: "BBS score /56",
    notes: "SAMPLE DATA: Approaching low fall-risk threshold of 45.",
    status: "improving",
    scale: "Berg Balance Scale 0-56",
    assessorName: "Sample Physiotherapist",
  },
  {
    id: "a004",
    kpiId: "adherence",
    date: "2024-09-15",
    category: "rehab-progress",
    baseline: 0,
    followUp: 84,
    unit: "%",
    notes: "SAMPLE DATA: 42 of 50 prescribed home sessions completed.",
    status: "stable",
    scale: "Session completion %",
    assessorName: "Sample Physiotherapist",
  },
];

// KPI Calculation Utilities

export function calcImprovementHigherBetter(baseline: number, followUp: number): number | null {
  if (baseline === 0) return null;
  return ((followUp - baseline) / Math.abs(baseline)) * 100;
}

export function calcImprovementLowerBetter(baseline: number, followUp: number): number | null {
  if (baseline === 0) return null;
  return ((baseline - followUp) / Math.abs(baseline)) * 100;
}

export function calcAdherence(completedSessions: number, totalPrescribed: number): number | null {
  if (totalPrescribed <= 0) return null;
  return (completedSessions / totalPrescribed) * 100;
}

export function getKPIChange(kpi: KPIDefinition): { value: number | null; pct: number | null } {
  const rawChange = kpi.latest - kpi.baseline;
  if (kpi.id === "adherence" || kpi.id === "program-participation" || kpi.id === "recovery-progress") {
    return { value: rawChange, pct: rawChange };
  }
  let pct: number | null = null;
  if (kpi.direction === "higher_is_better") {
    pct = calcImprovementHigherBetter(kpi.baseline, kpi.latest);
  } else {
    pct = calcImprovementLowerBetter(kpi.baseline, kpi.latest);
  }
  return { value: rawChange, pct };
}

export function getTargetProgress(kpi: KPIDefinition): number {
  const totalRange = Math.abs(kpi.target - kpi.baseline);
  if (totalRange === 0) return 100;
  const achievedRange = Math.abs(kpi.latest - kpi.baseline);
  return Math.min(100, (achievedRange / totalRange) * 100);
}

export function getDashboardSummary(kpis: KPIDefinition[]) {
  return {
    total: kpis.length,
    improving: kpis.filter((k) => k.status === "improving").length,
    stable: kpis.filter((k) => k.status === "stable").length,
    needsReview: kpis.filter((k) => k.status === "declining" || k.status === "needs-review").length,
    latestDate: kpis.reduce((latest, k) => (k.assessmentDate > latest ? k.assessmentDate : latest), ""),
  };
}
