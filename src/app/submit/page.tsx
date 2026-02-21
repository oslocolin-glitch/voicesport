"use client";

import { useState } from "react";
import { Upload, ChevronRight, ChevronLeft, FileUp, Sparkles, Check } from "lucide-react";

const STEPS = ["Project Info", "Content Details", "Upload Files", "AI Transform", "Review"];

export default function SubmitPage() {
  const [step, setStep] = useState(0);

  return (
    <div className="min-h-[80vh] max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Submit Content</h1>
          <p className="text-xs text-gray-400">Share your project outputs with the European sport community.</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 my-6">
        {STEPS.map((s, i) => (
          <div key={i} className="flex-1 text-center">
            <div className={`h-1 rounded-full transition-all mb-1 ${i <= step ? "bg-emerald-500" : "bg-gray-800"}`} />
            <span className={`text-[10px] ${i === step ? "text-emerald-400 font-semibold" : "text-gray-500"}`}>{s}</span>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Step 1: Project Information</h3>
            {["Project Name", "Funding Programme", "Partner Countries", "Your Name & Organisation"].map(label => (
              <div key={label}>
                <label className="text-xs font-semibold text-gray-400 mb-1 block">{label}</label>
                <input placeholder={`e.g. ${label}`} className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-500" />
              </div>
            ))}
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Step 2: Content Details</h3>
            <div><label className="text-xs font-semibold text-gray-400 mb-1 block">Title</label><input placeholder="Resource title" className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-500"/></div>
            <div><label className="text-xs font-semibold text-gray-400 mb-1 block">Description</label><textarea rows={3} placeholder="Brief description..." className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-500 resize-y"/></div>
          </div>
        )}
        {step === 2 && (
          <div className="text-center py-8">
            <FileUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-white mb-1">Drag & drop files here</p>
            <p className="text-xs text-gray-500 mb-4">PDF, DOCX, MP4, PNG — Max 500MB per file</p>
            <button className="bg-gray-800 text-white text-sm px-5 py-2 rounded-lg font-medium border border-gray-700">Browse Files</button>
            <div className="mt-4 p-3 bg-blue-950/30 border border-blue-800 rounded-xl text-xs text-blue-400 flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Tip: Upload the full report — our AI can generate a 2-page practitioner brief, infographic, and multilingual translations automatically.</span>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Step 4: AI-Powered Transformation (Optional)</h3>
            <p className="text-xs text-gray-400">Let AI create accessible versions of your content.</p>
            {[
              { icon: "📝", label: "2-Page Practitioner Brief", desc: "AI summary for coaches & managers" },
              { icon: "🖼️", label: "Visual Infographic", desc: "Key findings as a shareable visual" },
              { icon: "🎬", label: "3-Min Video Summary", desc: "Animated explainer with narration" },
              { icon: "🎧", label: "Audio Summary", desc: "Listen-friendly audio digest" },
              { icon: "🌐", label: "Translate to 10+ Languages", desc: "AI translation with human review" },
            ].map(o => (
              <label key={o.label} className="flex items-center gap-3 p-3 rounded-xl border border-gray-700 bg-gray-800 cursor-pointer hover:border-emerald-500/50 transition">
                <input type="checkbox" className="w-4 h-4 accent-emerald-500" />
                <span className="text-xl">{o.icon}</span>
                <div><div className="text-sm font-medium text-white">{o.label}</div><div className="text-[11px] text-gray-500">{o.desc}</div></div>
              </label>
            ))}
          </div>
        )}
        {step === 4 && (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"><Check className="w-7 h-7 text-emerald-400" /></div>
            <h3 className="text-lg font-bold text-white mb-2">Ready to Submit!</h3>
            <p className="text-sm text-gray-400 mb-6">Your content will be reviewed within 24-48 hours.</p>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-xl font-semibold transition">🚀 Submit for Review</button>
          </div>
        )}

        {step < 4 && (
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-700 text-sm text-gray-300 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /> Back</button>
            <button onClick={() => setStep(step + 1)} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium border border-gray-700">Next <ChevronRight className="w-4 h-4" /></button>
          </div>
        )}
      </div>
    </div>
  );
}
