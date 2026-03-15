import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 10;

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({
      status: "error",
      message: "Missing env vars",
      hasUrl: !!url,
      hasKey: !!key,
    });
  }

  try {
    const supabase = createClient(url, key);
    const start = Date.now();
    const { count, error } = await supabase
      .from("resources")
      .select("id", { count: "exact", head: true })
      .eq("status", "published");

    return NextResponse.json({
      status: error ? "db_error" : "ok",
      latencyMs: Date.now() - start,
      resourceCount: count,
      dbError: error?.message || null,
      supabaseUrl: url,
    });
  } catch (err: unknown) {
    return NextResponse.json({
      status: "exception",
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
