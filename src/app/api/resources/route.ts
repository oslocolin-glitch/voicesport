import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getClient() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(req: NextRequest) {
  const supabase = getClient();
  if (!supabase) {
    return NextResponse.json({ data: [], total: 0 });
  }

  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") || "";
  const topic = searchParams.get("topic") || "";
  const sport = searchParams.get("sport") || "";
  const audience = searchParams.get("audience") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "20");
  const offset = (page - 1) * perPage;

  let query = supabase
    .from("resources")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("applied_count", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,abstract.ilike.%${q}%`);
  }
  if (topic) {
    query = query.contains("topics", [topic]);
  }
  if (sport) {
    query = query.contains("sports", [sport]);
  }
  if (audience) {
    query = query.contains("target_audiences", [audience]);
  }

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch available output formats for each resource
  let enriched = data || [];
  if (enriched.length > 0) {
    const ids = enriched.map(r => r.id);
    const { data: files } = await supabase
      .from("resource_files")
      .select("resource_id, file_type")
      .in("resource_id", ids)
      .neq("file_type", "source");

    const outputMap: Record<number, string[]> = {};
    if (files) {
      for (const f of files) {
        if (!outputMap[f.resource_id]) outputMap[f.resource_id] = [];
        if (!outputMap[f.resource_id].includes(f.file_type)) {
          outputMap[f.resource_id].push(f.file_type);
        }
      }
    }

    enriched = enriched.map(r => ({
      ...r,
      available_formats: outputMap[r.id] || [],
    }));
  }

  return NextResponse.json({
    data: enriched,
    total: count || 0,
    page,
    perPage,
  });
}
