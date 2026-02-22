import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  // Auth check via cookies
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return req.cookies.getAll(); },
      setAll() {},
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const { rating, comment, applied_in_practice } = await req.json();
  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating 1-5 required" }, { status: 400 });
  }

  // Get resource by slug
  const { data: resource } = await supabase.from("resources").select("id").eq("slug", slug).single();
  if (!resource) return NextResponse.json({ error: "Resource not found" }, { status: 404 });

  // Upsert review
  const { error } = await supabase.from("reviews").upsert({
    resource_id: resource.id,
    user_id: user.id,
    rating,
    comment: comment || null,
    applied_in_practice: !!applied_in_practice,
  }, { onConflict: "resource_id,user_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update resource stats
  const { data: stats } = await supabase.from("reviews").select("rating, applied_in_practice").eq("resource_id", resource.id);
  if (stats && stats.length > 0) {
    const avg = stats.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / stats.length;
    const appliedCount = stats.filter((r: { applied_in_practice: boolean }) => r.applied_in_practice).length;
    await supabase.from("resources").update({
      rating_avg: Math.round(avg * 100) / 100,
      rating_count: stats.length,
      applied_count: appliedCount,
    }).eq("id", resource.id);
  }

  return NextResponse.json({ success: true });
}
