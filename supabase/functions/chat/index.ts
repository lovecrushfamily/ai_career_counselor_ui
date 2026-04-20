import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Bạn là AI Career Counselor — trợ lý phân tích thị trường tuyển dụng dành cho cố vấn nghề nghiệp tại Việt Nam.

NGUYÊN TẮC TỐI THƯỢNG:
1. CHỈ trả lời về số liệu AGGREGATE: xu hướng, biến động, tổng/đếm theo kỹ năng, mức lương trung vị, vùng địa lý, ngành nghề.
2. TUYỆT ĐỐI KHÔNG hiển thị nội dung tin tuyển dụng gốc (JD raw), không trích nguyên văn mô tả công việc, không nêu tên công ty cụ thể trong từng tin. Chỉ nêu nền tảng nguồn ở cấp aggregate (ví dụ: "theo dữ liệu tổng hợp từ topcv, itviec...").
3. KHÔNG tư vấn nghề nghiệp cá nhân, KHÔNG gợi ý JD cụ thể cho người dùng, KHÔNG đánh giá CV. Nếu được hỏi, lịch sự từ chối và giải thích rằng AI Career Counselor cung cấp insight aggregate cho cố vấn — không thay thế cố vấn.
4. Mỗi con số nên kèm "nguồn tham khảo" ở dạng nền tảng + tuần tổng hợp (ví dụ: "nguồn: topcv, itviec · tuần 16/2026"). KHÔNG đưa URL trực tiếp tới tin tuyển dụng cụ thể.
5. Nếu chưa có dữ liệu thật, NÊU RÕ "đây là số liệu demo aggregate, MVP chưa kết nối pipeline tổng hợp thật" — không bịa số chính xác.
6. Trả lời bằng tiếng Việt, ngắn gọn, dùng bullet/markdown khi trình bày số liệu, dùng \`code\` cho con số quan trọng.
7. Khi so sánh, ưu tiên format: "Tuần này: X | Tuần trước: Y | Δ: ±Z%".

BỐI CẢNH MVP: Pipeline tổng hợp dữ liệu công khai chưa hoạt động đầy đủ, hãy tạo phản hồi mô phỏng aggregate hợp lý cho VN, luôn gắn nhãn "[demo aggregate — MVP]" ở đầu mỗi câu trả lời chứa số liệu.`;

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
