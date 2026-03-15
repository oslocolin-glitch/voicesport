"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, ChevronRight, ChevronLeft, FileUp, Sparkles, Check, X, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const STEPS = ["Project Info", "Content Details", "Upload Files", "AI Transform", "Review"];

const LICENSE_OPTIONS = [
  { value: "CC-BY-4.0", label: "CC-BY 4.0 — Attribution" },
  { value: "CC-BY-SA-4.0", label: "CC-BY-SA 4.0 — Attribution ShareAlike" },
  { value: "CC-BY-NC-4.0", label: "CC-BY-NC 4.0 — Attribution NonCommercial" },
  { value: "CC-BY-NC-SA-4.0", label: "CC-BY-NC-SA 4.0 — Attribution NonCommercial ShareAlike" },
  { value: "all-rights-reserved", label: "All Rights Reserved" },
  { value: "public-domain", label: "Public Domain" },
];

const AI_TRANSFORMS = [
  { key: "practitioner_brief", icon: "📝", label: "2-Page Practitioner Brief", desc: "AI summary for coaches & managers" },
  { key: "infographic", icon: "🖼️", label: "Visual Infographic", desc: "Key findings as a shareable visual" },
  { key: "video_summary", icon: "🎬", label: "3-Min Video Summary", desc: "Animated explainer with narration" },
  { key: "audio_digest", icon: "🎧", label: "Audio Summary", desc: "Listen-friendly audio digest" },
  { key: "flashcards", icon: "🃏", label: "Flashcards", desc: "Key findings as question-answer cards" },
];

const SIZE_LIMITS: Record<string, number> = {
  "application/pdf": 50,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": 30,
  "video/mp4": 500,
  "image/png": 20,
  "image/jpeg": 20,
};

