import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Format-based size limits (bytes)
const SIZE_LIMITS: Record<string, number> = {
  "application/pdf": 50 * 1024 * 1024,        // 50MB
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": 30 * 1024 * 1024, // 30MB DOCX
  "video/mp4": 500 * 1024 * 1024,             // 500MB
  "image/png": 20 * 1024 * 1024,              // 20MB
  "image/jpeg": 20 * 1024 * 1024,             // 20MB
  "image/jpg": 20 * 1024 * 1024,              // 20MB
};

const ALLOWED_TYPES = Object.keys(SIZE_LIMITS);

function getClient() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(req: NextRequest) {
  const supabase = getClient();
  if (!supabase) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const resourceId = formData.get("resource_id") as string | null;
    const selectedFormats = formData.get("selected_formats") as string | null; // JSON array

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed: PDF, DOCX, MP4, PNG, JPG` },
        { status: 400 }
      );
    }

    // Validate size
    const maxSize = SIZE_LIMITS[file.type] || 50 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        { error: `File too large. Maximum ${maxMB}MB for ${file.type.split("/").pop()?.toUpperCase()}` },
        { status: 400 }
      );
    }

    // Resource ID is integer (from resources table)
    if (!resourceId) {
      return NextResponse.json({ error: "resource_id is required" }, { status: 400 });
    }
    const resId = parseInt(resourceId, 10);
    if (isNaN(resId)) {
      return NextResponse.json({ error: "resource_id must be an integer" }, { status: 400 });
    }
    const storagePath = `resources/${resId}/${file.name}`;

    // Upload to Supabase Storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from("resources")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
    }

    // Update resource record with status 'uploaded'
    const { error: updateError } = await supabase
      .from("resources")
      .update({
        status: "uploaded",
        storage_path: storagePath,
        file_type: file.type,
        file_size: file.size,
      })
      .eq("id", resId);

    if (updateError) {
      console.error("Resource update error:", updateError);
    }

    // Also insert into resource_files as source file
    const { data: fileRecord } = await supabase
      .from("resource_files")
      .insert({
        resource_id: resId,
        file_type: "source",
        storage_path: storagePath,
        file_name: file.name,
        file_size: file.size,
        is_original: true,
      })
      .select("id")
      .single();

    // Queue AI transform jobs for selected formats
    const formats: string[] = selectedFormats ? JSON.parse(selectedFormats) : [];
    if (formats.length > 0) {
      const jobs = formats.map(format => ({
        resource_id: resId,
        source_file_id: fileRecord?.id || null,
        transform_type: format,
        status: "queued",
      }));

      const { error: jobError } = await supabase
        .from("ai_transform_jobs")
        .insert(jobs);

      if (jobError) {
        console.error("Job queue error:", jobError);
        // Non-fatal — upload still succeeded
      }
    }

    return NextResponse.json({
      success: true,
      resource_id: resId,
      storage_path: storagePath,
      queued_formats: formats,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
