import React, { useState, useEffect, useMemo, useRef } from "react";

/* ============================================================================
   SURYA'S ENGINEERING ROADMAP — a personal career operating system
   Dark, developer skill-tree aesthetic. Single file. Persists to localStorage
   with an in-memory fallback (Claude.ai artifact sandbox blocks storage).
   ========================================================================== */

/* ---- persistence: localStorage w/ safe in-memory fallback --------------- */
const memStore = {};
const store = {
  get(k, fb) {
    try {
      const v = window.localStorage.getItem(k);
      return v == null ? fb : JSON.parse(v);
    } catch {
      return k in memStore ? memStore[k] : fb;
    }
  },
  set(k, v) {
    try {
      window.localStorage.setItem(k, JSON.stringify(v));
    } catch {
      memStore[k] = v;
    }
  },
};
const K = (s) => `surya.roadmap.v1.${s}`;

function usePersist(key, initial) {
  const [val, setVal] = useState(() => store.get(K(key), initial));
  useEffect(() => store.set(K(key), val), [key, val]);
  return [val, setVal];
}

/* ---- design tokens ------------------------------------------------------ */
const C = {
  bg: "#0a0b0e",
  panel: "#101318",
  panel2: "#14181f",
  line: "#1e242e",
  line2: "#2a323e",
  text: "#e7ecf3",
  dim: "#8b95a5",
  dim2: "#5c6675",
  // status accents — muted, not neon
  accent: "#5b8def", // cool blue, primary
  learn: "#e0a458", // amber — learning
  comfort: "#5bbf8a", // green — comfortable
  strong: "#7c6cf0", // violet — strong / done
  hire: "#e06a6a", // warm red — the "get hired" track
  locked: "#3a414d",
};

const STATUS = {
  not: { label: "Not started", color: C.dim2, pct: 0 },
  learning: { label: "Learning", color: C.learn, pct: 40 },
  comfortable: { label: "Comfortable", color: C.comfort, pct: 75 },
  strong: { label: "Strong", color: C.strong, pct: 100 },
};
const STATUS_ORDER = ["not", "learning", "comfortable", "strong"];

/* ---- skill data --------------------------------------------------------- */
const INITIAL_SKILLS = [
  { id: "python", name: "Python", lvl: 2, group: "Languages", desc: "Core language for everything ahead — ML, backend, scripting. Priority #1." },
  { id: "java", name: "Java", lvl: 2, group: "Languages", desc: "Refresher-level. Opens Java Werkstudent roles as a fast on-ramp." },
  { id: "js", name: "JavaScript", lvl: 1, group: "Languages", desc: "Enough for frontend glue on projects. Not a focus early." },
  { id: "ts", name: "TypeScript", lvl: 1, group: "Languages", desc: "Later, once JS is comfortable. Useful for portfolio + tooling." },
  { id: "cpp", name: "C / C++", lvl: 0, group: "Languages", desc: "LOCKED for now. Comes in the systems/robotics phase, not before.", lock: true },
  { id: "rust", name: "Rust", lvl: 0, group: "Languages", desc: "LOCKED. Do not touch until much later. It is a distraction now.", lock: true },

  { id: "git", name: "Git", lvl: 2, group: "Tooling", desc: "Branch, commit, PR workflow. Non-negotiable for any job." },
  { id: "linux", name: "Linux / Terminal", lvl: 2, group: "Tooling", desc: "Filesystem, permissions, processes, SSH, pipes." },
  { id: "sql", name: "SQL", lvl: 1, group: "Tooling", desc: "SELECT → JOIN → GROUP BY. Then PostgreSQL relations & indexes." },
  { id: "htmlcss", name: "HTML / CSS", lvl: 2, group: "Tooling", desc: "Already usable. Enough to present projects well." },
  { id: "react", name: "React", lvl: 2, group: "Tooling", desc: "For portfolio + project frontends. Not a career pillar." },
  { id: "docker", name: "Docker", lvl: 0, group: "Tooling", desc: "Basics only in month 3: images, containers, compose." },

  { id: "dsa", name: "DSA", lvl: 1, group: "Foundations", desc: "Arrays, hash maps, stacks, recursion, binary search, sorting." },
  { id: "leetcode", name: "LeetCode", lvl: 0, group: "Foundations", desc: "Easy problems, understood not copied. Target ~30–40 by week 12." },
  { id: "networking", name: "Networking", lvl: 1, group: "Foundations", desc: "HTTP, REST, status codes. Deepen after first job." },
  { id: "os", name: "Operating Systems", lvl: 1, group: "Foundations", desc: "Processes, memory, scheduling. Foundation phase." },
  { id: "db", name: "Databases", lvl: 1, group: "Foundations", desc: "Relational modelling, normalization, transactions." },

  { id: "ml", name: "ML Theory", lvl: 1, group: "AI / CV", desc: "Training vs inference, loss, gradient descent, over/underfit." },
  { id: "pytorch", name: "PyTorch", lvl: 1, group: "AI / CV", desc: "Tensors, Dataset/DataLoader, training loop, inference." },
  { id: "opencv", name: "OpenCV", lvl: 1, group: "AI / CV", desc: "Load/resize/crop, color, draw boxes, video, webcam." },
  { id: "yolo", name: "YOLO / Detection", lvl: 1, group: "AI / CV", desc: "Boxes, IoU, precision/recall, mAP, NMS. Make FLARE defensible." },

  { id: "cloud", name: "Cloud", lvl: 0, group: "Systems", desc: "AWS basics later: EC2, S3, IAM, RDS. LOCKED for now.", lock: true },
  { id: "cyber", name: "Cybersecurity", lvl: 0, group: "Systems", desc: "Optional pivot lane. Explore only after foundation.", lock: true },
];

/* ---- 12-week sprint ----------------------------------------------------- */
const SPRINT = [
  {
    wk: "Weeks 1–2", tag: "Ignition",
    learn: ["Python: variables, types, conditions", "Loops, strings, lists, dicts", "Functions", "Terminal basics", "Git basics"],
    career: ["Fix CV — correct skills to real level", "Correct German to B1", "Fix LinkedIn", "Clean GitHub", "Start applying immediately", "10–15 quality applications / week"],
  },
  {
    wk: "Weeks 3–4", tag: "Structure",
    learn: ["Modules, imports, files, JSON, CSV", "Exceptions", "Classes, objects, OOP basics", "venv, pip, debugging", "SQL: SELECT / WHERE / ORDER BY", "SQL: INSERT / UPDATE / DELETE / GROUP BY / JOIN", "DSA: Big-O, arrays, strings, hash maps, sets, stacks, queues", "Begin very easy LeetCode"],
    career: ["Keep the funnel full", "Refine targeting from early responses"],
  },
  {
    wk: "Weeks 5–6", tag: "Foundations",
    learn: ["Linux: filesystem, permissions, processes", "env vars, SSH, pipes, redirection", "PostgreSQL: keys, joins, indexes, normalization, transactions", "DSA: linked lists, binary search, sorting, recursion", "~4–5 Easy LeetCode / week"],
    career: ["Start independent project: Job Application Tracker (CLI, Python + JSON)", "You build it — AI explains, reviews, hints, debugs WITH you"],
  },
  {
    wk: "Weeks 7–8", tag: "Make FLARE defensible",
    learn: ["What ML is: training vs inference", "Supervised learning, train/val/test, overfitting", "Loss, gradient descent, neural nets, CNNs", "Object detection: boxes, IoU, precision, recall, mAP", "Confidence thresholds, NMS, YOLO fundamentals", "Datasets, annotations, augmentation", "PyTorch: tensor → DataLoader → model → loss → optimizer → loop → inference", "OpenCV: load/resize/crop, color, draw boxes, video, webcam"],
    career: ["Write out exactly what YOU contributed to FLARE", "Prepare to explain it in an interview"],
  },
  {
    wk: "Weeks 9–10", tag: "Backend",
    learn: ["HTTP, REST, GET/POST/PUT/DELETE", "Requests, responses, JSON, status codes", "FastAPI", "Upgrade tracker: CLI → FastAPI → PostgreSQL", "Docker: images, containers, Dockerfile, ports, volumes, compose"],
    career: ["Project becomes a real portfolio piece", "Update GitHub README + CV bullet"],
  },
  {
    wk: "Weeks 11–12", tag: "Interview ready",
    learn: ["Review: Python, Git, Linux, SQL, DSA, OOP, HTTP, REST", "Review: FLARE, CV & YOLO fundamentals, your project", "Target ~30–40 understood LeetCode Easy"],
    career: ["Practice: tell me about yourself / about FLARE", "What did YOU contribute? Explain a technical problem.", "Explain your project. Why this role? What are you learning?", "Technical Python / basic DSA / basic SQL questions"],
  },
];

