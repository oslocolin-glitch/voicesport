"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";

interface PipelineErrorProps {
  failedFormats?: string[];
  completedFormats?: string[];
}

export default function PipelineError({ failedFormats = [], completedFormats = [] }: PipelineErrorProps) {
  return (
    <div className="space-y-3">
      {failedFormats.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-700/50 bg-red-950/20 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300">Some transformations could not be completed</p>
            <p className="text-gray-400 mt-1">Our team has been notified. Failed: {failedFormats.join(", ")}</p>
          </div>
        </div>
      )}
      {completedFormats.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-700/50 bg-emerald-950/20 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-300">Available formats</p>
            <p className="text-gray-400 mt-1">{completedFormats.join(", ")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
