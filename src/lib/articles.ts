export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Elderly care" | "Rehabilitation" | "Clinics" | "Technology";
  readMins: number;
  date: string;
  sections: { h: string; p: string[] }[];
};

export const ARTICLES: Article[] = [
  {
    slug: "film-exercise-video-for-analysis",
    title: "How to film an exercise video your physiotherapist can actually use",
    excerpt: "Camera angle, lighting and distance matter more than the phone you use. A simple checklist for clear, reviewable recordings.",
    category: "Technology",
    readMins: 4,
    date: "2026-10-01",
    sections: [
      { h: "Why the recording matters", p: ["Pose-estimation software, and the human eye, can only judge what the camera sees. A joint hidden behind furniture or cut off at the edge of the frame cannot be measured reliably."] },
      { h: "The checklist", p: [
        "Film side-on for squats and knee extensions, and front-on for arm raises, so the movement happens across the camera's view rather than towards it.",
        "Keep your whole body in frame — head to feet — with a little space around you.",
        "Prop the phone at roughly hip height on a stable surface or tripod, about 2–3 metres away.",
        "Use even, front-facing light. Avoid standing in front of a bright window.",
        "Wear fitted clothing that contrasts with the background so joints are easy to see.",
      ] },
      { h: "What to do after recording", p: ["Watch it back once. If you can't clearly see your knees, hips and shoulders, re-film. Physiomatics shows a confidence score and will decline to report metrics when visibility is too low — that is intentional."] },
    ],
  },
  {
    slug: "seated-exercises-older-adults-safety",
    title: "Seated exercises for older adults: staying safe at home",
    excerpt: "Practical safety habits for older adults and caregivers doing a prescribed home exercise program.",
    category: "Elderly care",
    readMins: 5,
    date: "2026-09-24",
    sections: [
      { h: "Start with your prescribed program", p: ["Only do exercises that your physiotherapist or doctor has recommended for you. Generic routines online may not suit your joints, balance or health conditions."] },
      { h: "Set up the space", p: [
        "Use a sturdy chair without wheels, placed against a wall.",
        "Clear trip hazards such as rugs and cables.",
        "Keep water and a phone within reach.",
      ] },
      { h: "Listen to your body", p: ["Mild effort is expected; sharp pain, dizziness, chest discomfort or breathlessness are not. Stop and seek medical advice if these occur. In an emergency, call your local emergency number."] },
      { h: "How caregivers can help", p: ["Caregivers can position the camera, read out instructions, and help keep a simple log of sessions so progress can be discussed at the next appointment."] },
    ],
  },
  {
    slug: "sticking-to-home-rehab-program",
    title: "Why home rehab programs get skipped — and how to stick with yours",
    excerpt: "Busy days, unclear instructions and not seeing progress are common reasons. Small changes help.",
    category: "Rehabilitation",
    readMins: 4,
    date: "2026-09-15",
    sections: [
      { h: "Common reasons people stop", p: ["People often skip home exercises when instructions are unclear, when they can't tell whether they're doing it right, or when progress feels invisible between appointments."] },
      { h: "Habits that help", p: [
        "Attach exercises to an existing routine, like after morning tea.",
        "Keep sessions short and specific — the exact sets your physiotherapist prescribed.",
        "Record a short video occasionally so you and your physiotherapist can compare over time.",
      ] },
      { h: "Track, don't guess", p: ["Seeing repetition counts and movement range across weeks can make progress visible. Treat these numbers as estimates to discuss with your physiotherapist, not as a diagnosis."] },
    ],
  },
  {
    slug: "video-analytics-for-physiotherapy-clinics",
    title: "What video movement analysis can (and can't) do for a clinic",
    excerpt: "An honest look at single-camera pose estimation for reviewing home-exercise performance.",
    category: "Clinics",
    readMins: 6,
    date: "2026-09-05",
    sections: [
      { h: "What it does well", p: ["Single-camera pose estimation detects body landmarks and can estimate joint angles in the camera's plane, count repetitions, and flag low-visibility frames. That gives clinicians a quick view of how home exercises are being performed between visits."] },
      { h: "Where it falls short", p: ["A single 2D camera cannot measure true 3D joint angles, and accuracy drops with poor lighting, loose clothing, occlusion and off-axis filming. It is not a substitute for clinical assessment and should not be used to diagnose."] },
      { h: "Using it responsibly", p: [
        "Show confidence alongside every metric and hide metrics when confidence is low.",
        "Keep a physiotherapist in the loop for interpretation.",
        "Prefer on-device processing where possible to protect patient privacy.",
      ] },
    ],
  },
];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