/* ---- long roadmap phases (vertical spine) ------------------------------- */
const PHASES = [
  {
    id: "now", title: "Foundation + Werkstudent Sprint", when: "Aug → Nov 2026",
    lens: ["immediate"], milestone: null,
    blurb: "Two jobs at once: learn to code, and get someone to hire you to code. Everything below waits until this is done.",
    nodes: ["Python", "Git + Terminal", "Basic problem solving", "DSA", "LeetCode Easy", "SQL + PostgreSQL", "Linux", "Java refresher", "Basic SWE", "Basic backend", "Docker basics", "Independent project", "Interview prep"],
  },
  {
    id: "swe", title: "Strong SWE Foundation", when: "post-hire, ongoing",
    lens: ["swe"], milestone: "Strong Software Engineering Foundation",
    blurb: "On-the-job reality (real codebase, reviews, testing, production) merged with personal depth (DSA, LeetCode, SWE fundamentals).",
    nodes: ["Networking", "Operating Systems", "Software engineering", "Testing", "Backend", "FastAPI", "Docker", "CI/CD", "GitHub Actions"],
  },
  {
    id: "aiml", title: "AI / ML Foundation", when: "after SWE base",
    lens: ["aiml"], milestone: "ML Foundation",
    blurb: "The maths and the tooling, in order. Don't skip the maths — it's what makes the rest defensible.",
    nodes: ["Linear algebra", "Calculus", "Probability", "Statistics", "NumPy", "Pandas", "Matplotlib", "scikit-learn", "Machine learning", "Deep learning", "PyTorch"],
  },
  {
    id: "cv", title: "Computer Vision Specialization", when: "your edge",
    lens: ["cv"], milestone: "Computer Vision Engineer level",
    blurb: "Where FLARE already gives you a head start. Turn assisted experience into real, explainable depth.",
    nodes: ["CV fundamentals", "Image processing", "OpenCV", "CNNs", "Object detection", "YOLO", "Segmentation", "Tracking", "Evaluation", "Real-world CV systems"],
  },
  {
    id: "edge", title: "Edge AI + Deployment", when: "the FLARE sweet spot",
    lens: ["cv"], milestone: "AI/CV + Edge Deployment",
    blurb: "Getting models to run fast on small hardware — a genuinely rare and valuable combination.",
    nodes: ["Edge AI", "Raspberry Pi", "Hardware accelerators", "Latency / throughput", "Quantization", "ONNX", "ONNX Runtime", "Model optimization"],
  },
  {
    id: "systems", title: "Cloud + Systems", when: "breadth",
    lens: ["swe"], milestone: "AI / Computer Vision Engineer",
    blurb: "Cloud fundamentals plus a real systems language. This is where C++ finally unlocks.",
    nodes: ["AWS fundamentals", "EC2 / S3 / IAM / RDS", "Docker deployment", "CI/CD", "C++: memory, pointers, STL, RAII", "Performance", "Concurrency"],
  },
  {
    id: "advanced", title: "Advanced Specialization", when: "depth",
    lens: ["robotics", "aiml"], milestone: null,
    blurb: "Robotics/perception, GPU computing, MLOps, and advanced systems. Pick what pulls you.",
    nodes: ["Robotics / ROS2", "Perception, 3D geometry, depth", "Sensor fusion, SLAM basics", "GPU / CUDA / TensorRT", "MLOps: tracking, registry, serving, monitoring", "Distributed systems, system design"],
  },
];

/* ---- branches ----------------------------------------------------------- */
const BRANCHES = [
  { id: "ml", title: "ML Systems Engineer", color: C.strong, skills: ["ML infrastructure", "Model serving", "Distributed training", "MLOps", "Cloud", "Performance", "AI infrastructure"] },
  { id: "cv", title: "Computer Vision / Perception", color: C.accent, skills: ["Advanced CV", "Detection", "Segmentation", "Tracking", "3D vision", "Sensor fusion", "Edge inference", "GPU optimization"] },
  { id: "robotics", title: "Robotics / Autonomous Systems", color: C.comfort, skills: ["ROS2", "Perception", "Localization", "Mapping", "SLAM", "Planning", "Sensors", "Real-time systems", "Autonomous decisions"] },
];

/* ---- milestones --------------------------------------------------------- */
const MILESTONES = [
  { id: "m1", t: "Can program independently in Python" },
  { id: "m2", t: "Can solve basic DSA problems" },
  { id: "m3", t: "First independently coded project" },
  { id: "m4", t: "Interview ready" },
  { id: "m5", t: "First technical Werkstudent / HiWi", hero: true, when: "Target: Nov 2026" },
  { id: "m6", t: "Strong Software Engineering Foundation" },
  { id: "m7", t: "ML Foundation" },
  { id: "m8", t: "Computer Vision Engineer level" },
  { id: "m9", t: "AI/CV + Edge Deployment" },
  { id: "m10", t: "Specialization selected" },
  { id: "m11", t: "Bachelor thesis" },
  { id: "m12", t: "Full-time offer" },
  { id: "m13", t: "Graduation" },
  { id: "m14", t: "Senior / Specialized Engineer" },
  { id: "m15", t: "€100k+ career milestone", hero: true },
];

/* ---- application mix ---------------------------------------------------- */
const APP_MIX = [
  { label: "SWE / Python / Java", pct: 35, color: C.accent },
  { label: "AI / ML / CV", pct: 20, color: C.strong },
  { label: "Research / HiWi / R&D", pct: 15, color: C.comfort },
  { label: "QA / Test Automation", pct: 10, color: C.learn },
  { label: "Robotics / Embedded / Edge", pct: 10, color: "#c17ad9" },
  { label: "Cloud / DevOps", pct: 5, color: "#5bbfb5" },
  { label: "Cybersecurity", pct: 5, color: C.hire },
];

const ROLE_TARGETS = [
  "Werkstudent Softwareentwicklung", "Werkstudent Software Engineering", "Werkstudent Python", "Werkstudent Java",
  "Werkstudent Informatik", "Werkstudent IT Automation", "Werkstudent QA Automation", "Werkstudent Test Automation",
  "Werkstudent AI / ML", "Werkstudent Computer Vision", "Werkstudent Robotics", "Werkstudent Embedded AI",
  "Werkstudent R&D", "Studentische Hilfskraft Informatik", "HiWi Softwareentwicklung", "HiWi AI", "HiWi Computer Vision",
];

const LOCKED = ["Rust", "Advanced C++", "CUDA", "Kubernetes", "ROS2", "TensorRT", "Advanced AWS", "Advanced MLOps", "Distributed Systems", "Advanced System Design"];

