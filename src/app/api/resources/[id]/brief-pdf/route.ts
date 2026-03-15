import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getClient() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

// Simple markdown-to-text converter for PDF
function markdownToLines(md: string): Array<{ text: string; style: "h1" | "h2" | "h3" | "body" | "bullet" }> {
  const lines: Array<{ text: string; style: "h1" | "h2" | "h3" | "body" | "bullet" }> = [];
  for (const line of md.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) {
      lines.push({ text: "", style: "body" });
    } else if (trimmed.startsWith("### ")) {
      lines.push({ text: trimmed.slice(4), style: "h3" });
    } else if (trimmed.startsWith("## ")) {
      lines.push({ text: trimmed.slice(3), style: "h2" });
    } else if (trimmed.startsWith("# ")) {
      lines.push({ text: trimmed.slice(2), style: "h1" });
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      lines.push({ text: trimmed.slice(2), style: "bullet" });
    } else {
      // Strip inline markdown (bold, italic, links)
      const clean = trimmed
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/\*(.+?)\*/g, "$1")
        .replace(/\[(.+?)\]\(.+?\)/g, "$1")
        .replace(/`(.+?)`/g, "$1");
      lines.push({ text: clean, style: "body" });
    }
  }
  return lines;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const resourceId = parseInt(id, 10);
  if (isNaN(resourceId)) {
    return NextResponse.json({ error: "Invalid resource id" }, { status: 400 });
  }

  const supabase = getClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  // Get resource metadata
  const { data: resource } = await supabase
    .from("resources")
    .select("title, project_name, funding_source, funding_acknowledgement, license_type, original_author, original_organisation")
    .eq("id", resourceId)
    .single();

  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  // Get practitioner brief file
  const { data: briefFile } = await supabase
    .from("resource_files")
    .select("storage_path")
    .eq("resource_id", resourceId)
    .eq("file_type", "practitioner_brief")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  let briefContent = "";

  if (briefFile?.storage_path) {
    // Download brief content from storage
    const { data: fileData } = await supabase.storage
      .from("resources")
      .download(briefFile.storage_path);

    if (fileData) {
      briefContent = await fileData.text();
    }
  }

  // Fallback: check resource_analysis for executive_summary
  if (!briefContent) {
    const { data: analysis } = await supabase
      .from("resource_analysis")
      .select("executive_summary, key_findings, practical_implications")
      .eq("resource_id", resourceId)
      .limit(1)
      .single();

    if (analysis) {
      const parts: string[] = [];
      if (analysis.executive_summary) {
        parts.push("# Executive Summary\n\n" + analysis.executive_summary);
      }
      if (analysis.key_findings) {
        parts.push("\n\n## Key Findings\n");
        const findings = Array.isArray(analysis.key_findings) ? analysis.key_findings : [];
        for (const f of findings) {
          parts.push(`- ${f.finding || f}`);
        }
      }
      if (analysis.practical_implications) {
        parts.push("\n\n## Practical Implications\n");
        const implications = Array.isArray(analysis.practical_implications) ? analysis.practical_implications : [];
        for (const imp of implications) {
          parts.push(`- ${imp.implication || imp}`);
        }
      }
      briefContent = parts.join("\n");
    }
  }

  if (!briefContent) {
    return NextResponse.json({ error: "No brief content available for this resource" }, { status: 404 });
  }

  // Generate PDF
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 25;

  const styles = {
    h1: { size: 18, color: [16, 100, 70] as [number, number, number], spacing: 10 },
    h2: { size: 14, color: [30, 30, 30] as [number, number, number], spacing: 8 },
    h3: { size: 12, color: [50, 50, 50] as [number, number, number], spacing: 6 },
    body: { size: 10, color: [60, 60, 60] as [number, number, number], spacing: 5 },
    bullet: { size: 10, color: [60, 60, 60] as [number, number, number], spacing: 5 },
  };

  // Title header
  doc.setFontSize(20);
  doc.setTextColor(16, 100, 70);
  const titleLines = doc.splitTextToSize(resource.title || "Practitioner Brief", contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 8 + 4;

  // Subtitle
  if (resource.project_name) {
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(resource.project_name, margin, y);
    y += 6;
  }

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Content
  const parsed = markdownToLines(briefContent);
  for (const line of parsed) {
    const s = styles[line.style];

    if (line.text === "" && line.style === "body") {
      y += 3;
      continue;
    }

    doc.setFontSize(s.size);
    doc.setTextColor(s.color[0], s.color[1], s.color[2]);

    const prefix = line.style === "bullet" ? "•  " : "";
    const indent = line.style === "bullet" ? 5 : 0;
    const wrapped = doc.splitTextToSize(prefix + line.text, contentWidth - indent);

    // Check page break
    if (y + wrapped.length * s.spacing > 280) {
      doc.addPage();
      y = 20;
    }

    if (line.style === "h1" || line.style === "h2") {
      doc.setFont("helvetica", "bold");
    } else {
      doc.setFont("helvetica", "normal");
    }

    doc.text(wrapped, margin + indent, y);
    y += wrapped.length * s.spacing + 2;
  }

  // Attribution footer on last page
  y = Math.max(y + 10, 260);
  if (y > 275) {
    doc.addPage();
    y = 20;
  }

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "italic");

  const attribution = [
    `Source: ${resource.title}${resource.original_organisation ? ` — ${resource.original_organisation}` : ""}`,
    resource.funding_acknowledgement ? `Funding: ${resource.funding_acknowledgement}` : null,
    `License: ${resource.license_type || "CC-BY-4.0"}`,
    "This brief was generated using AI. Content should be verified against the original publication.",
    `Generated by VoiceSport — ${new Date().toISOString().split("T")[0]}`,
  ].filter(Boolean);

  for (const line of attribution) {
    doc.text(line!, margin, y);
    y += 4;
  }

  const pdfBuffer = doc.output("arraybuffer");

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${(resource.title || "brief").replace(/[^a-zA-Z0-9]/g, "_")}_Brief.pdf"`,
    },
  });
}
