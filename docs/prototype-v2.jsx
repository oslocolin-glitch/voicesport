import { useState, useEffect } from "react";

const sampleContent = [
  { id: 1, title: "Safeguarding Policy Toolkit for Grassroots Clubs", type: "Toolkit", sport: "Football", countries: ["ES","DE","TR"], topic: "Safeguarding", rating: 4.7, views: 2340, downloads: 890, languages: ["EN","ES","DE","TR"], formats: ["PDF","Video","Infographic"], project: "SafeClub 2024", year: 2024, cc: "CC BY-SA 4.0", abstract: "A comprehensive toolkit for grassroots sport clubs to develop, implement and monitor safeguarding policies.", pages: 80, applied: 34 },
  { id: 2, title: "AI-Powered Adaptive Learning for Coach Education", type: "Report", sport: "Multi-sport", countries: ["NL","NO"], topic: "AI & Education", rating: 4.5, views: 1890, downloads: 654, languages: ["EN","NO","NL"], formats: ["PDF","Practitioner Brief"], project: "COMPATH 2", year: 2025, cc: "CC BY 4.0", abstract: "Research report on implementing AI-driven personalized learning pathways in coach education.", pages: 120, applied: 18 },
  { id: 3, title: "Dual Career Support: Athlete-Student Balance Guide", type: "Guide", sport: "Athletics", countries: ["IT","BE","FI"], topic: "Dual Career", rating: 4.8, views: 3120, downloads: 1450, languages: ["EN","IT","FI","FR"], formats: ["PDF","Micro-learning","Quiz"], project: "EAS Network", year: 2024, cc: "CC BY 4.0", abstract: "Practical guide for athletes, coaches and university administrators on balancing sport with studies.", pages: 45, applied: 52 },
  { id: 4, title: "Green Sport Management: Carbon Footprint Toolkit", type: "Toolkit", sport: "Multi-sport", countries: ["DE","SE"], topic: "Green Sport", rating: 4.3, views: 1560, downloads: 520, languages: ["EN","DE","SV"], formats: ["PDF","App","Video"], project: "GAMES Erasmus+", year: 2025, cc: "CC BY-SA 4.0", abstract: "Tools for sport organizations to measure, reduce and report their environmental footprint.", pages: 60, applied: 12 },
  { id: 5, title: "Inclusive Sport Innovation Lab: Disability & Access", type: "Platform", sport: "Multi-sport", countries: ["PT","PL","IE"], topic: "Inclusive Sport", rating: 4.9, views: 2780, downloads: 980, languages: ["EN","PT","PL"], formats: ["Platform","PDF","Video"], project: "SportAccess+", year: 2024, cc: "CC BY 4.0", abstract: "Interactive platform with adapted training methodologies and policy frameworks for accessible sport.", pages: 95, applied: 41 },
  { id: 6, title: "Padel Development Framework for Europe", type: "Report", sport: "Padel", countries: ["ES","TR","SE"], topic: "Sport Development", rating: 4.4, views: 1230, downloads: 410, languages: ["EN","ES","TR","SV"], formats: ["PDF","Infographic"], project: "PADEL-EURO", year: 2026, cc: "CC BY 4.0", abstract: "Strategic framework for developing padel across European countries.", pages: 55, applied: 8 },
];

const topics = ["All","Safeguarding","AI & Education","Dual Career","Green Sport","Inclusive Sport","Sport Development"];
const formatIcons = { PDF:"📄", Video:"🎬", Infographic:"🖼️", "Practitioner Brief":"📝", "Micro-learning":"📱", Quiz:"❓", App:"📲", Platform:"🖥️", Podcast:"🎧" };
const flagMap = { ES:"🇪🇸", DE:"🇩🇪", TR:"🇹🇷", NL:"🇳🇱", NO:"🇳🇴", IT:"🇮🇹", BE:"🇧🇪", FI:"🇫🇮", SE:"🇸🇪", PT:"🇵🇹", PL:"🇵🇱", IE:"🇮🇪", FR:"🇫🇷", EN:"🇬🇧" };