const PRINCIPLES = [
  "Learn → Build → Apply → Interview → Improve",
  "Don't wait until you're ready to apply.",
  "The first technical job doesn't need to be the final specialization.",
  "AI should accelerate learning, not replace it.",
  "If AI writes code, understand it before claiming it.",
  "One project you built beats ten AI-generated ones.",
  "Skills over certificates.",
  "Consistency over occasional extreme sessions.",
];

const LENSES = [
  { id: "all", label: "All" },
  { id: "immediate", label: "Immediate" },
  { id: "swe", label: "SWE" },
  { id: "aiml", label: "AI / ML" },
  { id: "cv", label: "CV" },
  { id: "robotics", label: "Robotics" },
  { id: "career", label: "Career" },
];

/* ======================================================================== */
/* small UI atoms                                                            */
/* ======================================================================== */
const mono = "'JetBrains Mono','SF Mono',ui-monospace,Menlo,monospace";
const sans = "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

function Eyebrow({ children, color = C.dim2 }) {
  return (
    <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color }}>
      {children}
    </div>
  );
}

function Ring({ pct, size = 44, stroke = 4, color = C.accent, label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.line} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .5s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: mono, fontSize: 11, color: C.text }}>
        {label ?? `${Math.round(pct)}`}
      </div>
    </div>
  );
}

/* ======================================================================== */
/* SKILL NODE                                                                */
/* ======================================================================== */
function levelToStatus(lvl) {
  return lvl >= 4 ? "strong" : lvl >= 3 ? "comfortable" : lvl >= 1 ? "learning" : "not";
}

function SkillNode({ skill, onCycle, onSelect, active }) {
  const st = STATUS[levelToStatus(skill.lvl)];
  const locked = skill.lock && skill.lvl === 0;
  return (
    <button
      onClick={() => onSelect(skill.id)}
      style={{
        textAlign: "left", cursor: "pointer", position: "relative",
        background: active ? C.panel2 : C.panel,
        border: `1px solid ${active ? C.line2 : C.line}`,
        borderRadius: 10, padding: "11px 12px", width: "100%",
        opacity: locked ? 0.5 : 1, transition: "all .15s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div onClick={(e) => { e.stopPropagation(); if (!locked) onCycle(skill.id); }}
          title={locked ? "Locked — unlock later" : "Click to raise level"}
          style={{ cursor: locked ? "not-allowed" : "pointer" }}>
          <Ring pct={(skill.lvl / 5) * 100} size={40} stroke={3.5}
            color={locked ? C.locked : st.color} label={`${skill.lvl}`} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: sans, fontSize: 13.5, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {skill.name} {locked && <span style={{ color: C.dim2, fontSize: 11 }}>· locked</span>}
          </div>
          <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: ".06em", color: st.color, marginTop: 3, textTransform: "uppercase" }}>
            {st.label}
          </div>
        </div>
      </div>
    </button>
  );
}

