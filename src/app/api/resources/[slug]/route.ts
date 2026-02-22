import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getClient() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = getClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  // Fetch resource
  const { data: resource, error } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  // Increment view count
  await supabase.from("resources").update({ view_count: (resource.view_count || 0) + 1 }).eq("id", resource.id);

  // Fetch files
  const { data: files } = await supabase
    .from("resource_files")
    .select("*")
    .eq("resource_id", resource.id)
    .order("is_original", { ascending: false });

  // Fetch reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profiles(display_name, user_type, country_code)")
    .eq("resource_id", resource.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({
    resource,
    files: files || [],
    reviews: (reviews || []).map((r: Record<string, unknown>) => ({
      ...r,
      display_name: (r.profiles as Record<string, unknown>)?.display_name,
      user_type: (r.profiles as Record<string, unknown>)?.user_type,
      country_code: (r.profiles as Record<string, unknown>)?.country_code,
    })),
  });
}
