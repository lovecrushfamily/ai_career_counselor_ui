import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAILS = (Deno.env.get("ADMIN_EMAILS") ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

  // Auth
  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const { data: u } = await admin.auth.getUser(token);
  const email = u.user?.email?.toLowerCase();
  if (!email || (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(email))) {
    return new Response(JSON.stringify({ error: "forbidden", hint: "Email không nằm trong ADMIN_EMAILS." }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const now = new Date();
    const since7 = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();
    const since24h = new Date(now.getTime() - 24 * 3600 * 1000).toISOString();

    // ---- Pull recent logs (last 7d, capped) ----
    const { data: logs7d } = await admin
      .from("request_logs")
      .select("created_at, status_code, latency_ms, total_tokens, completion_tokens, prompt_tokens, model, user_id, error")
      .gte("created_at", since7)
      .order("created_at", { ascending: false })
      .limit(5000);

    const logs = logs7d ?? [];
    const okLogs = logs.filter((l) => l.status_code === 200);
    const errLogs = logs.filter((l) => l.status_code >= 400);
    const lat = okLogs.map((l) => l.latency_ms ?? 0).filter((n) => n > 0).sort((a, b) => a - b);
    const pct = (p: number) => (lat.length ? lat[Math.min(lat.length - 1, Math.floor(lat.length * p))] : 0);

    // status distribution
    const statusDist: Record<string, number> = {};
    for (const l of logs) {
      const k = String(l.status_code);
      statusDist[k] = (statusDist[k] ?? 0) + 1;
    }

    // model distribution
    const modelDist: Record<string, number> = {};
    for (const l of logs) modelDist[l.model] = (modelDist[l.model] ?? 0) + 1;

    // requests per day (7d)
    const perDay: Record<string, { date: string; ok: number; err: number; tokens: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
      const k = d.toISOString().slice(0, 10);
      perDay[k] = { date: k, ok: 0, err: 0, tokens: 0 };
    }
    for (const l of logs) {
      const k = l.created_at.slice(0, 10);
      if (!perDay[k]) continue;
      if (l.status_code >= 400) perDay[k].err++; else perDay[k].ok++;
      perDay[k].tokens += l.total_tokens ?? l.completion_tokens ?? 0;
    }

    // top users
    const userCounts: Record<string, number> = {};
    for (const l of logs) {
      if (!l.user_id) continue;
      userCounts[l.user_id] = (userCounts[l.user_id] ?? 0) + 1;
    }
    const topUserIds = Object.entries(userCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    let topUsers: Array<{ user_id: string; email: string | null; requests: number }> = [];
    if (topUserIds.length) {
      const { data: profs } = await admin
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", topUserIds.map(([id]) => id));
      const nameMap = new Map((profs ?? []).map((p) => [p.user_id, p.display_name]));
      topUsers = topUserIds.map(([uid, n]) => ({
        user_id: uid,
        email: nameMap.get(uid) ?? null,
        requests: n,
      }));
    }

    // 24h counters
    const last24 = logs.filter((l) => l.created_at >= since24h);
    const errors24 = last24.filter((l) => l.status_code >= 400);
    const rate429 = last24.filter((l) => l.status_code === 429).length;
    const rate402 = last24.filter((l) => l.status_code === 402).length;

    // Totals
    const [{ count: totalSessions }, { count: totalMessages }, { count: totalUsers }, { count: feedbackTotal }] = await Promise.all([
      admin.from("chat_sessions").select("id", { count: "exact", head: true }),
      admin.from("chat_messages").select("id", { count: "exact", head: true }),
      admin.from("profiles").select("user_id", { count: "exact", head: true }),
      admin.from("message_feedback").select("id", { count: "exact", head: true }),
    ]);

    // Feedback breakdown
    const { data: fbRows } = await admin
      .from("message_feedback")
      .select("rating, created_at, comment")
      .gte("created_at", since7)
      .order("created_at", { ascending: false })
      .limit(200);
    const fb = fbRows ?? [];
    const positives = fb.filter((f) => f.rating === 1).length;
    const negatives = fb.filter((f) => f.rating === -1).length;
    const recentComments = fb.filter((f) => f.comment).slice(0, 20);

    // Recent errors
    const recentErrors = errLogs.slice(0, 20).map((e) => ({
      created_at: e.created_at, status: e.status_code, error: e.error, latency_ms: e.latency_ms,
    }));

    return new Response(
      JSON.stringify({
        generated_at: now.toISOString(),
        totals: {
          users: totalUsers ?? 0,
          sessions: totalSessions ?? 0,
          messages: totalMessages ?? 0,
          feedback: feedbackTotal ?? 0,
          requests_7d: logs.length,
          requests_24h: last24.length,
          errors_24h: errors24.length,
          rate_limit_24h: rate429,
          out_of_credits_24h: rate402,
        },
        latency_ms: { p50: pct(0.5), p95: pct(0.95), p99: pct(0.99) },
        error_rate_7d: logs.length ? errLogs.length / logs.length : 0,
        status_distribution: statusDist,
        model_distribution: modelDist,
        per_day: Object.values(perDay),
        top_users: topUsers,
        feedback: {
          total_7d: fb.length,
          positives,
          negatives,
          satisfaction: fb.length ? positives / fb.length : null,
          recent_comments: recentComments,
        },
        recent_errors: recentErrors,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("admin-stats error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
