"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight, Upload } from "lucide-react";

export default function SubmitSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Content Submitted!</h1>
        <p className="text-sm text-gray-400 mb-2">
          Your resource has been submitted for review. Our team will check it within 24-48 hours.
        </p>
        <p className="text-xs text-gray-500 mb-8">
          If you selected AI transformations, they will be queued automatically once your content is approved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
          >
            Explore Library <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/submit"
            className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-gray-300 px-6 py-3 rounded-xl text-sm font-medium transition hover:bg-gray-700"
          >
            <Upload className="w-4 h-4" /> Submit Another
          </Link>
        </div>
      </div>
    </div>
  );
}