const ALLOWED_TYPES = Object.keys(SIZE_LIMITS);

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SubmitPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    project_name: "",
    funding_programme: "",
    partner_countries: "",
    submitter_name: "",
    license_type: "CC-BY-4.0",
    funding_acknowledgement: "",
    grant_number: "",
    title: "",
    description: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [selectedTransforms, setSelectedTransforms] = useState<Set<string>>(new Set());

  const updateField = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  // File validation
  const validateAndAddFiles = useCallback((newFiles: FileList | File[]) => {
    const errors: string[] = [];
    const valid: File[] = [];

    for (const file of Array.from(newFiles)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Unsupported format. Use PDF, DOCX, MP4, PNG, or JPG.`);
        continue;
      }
      const maxMB = SIZE_LIMITS[file.type] || 50;
      if (file.size > maxMB * 1024 * 1024) {
        errors.push(`${file.name}: Too large (max ${maxMB}MB for this format).`);
        continue;
      }
      // Prevent duplicates
      if (files.some(f => f.name === file.name && f.size === file.size)) {
        errors.push(`${file.name}: Already added.`);
        continue;
      }
      valid.push(file);
    }

    setFileErrors(errors);
    if (valid.length) setFiles(prev => [...prev, ...valid]);
  }, [files]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFileErrors([]);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) validateAndAddFiles(e.dataTransfer.files);
  };

  // Toggle AI transform
  const toggleTransform = (key: string) => {
    setSelectedTransforms(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  // Submit
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      // 1. Create resource record
      const res = await fetch("/api/resources/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          partner_countries: form.partner_countries.split(",").map(s => s.trim()).filter(Boolean),
          selected_transforms: Array.from(selectedTransforms),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create resource");
      }

      const { resource_id } = await res.json();

      // 2. Upload files
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("resource_id", String(resource_id));
        formData.append("selected_formats", JSON.stringify(Array.from(selectedTransforms)));

        const uploadRes = await fetch("/api/resources/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          console.error("Upload error:", data.error);
        }
      }

      // Success — redirect to resource page or dashboard
      router.push(`/submit/success?id=${resource_id}`);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Validation per step
  const canProceed = () => {
    if (step === 0) return form.title.trim().length > 0 || form.project_name.trim().length > 0;
    if (step === 1) return form.title.trim().length > 0;
    if (step === 2) return files.length > 0;
    return true;
  };

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

        {/* ─── Step 0: Project Info ─── */}
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Step 1: Project Information</h3>
            {[
              { key: "project_name", label: "Project Name", placeholder: "e.g. AMPLIFY-SPORT" },
              { key: "funding_programme", label: "Funding Programme", placeholder: "e.g. Erasmus+ Sport" },
              { key: "partner_countries", label: "Partner Countries", placeholder: "e.g. Norway, Turkey, Ireland" },
              { key: "submitter_name", label: "Your Name & Organisation", placeholder: "e.g. Jane Doe, COLIN" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-gray-400 mb-1 block">{f.label}</label>
                <input
                  value={form[f.key as keyof typeof form]}
                  onChange={e => updateField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-500"
                />
              </div>
            ))}

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">License Type</label>
              <select
                value={form.license_type}
                onChange={e => updateField("license_type", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {LICENSE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Funding Acknowledgement</label>
              <input
                value={form.funding_acknowledgement}
                onChange={e => updateField("funding_acknowledgement", e.target.value)}
                placeholder="e.g. Co-funded by the European Union"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Grant Number <span className="text-gray-600">(optional)</span></label>
              <input
                value={form.grant_number}
                onChange={e => updateField("grant_number", e.target.value)}
                placeholder="e.g. 101234567"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-500"
              />
            </div>
          </div>
        )}

        {/* ─── Step 1: Content Details ─── */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Step 2: Content Details</h3>
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Title <span className="text-red-400">*</span></label>
              <input value={form.title} onChange={e => updateField("title", e.target.value)} placeholder="Resource title" className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => updateField("description", e.target.value)} rows={3} placeholder="Brief description of your resource..." className="w-full px-3 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-500 resize-y" />
            </div>
          </div>
        )}

        {/* ─── Step 2: Upload Files ─── */}
        {step === 2 && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Step 3: Upload Files</h3>

            {/* Drop zone */}
            <div
              ref={dropRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`text-center py-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                dragOver
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.mp4,.png,.jpg,.jpeg"
                onChange={e => { if (e.target.files?.length) validateAndAddFiles(e.target.files); e.target.value = ""; }}
                className="hidden"
              />
              <FileUp className={`w-12 h-12 mx-auto mb-3 ${dragOver ? "text-emerald-400" : "text-gray-600"}`} />
              <p className="text-sm font-semibold text-white mb-1">
                {dragOver ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-xs text-gray-500 mb-2">PDF (50MB), DOCX (30MB), MP4 (500MB), PNG/JPG (20MB)</p>
              <span className="bg-gray-800 text-white text-sm px-5 py-2 rounded-lg font-medium border border-gray-700 inline-block">Browse Files</span>
            </div>

            {/* File errors */}
            {fileErrors.length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-red-950/30 border border-red-800 space-y-1">
                {fileErrors.map((err, i) => (
                  <p key={i} className="text-xs text-red-400 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {err}
                  </p>
                ))}
              </div>
            )}

            {/* File list */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-xl">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">📄</span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white truncate">{file.name}</p>
                        <p className="text-[10px] text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="p-1 text-gray-500 hover:text-red-400 transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-950/30 border border-blue-800 rounded-xl text-xs text-blue-400 flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Tip: Upload the full report — our AI can generate a 2-page practitioner brief, infographic, and multilingual translations automatically.</span>
            </div>
          </div>
        )}

        {/* ─── Step 3: AI Transform ─── */}
        {step === 3 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Step 4: AI-Powered Transformation (Optional)</h3>
            <p className="text-xs text-gray-400">Select the formats you'd like AI to generate from your uploaded content.</p>
            {AI_TRANSFORMS.map(o => {
              const checked = selectedTransforms.has(o.key);
              return (
                <label
                  key={o.key}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    checked
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-gray-700 bg-gray-800 hover:border-emerald-500/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleTransform(o.key)}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-xl">{o.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-white">{o.label}</div>
                    <div className="text-[11px] text-gray-500">{o.desc}</div>
                  </div>
                </label>
              );
            })}
            {selectedTransforms.size > 0 && (
              <p className="text-xs text-emerald-400 mt-2">
                ✓ {selectedTransforms.size} format{selectedTransforms.size > 1 ? "s" : ""} selected — will be queued after upload
              </p>
            )}
          </div>
        )}

        {/* ─── Step 4: Review & Submit ─── */}
        {step === 4 && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Review & Submit</h3>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-gray-800 rounded-xl">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Project</p>
                <p className="text-sm text-white">{form.project_name || "—"}</p>
                <p className="text-xs text-gray-400">{form.funding_programme} · {form.partner_countries}</p>
              </div>

              <div className="p-3 bg-gray-800 rounded-xl">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Content</p>
                <p className="text-sm text-white font-medium">{form.title}</p>
                {form.description && <p className="text-xs text-gray-400 mt-1">{form.description}</p>}
              </div>

              <div className="p-3 bg-gray-800 rounded-xl">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Files ({files.length})</p>
                {files.map((f, i) => (
                  <p key={i} className="text-xs text-gray-300">📄 {f.name} ({formatFileSize(f.size)})</p>
                ))}
              </div>

              <div className="p-3 bg-gray-800 rounded-xl">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">License & Attribution</p>
                <p className="text-xs text-gray-300">{form.license_type}</p>
                {form.funding_acknowledgement && <p className="text-xs text-gray-400">{form.funding_acknowledgement}</p>}
              </div>

              {selectedTransforms.size > 0 && (
                <div className="p-3 bg-gray-800 rounded-xl">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">AI Transforms</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {Array.from(selectedTransforms).map(key => {
                      const t = AI_TRANSFORMS.find(x => x.key === key);
                      return t ? (
                        <span key={key} className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-700/50">
                          {t.icon} {t.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            {submitError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-950/30 border border-red-800 mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400">{submitError}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "🚀 Submit for Review"}
            </button>
          </div>
        )}

        {/* Navigation */}
        {step < 4 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-700 text-sm text-gray-300 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium border border-gray-700 disabled:opacity-30"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