const Stars = ({ rating }) => (
  <span style={{ color: "#F59E0B", letterSpacing: 1, fontSize: 13 }}>
    {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
    <span style={{ color: "#64748B", fontSize: 11, marginLeft: 3, fontWeight: 500 }}>{rating}</span>
  </span>
);

// Animated counter
function Counter({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const inc = target / (duration / 16);
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <>{typeof target === "string" ? target : val.toLocaleString()}</>;
}

export default function VoiceSportV2() {
  const [tab, setTab] = useState("discover");
  const [topic, setTopic] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [role, setRole] = useState("Coach");
  const [submitStep, setSubmitStep] = useState(0);
  const [aiTarget, setAiTarget] = useState(null);
  const [aiOptions, setAiOptions] = useState({ summary: false, infographic: false, video: false, audio: false, translate: false });
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [okrFaz, setOkrFaz] = useState(1);

  const filtered = sampleContent.filter(item => {
    if (topic !== "All" && item.topic !== topic) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.abstract.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalApplied = sampleContent.reduce((s, i) => s + i.applied, 0);

  const handleAiTransform = () => {
    setAiProcessing(true);
    setAiDone(false);
    setTimeout(() => { setAiProcessing(false); setAiDone(true); }, 3000);
  };

  const roles = [
    { key: "Coach", icon: "🏃", label: "Coach" },
    { key: "Club", icon: "🏢", label: "Club Manager" },
    { key: "Athlete", icon: "⚡", label: "Athlete" },
    { key: "Educator", icon: "📚", label: "Educator" },
    { key: "Researcher", icon: "🔬", label: "Researcher" },
  ];

  const tabStyle = (t) => ({
    background: tab === t ? "rgba(16,185,129,0.15)" : "transparent",
    border: tab === t ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10, padding: "7px 16px", color: "white", cursor: "pointer",
    fontSize: 13, fontWeight: tab === t ? 600 : 400, transition: "all 0.2s",
  });

  const pillStyle = (active) => ({
    background: active ? "#0F172A" : "white", color: active ? "white" : "#475569",
    border: "1px solid " + (active ? "#0F172A" : "#E2E8F0"), borderRadius: 20,
    padding: "5px 14px", fontSize: 12, cursor: "pointer", fontWeight: 500, transition: "all 0.15s",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet" />

      {/* ═══════════ HEADER ═══════════ */}
      <header style={{ background: "linear-gradient(145deg, #0B1120 0%, #162033 40%, #0D3B3B 100%)", color: "white" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#10B981,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, fontFamily: "Outfit" }}>V</div>
            <div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 19, letterSpacing: -0.5 }}>VoiceSport</div>
              <div style={{ fontSize: 9, opacity: 0.5, letterSpacing: 2, textTransform: "uppercase" }}>European Sport Knowledge Hub</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { key: "discover", icon: "🔍", label: "Discover" },
              { key: "submit", icon: "📤", label: "Submit" },
              { key: "ai", icon: "🤖", label: "AI Studio" },
              { key: "okr", icon: "🎯", label: "OKR" },
              { key: "dashboard", icon: "📊", label: "Impact" },
              { key: "community", icon: "👥", label: "Community" },
            ].map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); if (t.key === "submit") setSubmitStep(0); if (t.key === "ai") { setAiTarget(null); setAiDone(false); } }} style={tabStyle(t.key)}>{t.icon} {t.label}</button>
            ))}
          </div>
        </div>

        {/* Hero — only on discover */}
        {tab === "discover" && (
          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
              <div>
                <h1 style={{ fontFamily: "Outfit", fontSize: 26, fontWeight: 800, letterSpacing: -1, lineHeight: 1.15, marginBottom: 4 }}>
                  Discover. Transform. Apply.
                </h1>
                <p style={{ fontSize: 14, opacity: 0.6, maxWidth: 520 }}>
                  One hub for all EU sport project outputs — made findable, accessible and actionable through AI.
                </p>
              </div>
              <div style={{ marginLeft: "auto", background: "rgba(16,185,129,0.12)", borderRadius: 14, padding: "14px 20px", textAlign: "center", border: "1px solid rgba(16,185,129,0.25)" }}>
                <div style={{ fontSize: 10, opacity: 0.6, textTransform: "uppercase", letterSpacing: 1.5 }}>North Star</div>
                <div style={{ fontFamily: "Outfit", fontSize: 28, fontWeight: 800, color: "#10B981" }}><Counter target={totalApplied} /></div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>"Applied in practice"</div>
              </div>
            </div>

            {/* Roles */}
            <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
              {roles.map(r => (
                <button key={r.key} onClick={() => setRole(r.key)} style={{
                  background: role === r.key ? "#10B981" : "rgba(255,255,255,0.07)",
                  border: role === r.key ? "none" : "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 20, padding: "5px 14px", color: "white", cursor: "pointer",
                  fontSize: 12, fontWeight: 500, transition: "all 0.15s",
                }}>{r.icon} {r.label}</button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: "relative" }}>
              <input type="text" placeholder='Try: "safeguarding toolkit" or "AI coaching guide in Turkish"' value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "13px 16px 13px 42px", borderRadius: 14, border: "2px solid rgba(16,185,129,0.3)", fontSize: 14, background: "rgba(255,255,255,0.95)", color: "#0F172A", boxSizing: "border-box", outline: "none" }} />
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 17 }}>🔍</span>
            </div>
          </div>
        )}
      </header>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 20px 40px" }}>

        {/* ═══════════ DISCOVER TAB ═══════════ */}
        {tab === "discover" && (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
              {topics.map(t => <button key={t} onClick={() => setTopic(t)} style={pillStyle(topic === t)}>{t}</button>)}
            </div>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 14 }}>{filtered.length} resource{filtered.length !== 1 && "s"} found</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 14 }}>
              {filtered.map(item => (
                <div key={item.id} onClick={() => setExpanded(expanded === item.id ? null : item.id)} style={{
                  background: "white", borderRadius: 16, border: expanded === item.id ? "2px solid #10B981" : "1px solid #E2E8F0",
                  overflow: "hidden", cursor: "pointer", transition: "all 0.2s",
                  boxShadow: expanded === item.id ? "0 8px 30px rgba(16,185,129,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ padding: "14px 16px 10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ background: "#EFF6FF", color: "#1D4ED8", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 6 }}>{item.type}</span>
                      <span style={{ background: "#F0FDF4", color: "#166534", fontSize: 10, padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>✅ {item.applied} applied</span>
                    </div>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", lineHeight: 1.35, marginBottom: 6 }}>{item.title}</h3>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                      <span style={{ background: "#FEF3C7", color: "#92400E", fontSize: 10, padding: "1px 6px", borderRadius: 4 }}>🏷️ {item.topic}</span>
                      <span style={{ fontSize: 10, color: "#94A3B8" }}>{item.countries.map(c => flagMap[c] || c).join(" ")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Stars rating={item.rating} />
                      <div style={{ display: "flex", gap: 10, fontSize: 11, color: "#94A3B8" }}>
                        <span>👁 {item.views.toLocaleString()}</span>
                        <span>⬇ {item.downloads.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "6px 16px 10px", display: "flex", gap: 4, flexWrap: "wrap", borderTop: "1px solid #F8FAFC" }}>
                    {item.formats.map(f => <span key={f} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6, padding: "2px 7px", fontSize: 10, color: "#475569" }}>{formatIcons[f]} {f}</span>)}
                    <span style={{ marginLeft: "auto", fontSize: 10 }}>{item.languages.map(l => <span key={l} style={{ background: "#0F172A", color: "white", fontSize: 9, fontWeight: 600, padding: "1px 5px", borderRadius: 3, marginLeft: 2 }}>{l}</span>)}</span>
                  </div>
                  {expanded === item.id && (
                    <div style={{ padding: "12px 16px 14px", borderTop: "1px solid #E2E8F0", background: "#FAFBFC" }}>
                      <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6, marginBottom: 8 }}>{item.abstract}</p>
                      <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 10 }}>📄 {item.pages} pages · {item.project} · {item.year} · {item.cc}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={{ flex: 1, background: "#10B981", color: "white", border: "none", borderRadius: 10, padding: "8px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>⬇ Download</button>
                        <button onClick={e => { e.stopPropagation(); setAiTarget(item); setTab("ai"); setAiDone(false); }} style={{ flex: 1, background: "linear-gradient(135deg,#7C3AED,#2563EB)", color: "white", border: "none", borderRadius: 10, padding: "8px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🤖 AI Transform</button>
                        <button style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 10, padding: "8px 12px", fontSize: 12, cursor: "pointer" }}>⭐</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ═══════════ SUBMIT TAB ═══════════ */}
        {tab === "submit" && (
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "Outfit", fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>📤 Submit Content</h2>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>Share your project outputs with the European sport community.</p>

            {/* Progress */}
            <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
              {["Project Info","Content Details","Upload Files","AI Transform","Review"].map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ height: 4, borderRadius: 2, background: i <= submitStep ? "#10B981" : "#E2E8F0", transition: "all 0.3s", marginBottom: 4 }} />
                  <span style={{ fontSize: 10, color: i <= submitStep ? "#10B981" : "#94A3B8", fontWeight: i === submitStep ? 600 : 400 }}>{s}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "white", borderRadius: 16, border: "1px solid #E2E8F0", padding: 24 }}>
              {submitStep === 0 && (
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: "#0F172A" }}>Step 1: Project Information</h3>
                  {[
                    { label: "Project Name", placeholder: "e.g. SafeClub 2024" },
                    { label: "Funding Programme", placeholder: "e.g. Erasmus+ Sport KA2" },
                    { label: "Partner Countries", placeholder: "e.g. Spain, Germany, Turkey" },
                    { label: "Your Name & Organization", placeholder: "e.g. Maria Garcia, Valencia Athletics Club" },
                  ].map((f, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>{f.label}</label>
                      <input placeholder={f.placeholder} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                    </div>
                  ))}
                </div>
              )}
              {submitStep === 1 && (
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: "#0F172A" }}>Step 2: Content Details</h3>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>Title</label>
                    <input placeholder="Resource title" style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 13, boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>Description</label>
                    <textarea placeholder="Brief description of the resource..." rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 13, boxSizing: "border-box", resize: "vertical" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>Topic</label>
                      <select style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 13 }}>
                        {topics.filter(t => t !== "All").map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>Target Audience</label>
                      <select style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 13 }}>
                        <option>Coaches</option><option>Club Managers</option><option>Athletes</option><option>Educators</option><option>Researchers</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>License</label>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["CC BY 4.0","CC BY-SA 4.0","CC BY-NC 4.0"].map(l => (
                        <button key={l} style={{ ...pillStyle(l === "CC BY 4.0"), fontSize: 11 }}>{l}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {submitStep === 2 && (
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: "#0F172A" }}>Step 3: Upload Files</h3>
                  <div style={{ border: "2px dashed #CBD5E1", borderRadius: 14, padding: 32, textAlign: "center", background: "#FAFBFC" }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>📁</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 4 }}>Drag & drop files here</div>
                    <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 12 }}>PDF, DOCX, MP4, PNG, URL — Max 500MB per file</div>
                    <button style={{ background: "#0F172A", color: "white", border: "none", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Browse Files</button>
                  </div>
                  <div style={{ marginTop: 14, padding: 12, background: "#EFF6FF", borderRadius: 10, display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 18 }}>💡</span>
                    <span style={{ fontSize: 12, color: "#1D4ED8" }}>Tip: Upload the full report — our AI can generate a 2-page practitioner brief, infographic, and multilingual translations automatically.</span>
                  </div>
                </div>
              )}
              {submitStep === 3 && (
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: "#0F172A" }}>Step 4: AI-Powered Transformation (Optional)</h3>
                  <p style={{ fontSize: 12, color: "#64748B", marginBottom: 14 }}>Let AI create accessible versions of your content to maximize reach.</p>
                  {[
                    { key: "summary", icon: "📝", label: "2-Page Practitioner Brief", desc: "AI summary optimized for coaches & club managers" },
                    { key: "infographic", icon: "🖼️", label: "Visual Infographic", desc: "Key findings as a shareable visual" },
                    { key: "video", icon: "🎬", label: "3-Min Video Summary", desc: "Animated explainer video with narration" },
                    { key: "audio", icon: "🎧", label: "Audio Summary (Podcast)", desc: "Listen-friendly audio digest" },
                    { key: "translate", icon: "🌐", label: "Translate to 10+ Languages", desc: "AI translation with human review" },
                  ].map(o => (
                    <label key={o.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, border: aiOptions[o.key] ? "2px solid #10B981" : "1px solid #E2E8F0", background: aiOptions[o.key] ? "#F0FDF4" : "white", marginBottom: 8, cursor: "pointer", transition: "all 0.15s" }}>
                      <input type="checkbox" checked={aiOptions[o.key]} onChange={() => setAiOptions(prev => ({ ...prev, [o.key]: !prev[o.key] }))} style={{ width: 18, height: 18, accentColor: "#10B981" }} />
                      <span style={{ fontSize: 20 }}>{o.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{o.label}</div>
                        <div style={{ fontSize: 11, color: "#64748B" }}>{o.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {submitStep === 4 && (
                <div style={{ textAlign: "center", padding: 20 }}>
                  <div style={{ fontSize: 48, marginBottom: 10 }}>✅</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>Ready to Submit!</h3>
                  <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>Your content will be reviewed by our editorial team within 24-48 hours. You'll receive a notification when it goes live.</p>
                  <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 16, textAlign: "left", fontSize: 12, color: "#475569" }}>
                    <div style={{ marginBottom: 4 }}>📄 1 file uploaded</div>
                    <div style={{ marginBottom: 4 }}>🤖 {Object.values(aiOptions).filter(Boolean).length} AI transformations requested</div>
                    <div>📊 Impact tracking will begin automatically</div>
                  </div>
                  <button style={{ marginTop: 16, background: "#10B981", color: "white", border: "none", borderRadius: 12, padding: "12px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>🚀 Submit for Review</button>
                </div>
              )}

              {submitStep < 4 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                  <button onClick={() => setSubmitStep(Math.max(0, submitStep - 1))} disabled={submitStep === 0} style={{ padding: "8px 20px", borderRadius: 10, border: "1px solid #E2E8F0", background: "white", fontSize: 13, cursor: submitStep === 0 ? "default" : "pointer", opacity: submitStep === 0 ? 0.4 : 1 }}>← Back</button>
                  <button onClick={() => setSubmitStep(submitStep + 1)} style={{ padding: "8px 20px", borderRadius: 10, border: "none", background: "#0F172A", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Next →</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════ AI STUDIO TAB ═══════════ */}
        {tab === "ai" && (
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "Outfit", fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>🤖 AI Transform Studio</h2>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>Transform any resource into accessible, multilingual formats.</p>

            {!aiTarget ? (
              <div>
                <p style={{ fontSize: 13, color: "#475569", marginBottom: 14 }}>Select a resource to transform:</p>
                {sampleContent.map(item => (
                  <button key={item.id} onClick={() => { setAiTarget(item); setAiDone(false); setAiProcessing(false); setAiOptions({ summary: false, infographic: false, video: false, audio: false, translate: false }); }} style={{ display: "block", width: "100%", textAlign: "left", background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: "12px 16px", marginBottom: 8, cursor: "pointer" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{item.pages} pages · {item.project} · {item.languages.join(", ")}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(135deg,#7C3AED,#2563EB)", color: "white", padding: "16px 20px" }}>
                  <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>SOURCE DOCUMENT</div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{aiTarget.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{aiTarget.pages} pages · {aiTarget.languages.join(", ")} · {aiTarget.project}</div>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>What would you like to create?</div>
                  {[
                    { key: "summary", icon: "📝", label: "Practitioner Brief (2 pages)", time: "~1 min" },
                    { key: "infographic", icon: "🖼️", label: "Visual Infographic", time: "~2 min" },
                    { key: "video", icon: "🎬", label: "3-Min Video Summary", time: "~4 min" },
                    { key: "audio", icon: "🎧", label: "Audio Digest (Podcast)", time: "~3 min" },
                    { key: "translate", icon: "🌐", label: "Translate to 10+ Languages", time: "~2 min" },
                  ].map(o => (
                    <label key={o.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, border: aiOptions[o.key] ? "2px solid #7C3AED" : "1px solid #E2E8F0", background: aiOptions[o.key] ? "#F5F3FF" : "white", marginBottom: 8, cursor: "pointer" }}>
                      <input type="checkbox" checked={aiOptions[o.key]} onChange={() => setAiOptions(prev => ({ ...prev, [o.key]: !prev[o.key] }))} style={{ width: 18, height: 18, accentColor: "#7C3AED" }} />
                      <span style={{ fontSize: 20 }}>{o.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{o.label}</div>
                      </div>
                      <span style={{ fontSize: 11, color: "#94A3B8" }}>{o.time}</span>
                    </label>
                  ))}

                  {!aiDone && (
                    <button onClick={handleAiTransform} disabled={aiProcessing || !Object.values(aiOptions).some(Boolean)} style={{ width: "100%", marginTop: 14, background: Object.values(aiOptions).some(Boolean) ? "linear-gradient(135deg,#7C3AED,#2563EB)" : "#E2E8F0", color: "white", border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 700, cursor: Object.values(aiOptions).some(Boolean) ? "pointer" : "default" }}>
                      {aiProcessing ? "⏳ Processing..." : "⚡ Transform Now"}
                    </button>
                  )}

                  {aiProcessing && (
                    <div style={{ marginTop: 14, padding: 16, background: "#F5F3FF", borderRadius: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 16, height: 16, border: "3px solid #7C3AED", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                        <span style={{ fontSize: 13, color: "#5B21B6", fontWeight: 600 }}>AI is transforming your content...</span>
                      </div>
                      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                      {Object.entries(aiOptions).filter(([,v]) => v).map(([k], i) => (
                        <div key={k} style={{ fontSize: 12, color: "#7C3AED", marginLeft: 24, marginTop: 4 }}>
                          {i === 0 ? "🔄" : "⏳"} {k === "summary" ? "Generating practitioner brief..." : k === "infographic" ? "Creating infographic..." : k === "video" ? "Rendering video..." : k === "audio" ? "Generating audio..." : "Translating..."}
                        </div>
                      ))}
                    </div>
                  )}

                  {aiDone && (
                    <div style={{ marginTop: 14, padding: 16, background: "#F0FDF4", borderRadius: 12, border: "1px solid #BBF7D0" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#166534", marginBottom: 10 }}>✅ Transformation Complete!</div>
                      {Object.entries(aiOptions).filter(([,v]) => v).map(([k]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #DCFCE7" }}>
                          <span style={{ fontSize: 12, color: "#166534" }}>
                            {k === "summary" ? "📝 Practitioner Brief (2p)" : k === "infographic" ? "🖼️ Infographic (PNG)" : k === "video" ? "🎬 Video Summary (MP4)" : k === "audio" ? "🎧 Audio Digest (MP3)" : "🌐 10 language translations"}
                          </span>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button style={{ fontSize: 11, background: "white", border: "1px solid #BBF7D0", borderRadius: 6, padding: "3px 10px", cursor: "pointer", color: "#166534" }}>Preview</button>
                            <button style={{ fontSize: 11, background: "#166534", color: "white", border: "none", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>Download</button>
                          </div>
                        </div>
                      ))}
                      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 10, fontStyle: "italic" }}>All AI-generated content undergoes editorial review before publication.</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ OKR TAB ═══════════ */}
        {tab === "okr" && (
          <div>
            <h2 style={{ fontFamily: "Outfit", fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>🎯 OKR Dashboard</h2>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>Faz bazlı hedefler ve ilerleme takibi.</p>

            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
              {[1,2,3].map(f => (
                <button key={f} onClick={() => setOkrFaz(f)} style={{ ...pillStyle(okrFaz === f), padding: "8px 20px" }}>
                  Faz {f}: {f === 1 ? "Temel (0-12 ay)" : f === 2 ? "Büyüme (12-24 ay)" : "Ölçekleme (24-48 ay)"}
                </button>
              ))}
            </div>

            {/* North Star */}
            <div style={{ background: "linear-gradient(135deg,#0B1120,#162033)", borderRadius: 16, padding: 20, color: "white", marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 10, opacity: 0.5, letterSpacing: 2, textTransform: "uppercase" }}>North Star Metric</div>
              <div style={{ fontFamily: "Outfit", fontSize: 32, fontWeight: 800, color: "#10B981", margin: "6px 0" }}>
                {okrFaz === 1 ? "50" : okrFaz === 2 ? "250" : "500"}+
              </div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>"I applied this resource in practice" declarations</div>
            </div>

            {/* OKR Cards */}
            {okrFaz === 1 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { obj: "O1: Launch functional MVP", krs: [
                    { kr: "Beta launch", target: "Month 6", current: "On track", pct: 60 },
                    { kr: "Total content", target: "≥500", current: "320", pct: 64 },
                    { kr: "Content providers", target: "≥30", current: "18", pct: 60 },
                    { kr: "Interface languages", target: "≥3", current: "2 (EN, TR)", pct: 67 },
                  ]},
                  { obj: "O2: Build initial user base", krs: [
                    { kr: "Registered users", target: "≥1,000", current: "640", pct: 64 },
                    { kr: "MAU (Month 12)", target: "≥300", current: "185", pct: 62 },
                    { kr: "Avg session duration", target: "≥3 min", current: "2.4 min", pct: 80 },
                    { kr: "Country coverage", target: "≥10", current: "8", pct: 80 },
                  ]},
                  { obj: "O3: Establish measurement infrastructure", krs: [
                    { kr: "Analytics dashboard live", target: "Month 8", current: "In dev", pct: 40 },
                    { kr: "Project impact report", target: "Auto-template", current: "Design phase", pct: 30 },
                    { kr: "Baseline NPS", target: "≥30", current: "—", pct: 0 },
                  ]},
                ].map((o, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 14, border: "1px solid #E2E8F0", padding: 18, gridColumn: i === 2 ? "1 / -1" : undefined }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>{o.obj}</h4>
                    {o.krs.map((kr, j) => (
                      <div key={j} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                          <span style={{ color: "#334155", fontWeight: 500 }}>{kr.kr}</span>
                          <span style={{ color: "#64748B", fontSize: 11 }}>{kr.current} / {kr.target}</span>
                        </div>
                        <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3 }}>
                          <div style={{ height: 6, borderRadius: 3, width: `${kr.pct}%`, background: kr.pct >= 70 ? "#10B981" : kr.pct >= 40 ? "#F59E0B" : "#EF4444", transition: "width 0.5s" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {okrFaz === 2 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { obj: "O4: Deploy AI transform engine", krs: [
                    { kr: "AI-transformed content", target: "≥300", pct: 0 },
                    { kr: "AI acceptance rate", target: "≥70%", pct: 0 },
                    { kr: "Translation languages", target: "≥10", pct: 0 },
                    { kr: "AI content satisfaction", target: "≥4.0/5", pct: 0 },
                  ]},
                  { obj: "O5: Grow user base organically", krs: [
                    { kr: "MAU (Month 24)", target: "≥3,000", pct: 0 },
                    { kr: "Return rate", target: "≥35%", pct: 0 },
                    { kr: "User-generated content", target: "≥100", pct: 0 },
                    { kr: "NPS", target: "≥40", pct: 0 },
                  ]},
                ].map((o, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 14, border: "1px solid #E2E8F0", padding: 18 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>{o.obj}</h4>
                    {o.krs.map((kr, j) => (
                      <div key={j} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                          <span style={{ color: "#334155", fontWeight: 500 }}>{kr.kr}</span>
                          <span style={{ color: "#94A3B8", fontSize: 11 }}>Target: {kr.target}</span>
                        </div>
                        <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3 }}>
                          <div style={{ height: 6, borderRadius: 3, width: "0%", background: "#E2E8F0" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {okrFaz === 3 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { obj: "O7: Become EU reference platform", krs: [
                    { kr: "MAU", target: "≥15,000", pct: 0 },
                    { kr: "Total content", target: "≥2,500", pct: 0 },
                    { kr: "Country coverage", target: "≥27 EU + 5", pct: 0 },
                    { kr: "DG EAC citation", target: "≥1", pct: 0 },
                  ]},
                  { obj: "O8: Financial sustainability", krs: [
                    { kr: "Premium subscribers", target: "≥20", pct: 0 },
                    { kr: "Non-grant revenue", target: "≥30%", pct: 0 },
                    { kr: "Cost coverage", target: "≥80%", pct: 0 },
                  ]},
                ].map((o, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 14, border: "1px solid #E2E8F0", padding: 18 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>{o.obj}</h4>
                    {o.krs.map((kr, j) => (
                      <div key={j} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                          <span style={{ color: "#334155", fontWeight: 500 }}>{kr.kr}</span>
                          <span style={{ color: "#94A3B8", fontSize: 11 }}>Target: {kr.target}</span>
                        </div>
                        <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3 }} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════ DASHBOARD TAB ═══════════ */}
        {tab === "dashboard" && (
          <div>
            <h2 style={{ fontFamily: "Outfit", fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>📊 Impact Dashboard</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 20 }}>
              {[
                { icon: "📚", value: 2450, label: "Resources" },
                { icon: "⬇️", value: 128000, label: "Downloads" },
                { icon: "👥", value: 15600, label: "Users" },
                { icon: "🌍", value: 31, label: "Countries" },
                { icon: "✅", value: totalApplied, label: "Applied" },
              ].map((s, i) => (
                <div key={i} style={{ background: "white", borderRadius: 14, border: "1px solid #E2E8F0", textAlign: "center", padding: "16px 8px" }}>
                  <div style={{ fontSize: 20 }}>{s.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", fontFamily: "Outfit" }}><Counter target={s.value} /></div>
                  <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E2E8F0", padding: 18 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>📈 Trending Topics</h3>
                {[
                  { topic: "AI & Sport", growth: "+340%", bar: 95 },
                  { topic: "Safeguarding", growth: "+120%", bar: 75 },
                  { topic: "Green Sport", growth: "+85%", bar: 60 },
                  { topic: "Dual Career", growth: "+62%", bar: 50 },
                  { topic: "Inclusive Sport", growth: "+45%", bar: 40 },
                ].map((t, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                      <span style={{ fontWeight: 500, color: "#334155" }}>{t.topic}</span>
                      <span style={{ color: "#10B981", fontWeight: 600, fontSize: 11 }}>{t.growth}</span>
                    </div>
                    <div style={{ height: 5, background: "#F1F5F9", borderRadius: 3 }}>
                      <div style={{ height: 5, background: "linear-gradient(90deg,#10B981,#06B6D4)", borderRadius: 3, width: `${t.bar}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E2E8F0", padding: 18 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>🗺️ Top Countries</h3>
                {[
                  { c: "🇪🇸 Spain", p: 18 }, { c: "🇩🇪 Germany", p: 15 }, { c: "🇮🇹 Italy", p: 12 },
                  { c: "🇵🇹 Portugal", p: 9 }, { c: "🇹🇷 Turkey", p: 7 }, { c: "🇳🇴 Norway", p: 6 },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0" }}>
                    <span style={{ fontSize: 12, color: "#334155" }}>{c.c}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 70, height: 4, background: "#F1F5F9", borderRadius: 2 }}>
                        <div style={{ height: 4, background: "#3B82F6", borderRadius: 2, width: `${c.p * 5}%` }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#64748B", width: 28, textAlign: "right" }}>{c.p}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg,#0B1120,#162033)", borderRadius: 14, padding: 20, color: "white" }}>
              <h3 style={{ fontFamily: "Outfit", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🤖 AI Content Transformation</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {[
                  { label: "Practitioner Briefs", count: "342" },
                  { label: "Auto-translations", count: "1,240" },
                  { label: "Video summaries", count: "186" },
                  { label: "Languages covered", count: "18" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#10B981", fontFamily: "Outfit" }}>{s.count}</div>
                    <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ COMMUNITY TAB ═══════════ */}
        {tab === "community" && (
          <div>
            <h2 style={{ fontFamily: "Outfit", fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>👥 Voices from the Field</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              {[
                { name: "Claudiu M.", role: "Youth Football Coach", country: "🇷🇴", story: "Found the SafeClub toolkit translated into Romanian. In 2 hours I had a safeguarding policy — something I'd put off for months.", resource: "Safeguarding Toolkit", avatar: "C", applied: true },
                { name: "Ana G.", role: "Athletics Club Director", country: "🇪🇸", story: "The 3-minute video summary gave me exactly what I needed to present to our board. No more 100-page reports!", resource: "Dual Career Guide", avatar: "A", applied: true },
                { name: "Lars N.", role: "PE Teacher & Coach", country: "🇸🇪", story: "The AI coaching module showed constraint-based training designs I'd never considered. Tried it with my U-15s — visible difference.", resource: "AI Coach Education", avatar: "L", applied: true },
                { name: "Fatma K.", role: "Sport Dev Officer", country: "🇹🇷", story: "Finally, EU project outputs in Turkish! The practitioner briefs are exactly the right length for our club managers.", resource: "Multiple resources", avatar: "F", applied: true },
              ].map((s, i) => (
                <div key={i} style={{ background: "white", borderRadius: 14, border: "1px solid #E2E8F0", padding: 18 }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#10B981,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{s.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#0F172A" }}>{s.name} {s.country}</div>
                      <div style={{ fontSize: 11, color: "#64748B" }}>{s.role}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6, marginBottom: 8, fontStyle: "italic" }}>"{s.story}"</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "#94A3B8" }}>Used: {s.resource}</span>
                    {s.applied && <span style={{ fontSize: 10, background: "#F0FDF4", color: "#166534", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>✅ Applied in practice</span>}
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>Thematic Communities</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[
                { icon: "🛡️", name: "Safeguarding Network", members: 2840 },
                { icon: "🎓", name: "Dual Career Community", members: 1960 },
                { icon: "🤖", name: "AI in Sport Innovators", members: 1540 },
                { icon: "🌿", name: "Green Sport Alliance", members: 980 },
                { icon: "♿", name: "Inclusive Sport Hub", members: 1320 },
                { icon: "🏋️", name: "Coach Development Circle", members: 3200 },
              ].map((c, i) => (
                <div key={i} style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", padding: 14, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <span style={{ fontSize: 26 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 12, color: "#0F172A" }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: "#64748B" }}>{c.members.toLocaleString()} members</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: "#0B1120", color: "white", padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: 11, opacity: 0.4 }}>VoiceSport — The Amplify Pillar of Sport Singularity · Think → Learn → Act → Amplify</div>
        <div style={{ fontSize: 10, opacity: 0.25, marginTop: 4 }}>Concept Prototype v2.0 · © 2026 Sport Singularity BV</div>
      </footer>
    </div>
  );
}
