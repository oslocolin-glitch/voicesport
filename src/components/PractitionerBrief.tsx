"use client";

import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import AIDisclaimer from "./AIDisclaimer";

interface PractitionerBriefProps {
  content: string; // Markdown/HTML content
  resourceTitle: string;
  organisation?: string;
  fundingAcknowledgement?: string;
  licenseType?: string;
  resourceId: number;
}

export default function PractitionerBrief({
  content,
  resourceTitle,
  organisation,
  fundingAcknowledgement,
  licenseType = "CC-BY-4.0",
  resourceId,
}: PractitionerBriefProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/resources/${resourceId}/brief-pdf`);
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resourceTitle.replace(/[^a-zA-Z0-9]/g, "_")}_Brief.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("PDF download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Practitioner Brief</h2>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition disabled:opacity-50"
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {downloading ? "Generating..." : "Download PDF"}
        </button>
      </div>

      {/* AI Disclaimer */}
      <AIDisclaimer
        documentName={resourceTitle}
        organisation={organisation}
        formatLabel="practitioner brief"
      />

      {/* Brief Content */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div
          className="prose prose-invert prose-sm max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-li:text-gray-300
            prose-strong:text-white
            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {/* Attribution Footer */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-xs text-gray-500 space-y-1">
        <p>
          <span className="text-gray-400 font-medium">Source:</span> {resourceTitle}
          {organisation && <> — {organisation}</>}
        </p>
        {fundingAcknowledgement && (
          <p>
            <span className="text-gray-400 font-medium">Funding:</span> {fundingAcknowledgement}
          </p>
        )}
        <p>
          <span className="text-gray-400 font-medium">License:</span> {licenseType}
        </p>
        <p className="text-gray-600 italic">
          This brief was generated using AI. Content should be verified against the original publication.
        </p>
      </div>
    </div>
  );
}
