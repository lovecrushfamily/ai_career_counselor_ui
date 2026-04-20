import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "MarketPulse khác gì so với hỏi ChatGPT về thị trường tuyển dụng?",
    a: "ChatGPT trả lời dựa trên dữ liệu huấn luyện — bạn không biết con số đến từ đâu, lúc nào, và liệu có còn đúng. MarketPulse crawl trực tiếp từ các nền tảng tuyển dụng mỗi tuần, mỗi con số đều kèm nguồn URL và ngày crawl để bạn có thể audit.",
  },
  {
    q: "Dữ liệu được crawl từ đâu?",
    a: "Hiện tại MVP tập trung vào TopCV, VietnamWorks, ITviec và LinkedIn. Chúng tôi đang mở rộng sang JobsGo, CareerBuilder và một số nền tảng quốc tế. Mỗi tin tuyển dụng được lưu kèm URL gốc để truy vết.",
  },
  {
    q: "Tần suất cập nhật như thế nào?",
    a: "Pipeline chạy hàng tuần (mỗi Chủ Nhật). Bạn luôn thấy snapshot tuần gần nhất, đồng thời so sánh được với 4–12 tuần trước.",
  },
  {
    q: "MarketPulse có gợi ý công việc cho sinh viên không?",
    a: "Không. Chúng tôi cố ý không làm việc đó. MarketPulse cung cấp dữ liệu thị trường cho cố vấn nghề nghiệp — quyết định tư vấn vẫn thuộc về con người. Việc gợi ý JD cá nhân hoá đòi hỏi nhiều yếu tố ngoài dữ liệu thị trường (sở thích, hoàn cảnh, năng lực) mà chỉ cố vấn mới đánh giá đúng.",
  },
  {
    q: "Tôi có thể trích dẫn số liệu MarketPulse trong báo cáo không?",
    a: "Có. Mỗi câu trả lời đều có citations dạng URL gốc + ngày crawl. Bạn có thể copy citation và đưa thẳng vào báo cáo / slide. Pipeline của chúng tôi public và có thể audit.",
  },
  {
    q: "Tại sao không phải real-time mà là hàng tuần?",
    a: "Crawl real-time vừa tốn kém vừa gây nhiễu (tin tuyển dụng được đăng/gỡ liên tục). Chu kỳ tuần đủ nhanh để bắt biến động kỹ năng, đủ ổn định để số liệu có ý nghĩa thống kê.",
  },
  {
    q: "Lovable AI dùng để làm gì trong sản phẩm?",
    a: "AI giúp bạn truy vấn dataset bằng ngôn ngữ tự nhiên (ví dụ: \"so sánh demand React vs Vue tháng này\") và tổng hợp insight. AI không phát minh số liệu — mọi con số đều phải có nguồn từ pipeline crawl.",
  },
  {
    q: "Dữ liệu cá nhân của tôi có an toàn không?",
    a: "Lịch sử phân tích được lưu riêng cho mỗi tài khoản với Row-Level Security. Chúng tôi không bán dữ liệu, không huấn luyện model trên hội thoại của bạn.",
  },
];

const FAQ = () => {
  return (
    <div className="container max-w-3xl py-20 md:py-28">
      <div className="mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">FAQ</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Câu hỏi thường gặp
        </h1>
        <p className="text-muted-foreground text-lg">
          Mọi thứ bạn cần biết về MarketPulse trước khi bắt đầu.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-border">
            <AccordionTrigger className="text-left font-display text-base md:text-lg font-semibold hover:no-underline hover:text-primary transition-colors py-5">
              <span className="flex gap-3 items-start">
                <span className="font-mono text-xs text-muted-foreground shrink-0 mt-1.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {f.q}
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pl-9 pb-5">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
