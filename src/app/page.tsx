"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Star, Eye, Download, Bot, ChevronRight, Sparkles } from "lucide-react";
import { TOPICS, FORMAT_ICONS, FLAG_MAP, TARGET_AUDIENCES } from "@/lib/constants";
import { SAMPLE_RESOURCES } from "@/lib/sampleData";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-xs">
      <span className="text-amber-400">{"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}</span>
      <span className="text-gray-500 font-medium">{rating}</span>
    </span>
  );
}

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All");
  const [role, setRole] = useState("coach");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return SAMPLE_RESOURCES.filter(r => {
      if (topic !== "All" && !r.topics.includes(topic)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.title.toLowerCase().includes(q) && !r.description?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, topic]);

  const totalApplied = SAMPLE_RESOURCES.reduce((s, r) => s + r.applied_count, 0);

  return (
    <div className="min-h-screen">
      {/* ═══ Hero ═══ */}
      <div className="bg-gradient-to-b from-[#0B1120] via-[#162033] to-[#0D3B3B]">
        <div className="max-w-5xl mx-auto px-4 pt-10 pb-8 md:pt-14 md:pb-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 text-sm text-emerald-300 mb-4">
                <Sparkles className="w-3.5 h-3.5" /> AI-Powered Sport Knowledge
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
                Discover. Transform. Apply.
              </h1>
              <p className="text-gray-400 text-base max-w-xl">
                One hub for all EU sport project outputs — made findable, accessible and actionable through AI.
              </p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4 text-center">
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">North Star</div>
              <div className="text-4xl font-extrabold text-emerald-400 my-1">{totalApplied}</div>
              <div className="text-xs text-gray-400">&quot;Applied in practice&quot;</div>
            </div>
          </div>

          {/* Role selector */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {TARGET_AUDIENCES.map(r => (
              <button key={r.key} onClick={() => setRole(r.key)} className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${role === r.key ? "bg-emerald-500 text-white" : "bg-white/[0.07] text-gray-300 border border-white/10 hover:bg-white/10"}`}>
                {r.icon} {r.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Try: "safeguarding toolkit" or "AI coaching guide in Turkish"'
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-emerald-500/30 bg-white/95 text-gray-900 text-sm outline-none focus:border-emerald-500 transition placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* ═══ Content ═══ */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Topic pills */}
        <div className="flex gap-2 mb-5 flex-wrap">
          <button onClick={() => setTopic("All")} className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${topic === "All" ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}>
            All
          </button>
          {TOPICS.map(t => (
            <button key={t} onClick={() => setTopic(t)} className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${topic === t ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}>
              {t}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} resource{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Resource cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(r => (
            <div
              key={r.id}
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}
              className={`bg-white dark:bg-gray-900 rounded-2xl border cursor-pointer transition-all duration-200 overflow-hidden ${expanded === r.id ? "border-emerald-500 shadow-lg shadow-emerald-500/10" : "border-gray-200 dark:border-gray-800 hover:shadow-md"}`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md">{r.resource_type}</span>
                  <span className="text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md">✅ {r.applied_count} applied</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug mb-2">{r.title}</h3>
                <div className="flex gap-1 flex-wrap mb-2">
                  <span className="text-[10px] bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded">🏷️ {r.topics[0]}</span>
                  <span className="text-[10px] text-gray-400">{r.partner_countries.map(c => FLAG_MAP[c] || c).join(" ")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Stars rating={r.rating_avg} />
                  <div className="flex gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{r.view_count.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Download className="w-3 h-3" />{r.download_count.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Format bar */}
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 flex gap-1 flex-wrap items-center">
                {r.formats.map(f => (
                  <span key={f} className="text-[10px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 text-gray-500 dark:text-gray-400">{FORMAT_ICONS[f] || ""} {f}</span>
                ))}
                <span className="ml-auto flex gap-0.5">
                  {r.languages.map(l => (
                    <span key={l} className="text-[9px] font-semibold bg-gray-900 dark:bg-gray-700 text-white px-1.5 py-0.5 rounded">{l}</span>
                  ))}
                </span>
              </div>

              {/* Expanded detail */}
              {expanded === r.id && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{r.abstract}</p>
                  <div className="text-[10px] text-gray-400 mb-3">
                    📄 {r.page_count} pages · {r.project_name} · {r.project_year} · {r.license}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/resource/${r.slug}`} className="flex-1 text-center bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold py-2 rounded-lg transition">
                      ⬇ Download
                    </Link>
                    <Link href="/ai-studio" className="flex-1 text-center bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-xs font-semibold py-2 rounded-lg transition flex items-center justify-center gap-1">
                      <Bot className="w-3 h-3" /> AI Transform
                    </Link>
                    <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs">⭐</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
