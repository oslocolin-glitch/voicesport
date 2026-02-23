"use client";

import { Users, BookOpen, Bot, TrendingUp, Globe, Upload } from "lucide-react";

const stats = [
  { label: "Total Users", value: "0", icon: Users, color: "from-emerald-400 to-cyan-500" },
  { label: "Resources", value: "0", icon: BookOpen, color: "from-violet-400 to-purple-500" },
  { label: "AI Transforms", value: "0", icon: Bot, color: "from-amber-400 to-orange-500" },
  { label: "Submissions", value: "0", icon: Upload, color: "from-blue-400 to-indigo-500" },
  { label: "Countries", value: "0", icon: Globe, color: "from-pink-400 to-rose-500" },
  { label: "Page Views (30d)", value: "—", icon: TrendingUp, color: "from-cyan-400 to-teal-500" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5 group hover:border-gray-700 transition">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${s.color}`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{s.label}</span>
            </div>
            <div className="text-3xl font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Recent Activity</h3>
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No activity yet. Stats will populate once the database is connected.</p>
        </div>
      </div>
    </div>
  );
}
