import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getClient() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export async function POST(req: NextRequest) {
  const supabase = getClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await req.json();

  const {
    title,
    description,
    project_name,
    funding_programme,
    partner_countries,
    submitter_name,
    license_type,
    funding_acknowledgement,
    grant_number,
  } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  // Generate unique slug
  const baseSlug = slugify(title);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const { data, error } = await supabase
    .from("resources")
    .insert({
      title: title.trim(),
      slug,
      description: description?.trim() || null,
      project_name: project_name?.trim() || null,
      funding_source: funding_programme?.trim() || null,
      partner_countries: Array.isArray(partner_countries) ? partner_countries : [],
      submitted_by: submitter_name?.trim() || null,
      license: license_type || "CC-BY-4.0",
      license_type: license_type || "CC-BY-4.0",
      funding_acknowledgement: funding_acknowledgement?.trim() || null,
      grant_number: grant_number?.trim() || null,
      status: "pending",
      resource_type: "Report", // default, can be changed by admin
      topics: [],
      sports: [],
      target_audiences: [],
      languages: ["EN"],
    })
    .select("id")
    .single();

  if (error) {
    console.error("Resource insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ resource_id: data.id, slug });
}
