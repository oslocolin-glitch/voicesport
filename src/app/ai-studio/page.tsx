"use client";

import { useState } from "react";
import { Bot, FileText, Image, Video, Headphones, Globe, Zap } from "lucide-react";
import { SAMPLE_RESOURCES } from "@/lib/sampleData";

const AI_OPTIONS = [
  { key: "summary", icon: FileText, label: "Practitioner Brief (2 pages)", time: "~1 min" },
  { key: "infographic", icon: Image, label: "Visual Infographic", time: "~2 min" },
  { key: "video", icon: Video, label: "3-Min Video Summary", time: "~4 min" },
  { key: "audio", icon: Headphones, label: "Audio Digest (Podcast)", time: "~3 min" },
  { key: "translate", icon: Globe, label: "Translate to 10+ Languages", time: "~2 min" },
];

export default function AIStudioPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [options, setOptions] = useState<Record<string, boolean>>({});
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const resource = selected ? SAMPLE_RESOURCES.find(r => r.id === selected) : null;

  const handleTransform = () => {
    setProcessing(true);
    setDone(false);
    setTimeout(() => { setProcessing(false); setDone(true); }, 3000);
  };

  return (
    <div className="min-h-[80vh] max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Transform Studio</h1>
          <p className="text-xs text-gray-400">Transform any resource into accessible, multilingual formats.</p>
        </div>
      </div>

      {!resource ? (
        <div>
          <p className="text-sm text-gray-400 mb-4">Select a resource to transform:</p>
          <div className="space-y-2">
            {SAMPLE_RESOURCES.map(r => (
              <button key={r.id} onClick={() => { setSelected(r.id); setDone(false); setProcessing(false); setOptions({}); }} className="block w-full text-left bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
                <div className="text-sm font-semibold text-white">{r.title}</div>
                <div className="text-[11px] text-gray-500 mt-1">{r.page_count} pages · {r.project_name} · {r.languages.join(", ")}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-blue-600 p-5">
            <div className="text-[10px] text-white/60 uppercase tracking-wider mb-1">Source Document</div>
            <div className="text-base font-semibold text-white">{resource.title}</div>
            <div className="text-xs text-white/60 mt-1">{resource.page_count} pages · {resource.languages.join(", ")} · {resource.project_name}</div>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-sm font-semibold text-white">What would you like to create?</p>
            {AI_OPTIONS.map(o => (
              <label key={o.key} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${options[o.key] ? "border-violet-500 bg-violet-950/30" : "border-gray-800 hover:border-gray-700"}`}>
                <input type="checkbox" checked={!!options[o.key]} onChange={() => setOptions(prev => ({ ...prev, [o.key]: !prev[o.key] }))} className="w-4 h-4 accent-violet-500" />
                <o.icon className="w-5 h-5 text-gray-400" />
                <div className="flex-1"><div className="text-sm font-medium text-white">{o.label}</div></div>
                <span className="text-[11px] text-gray-500">{o.time}</span>
              </label>
            ))}

            {!done && (
              <button onClick={handleTransform} disabled={processing || !Object.values(options).some(Boolean)} className="w-full mt-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-40 transition flex items-center justify-center gap-2">
                {processing ? "⏳ Processing..." : <><Zap className="w-4 h-4" /> Transform Now</>}
              </button>
            )}

            {processing && (
              <div className="p-4 bg-violet-950/30 rounded-xl mt-3">
                <div className="flex items-center gap-2 text-sm text-violet-400 font-medium mb-2">
                  <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                  AI is transforming your content...
                </div>
              </div>
            )}

            {done && (
              <div className="p-4 bg-emerald-950/30 border border-emerald-800 rounded-xl mt-3">
                <p className="text-sm font-bold text-emerald-400 mb-3">✅ Transformation Complete!</p>
                {Object.entries(options).filter(([,v]) => v).map(([k]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b border-emerald-900/50 last:border-0">
                    <span className="text-xs text-emerald-300">{AI_OPTIONS.find(o => o.key === k)?.label}</span>
                    <div className="flex gap-2">
                      <button className="text-[11px] bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-300">Preview</button>
                      <button className="text-[11px] bg-emerald-600 rounded px-2 py-1 text-white font-medium">Download</button>
                    </div>
                  </div>
                ))}
                <p className="text-[11px] text-gray-500 mt-3 italic">All AI-generated content undergoes editorial review before publication.</p>
              </div>
            )}

            <button onClick={() => { setSelected(null); setDone(false); }} className="text-xs text-gray-500 hover:text-gray-300 transition mt-2">← Back to resource list</button>
          </div>
        </div>
      )}
    </div>
  );
}
