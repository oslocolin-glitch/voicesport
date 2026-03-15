"use client";

import { AlertTriangle } from "lucide-react";

interface AIDisclaimerProps {
  documentName?: string;
  organisation?: string;
  formatLabel?: string; // e.g. "brief", "summary", "flashcard set"
}

export default function AIDisclaimer({ documentName, organisation, formatLabel = "content" }: AIDisclaimerProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-700/50 bg-amber-950/20 text-sm">
      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="font-semibold text-amber-300">AI-Generated Content</p>
        <p className="text-gray-300">
          This {formatLabel} was automatically generated from the original source document.
          Always verify key findings with the original publication.
        </p>
        {(documentName || organisation) && (
          <p className="text-gray-400 text-xs mt-2">
            Original: {documentName || "Source Document"}
            {organisation && <> by <span className="text-gray-300">{organisation}</span></>}
          </p>
        )}
      </div>
    </div>
  );
}
