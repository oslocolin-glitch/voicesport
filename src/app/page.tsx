"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Eye, Download, Bot, ArrowRight, Sparkles, BookOpen, Upload, Users, BarChart3, Loader2, ChevronRight } from "lucide-react";
import { TOPICS, FORMAT_ICONS, FLAG_MAP, TARGET_AUDIENCES } from "@/lib/constants";
import type { Resource } from "@/lib/types";

/* ─── Tiny helpers ─── */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-xs">
      <span className="text-amber-400">{"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}</span>
      <span className="text-gray-500 font-medium">{rating}</span>
    </span>
  );
}

const RESOURCE_FORMATS: Record<string, string[]> = {
  Toolkit: ["PDF", "Video", "Infographic"],
  Report: ["PDF", "Practitioner Brief"],
  Guide: ["PDF", "Micro-learning", "Quiz"],
  Platform: ["Platform", "PDF", "Video"],
};

const FEATURES = [
  {
    icon: Search,
    title: "Discover",
    desc: "Find sport knowledge resources from EU-funded projects across all disciplines.",
    href: "/",
    color: "bg-[#30d158]", // Apple green
    shadow: "shadow-[0_4px_16px_rgba(48,209,88,0.3)]",
    size: "large",
  },
  {
    icon: Bot,
    title: "AI Studio",
    desc: "Transform documents into summaries, translations, infographics and micro-learning modules.",
    href: "/ai-studio",
    color: "bg-[#5e5ce6]", // Apple indigo
    shadow: "shadow-[0_4px_16px_rgba(94,92,230,0.3)]",
    size: "large",
  },
  {
    icon: Upload,
    title: "Submit",
    desc: "Share your project outputs with the European sport community. Get visibility and impact.",
    href: "/submit",
    color: "bg-[#ff9f0a]", // Apple orange
    shadow: "shadow-[0_4px_16px_rgba(255,159,10,0.3)]",
    size: "normal",
  },
  {
    icon: BarChart3,
    title: "Impact",
    desc: "Track real-world application. See how knowledge moves from reports to practice.",
    href: "/dashboard",
    color: "bg-[#ff375f]", // Apple pink
    shadow: "shadow-[0_4px_16px_rgba(255,55,95,0.3)]",
    size: "normal",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Connect with coaches, researchers and policy-makers across European sport.",
    href: "/communities",
    color: "bg-[#64d2ff]", // Apple cyan
    shadow: "shadow-[0_4px_16px_rgba(100,210,255,0.3)]",
    size: "normal",
  },
  {
    icon: BookOpen,
    title: "Multi-format",
    desc: "Every resource available as PDF, video summary, quiz, podcast — whatever works for you.",
    href: "/",
    color: "bg-[#30d158]", // Apple green
    shadow: "shadow-[0_4px_16px_rgba(48,209,88,0.3)]",
    size: "normal",
  },
];

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All");
  const [role, setRole] = useState("coach");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResources = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (topic !== "All") params.set("topic", topic);
      const res = await fetch(`/api/resources?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setResources(data.data);
      setTotal(data.total);
    } catch { setError("Failed to load resources"); }
    finally { setLoading(false); }
  }, [search, topic]);

  useEffect(() => {
    const timer = setTimeout(fetchResources, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchResources, search]);

  const totalApplied = resources.reduce((s, r) => s + (r.applied_count || 0), 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>

      {/* ═══════════════ HERO — Apple-style cinematic ═══════════════ */}
      <section className="relative overflow-hidden">
        {/* Background — adapts to theme */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]" />
          <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: `linear-gradient(to top, var(--bg-primary), transparent)` }} />
        </div>

        <div className="relative max-w-[980px] mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-28 text-center">
          {/* Tagline chip */}
          <div className="animate-fade-in inline-flex items-center gap-2 backdrop-blur-md rounded-full px-5 py-2 text-sm text-emerald-500 mb-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <Sparkles className="w-3.5 h-3.5" />
            The Amplify Pillar of Sport Singularity
          </div>

          {/* Giant headline */}
          <h1 className="animate-fade-in-up text-5xl sm:text-7xl md:text-[80px] lg:text-[88px] font-bold tracking-tight leading-[1.05] mb-6">
            <span style={{ color: "var(--text-primary)" }}>Sport knowledge,</span>
            <br />
            <span className="text-gradient">amplified.</span>
          </h1>

          <p className="animate-fade-in-up delay-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            One hub for all EU sport project outputs — made findable, accessible and actionable through AI.
          </p>

          {/* CTA */}
          <div className="animate-fade-in-up delay-300 flex gap-4 justify-center flex-wrap mb-16">
            <a href="#discover" className="group inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-full text-base font-semibold transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              Start Exploring
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <Link href="/ai-studio" className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all" style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
              <Bot className="w-4 h-4" />
              Try AI Studio
            </Link>
          </div>

          {/* Stats row */}
          <div className="animate-fade-in-up delay-400 flex items-center justify-center gap-8 md:gap-16 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>{total || "—"}</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Resources</div>
            </div>
            <div className="w-px h-10" style={{ background: "var(--border)" }} />
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-500">{totalApplied}</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Applied in Practice</div>
            </div>
            <div className="w-px h-10" style={{ background: "var(--border)" }} />
            <div>
              <div className="text-3xl md:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>30+</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES — Apple grid ═══════════════ */}
      <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-[980px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>
              Everything you need.
            </h2>
            <p className="text-lg max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
              From discovery to application — a complete platform for sport knowledge.
            </p>
          </div>

          {/* Top 2 features — large cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {FEATURES.filter(f => f.size === "large").map((f, i) => (
              <Link
                key={f.title}
                href={f.href}
                className="animate-fade-in-up group rounded-3xl p-10 transition-all duration-500"
                style={{ background: "var(--bg-card)", boxShadow: "var(--card-shadow)", animationDelay: `${i * 100}ms` }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--bg-card)"}
              >
                <div className={`inline-flex p-4 rounded-[18px] ${f.color} ${f.shadow} mb-6`}>
                  <f.icon className="w-7 h-7 text-white" strokeWidth={2.2} />
                </div>
                <h3 className="text-2xl font-semibold mb-2 tracking-tight" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                <p className="text-[15px] leading-relaxed max-w-sm" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
              </Link>
            ))}
          </div>

          {/* Bottom 4 features — smaller cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.filter(f => f.size === "normal").map((f, i) => (
              <Link
                key={f.title}
                href={f.href}
                className="animate-fade-in-up group rounded-3xl p-7 transition-all duration-500"
                style={{ background: "var(--bg-card)", boxShadow: "var(--card-shadow)", animationDelay: `${(i + 2) * 100}ms` }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--bg-card)"}
              >
                <div className={`inline-flex p-3.5 rounded-[14px] ${f.color} ${f.shadow} mb-5`}>
                  <f.icon className="w-5 h-5 text-white" strokeWidth={2.2} />
                </div>
                <h3 className="text-lg font-semibold mb-1.5 tracking-tight" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ DISCOVER — Search & Resources ═══════════════ */}
      <section id="discover" className="section-padding" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-[980px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>
              Discover resources.
            </h2>
            <p className="text-lg max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
              Search across EU sport project outputs by topic, role, or keyword.
            </p>
          </div>

          {/* Role selector */}
          <div className="flex gap-2 mb-6 flex-wrap justify-center">
            {TARGET_AUDIENCES.map(r => (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={role === r.key
                  ? { background: "var(--pill-active-bg)", color: "var(--pill-active-text)", boxShadow: "var(--pill-active-shadow)" }
                  : { background: "var(--bg-pill)", color: "var(--text-secondary)" }
                }
              >
                {r.icon} {r.label}
              </button>
            ))}
          </div>

          {/* Search bar — Apple style clean */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Try "safeguarding toolkit" or "AI coaching"'
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-transparent text-base outline-none transition"
              style={{ background: "var(--bg-input)", color: "var(--text-primary)" }}
            />
          </div>

          {/* Topic pills */}
          <div className="flex gap-2 mb-8 flex-wrap justify-center">
            <button onClick={() => setTopic("All")} className="px-4 py-2 rounded-full text-sm font-medium transition-all" style={topic === "All" ? { background: "var(--pill-active-bg)", color: "var(--pill-active-text)", boxShadow: "var(--pill-active-shadow)" } : { background: "var(--bg-pill)", color: "var(--text-secondary)" }}>All</button>
            {TOPICS.map(t => (
              <button key={t} onClick={() => setTopic(t)} className="px-4 py-2 rounded-full text-sm font-medium transition-all" style={topic === t ? { background: "var(--pill-active-bg)", color: "var(--pill-active-text)", boxShadow: "var(--pill-active-shadow)" } : { background: "var(--bg-pill)", color: "var(--text-secondary)" }}>{t}</button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-sm mb-6 text-center" style={{ color: "var(--text-secondary)" }}>
            {loading ? "Searching..." : `${total} resource${total !== 1 ? "s" : ""} found`}
          </p>

          {error && <div className="text-sm text-red-400 bg-red-950/30 rounded-2xl p-4 mb-6 text-center">{error}</div>}

          {/* Resource Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-10 h-10 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">No resources found. Try a different search or topic.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((r, i) => {
                const formats = RESOURCE_FORMATS[r.resource_type] || ["PDF"];
                const isExpanded = expanded === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setExpanded(isExpanded ? null : r.id)}
                    className="animate-fade-in-up rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden"
                    style={{ background: isExpanded ? "var(--bg-card-hover)" : "var(--bg-card)", boxShadow: "var(--card-shadow)", border: isExpanded ? "1px solid var(--border-hover)" : "1px solid transparent", animationDelay: `${i * 60}ms` }}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg">{r.resource_type}</span>
                        <span className="text-[11px] font-medium text-gray-500">✅ {r.applied_count} applied</span>
                      </div>
                      <h3 className="text-base font-semibold leading-snug mb-3" style={{ color: "var(--text-primary)" }}>{r.title}</h3>
                      <div className="flex gap-1.5 flex-wrap mb-3">
                        <span className="text-[11px] bg-white/[0.06] text-gray-300 px-2 py-0.5 rounded-lg">{r.topics?.[0]}</span>
                        <span className="text-[11px] text-gray-500">{r.partner_countries?.map((c: string) => FLAG_MAP[c] || c).join(" ")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Stars rating={Number(r.rating_avg) || 0} />
                        <div className="flex gap-3 text-[11px] text-gray-500">
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(r.view_count || 0).toLocaleString()}</span>
                          <span className="flex items-center gap-1"><Download className="w-3 h-3" />{(r.download_count || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Format bar */}
                    <div className="px-5 py-2.5 flex gap-1.5 flex-wrap items-center" style={{ borderTop: "1px solid var(--border)" }}>
                      {formats.map((f: string) => (
                        <span key={f} className="text-[10px] rounded-lg px-2 py-0.5" style={{ background: "var(--bg-pill)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>{FORMAT_ICONS[f] || ""} {f}</span>
                      ))}
                      <span className="ml-auto flex gap-1">
                        {r.languages?.map((l: string) => (
                          <span key={l} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md" style={{ background: "var(--bg-pill)", color: "var(--text-primary)" }}>{l}</span>
                        ))}
                      </span>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
                        <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{r.abstract}</p>
                        <div className="text-[11px] mb-4" style={{ color: "var(--text-tertiary)" }}>
                          📄 {r.page_count} pages · {r.project_name} · {r.project_year} · {r.license}
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/resource/${r.slug}`} className="flex-1 text-center text-xs font-semibold py-2.5 rounded-full transition" style={{ background: "var(--pill-active-bg)", color: "var(--pill-active-text)" }} onClick={e => e.stopPropagation()}>
                            Download
                          </Link>
                          <Link href="/ai-studio" className="flex-1 text-center bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs font-semibold py-2.5 rounded-full transition flex items-center justify-center gap-1 hover:shadow-lg hover:shadow-violet-500/20" onClick={e => e.stopPropagation()}>
                            <Bot className="w-3 h-3" /> AI Transform
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ CTA — Final cinematic block ═══════════════ */}
      <section className="relative section-padding overflow-hidden" style={{ background: "var(--bg-primary)" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(16,185,129,0.08),transparent)]" />
        <div className="relative max-w-[980px] mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5" style={{ color: "var(--text-primary)" }}>
            Ready to amplify
            <br />
            <span className="text-gradient">sport knowledge?</span>
          </h2>
          <p className="text-lg max-w-lg mx-auto mb-10" style={{ color: "var(--text-secondary)" }}>
            Join practitioners, researchers and organisations across Europe.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/signup" className="group inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-full text-base font-semibold transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/submit" className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all" style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
              <Upload className="w-4 h-4" /> Submit a Resource
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
