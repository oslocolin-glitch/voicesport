"use client";

import { BarChart3, Download, Users, Globe, CheckCircle, TrendingUp } from "lucide-react";

const STATS = [
  { icon: "📚", value: "2,450", label: "Resources" },
  { icon: "⬇️", value: "128K", label: "Downloads" },
  { icon: "👥", value: "15,600", label: "Users" },
  { icon: "🌍", value: "31", label: "Countries" },
  { icon: "✅", value: "165", label: "Applied" },
];

const TRENDS = [
  { topic: "AI & Sport", growth: "+340%", pct: 95 },
  { topic: "Safeguarding", growth: "+120%", pct: 75 },
  { topic: "Green Sport", growth: "+85%", pct: 60 },
  { topic: "Dual Career", growth: "+62%", pct: 50 },
  { topic: "Inclusive Sport", growth: "+45%", pct: 40 },
];

const COUNTRIES = [
  { name: "🇪🇸 Spain", pct: 18 }, { name: "🇩🇪 Germany", pct: 15 }, { name: "🇮🇹 Italy", pct: 12 },
  { name: "🇵🇹 Portugal", pct: 9 }, { name: "🇹🇷 Turkey", pct: 7 }, { name: "🇳🇴 Norway", pct: 6 },
];

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500"><BarChart3 className="w-5 h-5 text-white" /></div>
        <h1 className="text-xl font-bold text-white">Impact Dashboard</h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {STATS.map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Trends */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Trending Topics</h3>
          {TRENDS.map(t => (
            <div key={t.topic} className="mb-3 last:mb-0">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300 font-medium">{t.topic}</span>
                <span className="text-emerald-400 font-semibold">{t.growth}</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full"><div className="h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: `${t.pct}%` }} /></div>
            </div>
          ))}
        </div>

        {/* Countries */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> Top Countries</h3>
          {COUNTRIES.map(c => (
            <div key={c.name} className="flex items-center justify-between py-1.5">
              <span className="text-xs text-gray-300">{c.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-gray-800 rounded-full"><div className="h-1 bg-blue-500 rounded-full" style={{ width: `${c.pct * 5}%` }} /></div>
                <span className="text-[11px] text-gray-500 w-7 text-right">{c.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI stats */}
      <div className="bg-gradient-to-r from-[#0B1120] to-[#162033] border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">🤖 AI Content Transformation</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Practitioner Briefs", count: "342" },
            { label: "Auto-translations", count: "1,240" },
            { label: "Video summaries", count: "186" },
            { label: "Languages covered", count: "18" },
          ].map(s => (
            <div key={s.label} className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-emerald-400">{s.count}</div>
              <div className="text-[10px] text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
