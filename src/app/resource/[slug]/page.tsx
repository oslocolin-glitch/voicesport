"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Download, Star, Bot, CheckCircle, Send, Loader2 } from "lucide-react";
import { FLAG_MAP, FORMAT_ICONS } from "@/lib/constants";
import { useAuth } from "@/components/AuthProvider";
import type { Resource, ResourceFile, Review } from "@/lib/types";

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "text-lg" : "text-xs";
  return (
    <span className={`flex items-center gap-1 ${cls}`}>
      <span className="text-amber-400">{"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}</span>
      <span className="text-gray-500 font-medium">{rating}</span>
    </span>
  );
}

export default function ResourcePage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [resource, setResource] = useState<Resource | null>(null);
  const [files, setFiles] = useState<ResourceFile[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Review form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    fetch(`/api/resources/${slug}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(data => { setResource(data.resource); setFiles(data.files); setReviews(data.reviews); })
      .catch(() => setError("Resource not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    setSubmitting(true); setReviewSuccess("");
    try {
      const res = await fetch(`/api/resources/${slug}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, applied_in_practice: applied }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setReviewSuccess("Review submitted! Thank you. 🎉");
      setRating(0); setComment(""); setApplied(false);
      // Refresh
      const data = await (await fetch(`/api/resources/${slug}`)).json();
      setResource(data.resource); setReviews(data.reviews);
    } catch (err: unknown) {
      setReviewSuccess(err instanceof Error ? err.message : "Failed");
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="w-6 h-6 text-emerald-400 animate-spin" /></div>;
  if (error || !resource) return <div className="text-center py-32 text-gray-500">{error || "Not found"}</div>;

  const r = resource;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Discover
      </Link>

      {/* Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 px-6 py-5">
          <div className="flex gap-2 mb-3 flex-wrap">
            <span className="text-[10px] font-semibold bg-blue-950/70 text-blue-400 px-2 py-0.5 rounded-md border border-blue-800">{r.resource_type}</span>
            {r.featured && <span className="text-[10px] font-semibold bg-amber-950/70 text-amber-400 px-2 py-0.5 rounded-md border border-amber-800">⭐ Featured</span>}
            <span className="text-[10px] font-semibold bg-emerald-950/70 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-800">✅ {r.applied_count} applied in practice</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{r.title}</h1>
          <p className="text-sm text-gray-300">{r.description}</p>
        </div>

        <div className="px-6 py-4 grid sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div><span className="text-gray-500">Project:</span> <span className="text-gray-300 font-medium">{r.project_name}</span></div>
            <div><span className="text-gray-500">Funding:</span> <span className="text-gray-300">{r.funding_source}</span></div>
            <div><span className="text-gray-500">Countries:</span> <span className="text-gray-300">{r.partner_countries?.map((c: string) => `${FLAG_MAP[c] || ""} ${c}`).join(", ")}</span></div>
            <div><span className="text-gray-500">Year:</span> <span className="text-gray-300">{r.project_year}</span></div>
          </div>
          <div className="space-y-2">
            <div><span className="text-gray-500">Pages:</span> <span className="text-gray-300">{r.page_count}</span></div>
            <div><span className="text-gray-500">License:</span> <span className="text-gray-300">{r.license}</span></div>
            <div><span className="text-gray-500">Languages:</span> <span className="flex gap-1 mt-0.5">{r.languages?.map((l: string) => <span key={l} className="bg-gray-700 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold">{l}</span>)}</span></div>
            <div><span className="text-gray-500">Topics:</span> <span className="flex gap-1 mt-0.5">{r.topics?.map((t: string) => <span key={t} className="bg-amber-950/30 text-amber-400 px-1.5 py-0.5 rounded text-[10px]">{t}</span>)}</span></div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="px-6 py-3 border-t border-gray-800 flex gap-6">
          <span className="flex items-center gap-1.5 text-sm text-gray-400"><Eye className="w-4 h-4" /> {(r.view_count || 0).toLocaleString()} views</span>
          <span className="flex items-center gap-1.5 text-sm text-gray-400"><Download className="w-4 h-4" /> {(r.download_count || 0).toLocaleString()} downloads</span>
          <Stars rating={Number(r.rating_avg) || 0} size="lg" />
          <span className="text-sm text-gray-500">({r.rating_count} reviews)</span>
        </div>
      </div>

      {/* Abstract + Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-3">About this resource</h3>
          <p className="text-xs text-gray-400 leading-relaxed">{r.abstract}</p>
        </div>
        <div className="space-y-3">
          <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download
          </button>
          <Link href="/ai-studio" className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2">
            <Bot className="w-4 h-4" /> AI Transform
          </Link>
          <button className="w-full bg-gray-800 border border-gray-700 text-gray-300 py-3 rounded-xl text-sm font-medium transition hover:bg-gray-700">⭐ Save to Collection</button>
        </div>
      </div>

      {/* Files */}
      {files.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-bold text-white mb-3">Available Formats</h3>
          <div className="space-y-2">
            {files.map(f => (
              <div key={f.id} className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <span>{FORMAT_ICONS[f.file_type] || "📄"}</span>
                  <div>
                    <div className="text-xs font-medium text-white">{f.format_label || f.file_name}</div>
                    <div className="text-[10px] text-gray-500">{f.language} · {f.file_size ? `${(f.file_size / 1024 / 1024).toFixed(1)} MB` : f.file_type}</div>
                  </div>
                  {f.ai_generated && <span className="text-[9px] bg-violet-950/50 text-violet-400 px-1.5 py-0.5 rounded border border-violet-800">AI</span>}
                </div>
                <button className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-medium">Download</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold text-white mb-4">Reviews ({reviews.length})</h3>

        {reviews.length === 0 && <p className="text-xs text-gray-500">No reviews yet. Be the first!</p>}

        <div className="space-y-3 mb-6">
          {reviews.map(rv => (
            <div key={rv.id} className="bg-gray-800 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white">{rv.display_name || "Anonymous"}</span>
                  {rv.user_type && <span className="text-[10px] text-gray-500 capitalize">{rv.user_type}</span>}
                </div>
                <Stars rating={rv.rating} />
              </div>
              {rv.comment && <p className="text-xs text-gray-400 mt-1">{rv.comment}</p>}
              {rv.applied_in_practice && (
                <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-400 font-medium">
                  <CheckCircle className="w-3 h-3" /> Applied in practice
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Review form */}
        {user ? (
          <form onSubmit={handleReview} className="border-t border-gray-800 pt-4">
            <h4 className="text-xs font-semibold text-white mb-3">Write a review</h4>
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setRating(n)} className={`text-2xl transition ${n <= rating ? "text-amber-400" : "text-gray-700 hover:text-gray-500"}`}>★</button>
              ))}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience with this resource..." rows={3} className="w-full px-3 py-2 rounded-xl border border-gray-700 bg-gray-800 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-emerald-500 resize-y mb-3" />
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input type="checkbox" checked={applied} onChange={e => setApplied(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
              <span className="text-xs text-gray-300">✅ I applied this resource in my practice</span>
            </label>
            {reviewSuccess && <p className={`text-xs mb-2 ${reviewSuccess.includes("🎉") ? "text-emerald-400" : "text-red-400"}`}>{reviewSuccess}</p>}
            <button type="submit" disabled={!rating || submitting} className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 transition flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="border-t border-gray-800 pt-4 text-center">
            <p className="text-xs text-gray-500 mb-2">Sign in to leave a review</p>
            <Link href="/auth/login" className="text-xs text-emerald-400 font-medium hover:underline">Sign In →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
