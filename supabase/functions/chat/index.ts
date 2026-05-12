import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Bạn là AI Career Advisor Assistant — trợ lý AI phân tích thị trường tuyển dụng dành cho cố vấn nghề nghiệp, HR, recruiter và người tìm việc tại Việt Nam.

NGUYÊN TẮC TỐI THƯỢNG:
1. CHỈ trả lời về số liệu AGGREGATE: xu hướng, biến động, tổng/đếm theo kỹ năng, mức lương trung vị, vùng địa lý, ngành nghề.
2. TUYỆT ĐỐI KHÔNG hiển thị nội dung tin tuyển dụng gốc (JD raw), không trích nguyên văn mô tả công việc, không nêu tên công ty cụ thể trong từng tin. Chỉ nêu nền tảng nguồn ở cấp aggregate (ví dụ: "theo dữ liệu tổng hợp từ topcv, itviec...").
3. KHÔNG tư vấn nghề nghiệp cá nhân, KHÔNG gợi ý JD cụ thể cho người dùng, KHÔNG đánh giá CV. Nếu được hỏi, lịch sự từ chối và giải thích rằng AI Career Advisor Assistant cung cấp insight aggregate cho cố vấn — không thay thế cố vấn.
4. Mỗi con số nên kèm "nguồn tham khảo" ở dạng nền tảng + tuần tổng hợp (ví dụ: "nguồn: topcv, itviec · tuần 16/2026"). KHÔNG đưa URL trực tiếp tới tin tuyển dụng cụ thể.
5. Trả lời bằng tiếng Việt, ngắn gọn, dùng bullet/markdown khi trình bày số liệu, dùng \`code\` cho con số quan trọng.
6. Khi so sánh, ưu tiên format: "Tuần này: X | Tuần trước: Y | Δ: ±Z%".`;

const MODEL = "google/gemini-3-flash-preview";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startedAt = Date.now();
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE);

  // Try to identify the caller (best-effort)
  let userId: string | null = null;
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const token = auth.replace("Bearer ", "");
    if (token) {
      const { data } = await adminClient.auth.getUser(token);
      userId = data.user?.id ?? null;
    }
  } catch (_) { /* ignore */ }

  const userAgent = req.headers.get("user-agent") ?? null;
  let sessionId: string | null = null;

  const logRequest = async (
    statusCode: number,
    error: string | null,
    extras: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } = {}
  ) => {
    try {
      await adminClient.from("request_logs").insert({
        user_id: userId,
        session_id: sessionId,
        model: MODEL,
        status_code: statusCode,
        latency_ms: Date.now() - startedAt,
        prompt_tokens: extras.prompt_tokens ?? null,
        completion_tokens: extras.completion_tokens ?? null,
        total_tokens: extras.total_tokens ?? null,
        error,
        user_agent: userAgent,
      });
    } catch (e) {
      console.error("log insert failed", e);
    }
  };

  try {
    const body = await req.json();
    const { messages, session_id } = body ?? {};
    sessionId = session_id ?? null;

    if (!Array.isArray(messages)) {
      await logRequest(400, "messages must be an array");
      return new Response(JSON.stringify({ error: "messages must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      await logRequest(500, "LOVABLE_API_KEY not configured");
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        await logRequest(429, "rate limit");
        return new Response(JSON.stringify({ error: "Đã vượt giới hạn yêu cầu. Vui lòng thử lại sau ít phút." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        await logRequest(402, "out of credits");
        return new Response(JSON.stringify({ error: "Hết credit Lovable AI. Vui lòng nạp thêm trong Settings → Workspace → Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      await logRequest(response.status, t.slice(0, 500));
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Tee the stream so we can log usage on completion while still streaming to client.
    const [clientStream, logStream] = response.body!.tee();

    (async () => {
      const reader = logStream.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let usage: any = null;
      let completionChars = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          let idx: number;
          while ((idx = buf.indexOf("\n")) !== -1) {
            let line = buf.slice(0, idx);
            buf = buf.slice(idx + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") continue;
            try {
              const parsed = JSON.parse(json);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (typeof delta === "string") completionChars += delta.length;
              if (parsed.usage) usage = parsed.usage;
            } catch (_) { /* partial */ }
          }
        }
      } catch (e) {
        console.error("tee read err", e);
      }
      await logRequest(200, null, {
        prompt_tokens: usage?.prompt_tokens ?? null,
        completion_tokens: usage?.completion_tokens ?? Math.ceil(completionChars / 4),
        total_tokens: usage?.total_tokens ?? null,
      });
    })();

    return new Response(clientStream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    await logRequest(500, e instanceof Error ? e.message : "unknown");
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