/* ======================================================================== */
/* MAIN                                                                      */
/* ======================================================================== */
export default function App() {
  const [skills, setSkills] = usePersist("skills", INITIAL_SKILLS);
  const [msDone, setMsDone] = usePersist("milestones", {});
  const [funnel, setFunnel] = usePersist("funnel", { apps: 0, resp: 0, screen: 0, tech: 0, final: 0, offer: 0 });
  const [counters, setCounters] = usePersist("counters", { weekApps: 0, leetcode: 0, projects: 0 });
  const [status, setStatus] = usePersist("status", { werk: "Searching", german: "B1", grad: "Oct 2027" });
  const [openPhase, setOpenPhase] = usePersist("openPhase", { now: true });
  const [todo, setTodo] = usePersist("todo", {});

  const [lens, setLens] = useState("all");
  const [query, setQuery] = useState("");
  const [selSkill, setSelSkill] = useState(null);

  /* skill mutations */
  const cycleSkill = (id) =>
    setSkills((s) => s.map((k) => (k.id === id ? { ...k, lvl: (k.lvl + 1) % 6 } : k)));
  const setSkillLvl = (id, lvl) =>
    setSkills((s) => s.map((k) => (k.id === id ? { ...k, lvl } : k)));

  /* derived */
  const overall = useMemo(() => {
    const t = skills.reduce((a, k) => a + k.lvl, 0);
    return Math.round((t / (skills.length * 5)) * 100);
  }, [skills]);

  const msPct = useMemo(() => {
    const d = MILESTONES.filter((m) => msDone[m.id]).length;
    return Math.round((d / MILESTONES.length) * 100);
  }, [msDone]);

  const filteredSkills = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter((k) => !q || k.name.toLowerCase().includes(q) || k.group.toLowerCase().includes(q));
  }, [skills, query]);

  const groups = useMemo(() => {
    const g = {};
    filteredSkills.forEach((k) => { (g[k.group] ||= []).push(k); });
    return g;
  }, [filteredSkills]);

  const selected = selSkill ? skills.find((k) => k.id === selSkill) : null;

  /* funnel conversion + diagnosis */
  const conv = (a, b) => (a > 0 ? Math.round((b / a) * 100) : 0);
  const diagnosis = useMemo(() => {
    const f = funnel;
    if (f.apps >= 15 && f.tech === 0 && f.resp <= f.apps * 0.1)
      return { t: "Many applications, few responses", why: "Likely a CV, targeting, language, or application-quality problem. Fix the top of the funnel first." };
    if (f.resp > 0 && f.screen > 0 && f.tech === 0)
      return { t: "Screens but no technical rounds", why: "Likely communication, profile fit, or how you explain your projects. Rehearse the FLARE + project story." };
    if (f.tech > 0 && f.offer === 0)
      return { t: "Technical interviews but no offers", why: "Likely coding ability or interview prep. More understood LeetCode Easy + mock interviews." };
    if (f.apps === 0) return { t: "No data yet", why: "Log applications as you send them. Aim for 10–15 quality ones per week." };
    return { t: "Funnel is moving", why: "Keep volume up and keep refining. Conversion improves with reps." };
  }, [funnel]);

  const s = styles;

  return (
    <div style={s.root}>
      <style>{globalCss}</style>
      <Grain />

      <div style={s.wrap}>
        {/* ============ HERO ============ */}
        <header style={s.hero}>
          <Eyebrow color={C.accent}>Personal engineering career OS · v1</Eyebrow>
          <h1 style={s.h1}>SURYA'S ENGINEERING ROADMAP</h1>
          <div style={s.h1sub}>August 2026 → Graduation → Beyond</div>

          <div style={s.currentState}>
            <div style={s.csLine}><span style={s.csKey}>6th&nbsp;Semester&nbsp;CS</span><span style={s.csAt}>TU Darmstadt · 23</span></div>
            <Tree items={[
              ["Coding", "Beginner"],
              ["Professional experience", "Building"],
              ["Immediate goal", "Werkstudent"],
              ["Long-term direction", "Intelligent systems"],
            ]} />
          </div>

          {/* top stat strip */}
          <div style={s.stats} className="r-stats">
            <Stat label="Overall skill" value={`${overall}%`} sub="weighted across all tracks" ring={overall} ringColor={C.accent} />
            <Stat label="Milestones" value={`${MILESTONES.filter((m) => msDone[m.id]).length}/${MILESTONES.length}`} sub="career checkpoints" ring={msPct} ringColor={C.strong} />
            <EditStat label="Werkstudent" value={status.werk} options={["Searching", "Applying", "Interviewing", "Offer", "Hired"]} onSet={(v) => setStatus({ ...status, werk: v })} />
            <EditStat label="German" value={status.german} options={["A2", "B1", "B2", "C1", "C2"]} onSet={(v) => setStatus({ ...status, german: v })} />
          </div>
        </header>

        {/* ============ WHAT SHOULD I DO NOW — the hero UX ============ */}
        <NowPanel todo={todo} setTodo={setTodo} />

        {/* ============ TWO PARALLEL TRACKS ============ */}
        <Section eyebrow="Aug → Nov 2026" title="Two jobs, at the same time"
          note="These run in parallel — not one after the other.">
          <ParallelTracks />
        </Section>

        {/* ============ 12-WEEK SPRINT ============ */}
        <Section eyebrow="The first 3 months" title="12-week sprint"
          note="Learn track + career track, week by week, ending at interview-ready.">
          <SprintView />
        </Section>

        {/* ============ SKILL TREE (filter/search) ============ */}
        <Section eyebrow="Live skill tree" title="Where you actually are"
          note="Click a ring to raise a level · click a card for detail. Everything persists.">
          <div style={s.skillControls}>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search skills…" style={s.search} />
            <div style={s.lensRow}>
              {LENSES.map((l) => (
                <button key={l.id} onClick={() => setLens(l.id)}
                  style={{ ...s.lensBtn, ...(lens === l.id ? s.lensOn : {}) }}>{l.label}</button>
              ))}
            </div>
          </div>
          <div style={s.skillGrid}>
            {Object.entries(groups).map(([g, list]) => (
              <div key={g}>
                <Eyebrow>{g}</Eyebrow>
                <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                  {list.map((k) => (
                    <SkillNode key={k.id} skill={k} onCycle={cycleSkill} onSelect={setSelSkill} active={selSkill === k.id} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {selected && (
            <SkillDetail skill={selected} onClose={() => setSelSkill(null)} onSet={(lvl) => setSkillLvl(selected.id, lvl)} />
          )}
        </Section>

        {/* ============ APPLICATION TARGETS + MIX ============ */}
        <Section eyebrow="Apply now" title="What to apply for" note="The first job doesn't have to be the final specialization.">
          <div style={s.twoCol} className="r-2col">
            <div style={s.card}>
              <Eyebrow color={C.accent}>Role targets</Eyebrow>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                {ROLE_TARGETS.map((r) => (
                  <span key={r} style={s.chip}>{r}</span>
                ))}
              </div>
              <div style={s.pivotBox}>
                <span style={{ color: C.dim }}>Java Werkstudent</span> + real engineering + personal AI/CV learning
                <span style={{ color: C.comfort }}> → a stronger future AI/CV candidate.</span>
              </div>
            </div>
            <div style={s.card}>
              <Eyebrow color={C.accent}>Suggested application mix</Eyebrow>
              <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                {APP_MIX.map((m) => (
                  <div key={m.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 11, color: C.dim, marginBottom: 4 }}>
                      <span>{m.label}</span><span style={{ color: C.text }}>{m.pct}%</span>
                    </div>
                    <div style={s.barTrack}><div style={{ ...s.barFill, width: `${m.pct * 2.4}%`, background: m.color }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ============ FUNNEL ============ */}
        <Section eyebrow="Application funnel" title="Track and diagnose"
          note="Enter your real numbers. The panel tells you where the funnel leaks.">
          <FunnelTracker funnel={funnel} setFunnel={setFunnel} conv={conv} diagnosis={diagnosis}
            counters={counters} setCounters={setCounters} />
        </Section>

        {/* ============ LONG ROADMAP SPINE ============ */}
        <Section eyebrow="The long game" title="The full roadmap"
          note="Collapsed by default. Open a phase to see its nodes — later phases stay dimmed until earlier ones land.">
          <RoadmapSpine phases={PHASES} open={openPhase} setOpen={setOpenPhase} lens={lens} msDone={msDone} />
        </Section>

        {/* ============ BRANCHES ============ */}
        <Section eyebrow="Eventually" title="Choose your strongest branch"
          note="Don't force this early. Your foundation stays broad enough to pivot.">
          <div style={s.branchRow}>
            {BRANCHES.map((b) => <BranchCard key={b.id} b={b} />)}
          </div>
        </Section>

        {/* ============ GRADUATION + LONG TERM ============ */}
        <Section eyebrow="Graduation & beyond" title="From thesis to €100k+">
          <GradStrip status={status} setStatus={setStatus} />
        </Section>

        {/* ============ MILESTONES ============ */}
        <Section eyebrow="Checkpoints" title="Milestones" note="Tick them as you clear them.">
          <div style={s.msGrid}>
            {MILESTONES.map((m, i) => (
              <MilestoneCard key={m.id} m={m} n={i + 1} done={!!msDone[m.id]}
                onToggle={() => setMsDone({ ...msDone, [m.id]: !msDone[m.id] })} />
            ))}
          </div>
        </Section>

        {/* ============ NOT YET ============ */}
        <Section eyebrow="Discipline" title="Not yet"
          note="These are locked on purpose. They're distractions until the foundation is real.">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {LOCKED.map((l) => (
              <span key={l} style={s.locked}>🔒 {l}</span>
            ))}
          </div>
        </Section>

        {/* ============ PRINCIPLES ============ */}
        <Section eyebrow="Keep these close" title="Operating principles">
          <div style={s.prinGrid}>
            {PRINCIPLES.map((p, i) => (
              <div key={i} style={s.prin}>
                <span style={{ fontFamily: mono, color: C.dim2, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
          <div style={s.bigPrinciple}>
            <Eyebrow color={C.hire}>August → November has two jobs</Eyebrow>
            <div style={s.bigPrinRow}>
              <span>LEARN TO CODE</span>
              <span style={{ color: C.dim2 }}>+</span>
              <span>GET SOMEONE TO HIRE YOU TO CODE</span>
            </div>
          </div>
        </Section>

        {/* ============ STORY SPINE ============ */}
        <Section eyebrow="One continuous story" title="The whole arc">
          <StorySpine />
        </Section>

        <footer style={s.footer}>
          <span style={{ fontFamily: mono, fontSize: 11, color: C.dim2 }}>
            State saved locally on this device. Come back daily.
          </span>
          <button style={s.reset} onClick={() => {
            if (!window.confirm("Reset all progress on this device?")) return;
            ["skills", "milestones", "funnel", "counters", "status", "openPhase", "todo"].forEach((k) => {
              try { window.localStorage.removeItem(K(k)); } catch { delete memStore[K(k)]; }
            });
            window.location.reload?.();
            setSkills(INITIAL_SKILLS); setMsDone({}); setFunnel({ apps: 0, resp: 0, screen: 0, tech: 0, final: 0, offer: 0 });
            setCounters({ weekApps: 0, leetcode: 0, projects: 0 }); setTodo({});
          }}>Reset progress</button>
        </footer>
      </div>
    </div>
  );
}

/* ======================================================================== */
/* NOW PANEL                                                                 */
/* ======================================================================== */
const NOW_ITEMS = [
  "Learn Python", "Write Python yourself", "Practice Git / Terminal",
  "Complete one small programming exercise", "Apply to at least one relevant position",
  "Track the application", "Continue German",
];
function NowPanel({ todo, setTodo }) {
  const done = NOW_ITEMS.filter((_, i) => todo[i]).length;
  return (
    <div style={styles.nowWrap}>
      <div style={styles.nowGlow} />
      <div style={styles.nowInner}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <Eyebrow color={C.accent}>Current phase · Foundation + Werkstudent sprint</Eyebrow>
            <h2 style={styles.nowTitle}>What should I do now?</h2>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: mono, fontSize: 26, color: C.text }}>{done}<span style={{ color: C.dim2, fontSize: 16 }}>/{NOW_ITEMS.length}</span></div>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: ".12em", color: C.dim2, textTransform: "uppercase" }}>today</div>
          </div>
        </div>

        <div style={styles.nowGrid} className="r-nowgrid">
          <div>
            <Eyebrow>Today</Eyebrow>
            <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
              {NOW_ITEMS.map((t, i) => (
                <label key={i} style={styles.todoRow}>
                  <input type="checkbox" checked={!!todo[i]} onChange={() => setTodo({ ...todo, [i]: !todo[i] })} style={styles.check} />
                  <span style={{ fontFamily: mono, color: C.dim2, fontSize: 11, width: 20 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ textDecoration: todo[i] ? "line-through" : "none", color: todo[i] ? C.dim2 : C.text, fontSize: 13.5 }}>{t}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={styles.dontBox}>
            <Eyebrow color={C.hire}>Do not learn yet</Eyebrow>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              {["C++", "Rust", "CUDA", "Kubernetes", "ROS2", "TensorRT", "Advanced MLOps"].map((x) => (
                <span key={x} style={styles.dontChip}>{x}</span>
              ))}
            </div>
            <p style={styles.dontNote}>Every hour spent here now is an hour stolen from getting hired.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================================== */
/* PARALLEL TRACKS                                                           */
/* ======================================================================== */
const TRACK_A = ["Python", "Git + Terminal", "Basic problem solving", "DSA", "LeetCode Easy", "SQL + PostgreSQL", "Linux", "Java refresher", "Basic SWE", "Basic backend", "Docker basics", "Independent project", "Interview prep", "INTERVIEW READY"];
const TRACK_B = ["Fix CV", "Fix LinkedIn", "Clean GitHub", "Start applying immediately", "10–15+ apps / week", "TU Darmstadt HiWi", "Contact professors", "Use FLARE network", "SWE / Python / Java apps", "AI/ML / CV apps", "QA / Test apps", "R&D / Robotics / IT apps", "Track the funnel", "Improve CV & strategy", "FIRST TECHNICAL POSITION"];
function ParallelTracks() {
  return (
    <div>
      <div style={styles.tracksWrap} className="r-tracks">
        <TrackCol title="Track A — become employable" color={C.accent} items={TRACK_A} />
        <div style={styles.tracksAmp} className="r-amp">
          <div style={styles.ampLine} className="r-ampline" /><span style={styles.ampWord} className="r-ampword">SAME TIME</span><div style={styles.ampLine} className="r-ampline" />
        </div>
        <TrackCol title="Track B — get hired" color={C.hire} items={TRACK_B} />
      </div>
      <div style={styles.mergeNode}>↓ &nbsp; FIRST TECHNICAL JOB &nbsp; · &nbsp; TARGET NOV 20, 2026 &nbsp; ↓</div>
    </div>
  );
}
function TrackCol({ title, color, items }) {
  return (
    <div style={styles.trackCol}>
      <div style={{ ...styles.trackHead, color }}>{title}</div>
      <div style={styles.trackList}>
        {items.map((it, i) => {
          const terminal = i === items.length - 1;
          return (
            <div key={i} style={{ ...styles.trackItem, ...(terminal ? { borderColor: color, color: C.text, background: C.panel2, fontFamily: mono, letterSpacing: ".05em", fontWeight: 600 } : {}) }}>
              <span style={{ ...styles.trackDot, background: terminal ? color : C.line2 }} />
              {it}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ======================================================================== */
/* SPRINT                                                                    */
/* ======================================================================== */
function SprintView() {
  const [open, setOpen] = useState(0);
  return (
    <div style={styles.sprintWrap}>
      <div style={styles.sprintRail}>
        {SPRINT.map((s, i) => (
          <button key={i} onClick={() => setOpen(i)}
            style={{ ...styles.sprintTab, ...(open === i ? styles.sprintTabOn : {}) }}>
            <span style={{ fontFamily: mono, fontSize: 10, color: open === i ? C.accent : C.dim2 }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>{s.wk}</span>
            <span style={{ fontFamily: mono, fontSize: 10, color: C.dim2, letterSpacing: ".05em" }}>{s.tag}</span>
          </button>
        ))}
      </div>
      <div style={styles.sprintPanel} className="r-sprintpanel">
        <div style={styles.sprintCol}>
          <Eyebrow color={C.accent}>Learn</Eyebrow>
          <ul style={styles.sprintList}>{SPRINT[open].learn.map((x, i) => <li key={i} className="sprint-li" style={styles.sprintLi}>{x}</li>)}</ul>
        </div>
        <div style={{ ...styles.sprintCol, borderLeft: `1px solid ${C.line}` }}>
          <Eyebrow color={C.hire}>Career</Eyebrow>
          <ul style={styles.sprintList}>{SPRINT[open].career.map((x, i) => <li key={i} className="sprint-li" style={styles.sprintLi}>{x}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

/* ======================================================================== */
/* SKILL DETAIL                                                              */
/* ======================================================================== */
function SkillDetail({ skill, onClose, onSet }) {
  return (
    <div style={styles.detail}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: sans, fontSize: 16, fontWeight: 700, color: C.text }}>{skill.name}</div>
          <Eyebrow>{skill.group}</Eyebrow>
        </div>
        <button onClick={onClose} style={styles.detailClose}>esc ✕</button>
      </div>
      <p style={{ color: C.dim, fontSize: 13.5, lineHeight: 1.6, margin: "12px 0 14px" }}>{skill.desc}</p>
      <Eyebrow>Set status</Eyebrow>
      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
        {[0, 1, 2, 3, 4, 5].map((l) => {
          const st = STATUS[levelToStatus(l)];
          const on = skill.lvl === l;
          return (
            <button key={l} onClick={() => onSet(l)}
              style={{ ...styles.lvlBtn, ...(on ? { borderColor: st.color, color: C.text, background: C.panel2 } : {}) }}>
              {l} · {st.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ======================================================================== */
/* FUNNEL                                                                    */
/* ======================================================================== */
function FunnelTracker({ funnel, setFunnel, conv, diagnosis, counters, setCounters }) {
  const steps = [
    ["apps", "Applications", C.accent], ["resp", "Responses", "#6fa0e8"],
    ["screen", "Recruiter screens", C.comfort], ["tech", "Technical interviews", C.learn],
    ["final", "Final interviews", "#c17ad9"], ["offer", "Offers", C.hire],
  ];
  const max = Math.max(funnel.apps, 1);
  return (
    <div style={styles.twoCol} className="r-2col">
      <div style={styles.card}>
        <Eyebrow color={C.accent}>Funnel</Eyebrow>
        <div style={{ marginTop: 14, display: "grid", gap: 9 }}>
          {steps.map(([k, label, color], i) => {
            const v = funnel[k];
            const prev = i === 0 ? null : funnel[steps[i - 1][0]];
            return (
              <div key={k}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="number" min={0} value={v}
                    onChange={(e) => setFunnel({ ...funnel, [k]: Math.max(0, +e.target.value || 0) })}
                    style={styles.numIn} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.dim, marginBottom: 4 }}>
                      <span>{label}</span>
                      {prev != null && <span style={{ fontFamily: mono, fontSize: 10, color: C.dim2 }}>{conv(prev, v)}% of prev</span>}
                    </div>
                    <div style={styles.barTrack}><div style={{ ...styles.barFill, width: `${(v / max) * 100}%`, background: color }} /></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
        <div style={{ ...styles.card, borderColor: C.line2 }}>
          <Eyebrow color={C.learn}>Diagnosis</Eyebrow>
          <div style={{ fontSize: 14.5, fontWeight: 600, color: C.text, marginTop: 10 }}>{diagnosis.t}</div>
          <p style={{ fontSize: 13, color: C.dim, lineHeight: 1.6, marginTop: 6 }}>{diagnosis.why}</p>
        </div>
        <div style={styles.card}>
          <Eyebrow>Counters</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
            <Counter label="Apps / week" v={counters.weekApps} set={(x) => setCounters({ ...counters, weekApps: x })} />
            <Counter label="LeetCode" v={counters.leetcode} set={(x) => setCounters({ ...counters, leetcode: x })} />
            <Counter label="Projects" v={counters.projects} set={(x) => setCounters({ ...counters, projects: x })} />
          </div>
        </div>
      </div>
    </div>
  );
}
function Counter({ label, v, set }) {
  return (
    <div style={styles.counter}>
      <div style={{ fontFamily: mono, fontSize: 22, color: C.text, textAlign: "center" }}>{v}</div>
      <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: ".08em", color: C.dim2, textTransform: "uppercase", textAlign: "center", margin: "2px 0 8px" }}>{label}</div>
      <div style={{ display: "flex", gap: 5 }}>
        <button style={styles.cbtn} onClick={() => set(Math.max(0, v - 1))}>–</button>
        <button style={styles.cbtn} onClick={() => set(v + 1)}>+</button>
      </div>
    </div>
  );
}

/* ======================================================================== */
/* ROADMAP SPINE                                                             */
/* ======================================================================== */
function RoadmapSpine({ phases, open, setOpen, lens, msDone }) {
  return (
    <div style={styles.spine}>
      {phases.map((p, i) => {
        const dim = lens !== "all" && !p.lens.includes(lens) && !(lens === "career");
        const isOpen = !!open[p.id];
        return (
          <div key={p.id} style={{ position: "relative", opacity: dim ? 0.4 : 1, transition: "opacity .25s" }}>
            {i < phases.length - 1 && <div style={styles.spineLine} />}
            <div style={styles.spineDot(i === 0)} />
            <button onClick={() => setOpen({ ...open, [p.id]: !isOpen })} style={styles.phaseHead}>
              <div style={{ textAlign: "left" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: mono, fontSize: 11, color: C.dim2 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 15.5, fontWeight: 700, color: C.text }}>{p.title}</span>
                  <span style={{ fontFamily: mono, fontSize: 10.5, color: C.accent, letterSpacing: ".05em" }}>{p.when}</span>
                </div>
                {p.milestone && <div style={{ fontFamily: mono, fontSize: 10.5, color: msDone[milestoneIdFor(p.milestone)] ? C.comfort : C.dim2, marginTop: 5 }}>◈ {p.milestone}</div>}
              </div>
              <span style={{ fontFamily: mono, color: C.dim2, fontSize: 13 }}>{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div style={styles.phaseBody}>
                <p style={{ color: C.dim, fontSize: 13, lineHeight: 1.6, margin: "0 0 12px" }}>{p.blurb}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {p.nodes.map((n) => <span key={n} style={styles.phaseNode}>{n}</span>)}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
function milestoneIdFor(text) {
  const m = MILESTONES.find((x) => x.t === text);
  return m ? m.id : "";
}

/* ======================================================================== */
/* BRANCH CARD                                                               */
/* ======================================================================== */
function BranchCard({ b }) {
  return (
    <div style={{ ...styles.card, borderTop: `2px solid ${b.color}` }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{b.title}</div>
      <div style={{ display: "grid", gap: 6, marginTop: 12 }}>
        {b.skills.map((s) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: C.dim }}>
            <span style={{ width: 5, height: 5, borderRadius: 5, background: b.color, flex: "none" }} />{s}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================================================================== */
/* GRADUATION STRIP                                                          */
/* ======================================================================== */
const GRAD_FLOW = ["Specialization", "Bachelor thesis (aligned)", "Continue Werkstudent / internship", "Full-time apps BEFORE graduation", "Graduation", "Full-time engineer"];
const CAREER_FLOW = ["Junior / graduate engineer", "Strong engineer", "Specialized engineer", "Senior engineer"];
function GradStrip({ status, setStatus }) {
  return (
    <div>
      <div style={styles.gradToggleRow}>
        <Eyebrow>Graduation target</Eyebrow>
        <div style={{ display: "flex", gap: 6 }}>
          {["Oct 2027", "Apr 2028"].map((g) => (
            <button key={g} onClick={() => setStatus({ ...status, grad: g })}
              style={{ ...styles.gradToggle, ...(status.grad === g ? styles.gradToggleOn : {}) }}>{g}</button>
          ))}
        </div>
      </div>
      <div style={styles.flowRow}>
        {GRAD_FLOW.map((f, i) => (
          <React.Fragment key={f}>
            <div style={{ ...styles.flowNode, ...(f === "Graduation" ? { borderColor: C.accent, color: C.text } : {}) }}>{f}</div>
            {i < GRAD_FLOW.length - 1 && <span style={styles.flowArrow}>→</span>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ height: 18 }} />
      <Eyebrow color={C.strong}>Long-term trajectory</Eyebrow>
      <div style={{ ...styles.flowRow, marginTop: 12 }}>
        {CAREER_FLOW.map((f, i) => (
          <React.Fragment key={f}>
            <div style={styles.flowNode}>{f}</div>
            {i < CAREER_FLOW.length - 1 && <span style={styles.flowArrow}>→</span>}
          </React.Fragment>
        ))}
      </div>
      <div style={styles.branchTriple}>
        {["Senior engineer", "Tech lead", "Startup / founder"].map((x) => (
          <div key={x} style={styles.tripleNode}>{x}</div>
        ))}
      </div>
      <div style={styles.hundredK}>
        <div>
          <Eyebrow color={C.comfort}>Long-term milestone · not a graduate salary</Eyebrow>
          <div style={styles.hundredKBig}>€100K+ total compensation</div>
        </div>
        <div style={styles.hundredKNote}>A destination reached through experience and specialization — presented as a target, never a guarantee.</div>
      </div>
    </div>
  );
}

/* ======================================================================== */
/* MILESTONE CARD                                                            */
/* ======================================================================== */
function MilestoneCard({ m, n, done, onToggle }) {
  return (
    <button onClick={onToggle}
      style={{
        ...styles.msCard, textAlign: "left", cursor: "pointer",
        borderColor: done ? C.comfort : m.hero ? C.line2 : C.line,
        background: done ? "rgba(91,191,138,0.06)" : m.hero ? C.panel2 : C.panel,
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: mono, fontSize: 11, color: m.hero ? C.hire : C.dim2 }}>
          M{String(n).padStart(2, "0")}
        </span>
        <span style={{ ...styles.msDot, borderColor: done ? C.comfort : C.line2, background: done ? C.comfort : "transparent" }}>
          {done && <span style={{ color: "#07160e", fontSize: 11 }}>✓</span>}
        </span>
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: done ? C.comfort : C.text, marginTop: 10, lineHeight: 1.4 }}>{m.t}</div>
      {m.when && <div style={{ fontFamily: mono, fontSize: 10, color: C.hire, marginTop: 6 }}>{m.when}</div>}
    </button>
  );
}

/* ======================================================================== */
/* STORY SPINE                                                               */
/* ======================================================================== */
const STORY = ["I don't really know how to code yet", "Learn to program", "Learn + Apply", "First Werkstudent", "Real SWE experience", "Strong SWE foundation", "AI / ML", "Computer Vision", "Edge AI", "C++ + Robotics", "Autonomous systems", "Choose specialty", "Bachelor thesis", "Full-time engineer", "Specialized engineer", "Senior / Tech Lead / Founder", "€100k+ target"];
function StorySpine() {
  return (
    <div style={styles.storyWrap}>
      {STORY.map((s, i) => {
        const hero = i === 0 || i === STORY.length - 1 || s === "First Werkstudent";
        return (
          <React.Fragment key={i}>
            <div style={{
              ...styles.storyNode,
              ...(hero ? { borderColor: i === STORY.length - 1 ? C.comfort : i === 0 ? C.hire : C.accent, color: C.text, fontFamily: mono, letterSpacing: ".03em" } : {}),
            }}>{s}</div>
            {i < STORY.length - 1 && <div style={styles.storyConn} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ======================================================================== */
/* generic bits                                                              */
/* ======================================================================== */
function Section({ eyebrow, title, note, children }) {
  return (
    <section style={styles.section}>
      <div style={styles.sectionHead}>
        <Eyebrow color={C.accent}>{eyebrow}</Eyebrow>
        <h2 style={styles.h2}>{title}</h2>
        {note && <p style={styles.note}>{note}</p>}
      </div>
      {children}
    </section>
  );
}
function Tree({ items }) {
  return (
    <div style={{ marginTop: 10 }}>
      {items.map(([k, v], i) => (
        <div key={k} style={{ display: "flex", alignItems: "baseline", gap: 8, fontFamily: mono, fontSize: 12, color: C.dim, padding: "2px 0" }}>
          <span style={{ color: C.dim2 }}>{i === items.length - 1 ? "└──" : "├──"}</span>
          <span>{k}</span><span style={{ color: C.dim2 }}>:</span><span style={{ color: C.text }}>{v}</span>
        </div>
      ))}
    </div>
  );
}
function Stat({ label, value, sub, ring, ringColor }) {
  return (
    <div style={styles.stat}>
      {ring != null && <Ring pct={ring} size={44} color={ringColor} label="" />}
      <div>
        <div style={{ fontFamily: mono, fontSize: 20, color: C.text, lineHeight: 1 }}>{value}</div>
        <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: ".1em", color: C.dim2, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: C.dim2, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}
function EditStat({ label, value, options, onSet }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ ...styles.stat, position: "relative", cursor: "pointer" }} onClick={() => setOpen((o) => !o)}>
      <div>
        <div style={{ fontFamily: mono, fontSize: 17, color: C.text, lineHeight: 1 }}>{value}</div>
        <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: ".1em", color: C.dim2, textTransform: "uppercase", marginTop: 4 }}>{label} ▾</div>
      </div>
      {open && (
        <div style={styles.dropdown} onClick={(e) => e.stopPropagation()}>
          {options.map((o) => (
            <button key={o} onClick={() => { onSet(o); setOpen(false); }}
              style={{ ...styles.dropItem, ...(o === value ? { color: C.accent } : {}) }}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}
function Grain() { return <div style={styles.grid} aria-hidden />; }

/* ======================================================================== */
/* styles                                                                    */
/* ======================================================================== */
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
  * { box-sizing: border-box; }
  ::selection { background: rgba(91,141,239,0.3); }
  input[type=number]::-webkit-inner-spin-button { opacity: 1; }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.line2}; border-radius: 6px; border: 2px solid ${C.bg}; }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
  button:focus-visible, input:focus-visible, label:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
  .sprint-li::before { content: "›"; position: absolute; left: 0; color: ${C.dim2}; }
  @media (max-width: 720px) {
    .r-2col { grid-template-columns: 1fr !important; }
    .r-nowgrid { grid-template-columns: 1fr !important; }
    .r-sprintpanel { grid-template-columns: 1fr !important; }
    .r-tracks { grid-template-columns: 1fr !important; }
    .r-tracks .r-amp { flex-direction: row !important; padding: 12px 0 !important; }
    .r-tracks .r-amp .r-ampword { writing-mode: horizontal-tb !important; transform: none !important; }
    .r-tracks .r-ampline { width: auto !important; height: 1px !important; flex: 1 !important; }
    .r-stats { grid-template-columns: 1fr 1fr !important; }
  }
`;

const styles = {
  root: { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: sans, position: "relative", overflowX: "hidden" },
  grid: {
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
    backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
    backgroundSize: "56px 56px", opacity: 0.28,
    maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%)",
    WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%)",
  },
  wrap: { position: "relative", zIndex: 1, maxWidth: 1080, margin: "0 auto", padding: "clamp(20px,4vw,52px) clamp(16px,4vw,40px) 80px" },

  hero: { marginBottom: 40 },
  h1: { fontFamily: sans, fontSize: "clamp(28px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "12px 0 2px", lineHeight: 1.02 },
  h1sub: { fontFamily: mono, fontSize: "clamp(12px,2vw,15px)", color: C.dim, letterSpacing: ".04em" },
  currentState: { marginTop: 26, padding: "18px 20px", border: `1px solid ${C.line}`, borderRadius: 12, background: C.panel, maxWidth: 480 },
  csLine: { display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 },
  csKey: { fontFamily: mono, fontSize: 13, color: C.text, letterSpacing: ".03em" },
  csAt: { fontFamily: mono, fontSize: 11, color: C.dim2 },

  stats: { marginTop: 26, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 },
  stat: { display: "flex", gap: 14, alignItems: "center", padding: "16px 18px", border: `1px solid ${C.line}`, borderRadius: 12, background: C.panel },
  dropdown: { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: C.panel2, border: `1px solid ${C.line2}`, borderRadius: 10, padding: 6, zIndex: 20, boxShadow: "0 12px 40px rgba(0,0,0,.5)" },
  dropItem: { display: "block", width: "100%", textAlign: "left", background: "none", border: "none", color: C.dim, fontFamily: mono, fontSize: 12, padding: "7px 10px", borderRadius: 7, cursor: "pointer" },

  /* now panel */
  nowWrap: { position: "relative", borderRadius: 16, padding: 1, background: `linear-gradient(180deg, ${C.line2}, ${C.line})`, marginBottom: 44, overflow: "hidden" },
  nowGlow: { position: "absolute", top: -80, left: "20%", width: 300, height: 200, background: "radial-gradient(circle, rgba(91,141,239,0.14), transparent 70%)", pointerEvents: "none" },
  nowInner: { position: "relative", background: C.panel, borderRadius: 15, padding: "clamp(20px,3vw,30px)" },
  nowTitle: { fontFamily: sans, fontSize: "clamp(22px,3.4vw,32px)", fontWeight: 700, letterSpacing: "-0.02em", margin: "8px 0 0" },
  nowGrid: { marginTop: 22, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 },
  todoRow: { display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", borderRadius: 8, cursor: "pointer", border: `1px solid ${C.line}`, background: C.panel2 },
  check: { width: 15, height: 15, accentColor: C.accent, cursor: "pointer" },
  dontBox: { border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, background: "rgba(224,106,106,0.03)", alignContent: "start" },
  dontChip: { fontFamily: mono, fontSize: 11, color: C.dim, padding: "4px 9px", border: `1px dashed ${C.line2}`, borderRadius: 6 },
  dontNote: { fontSize: 12, color: C.dim2, lineHeight: 1.5, marginTop: 14, fontStyle: "italic" },

  section: { marginBottom: 52 },
  sectionHead: { marginBottom: 20 },
  h2: { fontFamily: sans, fontSize: "clamp(20px,3vw,27px)", fontWeight: 700, letterSpacing: "-0.02em", margin: "8px 0 0" },
  note: { fontSize: 13.5, color: C.dim, marginTop: 6, maxWidth: 640, lineHeight: 1.55 },

  /* tracks */
  tracksWrap: { display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 0, alignItems: "start" },
  tracksAmp: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "0 14px", alignSelf: "stretch", justifyContent: "center" },
  ampLine: { width: 1, flex: 1, background: `linear-gradient(${C.line2}, transparent)` },
  ampWord: { fontFamily: mono, fontSize: 9.5, letterSpacing: ".15em", color: C.dim2, writingMode: "vertical-rl", transform: "rotate(180deg)" },
  trackCol: { border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, background: C.panel },
  trackHead: { fontFamily: mono, fontSize: 11.5, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 },
  trackList: { display: "grid", gap: 5 },
  trackItem: { display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: C.dim, padding: "6px 9px", border: `1px solid ${C.line}`, borderRadius: 7 },
  trackDot: { width: 5, height: 5, borderRadius: 5, flex: "none" },
  mergeNode: { marginTop: 16, textAlign: "center", fontFamily: mono, fontSize: 12, letterSpacing: ".08em", color: C.text, padding: "12px", border: `1px solid ${C.line2}`, borderRadius: 10, background: C.panel2 },

  /* sprint */
  sprintWrap: { border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden", background: C.panel },
  sprintRail: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", borderBottom: `1px solid ${C.line}` },
  sprintTab: { display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start", padding: "13px 15px", background: "none", border: "none", borderRight: `1px solid ${C.line}`, cursor: "pointer", color: C.dim, transition: "background .15s" },
  sprintTabOn: { background: C.panel2, color: C.text },
  sprintPanel: { display: "grid", gridTemplateColumns: "1fr 1fr" },
  sprintCol: { padding: "18px 20px" },
  sprintList: { margin: "12px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 8 },
  sprintLi: { fontSize: 13, color: C.dim, lineHeight: 1.5, paddingLeft: 16, position: "relative" },

  /* skills */
  skillControls: { display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 18 },
  search: { flex: "1 1 200px", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 9, padding: "10px 13px", color: C.text, fontFamily: mono, fontSize: 13, minWidth: 160 },
  lensRow: { display: "flex", gap: 6, flexWrap: "wrap" },
  lensBtn: { fontFamily: mono, fontSize: 11, color: C.dim, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 7, padding: "7px 11px", cursor: "pointer" },
  lensOn: { color: C.text, borderColor: C.line2, background: C.panel2 },
  skillGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 22 },

  detail: { marginTop: 20, border: `1px solid ${C.line2}`, borderRadius: 12, padding: 18, background: C.panel2 },
  detailClose: { fontFamily: mono, fontSize: 11, color: C.dim2, background: "none", border: `1px solid ${C.line}`, borderRadius: 6, padding: "4px 8px", cursor: "pointer" },
  lvlBtn: { fontFamily: mono, fontSize: 11, color: C.dim, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 7, padding: "7px 10px", cursor: "pointer" },

  /* generic card */
  card: { border: `1px solid ${C.line}`, borderRadius: 12, padding: 18, background: C.panel },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" },
  chip: { fontFamily: mono, fontSize: 11, color: C.dim, padding: "5px 9px", border: `1px solid ${C.line}`, borderRadius: 6, background: C.panel2 },
  pivotBox: { marginTop: 16, padding: "12px 14px", borderRadius: 9, border: `1px dashed ${C.line2}`, fontSize: 12.5, lineHeight: 1.6 },
  barTrack: { height: 7, background: C.line, borderRadius: 5, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 5, transition: "width .5s cubic-bezier(.4,0,.2,1)" },

  numIn: { width: 54, background: C.panel2, border: `1px solid ${C.line2}`, borderRadius: 7, padding: "7px 8px", color: C.text, fontFamily: mono, fontSize: 13, textAlign: "center" },
  counter: { border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 8px", background: C.panel2 },
  cbtn: { flex: 1, background: C.panel, border: `1px solid ${C.line2}`, borderRadius: 6, color: C.dim, fontFamily: mono, fontSize: 14, padding: "3px 0", cursor: "pointer" },

  /* spine */
  spine: { position: "relative", display: "grid", gap: 14, paddingLeft: 26 },
  spineLine: { position: "absolute", left: -19, top: 26, bottom: -20, width: 1, background: C.line2 },
  spineDot: (first) => ({ position: "absolute", left: -23, top: 20, width: 9, height: 9, borderRadius: 9, background: first ? C.accent : C.panel, border: `2px solid ${first ? C.accent : C.line2}`, zIndex: 2 }),
  phaseHead: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 11, padding: "16px 18px", cursor: "pointer" },
  phaseBody: { marginTop: -2, padding: "14px 18px 18px", border: `1px solid ${C.line}`, borderTop: "none", borderRadius: "0 0 11px 11px", background: C.panel2, marginLeft: 0 },
  phaseNode: { fontFamily: mono, fontSize: 11, color: C.dim, padding: "6px 10px", border: `1px solid ${C.line2}`, borderRadius: 7, background: C.panel },

  /* branches */
  branchRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 },

  /* grad */
  gradToggleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 },
  gradToggle: { fontFamily: mono, fontSize: 12, color: C.dim, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 14px", cursor: "pointer" },
  gradToggleOn: { color: C.text, borderColor: C.accent, background: C.panel2 },
  flowRow: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 },
  flowNode: { fontFamily: mono, fontSize: 12, color: C.dim, padding: "9px 13px", border: `1px solid ${C.line}`, borderRadius: 8, background: C.panel },
  flowArrow: { color: C.dim2, fontFamily: mono },
  branchTriple: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 16 },
  tripleNode: { textAlign: "center", fontFamily: mono, fontSize: 12.5, color: C.text, padding: "14px", border: `1px solid ${C.line2}`, borderRadius: 10, background: C.panel2 },
  hundredK: { marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap", padding: "20px 22px", border: `1px solid ${C.line2}`, borderRadius: 14, background: "linear-gradient(120deg, rgba(91,191,138,0.05), transparent)" },
  hundredKBig: { fontFamily: sans, fontSize: "clamp(22px,3.4vw,32px)", fontWeight: 700, letterSpacing: "-0.02em", marginTop: 6 },
  hundredKNote: { fontSize: 12.5, color: C.dim2, maxWidth: 300, lineHeight: 1.55 },

  /* milestones */
  msGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 12 },
  msCard: { border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, background: C.panel, transition: "all .18s" },
  msDot: { width: 20, height: 20, borderRadius: 20, border: `2px solid ${C.line2}`, display: "grid", placeItems: "center", flex: "none" },

  /* locked */
  locked: { fontFamily: mono, fontSize: 11.5, color: C.dim2, padding: "7px 11px", border: `1px dashed ${C.locked}`, borderRadius: 7, background: "rgba(255,255,255,0.01)" },

  /* principles */
  prinGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 10 },
  prin: { display: "flex", gap: 12, alignItems: "baseline", fontSize: 13.5, color: C.dim, padding: "12px 14px", border: `1px solid ${C.line}`, borderRadius: 10, background: C.panel, lineHeight: 1.5 },
  bigPrinciple: { marginTop: 18, padding: "22px 24px", border: `1px solid ${C.line2}`, borderRadius: 14, background: C.panel2, textAlign: "center" },
  bigPrinRow: { display: "flex", justifyContent: "center", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: 12, fontFamily: mono, fontSize: "clamp(13px,2vw,17px)", letterSpacing: ".04em", color: C.text, fontWeight: 600 },

  /* story */
  storyWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 0 },
  storyNode: { fontFamily: sans, fontSize: 13, color: C.dim, padding: "10px 18px", border: `1px solid ${C.line}`, borderRadius: 9, background: C.panel, textAlign: "center", minWidth: 220, maxWidth: 340 },
  storyConn: { width: 1, height: 16, background: C.line2 },

  footer: { marginTop: 40, paddingTop: 24, borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 },
  reset: { fontFamily: mono, fontSize: 11, color: C.dim2, background: "none", border: `1px solid ${C.line}`, borderRadius: 7, padding: "7px 12px", cursor: "pointer" },
};
