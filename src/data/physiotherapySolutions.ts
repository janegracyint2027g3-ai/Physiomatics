export interface PhysiotherapySolution {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  tag: string;
  iconName: string;
  image: string;
  imageAlt: string;
  shortDesc: string;
  heroIntro: string;
  whoBenefits: string[];
  focusAreas: string[];
  conditions: {
    name: string;
    description: string;
    clinicalFocus: string;
  }[];
  journeySteps: {
    step: number;
    title: string;
    description: string;
    icon: string;
    keyActivity: string;
  }[];
  functionalOutcomes: {
    title: string;
    description: string;
    category: string;
  }[];
  sampleExercises: {
    name: string;
    purpose: string;
    precautions: string;
    category: string;
  }[];
  techFeatures: {
    title: string;
    status: "Implemented in Physiomatics" | "In Clinical Validation" | "Planned Platform Module";
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  relatedSolutions: {
    slug: string;
    title: string;
    tag: string;
  }[];
  waContext: string;
}

export const PHYSIOTHERAPY_SOLUTIONS: PhysiotherapySolution[] = [
  {
    id: "orthopedic",
    slug: "orthopedic-physiotherapy",
    title: "Orthopedic Physiotherapy",
    shortTitle: "Orthopedic",
    tag: "MUSCULOSKELETAL & POST-OP",
    iconName: "Bandage",
    image: "/images/solutions/orthopedic.jpg",
    imageAlt: "Orthopedic physical therapy rehabilitation for knee mobility and joint recovery",
    shortDesc: "Joint mobility restoration, musculoskeletal injury rehabilitation, and structured post-operative protocols.",
    heroIntro: "Orthopedic physiotherapy focuses on evaluating and treating disorders of the musculoskeletal system—including joints, muscles, ligaments, and tendons. Whether recovering from joint replacement surgery or managing persistent mechanical back and knee discomfort, clinical care focuses on restoring functional movement, joint stability, and daily mechanical confidence.",
    whoBenefits: [
      "Individuals recovering from surgeries such as Total Knee or Hip Arthroplasty (TKA/THA) or rotator cuff repair.",
      "Patients managing osteoarthritis, meniscus tears, or tendon strains with clinical supervision.",
      "Individuals experiencing joint stiffness, reduced range of motion, and localized mechanical pain.",
      "Working professionals rehabilitating repetitive strain or postural overuse injuries.",
    ],
    focusAreas: [
      "Joint Mobilization & Range of Motion",
      "Post-Surgical Load Titration",
      "Musculoskeletal Strength & Stability",
      "Symmetric Weight-Bearing Mechanics",
    ],
    conditions: [
      {
        name: "Joint Stiffness & Contracture",
        description: "Post-immobilization or degenerative restrictions in natural synovial joint excursion.",
        clinicalFocus: "Gradual passive and active-assisted range restoration without provoking joint effusion.",
      },
      {
        name: "Post-Operative Recovery (TKA, ACL, Rotator Cuff)",
        description: "Phased tissue remodeling following surgical repair or prosthetic arthroplasty.",
        clinicalFocus: "Criterion-based progression respecting biological healing timelines and clinical precautions.",
      },
      {
        name: "Ligament & Tendon Overuse Strains",
        description: "Tendinopathy, patellar pain, or lateral ankle ligament laxity from repetitive mechanical load.",
        clinicalFocus: "Controlled eccentric deceleration, proprioceptive loading, and kinetic chain balancing.",
      },
      {
        name: "Osteoarthritis & Cartilage Wear",
        description: "Progressive degenerative joint stiffness and pain during daily load transfers.",
        clinicalFocus: "Low-impact periarticular strengthening to preserve joint clearance and reduce shear forces.",
      },
    ],
    journeySteps: [
      {
        step: 1,
        title: "Initial Assessment",
        description: "Review symptoms, medical history, joint mobility, strength, and functional limitations under clinical evaluation.",
        icon: "Stethoscope",
        keyActivity: "Goniometric baseline, surgical protocol review, subjective pain mapping.",
      },
      {
        step: 2,
        title: "Movement Evaluation",
        description: "Assess relevant movements, flexibility, balance, and everyday activities such as sitting, standing, and gait.",
        icon: "Activity",
        keyActivity: "Functional kinematics, compensatory gait analysis, bilateral symmetry checks.",
      },
      {
        step: 3,
        title: "Personalized Plan",
        description: "A qualified physiotherapist selects appropriate mobility, strengthening, or other rehabilitation interventions tailored to tissue tolerance.",
        icon: "Target",
        keyActivity: "Phased protocol selection, range-of-motion targets, frequency prescription.",
      },
      {
        step: 4,
        title: "Guided Rehabilitation",
        description: "Perform prescribed exercises and suitable therapeutic interventions with careful focus on form, tempo, and joint safety boundaries.",
        icon: "Gauge",
        keyActivity: "Real-time angular feedback, eccentric deceleration control, joint offloading.",
      },
      {
        step: 5,
        title: "Progress Monitoring",
        description: "Reassess pain, range of motion, strength, and functional ability across longitudinal clinical check-ins.",
        icon: "LineChart",
        keyActivity: "Comparative excursion graphs, repetition consistency, symptom response logging.",
      },
      {
        step: 6,
        title: "Functional Recovery",
        description: "Progress towards individualized daily activity, work, or mobility goals with home maintenance self-management strategies.",
        icon: "CheckCircle2",
        keyActivity: "Return to unassisted daily tasks, recreational activity reintegration, home program maintenance.",
      },
    ],
    functionalOutcomes: [
      {
        title: "Improved Joint Range of Motion",
        description: "Gradual restoration of functional degrees in flexion, extension, and rotation according to individual joint tolerance.",
        category: "Mobility",
      },
      {
        title: "Symmetric Muscle Activation",
        description: "Reduced quadriceps lag or compensatory limb guarding during transfers and walking.",
        category: "Strength",
      },
      {
        title: "Enhanced Daily Activity Tolerance",
        description: "Greater ease during stair ascent, chair transfers, lifting, and prolonged standing tasks.",
        category: "Functional",
      },
      {
        title: "Confident Home Exercise Compliance",
        description: "Higher adherence to prescribed home protocols between supervised clinical appointments.",
        category: "Adherence",
      },
    ],
    sampleExercises: [
      {
        name: "Seated Active-Assisted Knee Extension",
        purpose: "Encourages terminal quadriceps recruitment while maintaining a stable seated base of support.",
        precautions: "Do not hyperextend or push past sharp joint line discomfort. Discontinue if sudden swelling occurs.",
        category: "Knee Mobility",
      },
      {
        name: "Supported Scapular Wall Slide",
        purpose: "Promotes upward scapular rotation and glenohumeral elevation within comfortable scapular planes.",
        precautions: "Avoid shrugging shoulders toward the ears or pushing into impingement pain.",
        category: "Shoulder Mechanics",
      },
      {
        name: "Closed-Chain Bilateral Mini-Squat to Chair",
        purpose: "Develops controlled hip and knee eccentric deceleration with tactile safety assurance.",
        precautions: "Ensure knees track comfortably over toes; avoid inward valgus collapse.",
        category: "Lower Extremity",
      },
    ],
    techFeatures: [
      {
        title: "Real-Time Angle Gating & Rep Counting",
        status: "Implemented in Physiomatics",
        description: "On-device MediaPipe computer vision measures joint angles (e.g. knee flexion/extension) in real time directly inside the browser.",
      },
      {
        title: "Zero-Cloud On-Device Privacy",
        status: "Implemented in Physiomatics",
        description: "All pose detection runs on your local browser GPU/CPU. Camera video streams never get transmitted or recorded to external servers.",
      },
      {
        title: "Clinical Excursion Telemetry",
        status: "In Clinical Validation",
        description: "Objective logs tracking maximum achieved degrees and session repetition consistency to share with your physical therapist.",
      },
      {
        title: "AI Kinematic Asymmetry Screening",
        status: "Planned Platform Module",
        description: "Under clinical review: Bilateral comparison algorithms to detect subtle compensatory weight-shifting during squat and lunge cycles.",
      },
    ],
    faqs: [
      {
        question: "What is Orthopedic Physiotherapy?",
        answer: "Orthopedic physiotherapy is a specialized healthcare discipline dedicated to assessing, diagnosing, and treating musculoskeletal injuries, post-surgical conditions, joint stiffness, and chronic structural discomfort.",
      },
      {
        question: "Who may benefit from Orthopedic Physiotherapy?",
        answer: "Individuals recovering from orthopedic surgery (such as knee, hip, or shoulder interventions), people managing sports injuries, tendon strains, ligament sprains, or individuals experiencing movement restrictions from osteoarthritis.",
      },
      {
        question: "What happens during an initial clinical assessment?",
        answer: "A licensed physiotherapist thoroughly reviews your medical records and surgical reports, measures joint active and passive range of motion, tests muscle strength, evaluates functional movement, and defines clear rehabilitation goals.",
      },
      {
        question: "How is recovery progress monitored?",
        answer: "Progress is monitored through objective physical measurements (goniometric joint degrees, manual muscle testing, functional tests) and session adherence tracking. Physiomatics provides digital feedback to reinforce home session compliance.",
      },
      {
        question: "Can rehabilitation exercises be safely performed at home?",
        answer: "Yes, once appropriate exercises have been assessed and prescribed by a qualified clinician. Physiomatics supports home adherence with visual biofeedback dials and repetition pacing.",
      },
      {
        question: "When should a person seek immediate professional medical evaluation?",
        answer: "Seek immediate medical attention if you experience sudden severe joint swelling, inability to bear any weight, signs of infection (heat, redness, fever), calf pain or shortness of breath post-surgery, or progressive numbness.",
      },
    ],
    relatedSolutions: [
      { slug: "sports-physiotherapy", title: "Sports Physiotherapy", tag: "ATHLETIC RECOVERY" },
      { slug: "posture-spinal-physiotherapy", title: "Posture and Spinal Physiotherapy", tag: "SPINAL HEALTH" },
      { slug: "geriatric-physiotherapy", title: "Geriatric Physiotherapy", tag: "MOBILITY PRESERVATION" },
    ],
    waContext: "orthopedic",
  },
  {
    id: "neurological",
    slug: "neurological-physiotherapy",
    title: "Neurological Physiotherapy",
    shortTitle: "Neurological",
    tag: "NEURO-REHAB & MOTOR CONTROL",
    iconName: "Activity",
    image: "/images/solutions/neurological.jpg",
    imageAlt: "Neurological physical therapy gait training and balance rehabilitation in clinical setting",
    shortDesc: "Movement retraining, balance recovery, and functional independence for neurological and motor conditions.",
    heroIntro: "Neurological physiotherapy specializes in treating individuals with movement and functional impairments arising from conditions affecting the central and peripheral nervous systems. Rooted in neuroplasticity principles, interventions emphasize repetitive, purposeful, and safe movement practice to foster motor control, balance, and daily independence.",
    whoBenefits: [
      "Individuals recovering from stroke (cerebrovascular accident) working on hemiparetic movement and gait.",
      "Persons managing Parkinson's disease seeking balance confidence and rhythmic movement cadence.",
      "Individuals with Multiple Sclerosis, peripheral neuropathies, or spinal cord conditions.",
      "Patients experiencing vestibular imbalance, coordination difficulties, or recurrent near-falls.",
    ],
    focusAreas: [
      "Motor Re-Education & Coordination",
      "Dynamic Balance & Fall Prevention",
      "Gait Retraining & Cadence Guidance",
      "Functional Transfer Independence",
    ],
    conditions: [
      {
        name: "Stroke & Hemiparesis",
        description: "Unilateral muscle weakness, spasticity, and altered sensory feedback impacting balance and walking.",
        clinicalFocus: "Task-specific motor relearning, bilateral coordination, and compensatory movement reduction.",
      },
      {
        name: "Parkinson's Disease & Bradykinesia",
        description: "Movement slowness, postural instability, muscle rigidity, and hesitation during movement initiation.",
        clinicalFocus: "Large-amplitude movement training, rhythmic auditory and visual cues, and balance perturbation recovery.",
      },
      {
        name: "Multiple Sclerosis & Ataxia",
        description: "Fatigue, muscle weakness, and coordination challenges affecting everyday gait mechanics.",
        clinicalFocus: "Energy-conserving movement patterns, core stabilization, and supported mobility drills.",
      },
      {
        name: "Peripheral Neuropathy & Sensory Deficits",
        description: "Reduced proprioceptive input from the lower limbs elevating fall risk and unsteady stance.",
        clinicalFocus: "Visual compensatory cues, ankle proprioceptive strategies, and safe stepping mechanics.",
      },
    ],
    journeySteps: [
      {
        step: 1,
        title: "Neurological and Functional Assessment",
        description: "Review movement, coordination, balance, walking, muscle tone, and relevant medical history in detail.",
        icon: "Stethoscope",
        keyActivity: "Baseline balance scales (Berg/BBS, TUG), sensory screening, motor control evaluation.",
      },
      {
        step: 2,
        title: "Identify Movement Goals",
        description: "Establish individualized goals for transfers, balance, gait, and daily independence with the patient and caregivers.",
        icon: "Target",
        keyActivity: "Collaborative goal setting (e.g., confident independent bed-to-chair transfer).",
      },
      {
        step: 3,
        title: "Rehabilitation Planning",
        description: "Select suitable, supervised exercises and functional training adapted to the person's motor stage and fatigue tolerance.",
        icon: "Layers",
        keyActivity: "Neuroplasticity-informed drill structuring, support level titration, pacing plan.",
      },
      {
        step: 4,
        title: "Movement Practice",
        description: "Practice appropriate balance, coordination, gait, and task-specific activities in controlled, safe environments.",
        icon: "Activity",
        keyActivity: "Supported weight shifts, stepped obstacles, paced seated and standing repetitions.",
      },
      {
        step: 5,
        title: "Progress Assessment",
        description: "Measure changes in functional mobility, movement confidence, and safety during routine tasks.",
        icon: "LineChart",
        keyActivity: "Longitudinal gait cadence, balance score re-evaluations, fatigue logs.",
      },
      {
        step: 6,
        title: "Maintenance Planning",
        description: "Develop an appropriate ongoing exercise, family guidance, and environmental safety plan.",
        icon: "ShieldCheck",
        keyActivity: "Home hazard mitigation, caregiver transfer techniques, daily maintenance routine.",
      },
    ],
    functionalOutcomes: [
      {
        title: "Enhanced Postural Balance",
        description: "Better steady-state and reactive postural control when standing or shifting weight.",
        category: "Balance",
      },
      {
        title: "Smoother Gait Coordination",
        description: "More consistent step length, pacing, and reduced compensatory trunk lean during walking.",
        category: "Gait",
      },
      {
        title: "Greater Functional Autonomy",
        description: "Increased confidence performing sit-to-stand transfers, dressing, and room-to-room mobility.",
        category: "Daily Living",
      },
      {
        title: "Reduced Fear of Falling",
        description: "Gradual reduction in movement avoidance behaviors through supervised practice.",
        category: "Confidence",
      },
    ],
    sampleExercises: [
      {
        name: "Supported Weight-Shifting with Counter Top Assist",
        purpose: "Retrains lateral and anterior-posterior pelvic displacement for balanced stance control.",
        precautions: "Must be practiced near a sturdy support with caregiver presence if balance is impaired.",
        category: "Postural Stability",
      },
      {
        name: "Seated Trunk Rotation with Visual Targeting",
        purpose: "Encourages spinal dissociation and symmetrical rotational motor control.",
        precautions: "Maintain upright posture; stop if lightheadedness or dizziness develops.",
        category: "Trunk Control",
      },
      {
        name: "High-Knee Stepping in Place (Supported)",
        purpose: "Reinforces hip flexor recruitment and single-leg stance balance time.",
        precautions: "Perform with two hands on a parallel bar or sturdy surface; ensure non-slip footwear.",
        category: "Stepping Mechanics",
      },
    ],
    techFeatures: [
      {
        title: "Visual Form Guides for Movement Symmetry",
        status: "Implemented in Physiomatics",
        description: "Interactive visual skeletons reflect real-time patient movement on screen, supporting visual motor feedback during home exercises.",
      },
      {
        title: "Cadence & Repetition Pacing Timer",
        status: "Implemented in Physiomatics",
        description: "Auditory and visual cadence pacing prevents rapid erratic movements and encourages steady motor timing.",
      },
      {
        title: "Automated Repetition Quality Flagging",
        status: "In Clinical Validation",
        description: "Validates whether limb excursion crossed therapist-defined thresholds before awarding completion points.",
      },
      {
        title: "Postural Sway & Velocity Estimator",
        status: "Planned Platform Module",
        description: "Under clinical review: Center-of-mass trajectory tracking to quantify static stance sway in clinical environments.",
      },
    ],
    faqs: [
      {
        question: "What is Neurological Physiotherapy?",
        answer: "Neurological physiotherapy is clinical rehabilitation focused on people affected by conditions of the brain, spinal cord, or nervous system to stimulate neuroplastic recovery and restore mobility.",
      },
      {
        question: "Can neuro-physiotherapy help years after a stroke?",
        answer: "Yes. Neuroplasticity—the nervous system's capacity to reorganize neural connections—continues throughout life. While early rehabilitation is optimal, purposeful movement practice can yield meaningful functional gains even long after onset.",
      },
      {
        question: "What should family members or caregivers expect during sessions?",
        answer: "Clinicians actively educate caregivers on safe transfer handling, proper body mechanics, positioning strategies, and ways to encourage safe activity without creating injury risks.",
      },
      {
        question: "How does Physiomatics technology support neurological rehabilitation?",
        answer: "Physiomatics provides real-time visual biofeedback on posture and repetitions during home exercise sessions, helping patients visualize their movement symmetries between clinic visits.",
      },
      {
        question: "Does digital software replace a neurological physiotherapist?",
        answer: "No. Physiomatics is strictly an educational exercise biofeedback companion. Clinical evaluation, manual facilitation, and safety clearance by a qualified clinician are essential.",
      },
      {
        question: "When should neuro-rehabilitation exercises be paused?",
        answer: "Pause immediately and consult your medical provider if you experience sudden dizziness, new vision changes, severe fatigue, loss of sensation, or cardiovascular distress.",
      },
    ],
    relatedSolutions: [
      { slug: "geriatric-physiotherapy", title: "Geriatric Physiotherapy", tag: "SENIOR HEALTH" },
      { slug: "posture-spinal-physiotherapy", title: "Posture and Spinal Physiotherapy", tag: "SPINE & CORE" },
      { slug: "orthopedic-physiotherapy", title: "Orthopedic Physiotherapy", tag: "MUSCULOSKELETAL" },
    ],
    waContext: "clinic",
  },
  {
    id: "sports",
    slug: "sports-physiotherapy",
    title: "Sports Physiotherapy",
    shortTitle: "Sports",
    tag: "ATHLETIC RECOVERY & PERFORMANCE",
    iconName: "Trophy",
    image: "/images/solutions/sports.jpg",
    imageAlt: "Sports physiotherapy dynamic rehabilitation, athletic mobility, and kinematic analysis",
    shortDesc: "Athletic injury rehabilitation, progressive loading, and objective return-to-sport evaluation.",
    heroIntro: "Sports physiotherapy focuses on prevention, acute triage, and comprehensive functional rehabilitation of athletic injuries. Combining kinematic movement analysis, progressive overload, and sport-specific training, clinical therapy helps athletes of all competitive levels regain peak performance safely and minimize reinjury risk.",
    whoBenefits: [
      "Competitive and recreational athletes recovering from sprains, tears, or fractures.",
      "Runners, jumpers, and field athletes managing tendinopathies (patellar, Achilles, hamstring).",
      "Individuals preparing for safe return-to-play following ACL reconstruction or shoulder stabilization.",
      "Athletes seeking kinematic movement screening to address biomechanical inefficiencies.",
    ],
    focusAreas: [
      "High-Demand Kinetic Chain Loading",
      "Neuromuscular Agility & Deceleration",
      "Biomechanical Asymmetry Correction",
      "Criterion-Based Return-to-Play Testing",
    ],
    conditions: [
      {
        name: "Anterior Cruciate Ligament (ACL) Tears",
        description: "Knee instability following ligament rupture or surgical graft reconstruction.",
        clinicalFocus: "Restoring quad index, hamstring co-contraction, and eliminating knee valgus during jump-landings.",
      },
      {
        name: "Hamstring Strain & Groin Strains",
        description: "Acute muscle tears during high-speed sprinting, deceleration, or rapid change of direction.",
        clinicalFocus: "Lengthened-state eccentric loading, pelvic stability, and progressive high-velocity running exposure.",
      },
      {
        name: "Rotator Cuff & Labral Shoulder Injuries",
        description: "Overhead throwing injuries, shoulder instability, and subacromial mechanical friction.",
        clinicalFocus: "Scapulothoracic rhythm, posterior cuff eccentric endurance, and kinetic chain energy transfer.",
      },
      {
        name: "Patellar & Achilles Tendinopathy",
        description: "Chronic tendon overload resulting in localized collagen disruption and reduced spring capacity.",
        clinicalFocus: "Heavy slow resistance (HSR) protocols, isometric pain-relief windows, and progressive plyometric loading.",
      },
    ],
    journeySteps: [
      {
        step: 1,
        title: "Injury and Activity Assessment",
        description: "Review injury history, symptoms, specific sport, position, and functional demands in detail.",
        icon: "Stethoscope",
        keyActivity: "Mechanism of injury analysis, orthopedic joint stability tests, imaging review.",
      },
      {
        step: 2,
        title: "Functional Evaluation",
        description: "Assess relevant strength, mobility, balance, and sport-specific movements across both limbs.",
        icon: "Gauge",
        keyActivity: "Limb Symmetry Index (LSI), goniometric angles, force-velocity movement assessment.",
      },
      {
        step: 3,
        title: "Rehabilitation Plan",
        description: "Establish progressive recovery and return-to-sport goals based on tissue healing and functional criteria.",
        icon: "Target",
        keyActivity: "Criterion-phased roadmap (Acute → Strength → Plyometrics → Sport-Specific).",
      },
      {
        step: 4,
        title: "Progressive Exercise",
        description: "Use appropriately prescribed mobility, strength, and neuromuscular exercises under strict kinematic control.",
        icon: "Activity",
        keyActivity: "Eccentric overload, rate of force development (RFD), multi-planar core stability.",
      },
      {
        step: 5,
        title: "Sport-Specific Training",
        description: "Gradually reintroduce relevant movements, cutting drills, and agility tasks when clinically appropriate.",
        icon: "Sparkles",
        keyActivity: "Controlled deceleration drills, reactive agility, sport-simulated conditioning.",
      },
      {
        step: 6,
        title: "Return-to-Sport Evaluation",
        description: "Assess readiness against individualized functional criteria (e.g., >90% LSI, hop testing) before unrestricted activity.",
        icon: "Trophy",
        keyActivity: "Y-Balance, triple hop testing, athlete psychological readiness score (ACL-RSI).",
      },
    ],
    functionalOutcomes: [
      {
        title: "Restored Bilateral Symmetry",
        description: "Achieving >90% limb symmetry in strength, range, and jump landing attenuation.",
        category: "Kinematics",
      },
      {
        title: "Controlled Deceleration Mechanics",
        description: "Improved trunk and knee alignment preventing excessive coronal valgus collapse.",
        category: "Biomechanics",
      },
      {
        title: "Restored Rate of Force Development",
        description: "Explosive movement recovery with minimal hesitation or compensatory offloading.",
        category: "Performance",
      },
      {
        title: "Confidence in High-Velocity Play",
        description: "Reduced psychological fear of reinjury during contact and uncontrolled sporting tasks.",
        category: "Psychological",
      },
    ],
    sampleExercises: [
      {
        name: "Single-Leg Romanian Deadlift (RDL)",
        purpose: "Develops posterior chain eccentric hamstring control and hip proprioception.",
        precautions: "Keep pelvis square; avoid rounding lumbar spine. Use wall fingertip balance if unstable.",
        category: "Posterior Chain",
      },
      {
        name: "Tempo Squat with Valgus Band Cue",
        purpose: "Reinforces gluteus medius abductor recruitment to eliminate inward knee collapse during descent.",
        precautions: "Maintain three points of foot contact; avoid collapsing foot arches.",
        category: "Lower Body Stability",
      },
      {
        name: "Prone Scapular Y-T-W Raises",
        purpose: "Strengthens lower trapezius, serratus anterior, and external rotators for overhead stability.",
        precautions: "Avoid lumbar hyperextension; keep movements controlled without momentum.",
        category: "Shoulder Dynamics",
      },
    ],
    techFeatures: [
      {
        title: "Angular Kinematics via Web Vision",
        status: "Implemented in Physiomatics",
        description: "Measures knee, hip, and elbow flexion angles live at up to 30 frames per second using MediaPipe pose detection.",
      },
      {
        title: "Repetition Tempo & Depth Thresholds",
        status: "Implemented in Physiomatics",
        description: "Enforces full lockout and target depth requirements to prevent shallow athletic repetitions.",
      },
      {
        title: "Limb Asymmetry Detection",
        status: "In Clinical Validation",
        description: "Compares bilateral squat depth and knee alignment during dual-leg functional tests.",
      },
      {
        title: "Jump-Landing Valgus Risk Score",
        status: "Planned Platform Module",
        description: "Under clinical review: Automated coronal plane frontal angle tracking during vertical drop jumps.",
      },
    ],
    faqs: [
      {
        question: "What is Sports Physiotherapy?",
        answer: "Sports physiotherapy is an athletic healthcare discipline focused on diagnosing, treating, and preventing sports injuries while maximizing return-to-sport physical readiness.",
      },
      {
        question: "When is it safe to return to competitive sports after injury?",
        answer: "Safe return depends on meeting objective functional criteria—such as limb symmetry index >90%, clinical strength tests, hop tests, and psychological readiness—rather than calendar time alone.",
      },
      {
        question: "Can sports physiotherapy help weekend warriors and recreational runners?",
        answer: "Absolutely. Most sports injuries occur in recreational athletes who encounter rapid training spikes. Physiotherapy helps restore joint mechanics and design structured load progression.",
      },
      {
        question: "How does Physiomatics assist athletic rehabilitation?",
        answer: "Physiomatics validates movement quality during home strengthening and conditioning sessions, logging angular data that athletes can share with coaches and therapists.",
      },
      {
        question: "What is the difference between physical therapy and fitness training?",
        answer: "Physical therapy focuses on pathology, joint kinematics, tissue healing physiology, and clinical precautions. Fitness training typically focuses on conditioning healthy tissues.",
      },
      {
        question: "When should an athlete pause their rehabilitation exercises?",
        answer: "Stop immediately if you experience sharp catching pain inside a joint, joint giving way, sudden swelling, or symptoms exceeding 3/10 on the visual analog scale that linger past 24 hours.",
      },
    ],
    relatedSolutions: [
      { slug: "orthopedic-physiotherapy", title: "Orthopedic Physiotherapy", tag: "JOINT REHAB" },
      { slug: "posture-spinal-physiotherapy", title: "Posture and Spinal Physiotherapy", tag: "CORE MECHANICS" },
      { slug: "cardiorespiratory-physiotherapy", title: "Cardiorespiratory Physiotherapy", tag: "CONDITIONING" },
    ],
    waContext: "rehab",
  },
  {
    id: "geriatric",
    slug: "geriatric-physiotherapy",
    title: "Geriatric Physiotherapy",
    shortTitle: "Geriatric",
    tag: "SENIOR MOBILITY & FALL RISK",
    iconName: "HeartHandshake",
    image: "/images/solutions/geriatric.jpg",
    imageAlt: "Geriatric physiotherapy safe balance and mobility exercises for older adults",
    shortDesc: "Age-appropriate mobility preservation, fall risk reduction, and everyday functional confidence.",
    heroIntro: "Geriatric physiotherapy addresses the unique health, musculoskeletal, and physiological considerations of older adults. By focusing on fall prevention, joint flexibility, functional transfers, and safe muscle strengthening, individualized therapy promotes healthy aging, independence, and daily safety at home.",
    whoBenefits: [
      "Older adults experiencing balance insecurity, unsteadiness, or a history of recent falls.",
      "Seniors recovering from hip fractures, joint replacements, or prolonged hospital deconditioning.",
      "Individuals living with osteoporosis, osteoarthritis, or spinal stenosis seeking safe activity.",
      "Family caregivers seeking guidance on safe transfer techniques and home mobility routines.",
    ],
    focusAreas: [
      "Fall Risk Mitigation & Stance Balance",
      "Chair Transfers & Bed Mobility",
      "Safe Functional Muscle Strengthening",
      "Postural Confidence & Endurance",
    ],
    conditions: [
      {
        name: "Fall Risk & Postural Instability",
        description: "Age-related decline in proprioception, vestibular response, and protective stepping reactions.",
        clinicalFocus: "Narrow base of support drills, tandem standing with support, and reactive balance training.",
      },
      {
        name: "Sarcopenia & Muscle Deconditioning",
        description: "Progressive loss of skeletal muscle mass and explosive power essential for rising from chairs.",
        clinicalFocus: "Progressive low-resistance closed-chain functional movements like sit-to-stands.",
      },
      {
        name: "Osteoporosis & Fracture Risk",
        description: "Reduced bone mineral density requiring avoidance of high-risk spinal flexion and uncontrolled impact.",
        clinicalFocus: "Axial weight-bearing, safe spinal extension exercises, and balance to prevent falls.",
      },
      {
        name: "Degenerative Joint Stiffness",
        description: "Chronic morning stiffness and restricted excursion in hips, knees, and ankles.",
        clinicalFocus: "Gentle synovial active range-of-motion, seated mobility, and warm-up pacing.",
      },
    ],
    journeySteps: [
      {
        step: 1,
        title: "Mobility and Safety Assessment",
        description: "Review walking, transfers, balance, strength, and fall history in an unhurried clinical environment.",
        icon: "Stethoscope",
        keyActivity: "Timed Up and Go (TUG), 30-Second Chair Stand, fall risk checklist.",
      },
      {
        step: 2,
        title: "Daily Activity Evaluation",
        description: "Identify difficulties with standing, climbing steps, dressing, and routine domestic activities.",
        icon: "Activity",
        keyActivity: "Functional independence measure review, assistive device inspection (walker, cane).",
      },
      {
        step: 3,
        title: "Individualized Plan",
        description: "Select safe, appropriate exercises according to the person's unique abilities, cardiovascular health, and preferences.",
        icon: "Target",
        keyActivity: "Seated or supported progression planning, caregiver involvement parameters.",
      },
      {
        step: 4,
        title: "Supervised Exercise",
        description: "Practice suitable strength, balance, flexibility, and mobility activities with large visual prompts.",
        icon: "HeartHandshake",
        keyActivity: "Supported heel-toe raises, seated knee extensions, guided posture alignment.",
      },
      {
        step: 5,
        title: "Progress Monitoring",
        description: "Reassess walking speed, chair transfers, confidence, and functional independence across sessions.",
        icon: "LineChart",
        keyActivity: "Repeat TUG testing, balance hold duration, subjective fear of falling scale.",
      },
      {
        step: 6,
        title: "Ongoing Wellness Plan",
        description: "Provide an individualized home activity and fall-prevention plan with home hazard reduction advice.",
        icon: "ShieldCheck",
        keyActivity: "Living room lighting, rug removal recommendations, daily routine reinforcement.",
      },
    ],
    functionalOutcomes: [
      {
        title: "Reduced Fall Incident Risk",
        description: "Strengthened balance recovery reactions and greater foot clearance during walking.",
        category: "Safety",
      },
      {
        title: "Independent Chair Transfers",
        description: "Ability to rise smoothly from dining chairs or couches without excessive upper limb pushing.",
        category: "Mobility",
      },
      {
        title: "Prolonged Walking Endurance",
        description: "Increased stamina for neighborhood walks, grocery shopping, and family social events.",
        category: "Endurance",
      },
      {
        title: "Caregiver Peace of Mind",
        description: "Clear routine structure reducing anxiety for family members supporting home recovery.",
        category: "Caregiver",
      },
    ],
    sampleExercises: [
      {
        name: "Seated Knee Extension (Long Arc Quad)",
        purpose: "Strengthens quadriceps in a safe, seated, zero-fall-risk position.",
        precautions: "Do not hold breath (avoid Valsalva maneuver); keep back supported against the chair.",
        category: "Seated Strength",
      },
      {
        name: "Supported Kitchen Counter Heel-Toe Raises",
        purpose: "Activates calf and anterior tibialis muscles essential for trip recovery and foot clearance.",
        precautions: "Both hands must remain firmly rested on a stable kitchen counter or handrail.",
        category: "Ankle Mobility",
      },
      {
        name: "Assisted Sit-to-Stand with Armrest Support",
        purpose: "Functional strengthening of hip and knee extensors for everyday seat rising.",
        precautions: "Ensure feet are planted firmly beneath knees; do not rush or drop abruptly back into chair.",
        category: "Transfer Training",
      },
    ],
    techFeatures: [
      {
        title: "High-Contrast, Large UI for Older Adults",
        status: "Implemented in Physiomatics",
        description: "Interface features large fonts, high-contrast controls, and clear audio chimes for effortless senior interaction.",
      },
      {
        title: "Dedicated Seated Exercise Modes",
        status: "Implemented in Physiomatics",
        description: "Computer vision algorithms specifically configured to detect seated joint angles without requiring standing camera framing.",
      },
      {
        title: "Caregiver Supervision Companion",
        status: "In Clinical Validation",
        description: "Allows family members to monitor repetitions and session logs without cloud video privacy concerns.",
      },
      {
        title: "Sit-to-Stand Power & Velocity Analysis",
        status: "Planned Platform Module",
        description: "Under clinical review: Measures transfer ascent velocity to objectively gauge lower limb power over time.",
      },
    ],
    faqs: [
      {
        question: "What is Geriatric Physiotherapy?",
        answer: "Geriatric physiotherapy is specialized physical therapy designed to support the physical health, functional independence, balance, and safe mobility of older adults.",
      },
      {
        question: "Is it safe for someone in their 80s or 90s to begin physiotherapy exercises?",
        answer: "Yes, when guided by a thorough clinical assessment. Safe, individualized exercises can build strength, improve balance, and increase bone density at virtually any age.",
      },
      {
        question: "What is the primary goal of fall prevention therapy?",
        answer: "To identify balance risks, strengthen lower extremity muscle groups, retrain protective postural reactions, and review home environmental safety factors.",
      },
      {
        question: "How does Physiomatics support elderly patients?",
        answer: "Physiomatics offers simplified seated exercise tracking, auditory chimes when full movement is achieved, and zero-cloud video processing for private home living spaces.",
      },
      {
        question: "Should seniors exercise alone at home?",
        answer: "Older adults with significant unsteadiness should perform standing exercises only under supervision. Physiomatics prioritizes seated options for unassisted practice.",
      },
      {
        question: "When should an older adult stop exercising and call a doctor?",
        answer: "Stop immediately if there is chest pressure, irregular heartbeat, sudden dizziness, shortness of breath, joint clicking accompanied by sharp pain, or feeling faint.",
      },
    ],
    relatedSolutions: [
      { slug: "neurological-physiotherapy", title: "Neurological Physiotherapy", tag: "BALANCE & GAIT" },
      { slug: "orthopedic-physiotherapy", title: "Orthopedic Physiotherapy", tag: "JOINT HEALTH" },
      { slug: "cardiorespiratory-physiotherapy", title: "Cardiorespiratory Physiotherapy", tag: "ENDURANCE" },
    ],
    waContext: "elderly",
  },
  {
    id: "cardiorespiratory",
    slug: "cardiorespiratory-physiotherapy",
    title: "Cardiorespiratory Physiotherapy",
    shortTitle: "Cardiorespiratory",
    tag: "PULMONARY & BREATHING REHAB",
    iconName: "Gauge",
    image: "/images/solutions/cardiorespiratory.jpg",
    imageAlt: "Cardiorespiratory physiotherapy breathing exercises and supervised respiratory rehabilitation",
    shortDesc: "Breathing pattern retraining, airway clearance, and supervised aerobic exercise tolerance.",
    heroIntro: "Cardiorespiratory physiotherapy focuses on optimizing lung mechanics, clearing retained airway secretions, improving ventilation-perfusion matching, and enhancing cardiovascular exercise tolerance. Patients living with chronic respiratory conditions or recovering from thoracic surgery receive evidence-informed guidance to breathe with greater ease and reclaim stamina.",
    whoBenefits: [
      "Individuals managing Chronic Obstructive Pulmonary Disease (COPD), bronchiectasis, or asthma.",
      "Patients recovering from thoracic, cardiac, or major abdominal surgeries.",
      "Individuals experiencing post-viral fatigue, post-COVID respiratory symptoms, or dyspnea on exertion.",
      "People seeking breathing retraining to overcome hyperventilation and apical breathing habits.",
    ],
    focusAreas: [
      "Diaphragmatic Breathing & Pursed-Lip Technique",
      "Airway Clearance Strategies (ACBT)",
      "Monitored Aerobic Exercise Progression",
      "Thoracic Expansion & Chest Wall Mobility",
    ],
    conditions: [
      {
        name: "COPD & Chronic Bronchitis",
        description: "Airflow limitation and gas trapping causing breathlessness during minimal exertion.",
        clinicalFocus: "Pursed-lip exhalation to create positive end-expiratory pressure, pacing, and peripheral muscle endurance.",
      },
      {
        name: "Post-Thoracic & Cardiac Surgery",
        description: "Reduced lung volumes, atelectasis, and sternal precautions following surgical procedures.",
        clinicalFocus: "Incentive spirometry education, splinted coughing, and gentle progressive thoracic mobilization.",
      },
      {
        name: "Bronchiectasis & Secretion Retention",
        description: "Abnormal bronchial dilation leading to mucus pooling and recurrent pulmonary infections.",
        clinicalFocus: "Active Cycle of Breathing Techniques (ACBT), gravity-assisted drainage, and huffing.",
      },
      {
        name: "Dysfunctional Breathing Patterns",
        description: "Apical chest breathing, hyperventilation, and elevated sympathetic drive causing air hunger.",
        clinicalFocus: "Diaphragmatic recruitment, nasal pacing, and autonomic breathing regulation.",
      },
    ],
    journeySteps: [
      {
        step: 1,
        title: "Clinical Assessment",
        description: "Review medical history, respiratory symptoms, breathing mechanics, exercise tolerance, and vital signs.",
        icon: "Stethoscope",
        keyActivity: "Breath sound evaluation, pulse oximetry, Modified Borg Dyspnea scale baseline.",
      },
      {
        step: 2,
        title: "Respiratory Evaluation",
        description: "Assess chest wall excursion, diaphragmatic excursion, cough effectiveness, and breathing pattern.",
        icon: "Gauge",
        keyActivity: "Thoracic perimeter expansion, posture influence on breathing, sputum assessment.",
      },
      {
        step: 3,
        title: "Treatment Planning",
        description: "Select suitable breathing techniques, mobility, exercise, or airway-clearance interventions.",
        icon: "Target",
        keyActivity: "Airway clearance protocol selection, target heart rate reserve, oxygen saturation safety buffers.",
      },
      {
        step: 4,
        title: "Guided Rehabilitation",
        description: "Practice prescribed interventions with supervised pacing and careful dyspnea symptom monitoring.",
        icon: "Activity",
        keyActivity: "Paced walking, seated cycle intervals, diaphragmatic breathing biofeedback.",
      },
      {
        step: 5,
        title: "Response Monitoring",
        description: "Monitor oxygen saturation, heart rate response, breathlessness recovery time, and exercise tolerance.",
        icon: "LineChart",
        keyActivity: "Longitudinal 6-Minute Walk Test distance, oxygen recovery time, Borg scale rating.",
      },
      {
        step: 6,
        title: "Home and Maintenance Plan",
        description: "Establish an individualized home activity and breathing maintenance routine with exacerbation action rules.",
        icon: "ShieldCheck",
        keyActivity: "Daily airway clearance schedule, paced walking goals, energy conservation pacing.",
      },
    ],
    functionalOutcomes: [
      {
        title: "Decreased Breathlessness on Exertion",
        description: "Lower subjective dyspnea ratings during stair ascent, walking, and household tasks.",
        category: "Ventilation",
      },
      {
        title: "Effective Airway Clearance",
        description: "Greater clearance of bronchial secretions with reduced coughing fatigue.",
        category: "Airway",
      },
      {
        title: "Enhanced Exercise Tolerance",
        description: "Extended continuous walking duration and improved peripheral muscle oxygen utilization.",
        category: "Endurance",
      },
      {
        title: "Respiratory Panic Management",
        description: "Mastery of recovery positions and pursed-lip breathing during sudden breathless episodes.",
        category: "Control",
      },
    ],
    sampleExercises: [
      {
        name: "Pursed-Lip Exhalation with Diaphragmatic Cueing",
        purpose: "Prevents small airway collapse and promotes slower, deeper alveolar ventilation.",
        precautions: "Do not force exhalation; allow air to escape softly as if flickering a candle.",
        category: "Breathing Retraining",
      },
      {
        name: "Active Cycle of Breathing Technique (ACBT)",
        purpose: "Mobilizes retained bronchial secretions from periphery to central airways.",
        precautions: "Perform in upright seated position. Avoid violent coughing; use gentle 'huffs'.",
        category: "Airway Clearance",
      },
      {
        name: "Seated Thoracic Expansion with Arm Elevation",
        purpose: "Expands lateral rib cage dimensions and enhances lung base ventilation.",
        precautions: "Respect sternal precautions if post-cardiac surgery; keep arm raises within comfortable limits.",
        category: "Thoracic Mobility",
      },
    ],
    techFeatures: [
      {
        title: "Paced Exercise Cadence Metronome",
        status: "Implemented in Physiomatics",
        description: "Visual cadence timer assists patients in maintaining steady, controlled movement rates to prevent rapid hyperventilation.",
      },
      {
        title: "Thoracic Landmark Elevation Tracking",
        status: "In Clinical Validation",
        description: "Computer vision tracks upper chest versus abdominal displacement to visually encourage diaphragmatic breathing.",
      },
      {
        title: "Session Duration & Recovery Telemetry",
        status: "In Clinical Validation",
        description: "Logs total active duration and rest interval frequency for clinical review.",
      },
      {
        title: "Integrated Pulse Oximetry Telemetry",
        status: "Planned Platform Module",
        description: "Under clinical review: Bluetooth integration with commercial pulse oximeters for simultaneous SpO2 and movement tracking.",
      },
    ],
    faqs: [
      {
        question: "What is Cardiorespiratory Physiotherapy?",
        answer: "Cardiorespiratory physiotherapy is a clinical specialty focused on managing diseases and impairments of the heart, lungs, and respiratory system through breathing retraining and exercise.",
      },
      {
        question: "Can cardiorespiratory exercises cure lung disease?",
        answer: "Physiotherapy does not cure underlying anatomical lung conditions like emphysema or fibrosis, but it significantly improves breathing mechanics, clearance, and daily functional stamina.",
      },
      {
        question: "What is pursed-lip breathing?",
        answer: "Pursed-lip breathing involves inhaling through the nose and exhaling slowly through gently parted lips. It creates back-pressure that keeps airways open longer, releasing trapped air.",
      },
      {
        question: "How does Physiomatics aid cardiorespiratory rehabilitation?",
        answer: "Physiomatics guides pacing during home exercises, helping patients avoid over-exertion while recording consistent activity frequency.",
      },
      {
        question: "When is it unsafe to perform respiratory exercises?",
        answer: "Do not exercise if you have untreated chest pain, acute hemoptysis (coughing blood), SpO2 dropping below prescribed thresholds, or an active severe fever.",
      },
      {
        question: "When should emergency medical assistance be sought?",
        answer: "Seek immediate emergency help if you experience severe shortness of breath not relieved by medication, chest tightness radiating to the jaw or arm, cyanosis (blue lips), or confusion.",
      },
    ],
    relatedSolutions: [
      { slug: "geriatric-physiotherapy", title: "Geriatric Physiotherapy", tag: "SENIOR CARE" },
      { slug: "posture-spinal-physiotherapy", title: "Posture and Spinal Physiotherapy", tag: "THORACIC EXPANSION" },
      { slug: "sports-physiotherapy", title: "Sports Physiotherapy", tag: "CONDITIONING" },
    ],
    waContext: "general",
  },
  {
    id: "posture-spinal",
    slug: "posture-spinal-physiotherapy",
    title: "Posture and Spinal Physiotherapy",
    shortTitle: "Posture & Spinal",
    tag: "SPINE, NECK & ERGONOMICS",
    iconName: "Layers",
    image: "/images/solutions/posture-spinal.jpg",
    imageAlt: "Posture and spinal physiotherapy assessment, neck mobility, and back rehabilitation",
    shortDesc: "Neck discomfort relief, lumbar stabilization, posture assessment, and spinal functional mobility.",
    heroIntro: "Posture and spinal physiotherapy is dedicated to evaluating and managing mechanical neck pain, thoracic stiffness, and lower back disorders. Through precise postural assessment, deep spinal stabilization exercises, and functional ergonomic guidance, therapy addresses root mechanical stressors and supports long-term spinal resiliency.",
    whoBenefits: [
      "Desk workers and remote professionals experiencing chronic neck, upper back, and shoulder tension.",
      "Individuals managing lumbar disc herniations, sciatica, or non-specific mechanical low back pain.",
      "Patients dealing with cervical radiculopathy, tension headaches, or postural kyphosis.",
      "Individuals seeking ergonomic movement strategies to lift, bend, and sit without spinal fatigue.",
    ],
    focusAreas: [
      "Cervical & Lumbar Kinematic Alignment",
      "Deep Core & Multifidus Activation",
      "Thoracic Spine Rotational Mobility",
      "Functional Lifting & Sitting Ergonomics",
    ],
    conditions: [
      {
        name: "Mechanical Low Back Pain & Sciatica",
        description: "Lumbar facet irritation, disc displacement, or sciatic nerve compression from poor load mechanics.",
        clinicalFocus: "Directional preference exercises, neutral spine stabilization, and gradual hip mobility restoration.",
      },
      {
        name: "Cervicogenic Headaches & Neck Tension",
        description: "Referred cephalic pain originating from upper cervical facet joints and suboccipital muscular tightness.",
        clinicalFocus: "Deep neck flexor (longus colli) retraining, cervical retractions, and thoracic mobilization.",
      },
      {
        name: "Forward Head Posture & Thoracic Kyphosis",
        description: "Protracted cervical position and rounded shoulders resulting in scapular muscle inhibition.",
        clinicalFocus: "Pectoral flexibility, mid-back extensor strengthening, and dynamic postural awareness.",
      },
      {
        name: "Spinal Stenosis & Spondylolisthesis",
        description: "Narrowing of the spinal canal or vertebral slippage causing lower extremity fatigue during standing.",
        clinicalFocus: "Flexion-biased protocols, pelvic tilting, and core abdominal stabilization.",
      },
    ],
    journeySteps: [
      {
        step: 1,
        title: "Symptom Assessment",
        description: "Review neck, thoracic, or back symptoms, radiating numbness, daily habits, and medical history.",
        icon: "Stethoscope",
        keyActivity: "Spinal pain mapping, neurological red flag screening, aggravating position identification.",
      },
      {
        step: 2,
        title: "Movement Assessment",
        description: "Evaluate spinal mobility in flexion, extension, lateral flexion, posture alignment, and functional movements.",
        icon: "Activity",
        keyActivity: "Range-of-motion testing, nerve tension tests (Straight Leg Raise, Slump), posture analysis.",
      },
      {
        step: 3,
        title: "Personalized Plan",
        description: "Identify suitable mobility, strengthening, and movement-control exercises matched to your directional preference.",
        icon: "Target",
        keyActivity: "Protocol selection (e.g. McKenzie directional preference, stabilization motor control).",
      },
      {
        step: 4,
        title: "Guided Exercise",
        description: "Practice prescribed exercises, motor control drills, and ergonomic functional movement strategies.",
        icon: "Gauge",
        keyActivity: "Transverse abdominis cueing, chin retractions, pelvic neutrality practice.",
      },
      {
        step: 5,
        title: "Progress Review",
        description: "Reassess symptoms, movement range, sitting tolerance, and daily activity comfort across check-ins.",
        icon: "LineChart",
        keyActivity: "Centralization of radiating symptoms, pain score reassessment, posture photo checks.",
      },
      {
        step: 6,
        title: "Self-Management",
        description: "Develop an individualized home exercise routine, workplace ergonomic setup, and spinal wellness strategy.",
        icon: "ShieldCheck",
        keyActivity: "Desk ergonomics checklist, micro-break reminders, long-term spinal core maintenance.",
      },
    ],
    functionalOutcomes: [
      {
        title: "Centralization & Pain Reduction",
        description: "Radiating symptoms migrating out of the arm or leg back toward the spinal midline.",
        category: "Pain Relief",
      },
      {
        title: "Restored Spinal Mobility",
        description: "Fuller, smoother spinal rotation, flexion, and extension without muscular guarding.",
        category: "Mobility",
      },
      {
        title: "Prolonged Sitting Tolerance",
        description: "Ability to work comfortably at a workstation for sustained periods without upper trap spasm.",
        category: "Ergonomics",
      },
      {
        title: "Dynamic Core Resiliency",
        description: "Automatic stabilization of the lumbar spine during everyday lifting and carrying tasks.",
        category: "Stability",
      },
    ],
    sampleExercises: [
      {
        name: "Cervical Retraction (Chin Tuck) with Hold",
        purpose: "Activates deep cervical flexors and decompresses suboccipital nerve pathways.",
        precautions: "Do not tilt head downward; slide chin straight backward horizontally as if making a double chin.",
        category: "Cervical Spine",
      },
      {
        name: "Prone Lumbar Extension on Elbows (Sphinx)",
        purpose: "Encourages anterior disc migration and restores lordotic lumbar curvature.",
        precautions: "Stop if pain radiates down into the leg (peripheralization). Keep hips relaxed on the mat.",
        category: "Lumbar Spine",
      },
      {
        name: "Side-Lying Thoracic Open Book Rotation",
        purpose: "Fosters mid-thoracic rotational mobility while locking lumbar movement.",
        precautions: "Keep knees bent at 90 degrees and pinned together; follow rotating arm with gentle gaze.",
        category: "Thoracic Mobility",
      },
    ],
    techFeatures: [
      {
        title: "Frontal & Sagittal Alignment Landmarks",
        status: "Implemented in Physiomatics",
        description: "MediaPipe landmark tracking visualizes shoulder levelness, ear-to-shoulder alignment, and pelvic tilt live on device.",
      },
      {
        title: "Repetition Quality & Hold Timer",
        status: "Implemented in Physiomatics",
        description: "Visual on-screen timer ensures prescribed 5-10 second static postural holds are completed accurately.",
      },
      {
        title: "Ergonomic Posture Drift Detection",
        status: "In Clinical Validation",
        description: "Detects forward head drift and shoulder rounding during desk sitting webcam assessments.",
      },
      {
        title: "Spinal Segmental Excursion Modeling",
        status: "Planned Platform Module",
        description: "Under clinical review: Multi-segment vertebral angle modeling to assess thoracic vs. lumbar movement contribution.",
      },
    ],
    faqs: [
      {
        question: "What is Posture and Spinal Physiotherapy?",
        answer: "It is specialized clinical physiotherapy dedicated to diagnosing, treating, and preventing mechanical conditions of the cervical, thoracic, and lumbar spine, as well as postural dysfunctions.",
      },
      {
        question: "Can poor posture permanently damage my spine?",
        answer: "Posture is dynamic, and the human spine is strong. However, sustained prolonged positioning without movement variety often causes fatigue, tissue irritation, and muscular imbalance.",
      },
      {
        question: "What is 'centralization' of back pain?",
        answer: "Centralization occurs when radiating pain (e.g. pain down the leg or arm) retreats back toward the center of the spine during specific exercises—a clinically favorable prognostic sign.",
      },
      {
        question: "How does Physiomatics evaluate spinal movement?",
        answer: "Physiomatics uses on-device computer vision to evaluate landmark vectors between ears, shoulders, and hips, providing biofeedback during prescribed home exercises.",
      },
      {
        question: "Are spinal adjustments or exercises better for back pain?",
        answer: "Clinical evidence consistently highlights that active exercise, core stabilization, and patient education offer superior long-term outcomes compared to passive treatments alone.",
      },
      {
        question: "What are red-flag spinal symptoms requiring emergency care?",
        answer: "Seek emergency care immediately for sudden loss of bowel or bladder control, numbness in the saddle/groin region, sudden progressive leg weakness, or unexplained fever with spinal pain.",
      },
    ],
    relatedSolutions: [
      { slug: "orthopedic-physiotherapy", title: "Orthopedic Physiotherapy", tag: "MUSCULOSKELETAL" },
      { slug: "neurological-physiotherapy", title: "Neurological Physiotherapy", tag: "MOTOR CONTROL" },
      { slug: "geriatric-physiotherapy", title: "Geriatric Physiotherapy", tag: "HEALTHY AGING" },
    ],
    waContext: "rehab",
  },
  {
    id: "pediatric",
    slug: "pediatric-physiotherapy",
    title: "Pediatric Physiotherapy",
    shortTitle: "Pediatric",
    tag: "GROWTH & MOTOR DEVELOPMENT",
    iconName: "Users",
    image: "/images/solutions/pediatric.jpg",
    imageAlt: "Pediatric physiotherapy motor development and movement exercises for children",
    shortDesc: "Gross motor development, pediatric coordination, play-based rehabilitation, and family guidance.",
    heroIntro: "Pediatric physiotherapy focuses on helping infants, children, and adolescents achieve their highest level of physical independence and motor potential. Using playful, engaging, and family-centered movement interventions, pediatric therapy addresses developmental milestones, congenital conditions, and juvenile musculoskeletal challenges.",
    whoBenefits: [
      "Infants showing developmental delays in rolling, sitting, crawling, or unassisted walking.",
      "Children diagnosed with cerebral palsy, developmental coordination disorder (DCD), or hypotonia.",
      "Youngsters recovering from sports injuries, growth-plate concerns, or pediatric fractures.",
      "Parents seeking professional guidance on safe motor stimulation and age-appropriate physical play.",
    ],
    focusAreas: [
      "Gross Motor Milestone Acquisition",
      "Dynamic Balance & Bilateral Coordination",
      "Play-Based Therapeutic Movement",
      "Caregiver Education & Home Activities",
    ],
    conditions: [
      {
        name: "Developmental Gross Motor Delay",
        description: "Delayed achievement of head control, rolling, unassisted sitting, crawling, or independent walking.",
        clinicalFocus: "Facilitated transitional movements, sensory-rich play surfaces, and caregiver coaching.",
      },
      {
        name: "Cerebral Palsy & Motor Tone Variations",
        description: "Neurological motor disorders affecting muscle tone, posture, and voluntary movement coordination.",
        clinicalFocus: "Functional task practice, gait facilitation, orthotic management support, and contracture prevention.",
      },
      {
        name: "Developmental Coordination Disorder (DCD)",
        description: "Difficulties with motor planning, catching balls, hopping, and fine/gross motor synchronization.",
        clinicalFocus: "Cognitive orientation to daily occupational performance (CO-OP), task breakdown, and agility games.",
      },
      {
        name: "Pediatric Torticollis & Plagiocephaly",
        description: "Tightness of the sternocleidomastoid muscle causing head tilt and asymmetric cranial flattening.",
        clinicalFocus: "Gentle cervical active stretching, tummy time strategies, and alternating positioning routines.",
      },
    ],
    journeySteps: [
      {
        step: 1,
        title: "Developmental Assessment",
        description: "Review birth history, developmental milestones, movement abilities, and caregiver concerns warmly.",
        icon: "Stethoscope",
        keyActivity: "Standardized developmental screening (e.g. Peabody/PDMS-2, AIMS), play observation.",
      },
      {
        step: 2,
        title: "Functional Evaluation",
        description: "Assess age-appropriate mobility, balance, muscle tone, coordination, and everyday motor skills.",
        icon: "Activity",
        keyActivity: "Floor play evaluation, rolling transitions, stepping symmetry, postural reactions.",
      },
      {
        step: 3,
        title: "Family-Centered Planning",
        description: "Set individualized goals with caregivers and the child's wider healthcare and education team.",
        icon: "Target",
        keyActivity: "Family goal identification (e.g., confident playground stair climbing, hopping).",
      },
      {
        step: 4,
        title: "Play-Based Intervention",
        description: "Use suitable, engaging movement activities, games, and exercises tailored to the child's interests.",
        icon: "Users",
        keyActivity: "Obstacle courses, balance beam walks, ball catching games, animal walk movements.",
      },
      {
        step: 5,
        title: "Developmental Monitoring",
        description: "Review progress towards the child's agreed functional goals with supportive reassessments.",
        icon: "LineChart",
        keyActivity: "Milestone checklist review, balance duration tracking, video movement comparison.",
      },
      {
        step: 6,
        title: "Caregiver Guidance",
        description: "Provide fun home activities, positioning strategies, and recommendations for school or playground play.",
        icon: "ShieldCheck",
        keyActivity: "Home play routine booklet, shoe/orthotic advice, school mobility recommendations.",
      },
    ],
    functionalOutcomes: [
      {
        title: "Milestone Progression",
        description: "Mastery of essential developmental movements such as independent sitting, crawling, or running.",
        category: "Development",
      },
      {
        title: "Improved Play Coordination",
        description: "Greater confidence playing ball games, skipping, climbing playground ladders, and jumping.",
        category: "Play",
      },
      {
        title: "Enhanced Postural Endurance",
        description: "Better upright stamina during classroom sitting and sports activities without slumping.",
        category: "Endurance",
      },
      {
        title: "Empowered Parents & Caregivers",
        description: "Clear understanding of how to weave fun therapeutic motor stimulation into daily play at home.",
        category: "Family",
      },
    ],
    sampleExercises: [
      {
        name: "Supported Animal Walks (Bear Walk, Crab Walk)",
        purpose: "Strengthens shoulder girdle, core, and promotes bilateral reciprocal motor coordination.",
        precautions: "Ensure a soft, cushioned floor surface; supervise continuously to prevent falls.",
        category: "Play Movement",
      },
      {
        name: "Interactive Balance Beam / Tape Line Walking",
        purpose: "Challenges dynamic balance, foot placement precision, and visual-motor integration.",
        precautions: "Place line flat on carpet or mat; hold parent's hand until steady balance is confirmed.",
        category: "Balance Play",
      },
      {
        name: "Therapy Ball Gentle Rhythmic Rocking",
        purpose: "Stimulates vestibular system and encourages protective postural righting reactions.",
        precautions: "Must be administered with constant firm pelvic support by an adult on an anti-burst ball.",
        category: "Sensory Motor",
      },
    ],
    techFeatures: [
      {
        title: "Engaging Visual Skeleton Feedback",
        status: "Implemented in Physiomatics",
        description: "Children enjoy seeing their colorful skeleton mimic their movements live on screen, transforming exercises into playful biofeedback.",
      },
      {
        title: "Zero-Cloud Pediatric Privacy Safeguard",
        status: "Implemented in Physiomatics",
        description: "Child videos never leave the device. All computer vision processing happens strictly client-side inside the local web browser.",
      },
      {
        title: "Playful Repetition Milestones",
        status: "In Clinical Validation",
        description: "Interactive celebration chimes reward children when completing prescribed repetitions.",
      },
      {
        title: "Milestone Motor Trajectory Analytics",
        status: "Planned Platform Module",
        description: "Under clinical review: Pediatric milestone tracking dashboard for developmental therapists.",
      },
    ],
    faqs: [
      {
        question: "What is Pediatric Physiotherapy?",
        answer: "Pediatric physiotherapy is clinical rehabilitation focused on infants, children, and youth to foster healthy motor development, coordination, and physical independence through play.",
      },
      {
        question: "How does therapy for a child differ from adult physiotherapy?",
        answer: "Pediatric therapy is playful and child-centered. Exercises are structured as games, obstacle courses, and creative play so the child is intrinsically engaged rather than feeling like they are doing medical drills.",
      },
      {
        question: "When should parents consult a pediatric physiotherapist?",
        answer: "Consult a clinician if your child misses gross motor milestones, avoids using one side of their body, walks consistently on their tiptoes, trips unusually frequently, or complains of limb pain.",
      },
      {
        question: "How does Physiomatics maintain privacy for children?",
        answer: "Child privacy is paramount. Physiomatics processes all computer vision locally on your device. No video frames, audio, or biometric recordings are ever uploaded to cloud servers.",
      },
      {
        question: "Can pediatric exercises replace developmental clinical checkups?",
        answer: "No. Pediatric physical therapy requires hands-on developmental assessment, tone evaluation, and medical oversight by qualified pediatric clinicians.",
      },
      {
        question: "When should exercises be stopped immediately?",
        answer: "Stop if the child expresses distress, pain, shortness of breath, unusual lethargy, or if joint instability is observed.",
      },
    ],
    relatedSolutions: [
      { slug: "neurological-physiotherapy", title: "Neurological Physiotherapy", tag: "NEURO-REHAB" },
      { slug: "posture-spinal-physiotherapy", title: "Posture and Spinal Physiotherapy", tag: "POSTURE & SPINE" },
      { slug: "orthopedic-physiotherapy", title: "Orthopedic Physiotherapy", tag: "JOINT MOBILITY" },
    ],
    waContext: "general",
  },
  {
    id: "womens-health",
    slug: "womens-health-physiotherapy",
    title: "Women's Health Physiotherapy",
    shortTitle: "Women's Health",
    tag: "PELVIC HEALTH & PRE/POSTNATAL",
    iconName: "UserCheck",
    image: "/images/solutions/womens-health.jpg",
    imageAlt: "Women's health physiotherapy pelvic floor education, pregnancy-related movement, and postnatal rehabilitation",
    shortDesc: "Pelvic floor rehabilitation, pregnancy-related mobility, diastasis recti recovery, and postnatal wellness.",
    heroIntro: "Women's health physiotherapy is a sensitive, evidence-informed clinical specialty addressing conditions across the female lifespan—including pregnancy, postpartum recovery, pelvic floor dysfunction, and menopausal bone health. Interventions combine gentle neuromuscular retraining, core integration, and empathetic education in an atmosphere of dignity and informed consent.",
    whoBenefits: [
      "Individuals experiencing stress or urge urinary incontinence during coughing, running, or exercise.",
      "Pregnant women managing pelvic girdle pain, sacroiliac discomfort, or low back fatigue.",
      "Postnatal mothers recovering from vaginal or cesarean birth, diastasis recti, or perineal trauma.",
      "Women seeking safe return-to-exercise guidance during perimenopause and menopause.",
    ],
    focusAreas: [
      "Pelvic Floor Muscle Retraining & Relaxation",
      "Diastasis Recti Abdominis Management",
      "Pregnancy Pelvic Girdle Mobility",
      "Safe Postnatal Return-to-Impact Progression",
    ],
    conditions: [
      {
        name: "Urinary Incontinence (Stress & Urge)",
        description: "Involuntary bladder leakage during physical exertion, sneezing, jumping, or sudden urgent sensations.",
        clinicalFocus: "Coordinated pelvic floor contraction and full relaxation, bladder training, and intra-abdominal pressure management.",
      },
      {
        name: "Diastasis Recti Abdominis (DRA)",
        description: "Separation of the rectus abdominis muscles along the linea alba following pregnancy expansion.",
        clinicalFocus: "Deep transversus abdominis engagement, progressive core tensioning, and avoiding uncontrolled doming.",
      },
      {
        name: "Pregnancy-Related Pelvic Girdle Pain (PGP)",
        description: "Discomfort at the pubic symphysis or sacroiliac joints aggravated by walking, turning in bed, or stairs.",
        clinicalFocus: "Pelvic stabilization belts, symmetric movement strategies, and gentle gluteal strengthening.",
      },
      {
        name: "Pelvic Organ Prolapse (Mild to Moderate)",
        description: "Sensation of vaginal heaviness or descent of pelvic organs due to supportive ligament laxity.",
        clinicalFocus: "Postural alignment, pelvic floor lift coordination, defecation dynamics, and low-impact conditioning.",
      },
    ],
    journeySteps: [
      {
        step: 1,
        title: "Private Initial Consultation",
        description: "Discuss relevant symptoms, goals, health history, and personal concerns in a confidential setting with informed consent.",
        icon: "Stethoscope",
        keyActivity: "Confidential history review, symptom mapping, consent discussions.",
      },
      {
        step: 2,
        title: "Individualized Assessment",
        description: "Perform appropriate non-invasive or clinical assessments only with explicit consent and within professional scope of practice.",
        icon: "Activity",
        keyActivity: "Postural screening, abdominal wall exam for diastasis recti, breathing mechanics review.",
      },
      {
        step: 3,
        title: "Care Planning",
        description: "Identify suitable pelvic health, functional movement, or pregnancy- and postnatal-related rehabilitation goals.",
        icon: "Target",
        keyActivity: "Paced care plan, daily routine integration, intra-abdominal pressure education.",
      },
      {
        step: 4,
        title: "Guided Rehabilitation",
        description: "Provide appropriate prescribed exercises, diaphragmatic breath coordination, and core education.",
        icon: "Gauge",
        keyActivity: "Transversus abdominis activation with gentle exhalation, bridge variations, side-lying clam series.",
      },
      {
        step: 5,
        title: "Progress Monitoring",
        description: "Review symptoms, function, comfort, abdominal integrity, and personal goals over time.",
        icon: "LineChart",
        keyActivity: "Incontinence score reduction, inter-recti distance tension testing, return-to-run criteria.",
      },
      {
        step: 6,
        title: "Ongoing Self-Management",
        description: "Offer individualized home guidance, lifelong pelvic wellness habits, and follow-up planning.",
        icon: "ShieldCheck",
        keyActivity: "Safe lifting biomechanics with children, bone-density strengthening, home program maintenance.",
      },
    ],
    functionalOutcomes: [
      {
        title: "Restored Bladder Confidence",
        description: "Reduced or eliminated leakage during coughing, laughing, sneezing, and recreational sports.",
        category: "Pelvic Control",
      },
      {
        title: "Abdominal Wall Tension Recovery",
        description: "Restored functional tension across the linea alba without central abdominal bulging or doming.",
        category: "Core Integrity",
      },
      {
        title: "Comfortable Pregnancy & Postpartum Mobility",
        description: "Diminished sacroiliac and pubic symphysis discomfort during walking and bed transfers.",
        category: "Comfort",
      },
      {
        title: "Confident Return to Running & Fitness",
        description: "Safe, symptom-free transition back to running, weight training, and high-energy exercise.",
        category: "Fitness",
      },
    ],
    sampleExercises: [
      {
        name: "Diaphragmatic Breath with Gentle Pelvic Floor Coordination",
        purpose: "Coordinates natural descent of the pelvic floor on inhalation and gentle ascent on exhalation.",
        precautions: "Do not hold breath or push downward. Practice in comfortable side-lying or supported sitting.",
        category: "Neuromuscular",
      },
      {
        name: "Supine Hooklying Heel Slides with Core Bracing",
        purpose: "Strengthens deep stabilizing transversus abdominis while limb moves through light kinetic lever.",
        precautions: "Monitor abdomen; discontinue if central bulging occurs along the midline.",
        category: "Core Stability",
      },
      {
        name: "Supported Side-Lying Clamshell",
        purpose: "Strengthens gluteus medius to provide lateral pelvic stability during walking.",
        precautions: "Keep pelvis stacked vertically; do not roll hip backwards during rotation.",
        category: "Pelvic Stability",
      },
    ],
    techFeatures: [
      {
        title: "Client-Side Zero-Cloud Camera Privacy",
        status: "Implemented in Physiomatics",
        description: "Absolute patient privacy. All pose detection executes locally inside your browser; no images or video streams are ever stored or uploaded.",
      },
      {
        title: "Posture & Pelvic Tilt Visual Cues",
        status: "Implemented in Physiomatics",
        description: "Computer vision tracks spinal alignment and pelvic angle during standing and seated stability exercises.",
      },
      {
        title: "Diastasis Safe Movement Guidelines",
        status: "In Clinical Validation",
        description: "Educational cues caution against excessive abdominal flexion that could increase intra-abdominal pressure.",
      },
      {
        title: "Postnatal Return-to-Run Readiness Checklist",
        status: "Planned Platform Module",
        description: "Under clinical review: Objective strength and impact tolerance verification module for postnatal athletes.",
      },
    ],
    faqs: [
      {
        question: "What is Women's Health Physiotherapy?",
        answer: "Women's health physiotherapy is a specialized branch of physiotherapy focusing on pelvic floor health, pre- and postnatal recovery, incontinence, prolapse, and female musculoskeletal conditions.",
      },
      {
        question: "Is leakage during exercise normal after having a baby?",
        answer: "Leakage is very common, but it is not normal or something you simply have to accept. Pelvic health physiotherapy can effectively retrain muscle coordination and restore continence.",
      },
      {
        question: "Are Kegel exercises right for everyone with pelvic floor issues?",
        answer: "No. In many cases, pelvic floor muscles are hypertonic (overly tight or in spasm) rather than weak. Performing Kegels on a hypertonic floor can worsen symptoms; relaxation training may be needed first.",
      },
      {
        question: "How does Physiomatics ensure privacy for women's health routines?",
        answer: "Physiomatics processes all video locally on your browser. Zero video footage ever reaches our servers, providing total peace of mind in your home.",
      },
      {
        question: "When can I begin postnatal physiotherapy after childbirth?",
        answer: "Gentle diaphragmatic breathing and gentle walking can begin within days if comfortable. A formal pelvic health assessment is typically scheduled around 6 weeks postpartum.",
      },
      {
        question: "When should I contact a physician immediately?",
        answer: "Seek prompt medical care if you experience abnormal heavy bleeding, foul-smelling discharge, sudden severe pelvic pain, burning during urination with fever, or calf redness/swelling.",
      },
    ],
    relatedSolutions: [
      { slug: "posture-spinal-physiotherapy", title: "Posture and Spinal Physiotherapy", tag: "SPINE & CORE" },
      { slug: "geriatric-physiotherapy", title: "Geriatric Physiotherapy", tag: "SENIOR HEALTH" },
      { slug: "orthopedic-physiotherapy", title: "Orthopedic Physiotherapy", tag: "REHABILITATION" },
    ],
    waContext: "general",
  },
];

export function getSolutionBySlug(slug: string): PhysiotherapySolution | undefined {
  return PHYSIOTHERAPY_SOLUTIONS.find((s) => s.slug === slug);
}
