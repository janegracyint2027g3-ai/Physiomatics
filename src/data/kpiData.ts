/**
 * Physiotherapy Wellness KPI Data Model & Real-Time Tracking Engine
 * Clinical standards, validated thresholds, dynamic timelines, and real patient tracking.
 */

export type KPIDirection = "higher_is_better" | "lower_is_better";
export type KPICategory = "pain-mobility" | "strength-balance" | "rehab-progress" | "overall-wellness";
export type TrendPoint = { date: string; value: number; isRealTime?: boolean };
export type AssessmentStatus = "improving" | "stable" | "declining" | "needs-review";

export interface ClinicalThreshold {
  criticalRange: string;
  moderateRange: string;
  optimalRange: string;
  standardBenchmark: string;
  optimalMin?: number;
  optimalMax?: number;
  criticalMax?: number;
}

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
  thresholds: ClinicalThreshold;
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
  patientId?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  admissionDate: string;
  therapist: string;
  notes: string;
}

// ── Dynamic Date Helpers (Always Current, Standardized) ────────────────────────
export function getRelativeDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

export function getCurrentDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function getCurrentTime(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export const KPI_CATEGORIES: { id: KPICategory | "all"; label: string; description: string; color: string }[] = [
  { id: "all", label: "All KPIs", description: "View all 15 physiotherapy wellness indicators", color: "bg-primary/10 text-primary" },
  { id: "pain-mobility", label: "Pain & Mobility", description: "Pain levels, mobility range, and flexibility indicators", color: "bg-rose-100 text-rose-700" },
  { id: "strength-balance", label: "Strength, Balance & Movement", description: "Muscle strength, balance, posture, and fall risk metrics", color: "bg-amber-100 text-amber-700" },
  { id: "rehab-progress", label: "Rehabilitation Progress", description: "Adherence, independence, and recovery rate indicators", color: "bg-emerald-100 text-emerald-700" },
  { id: "overall-wellness", label: "Overall Wellness", description: "Quality of life, satisfaction, and physical activity metrics", color: "bg-blue-100 text-blue-700" },
];

export const DEFAULT_PATIENT: PatientProfile = {
  id: "PT-LIVE-0824",
  name: "Marcus Vance",
  age: 46,
  gender: "Male",
  condition: "Post-Operative Right Knee ACL Reconstruction + Meniscal Repair",
  admissionDate: getRelativeDate(45),
  therapist: "Dr. Elena Rostova, DPT, OCS",
  notes: "Active rehabilitation protocol week 7. High adherence. Monitoring functional knee flexion and single-leg balance.",
};

// ── Helper to evaluate threshold status ────────────────────────────────────────
export function getThresholdStatus(kpi: KPIDefinition): { label: string; color: string; bg: string; border: string } {
  const val = kpi.latest;
  const t = kpi.thresholds;

  if (kpi.direction === "higher_is_better") {
    if (t.optimalMin !== undefined && val >= t.optimalMin) {
      return { label: "Standard Met (Optimal)", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" };
    }
    if (t.criticalMax !== undefined && val <= t.criticalMax) {
      return { label: "Below Threshold", color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" };
    }
    return { label: "Moderate Progress", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" };
  } else {
    // Lower is better (e.g. Pain NRS or TUG)
    if (t.optimalMax !== undefined && val <= t.optimalMax) {
      return { label: "Standard Met (Optimal)", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" };
    }
    if (t.criticalMax !== undefined && val >= t.criticalMax) {
      return { label: "Below Threshold (Alert)", color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" };
    }
    return { label: "Moderate Progress", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" };
  }
}

// ── Standard 15 Clinical KPI Definitions with Standard Thresholds ──────────────
export const getStandardKPIDefinitions = (): KPIDefinition[] => [
  // Category A: Pain & Mobility
  {
    id: "pain-reduction",
    name: "Pain Reduction Rate",
    shortName: "Pain Reduction",
    icon: "Zap",
    category: "pain-mobility",
    description: "Percentage decrease in self-reported pain intensity from baseline using validated numeric rating scale (NRS 0-10).",
    unit: "%",
    direction: "higher_is_better",
    scale: "NRS 0-10 (0 = no pain, 10 = worst pain)",
    methodology: "Numeric Rating Scale (NRS). Lower score = less pain. Reduction is calculated as percentage decrease from baseline NRS.",
    formula: "Pain Reduction (%) = ((Baseline NRS - Follow-up NRS) / Baseline NRS) x 100",
    thresholds: {
      criticalRange: "< 30% reduction (sub-therapeutic)",
      moderateRange: "30% - 49% reduction (MCID met)",
      optimalRange: ">= 50% reduction (clinically meaningful relief)",
      standardBenchmark: "MCID >= 30% reduction from initial baseline",
      optimalMin: 50,
      criticalMax: 29.9,
    },
    baseline: 7.5,
    latest: 3.2,
    target: 2.0,
    trend: [
      { date: getRelativeDate(45), value: 0 },
      { date: getRelativeDate(30), value: 20 },
      { date: getRelativeDate(20), value: 33 },
      { date: getRelativeDate(12), value: 45 },
      { date: getRelativeDate(5), value: 53 },
      { date: getCurrentDate(), value: 57.3 },
    ],
    assessmentDate: getCurrentDate(),
    status: "improving",
    clinicalNote: "Pain at rest down to 3.2/10. Functional pain during stair descent remains 4/10. Ice and isometric protocol continued.",
  },
  {
    id: "mobility-improvement",
    name: "Mobility Improvement Rate",
    shortName: "Mobility",
    icon: "Activity",
    category: "pain-mobility",
    description: "Tracks functional mobility gains using validated clinical mobility metrics (DEMMI 0-100 or TUG).",
    unit: "%",
    direction: "higher_is_better",
    scale: "DEMMI 0-100 or standardized functional mobility test",
    methodology: "De Morton Mobility Index (DEMMI). Higher scores correlate directly with independent functional mobility.",
    formula: "Mobility Improvement (%) = ((Follow-up Score - Baseline Score) / Baseline Score) x 100",
    thresholds: {
      criticalRange: "< 20% improvement",
      moderateRange: "20% - 39% improvement",
      optimalRange: ">= 40% improvement (community ambulation)",
      standardBenchmark: "MCID >= 9 points on DEMMI scale",
      optimalMin: 40,
      criticalMax: 19.9,
    },
    baseline: 42,
    latest: 68,
    target: 80,
    trend: [
      { date: getRelativeDate(45), value: 0 },
      { date: getRelativeDate(30), value: 15 },
      { date: getRelativeDate(20), value: 30 },
      { date: getRelativeDate(12), value: 45 },
      { date: getRelativeDate(5), value: 55 },
      { date: getCurrentDate(), value: 61.9 },
    ],
    assessmentDate: getCurrentDate(),
    status: "improving",
    clinicalNote: "Community ambulation without crutches achieved on level surfaces. Mild antalgic gait noted after 15 min.",
  },
  {
    id: "flexibility",
    name: "Flexibility Improvement",
    shortName: "Flexibility",
    icon: "Expand",
    category: "pain-mobility",
    description: "Measures improvement in muscle and soft tissue flexibility using goniometric and sit-and-reach protocols.",
    unit: "%",
    direction: "higher_is_better",
    scale: "Standardized flexibility test (cm or degrees)",
    methodology: "Sit-and-reach test and passive hamstring goniometry. Results calculated as percentage increase from baseline.",
    formula: "Flexibility Improvement (%) = ((Follow-up Measure - Baseline Measure) / |Baseline Measure|) x 100",
    thresholds: {
      criticalRange: "< 15% improvement",
      moderateRange: "15% - 29% improvement",
      optimalRange: ">= 30% improvement (functional clearance)",
      standardBenchmark: "Standard age-matched norm >= 25 cm or >= 30% gain",
      optimalMin: 30,
      criticalMax: 14.9,
    },
    baseline: 18,
    latest: 27,
    target: 35,
    trend: [
      { date: getRelativeDate(45), value: 0 },
      { date: getRelativeDate(30), value: 12 },
      { date: getRelativeDate(20), value: 25 },
      { date: getRelativeDate(12), value: 38 },
      { date: getRelativeDate(5), value: 45 },
      { date: getCurrentDate(), value: 50 },
    ],
    assessmentDate: getCurrentDate(),
    status: "improving",
    clinicalNote: "Hamstring flexibility and posterior chain extensibility progressing with active eccentric stretching.",
  },
  {
    id: "rom",
    name: "Range of Motion (ROM)",
    shortName: "ROM",
    icon: "Compass",
    category: "pain-mobility",
    description: "Measures joint range of motion in degrees using clinical goniometry. Joint: Knee Flexion.",
    unit: "deg",
    direction: "higher_is_better",
    scale: "Degrees of arc (0 - 140 deg for knee flexion)",
    methodology: "Universal goniometer with patient in prone/supine position. Active-assisted and passive end-range noted.",
    formula: "ROM (deg) = Measured joint angle at terminal voluntary excursion",
    thresholds: {
      criticalRange: "< 90 deg (severe functional limitation)",
      moderateRange: "90 - 119 deg (stair descent impaired)",
      optimalRange: ">= 120 deg (>= 135 deg normal physiological)",
      standardBenchmark: "Functional target: 110 deg for stairs, 135 deg for deep squat",
      optimalMin: 120,
      criticalMax: 89.9,
    },
    baseline: 78,
    latest: 118,
    target: 135,
    trend: [
      { date: getRelativeDate(45), value: 78 },
      { date: getRelativeDate(30), value: 92 },
      { date: getRelativeDate(20), value: 104 },
      { date: getRelativeDate(12), value: 111 },
      { date: getRelativeDate(5), value: 115 },
      { date: getCurrentDate(), value: 118 },
    ],
    assessmentDate: getCurrentDate(),
    status: "improving",
    clinicalNote: "Knee flexion reached 118 deg today. Extension deficit fully resolved (0 deg neutral achieved).",
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
    thresholds: {
      criticalRange: "< 15% gain (MRC < Grade 4)",
      moderateRange: "15% - 29% gain (MRC Grade 4)",
      optimalRange: ">= 30% gain (MRC Grade 5 functional)",
      standardBenchmark: "Symmetric limb strength within 10% of contralateral limb",
      optimalMin: 30,
      criticalMax: 14.9,
    },
    baseline: 3.2,
    latest: 4.1,
    target: 5.0,
    trend: [
      { date: getRelativeDate(45), value: 0 },
      { date: getRelativeDate(30), value: 8 },
      { date: getRelativeDate(20), value: 16 },
      { date: getRelativeDate(12), value: 22 },
      { date: getRelativeDate(5), value: 26 },
      { date: getCurrentDate(), value: 28.1 },
    ],
    assessmentDate: getCurrentDate(),
    status: "improving",
    clinicalNote: "Quadriceps strengthening progressing. Resistance increased from theraband to 2.5kg cuff weight.",
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
    thresholds: {
      criticalRange: "0 - 20 (High Fall Risk / Wheelchair dependent)",
      moderateRange: "21 - 44 (Medium Fall Risk / Assistive device needed)",
      optimalRange: "45 - 56 (Low Fall Risk / Independent community ambulation)",
      standardBenchmark: "Clinical Safe Cutoff >= 45/56",
      optimalMin: 45,
      criticalMax: 20,
    },
    baseline: 32,
    latest: 45,
    target: 50,
    trend: [
      { date: getRelativeDate(45), value: 32 },
      { date: getRelativeDate(30), value: 36 },
      { date: getRelativeDate(20), value: 39 },
      { date: getRelativeDate(12), value: 41 },
      { date: getRelativeDate(5), value: 43 },
      { date: getCurrentDate(), value: 45 },
    ],
    assessmentDate: getCurrentDate(),
    status: "improving",
    clinicalNote: "Achieved the low fall-risk threshold of 45/56 today! Single-leg stance improved to 15s on operative side.",
  },
  {
    id: "posture",
    name: "Posture Improvement Score",
    shortName: "Posture",
    icon: "AlignCenter",
    category: "strength-balance",
    description: "Measures postural alignment improvements using clinical postural assessment tools or computer vision grids.",
    unit: "%",
    direction: "higher_is_better",
    scale: "Clinical postural grid assessment (0-100%)",
    methodology: "Multi-segment kinematic tracking: craniovertebral angle, shoulder plumb line, pelvic tilt, and plumb line deviations.",
    formula: "Posture Improvement (%) = ((Follow-up Score - Baseline Score) / Baseline Score) x 100",
    thresholds: {
      criticalRange: "< 25% alignment score",
      moderateRange: "25% - 49% alignment score",
      optimalRange: ">= 50% alignment gain (>= 75% total alignment)",
      standardBenchmark: "Plumb line alignment deviation < 1.5 cm across all sagittal landmarks",
      optimalMin: 50,
      criticalMax: 24.9,
    },
    baseline: 48,
    latest: 67,
    target: 80,
    trend: [
      { date: getRelativeDate(45), value: 0 },
      { date: getRelativeDate(30), value: 10 },
      { date: getRelativeDate(20), value: 20 },
      { date: getRelativeDate(12), value: 28 },
      { date: getRelativeDate(5), value: 34 },
      { date: getCurrentDate(), value: 39.6 },
    ],
    assessmentDate: getCurrentDate(),
    status: "improving",
    clinicalNote: "Pelvic lateral tilt during stance phase decreased by 4 degrees. Thoracic kyphosis compensated well.",
  },
  {
    id: "fall-risk",
    name: "Fall Risk Reduction",
    shortName: "Fall Risk",
    icon: "ShieldAlert",
    category: "strength-balance",
    description: "Tracks reduction in fall risk using validated tools (e.g., TUG test time in seconds).",
    unit: "%",
    direction: "higher_is_better",
    scale: "Timed Up and Go (TUG < 10s = normal healthy, > 12s = fall risk)",
    methodology: "Timed Up and Go (TUG) test. Shorter time = lower fall risk. Risk reduction calculated as percentage decrease from baseline TUG.",
    formula: "Fall Risk Reduction (%) = ((Baseline TUG - Follow-up TUG) / Baseline TUG) x 100",
    thresholds: {
      criticalRange: "< 20% reduction (TUG remains > 14s)",
      moderateRange: "20% - 34% reduction (TUG 11 - 13s)",
      optimalRange: ">= 35% reduction (TUG <= 10s normal community ambulation)",
      standardBenchmark: "TUG <= 10.0 seconds for independent healthy adults",
      optimalMin: 35,
      criticalMax: 19.9,
    },
    baseline: 18.4,
    latest: 11.2,
    target: 10.0,
    trend: [
      { date: getRelativeDate(45), value: 0 },
      { date: getRelativeDate(30), value: 10 },
      { date: getRelativeDate(20), value: 20 },
      { date: getRelativeDate(12), value: 30 },
      { date: getRelativeDate(5), value: 36 },
      { date: getCurrentDate(), value: 39.1 },
    ],
    assessmentDate: getCurrentDate(),
    status: "improving",
    clinicalNote: "TUG time down to 11.2s. Dynamic turn and sit-to-stand transitions smooth. Approaching the 10s benchmark.",
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
    methodology: "Barthel Index covering 10 ADL domains including feeding, bathing, grooming, dressing, bowel, bladder, and transfers.",
    formula: "Barthel Change = Follow-up Score - Baseline Score",
    thresholds: {
      criticalRange: "0 - 60 (Severe Dependency)",
      moderateRange: "61 - 89 (Moderate / Mild Dependency)",
      optimalRange: "90 - 100 (Independent / Self-sufficient ADLs)",
      standardBenchmark: "Clinical Discharge Benchmark >= 90/100",
      optimalMin: 90,
      criticalMax: 60,
    },
    baseline: 55,
    latest: 82,
    target: 95,
    trend: [
      { date: getRelativeDate(45), value: 55 },
      { date: getRelativeDate(30), value: 62 },
      { date: getRelativeDate(20), value: 68 },
      { date: getRelativeDate(12), value: 74 },
      { date: getRelativeDate(5), value: 78 },
      { date: getCurrentDate(), value: 82 },
    ],
    assessmentDate: getCurrentDate(),
    status: "improving",
    clinicalNote: "Stair ascent independent with handrail. Car transfer mastered. Goal of 90+ Barthel expected within 2 weeks.",
  },
  {
    id: "adherence",
    name: "Rehabilitation Adherence Rate",
    shortName: "Adherence",
    icon: "ClipboardCheck",
    category: "rehab-progress",
    description: "Percentage of prescribed physiotherapy sessions and home biofeedback exercises completed by the patient.",
    unit: "%",
    direction: "higher_is_better",
    scale: "0 - 100% (>= 80% = clinically compliant)",
    methodology: "Live telemetry and app session completion logs. Count of verified completed sessions divided by prescribed sessions.",
    formula: "Adherence (%) = (Completed Sessions / Total Prescribed Sessions) x 100",
    thresholds: {
      criticalRange: "< 60% (Non-compliant, high recurrence risk)",
      moderateRange: "60% - 79% (Sub-optimal adherence)",
      optimalRange: ">= 80% (Clinically compliant adherence)",
      standardBenchmark: "WHO Physical Therapy Adherence Benchmark >= 80%",
      optimalMin: 80,
      criticalMax: 59.9,
    },
    baseline: 0,
    latest: 86,
    target: 90,
    trend: [
      { date: getRelativeDate(45), value: 65 },
      { date: getRelativeDate(30), value: 72 },
      { date: getRelativeDate(20), value: 78 },
      { date: getRelativeDate(12), value: 83 },
      { date: getRelativeDate(5), value: 85 },
      { date: getCurrentDate(), value: 86 },
    ],
    assessmentDate: getCurrentDate(),
    status: "improving",
    clinicalNote: "Patient completed 24 of 28 prescribed home sessions this month. Great engagement with app video feedback.",
  },
  {
    id: "recovery-progress",
    name: "Recovery Progress Rate",
    shortName: "Recovery",
    icon: "TrendingUp",
    category: "rehab-progress",
    description: "Composite percentage of clinical milestones achieved toward discharge criteria.",
    unit: "%",
    direction: "higher_is_better",
    scale: "0 - 100% of rehabilitation milestones achieved",
    methodology: "Goal Attainment Scaling (GAS) and clinical discharge protocol milestones.",
    formula: "Recovery Progress (%) = (Milestones Achieved / Total Milestones Defined) x 100",
    thresholds: {
      criticalRange: "< 35% (Early acute phase)",
      moderateRange: "35% - 69% (Active restorative phase)",
      optimalRange: ">= 70% (Return-to-sport / functional conditioning)",
      standardBenchmark: "Discharge criterion >= 85% milestones met",
      optimalMin: 70,
      criticalMax: 34.9,
    },
    baseline: 0,
    latest: 68,
    target: 100,
    trend: [
      { date: getRelativeDate(45), value: 12 },
      { date: getRelativeDate(30), value: 25 },
      { date: getRelativeDate(20), value: 38 },
      { date: getRelativeDate(12), value: 50 },
      { date: getRelativeDate(5), value: 60 },
      { date: getCurrentDate(), value: 68 },
    ],
    assessmentDate: getCurrentDate(),
    status: "improving",
    clinicalNote: "5 of 8 functional milestones complete. Phase III jogging protocol clearance planned for week 9.",
  },
  {
    id: "program-participation",
    name: "Wellness Program Participation Rate",
    shortName: "Participation",
    icon: "Users",
    category: "rehab-progress",
    description: "Percentage of scheduled tele-rehab and supervised clinic check-ins attended.",
    unit: "%",
    direction: "higher_is_better",
    scale: "0 - 100% attendance rate",
    methodology: "Automated session logs via Physiomatics platform. Total attended sessions vs total booked appointments.",
    formula: "Participation (%) = (Sessions Attended / Sessions Scheduled) x 100",
    thresholds: {
      criticalRange: "< 70% (At-risk attendance)",
      moderateRange: "70% - 84% (Acceptable)",
      optimalRange: ">= 85% (Excellent commitment)",
      standardBenchmark: "Clinical Program Standard >= 85%",
      optimalMin: 85,
      criticalMax: 69.9,
    },
    baseline: 0,
    latest: 82,
    target: 90,
    trend: [
      { date: getRelativeDate(45), value: 60 },
      { date: getRelativeDate(30), value: 70 },
      { date: getRelativeDate(20), value: 75 },
      { date: getRelativeDate(12), value: 79 },
      { date: getRelativeDate(5), value: 81 },
      { date: getCurrentDate(), value: 82 },
    ],
    assessmentDate: getCurrentDate(),
    status: "stable",
    clinicalNote: "Attendance stable. Patient prefers evening tele-rehab slots; adjusted schedule accordingly.",
  },

  // Category D: Overall Wellness
  {
    id: "patient-satisfaction",
    name: "Patient Satisfaction Score",
    shortName: "Satisfaction",
    icon: "Star",
    category: "overall-wellness",
    description: "Patient satisfaction with physiotherapy care using validated survey instruments (PSQ-18).",
    unit: "/ 5",
    direction: "higher_is_better",
    scale: "Likert 1-5 (5 = very satisfied)",
    methodology: "Patient Satisfaction Questionnaire (PSQ-18). Subscales: communication, time with therapist, outcomes.",
    formula: "Satisfaction Score = Mean score across domains (1.0 to 5.0)",
    thresholds: {
      criticalRange: "< 3.5 (Unsatisfied / Needs clinical review)",
      moderateRange: "3.5 - 4.2 (Satisfactory)",
      optimalRange: ">= 4.3 (Highly satisfied / Benchmark excellence)",
      standardBenchmark: "Healthcare Quality Benchmark >= 4.2 / 5.0",
      optimalMin: 4.3,
      criticalMax: 3.49,
    },
    baseline: 3.1,
    latest: 4.6,
    target: 4.8,
    trend: [
      { date: getRelativeDate(45), value: 3.1 },
      { date: getRelativeDate(30), value: 3.6 },
      { date: getRelativeDate(20), value: 4.0 },
      { date: getRelativeDate(12), value: 4.3 },
      { date: getRelativeDate(5), value: 4.5 },
      { date: getCurrentDate(), value: 4.6 },
    ],
    assessmentDate: getCurrentDate(),
    status: "improving",
    clinicalNote: "Patient praised the real-time posture biofeedback and clear exercise progression instructions.",
  },
  {
    id: "quality-of-life",
    name: "Quality of Life Improvement",
    shortName: "Quality of Life",
    icon: "Heart",
    category: "overall-wellness",
    description: "Tracks health-related quality of life improvement using validated EQ-5D Visual Analogue Scale.",
    unit: "%",
    direction: "higher_is_better",
    scale: "EQ-5D VAS 0-100 (100 = best imaginable health)",
    methodology: "EuroQol EQ-5D-5L index. Improvement measured as percentage increase in patient self-rated health score.",
    formula: "QoL Improvement (%) = ((Follow-up VAS - Baseline VAS) / Baseline VAS) x 100",
    thresholds: {
      criticalRange: "< 25% improvement",
      moderateRange: "25% - 49% improvement",
      optimalRange: ">= 50% improvement (meaningful life impact)",
      standardBenchmark: "MCID >= 7 points on EQ-5D VAS (approx >= 25% gain)",
      optimalMin: 50,
      criticalMax: 24.9,
    },
    baseline: 42,
    latest: 71,
    target: 85,
    trend: [
      { date: getRelativeDate(45), value: 0 },
      { date: getRelativeDate(30), value: 18 },
      { date: getRelativeDate(20), value: 35 },
      { date: getRelativeDate(12), value: 50 },
      { date: getRelativeDate(5), value: 62 },
      { date: getCurrentDate(), value: 69.0 },
    ],
    assessmentDate: getCurrentDate(),
    status: "improving",
    clinicalNote: "Patient returned to driving and light recreational walking. Sleep quality significantly improved.",
  },
  {
    id: "physical-activity",
    name: "Physical Activity Level",
    shortName: "Activity Level",
    icon: "Footprints",
    category: "overall-wellness",
    description: "Average daily physical step count tracked via wearable device or mobile health sensor.",
    unit: "steps/day",
    direction: "higher_is_better",
    scale: "Mean daily steps (adult standard target: >= 7,500 steps/day)",
    methodology: "Continuous step tracking over 7-day rolling window via smartphone pedometer / wearable sensor.",
    formula: "Activity Level = Rolling 7-day average steps per day",
    thresholds: {
      criticalRange: "< 5,000 steps/day (Sedentary)",
      moderateRange: "5,000 - 7,499 steps/day (Low Active)",
      optimalRange: ">= 7,500 steps/day (Active / Healthy Standard)",
      standardBenchmark: "WHO Physical Activity Guideline >= 7,500 steps/day",
      optimalMin: 7500,
      criticalMax: 4999,
    },
    baseline: 2400,
    latest: 6450,
    target: 8000,
    trend: [
      { date: getRelativeDate(45), value: 2400 },
      { date: getRelativeDate(30), value: 3200 },
      { date: getRelativeDate(20), value: 4300 },
      { date: getRelativeDate(12), value: 5100 },
      { date: getRelativeDate(5), value: 5900 },
      { date: getCurrentDate(), value: 6450 },
    ],
    assessmentDate: getCurrentDate(),
    status: "improving",
    clinicalNote: "Daily average increased by 4,050 steps from post-op baseline. Patient walking 30 minutes twice daily.",
  },
];

// Initial active definitions
export const KPI_DEFINITIONS: KPIDefinition[] = getStandardKPIDefinitions();

// ── Standard Assessments with Dynamic Dates ────────────────────────────────────
export const getStandardAssessments = (): Assessment[] => [
  {
    id: "a001",
    kpiId: "pain-reduction",
    date: getCurrentDate(),
    category: "pain-mobility",
    baseline: 7.5,
    followUp: 3.2,
    unit: "NRS score (0-10)",
    notes: "Resting pain down to 3.2. Ice and isometric quadriceps sets well tolerated.",
    status: "improving",
    scale: "NRS 0-10",
    assessorName: "Dr. Elena Rostova, DPT",
    patientId: DEFAULT_PATIENT.id,
  },
  {
    id: "a002",
    kpiId: "rom",
    date: getCurrentDate(),
    category: "pain-mobility",
    baseline: 78,
    followUp: 118,
    unit: "degrees",
    notes: "Right knee flexion goniometry. Cleared for recumbent stationary cycle without resistance.",
    status: "improving",
    scale: "Goniometry (degrees)",
    assessorName: "Dr. Elena Rostova, DPT",
    patientId: DEFAULT_PATIENT.id,
  },
  {
    id: "a003",
    kpiId: "balance-coordination",
    date: getRelativeDate(2),
    category: "strength-balance",
    baseline: 32,
    followUp: 45,
    unit: "BBS score /56",
    notes: "Achieved 45/56 threshold. Low fall risk criteria achieved.",
    status: "improving",
    scale: "Berg Balance Scale 0-56",
    assessorName: "Dr. Elena Rostova, DPT",
    patientId: DEFAULT_PATIENT.id,
  },
  {
    id: "a004",
    kpiId: "adherence",
    date: getRelativeDate(4),
    category: "rehab-progress",
    baseline: 0,
    followUp: 86,
    unit: "%",
    notes: "Verified telemetry: 24/28 sessions completed on Physiomatics app.",
    status: "improving",
    scale: "Session completion %",
    assessorName: "Physiomatics Telemetry",
    patientId: DEFAULT_PATIENT.id,
  },
];

export const SAMPLE_ASSESSMENTS: Assessment[] = getStandardAssessments();

// ── Calculation Utilities ──────────────────────────────────────────────────────

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

// ── LocalStorage Real Patient Persistence ──────────────────────────────────────
const STORAGE_PREFIX = "physiomatics_kpi_";
const KEY_KPIS = `${STORAGE_PREFIX}definitions_v2`;
const KEY_ASSESSMENTS = `${STORAGE_PREFIX}assessments_v2`;
const KEY_PATIENT = `${STORAGE_PREFIX}patient_v2`;

export function loadSavedKPIs(): KPIDefinition[] {
  if (typeof window === "undefined") return getStandardKPIDefinitions();
  try {
    const raw = localStorage.getItem(KEY_KPIS);
    if (!raw) return getStandardKPIDefinitions();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === 15) {
      return parsed;
    }
  } catch (e) {
    console.error("Failed to load saved KPIs", e);
  }
  return getStandardKPIDefinitions();
}

export function saveKPIs(kpis: KPIDefinition[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY_KPIS, JSON.stringify(kpis));
  } catch (e) {
    console.error("Failed to save KPIs", e);
  }
}

export function loadSavedAssessments(): Assessment[] {
  if (typeof window === "undefined") return getStandardAssessments();
  try {
    const raw = localStorage.getItem(KEY_ASSESSMENTS);
    if (!raw) return getStandardAssessments();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    console.error("Failed to load assessments", e);
  }
  return getStandardAssessments();
}

export function saveAssessments(assessments: Assessment[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY_ASSESSMENTS, JSON.stringify(assessments));
  } catch (e) {
    console.error("Failed to save assessments", e);
  }
}

export function loadSavedPatient(): PatientProfile {
  if (typeof window === "undefined") return DEFAULT_PATIENT;
  try {
    const raw = localStorage.getItem(KEY_PATIENT);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load patient", e);
  }
  return DEFAULT_PATIENT;
}

export function savePatient(patient: PatientProfile) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY_PATIENT, JSON.stringify(patient));
  } catch (e) {
    console.error("Failed to save patient", e);
  }
}

export function resetAllToClinicalStandards(): { kpis: KPIDefinition[]; assessments: Assessment[]; patient: PatientProfile } {
  const kpis = getStandardKPIDefinitions();
  const assessments = getStandardAssessments();
  const patient = DEFAULT_PATIENT;
  if (typeof window !== "undefined") {
    localStorage.removeItem(KEY_KPIS);
    localStorage.removeItem(KEY_ASSESSMENTS);
    localStorage.removeItem(KEY_PATIENT);
  }
  return { kpis, assessments, patient };
}
