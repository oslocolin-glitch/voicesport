"use client";

import { Users } from "lucide-react";

const COMMUNITIES = [
  { icon: "🛡️", name: "Safeguarding Network", members: 2840, desc: "Best practices for child and athlete protection in sport." },
  { icon: "🎓", name: "Dual Career Community", members: 1960, desc: "Supporting athletes balancing sport and education." },
  { icon: "🤖", name: "AI in Sport Innovators", members: 1540, desc: "Exploring AI applications in coaching, analytics and education." },
  { icon: "🌿", name: "Green Sport Alliance", members: 980, desc: "Sustainable practices for sport organisations." },
  { icon: "♿", name: "Inclusive Sport Hub", members: 1320, desc: "Making sport accessible for all abilities." },
  { icon: "🏋️", name: "Coach Development Circle", members: 3200, desc: "Professional development resources for coaches at all levels." },
  { icon: "🏃‍♀️", name: "Women in Sport Forum", members: 890, desc: "Gender equality and empowerment in sport." },
  { icon: "🏛️", name: "Good Governance Network", members: 760, desc: "Transparency, accountability and ethics in sport management." },
];

const STORIES = [
  { name: "Claudiu M.", role: "Youth Football Coach", country: "🇷🇴", story: "Found the SafeClub toolkit translated into Romanian. In 2 hours I had a safeguarding policy — something I'd put off for months.", resource: "Safeguarding Toolkit" },
  { name: "Ana G.", role: "Athletics Club Director", country: "🇪🇸", story: "The 3-minute video summary gave me exactly what I needed to present to our board. No more 100-page reports!", resource: "Dual Career Guide" },
  { name: "Lars N.", role: "PE Teacher & Coach", country: "🇸🇪", story: "The AI coaching module showed constraint-based training designs I'd never considered. Tried it with my U-15s — visible difference.", resource: "AI Coach Education" },
  { name: "Fatma K.", role: "Sport Dev Officer", country: "🇹🇷", story: "Finally, EU project outputs in Turkish! The practitioner briefs are exactly the right length for our club managers.", resource: "Multiple resources" },
];

export default function CommunitiesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500"><Users className="w-5 h-5 text-white" /></div>
        <h1 className="text-xl font-bold text-white">Voices from the Field</h1>
      </div>

      {/* Stories */}
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {STORIES.map(s => (
          <div key={s.name} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{s.name[0]}</div>
              <div><div className="text-sm font-semibold text-white">{s.name} {s.country}</div><div className="text-[11px] text-gray-500">{s.role}</div></div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed italic mb-3">&quot;{s.story}&quot;</p>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500">Used: {s.resource}</span>
              <span className="text-[10px] bg-emerald-950/30 text-emerald-400 px-2 py-0.5 rounded font-semibold">✅ Applied in practice</span>
            </div>
          </div>
        ))}
      </div>

      {/* Communities */}
      <h2 className="text-lg font-bold text-white mb-4">Thematic Communities</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {COMMUNITIES.map(c => (
          <div key={c.name} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <div className="text-sm font-semibold text-white">{c.name}</div>
                <div className="text-[10px] text-gray-500">{c.members.toLocaleString()} members</div>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
