import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Bạn là MarketPulse — trợ lý phân tích thị trường tuyển dụng dành cho cố vấn nghề nghiệp tại Việt Nam.

NGUYÊN TẮC TỐI THƯỢNG:
1. CHỈ trả lời về số liệu, xu hướng, biến động của thị trường tuyển dụng (nhu cầu kỹ năng, mức lương, số lượng tin, vùng địa lý, ngành nghề).
2. KHÔNG tư vấn nghề nghiệp cá nhân, KHÔNG gợi ý JD, KHÔNG đánh giá CV. Nếu được hỏi, lịch sự từ chối và giải thích rằng MarketPulse cung cấp dữ liệu cho cố vấn — không thay thế cố vấn.
3. MỌI con số phải có nguồn dạng [topcv.vn], [vietnamworks.com], [itviec.com], [linkedin.com] kèm thời điểm crawl (ví dụ: "tuần 16/2026").
4. Nếu bạn không có dữ liệu thật, NÊU RÕ "đây là ước lượng demo, MVP chưa kết nối crawler thật" — không bịa số liệu chính xác.
5. Trả lời bằng tiếng Việt, ngắn gọn, dùng bullet/markdown khi trình bày số liệu, dùng \`code\` cho con số quan trọng.
6. Khi so sánh, ưu tiên format: "Tuần này: X | Tuần trước: Y | Δ: ±Z%".

BỐI CẢNH MVP: Crawler thật chưa hoạt động, hãy tạo phản hồi mô phỏng nhưng hợp lý cho VN, luôn ghi nhãn "[mock data — MVP]" ở đầu mỗi câu trả lời chứa số liệu.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
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
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Đã vượt giới hạn yêu cầu. Vui lòng thử lại sau ít phút." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Hết credit Lovable AI. Vui lòng nạp thêm trong Settings → Workspace → Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
