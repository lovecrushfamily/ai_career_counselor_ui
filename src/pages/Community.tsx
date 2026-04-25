import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageSquare, Globe2, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const },
};

const stats = [
  {
    icon: MessageSquare,
    value: "2.4K",
    label: "Thành viên Discord",
    cta: "Tham gia Discord",
    href: "#",
  },
  {
    icon: Globe2,
    value: "12",
    label: "Tỉnh thành đang phân tích",
    cta: "Xem khu vực",
    href: "#",
  },
  {
    icon: Calendar,
    value: "48+",
    label: "Bản tin tuần đã phát hành",
    cta: "Đọc bản tin",
    href: "#",
  },
];

const voices = [
  {
    name: "Linh",
    role: "Career Coach · Hà Nội",
    quote:
      "Trước đây mình mất 2 tiếng mỗi tuần để tổng hợp xu hướng. Giờ chỉ cần hỏi và nhận insight kèm nguồn — tiết kiệm thời gian thật sự.",
  },
  {
    name: "Quân",
    role: "Talent Lead · TP.HCM",
    quote:
      "Mình thích nhất chỗ minh bạch nguồn. Khi báo cáo cho leadership, mọi con số đều dẫn được về nền tảng nguồn — không bị hỏi 'số này từ đâu?'.",
  },
  {
    name: "Mai",
    role: "Researcher độc lập",
    quote:
      "Pipeline rõ ràng và aggregate-only đúng tinh thần research. Đây là tool đầu tiên mình dám reference trong báo cáo công khai.",
  },
];

const faqs = [
  {
    q: "AI Career Advisor Assistant khác gì so với hỏi ChatGPT về thị trường tuyển dụng?",
    a: "ChatGPT trả lời dựa trên dữ liệu huấn luyện — bạn không biết con số đến từ đâu, lúc nào, và liệu có còn đúng. AI Career Advisor Assistant tổng hợp dữ liệu công khai từ các nền tảng tuyển dụng mỗi tuần, mỗi con số đều kèm nguồn tham khảo và thời điểm cập nhật để bạn có thể đối chiếu.",
  },
  {
    q: "Dữ liệu được tổng hợp từ đâu?",
    a: "MVP tham chiếu các nguồn công khai như TopCV, VietnamWorks, ITviec, LinkedIn. Chúng tôi chỉ lưu số liệu aggregate (tổng/đếm/biến động theo kỹ năng, theo tuần) — không lưu trữ và không hiển thị nội dung tin tuyển dụng gốc.",
  },
  {
    q: "Tần suất cập nhật như thế nào?",
    a: "Pipeline chạy hàng tuần (mỗi Chủ Nhật). Bạn luôn thấy snapshot tuần gần nhất, đồng thời so sánh được với 4–12 tuần trước.",
  },
  {
    q: "AI Career Advisor Assistant có gợi ý JD cụ thể cho cá nhân không?",
    a: "Không. Chúng tôi cố ý không làm việc đó. Sản phẩm cung cấp insight aggregate cho cố vấn nghề nghiệp — quyết định tư vấn cá nhân vẫn thuộc về con người.",
  },
  {
    q: "Tôi có thể trích dẫn số liệu trong báo cáo không?",
    a: "Có. Mỗi câu trả lời đều ghi rõ nền tảng nguồn và tuần tổng hợp. Bạn có thể đưa vào báo cáo / slide như một tài liệu tham khảo.",
  },
  {
    q: "Tại sao không phải real-time mà là hàng tuần?",
    a: "Cập nhật real-time vừa tốn kém vừa gây nhiễu (tin tuyển dụng được đăng/gỡ liên tục). Chu kỳ tuần đủ nhanh để bắt biến động kỹ năng, đủ ổn định để số liệu có ý nghĩa thống kê.",
  },
  {
    q: "Lovable AI dùng để làm gì trong sản phẩm?",
    a: "AI giúp bạn truy vấn dataset aggregate bằng ngôn ngữ tự nhiên và tổng hợp insight. AI không phát minh số liệu — mọi con số đều phải có nguồn từ pipeline tổng hợp của chúng tôi.",
  },
  {
    q: "Dữ liệu cá nhân của tôi có an toàn không?",
    a: "Lịch sử phân tích được lưu riêng cho mỗi tài khoản với Row-Level Security. Chúng tôi không bán dữ liệu, không huấn luyện model trên hội thoại của bạn.",
  },
];

const Community = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div className="glow-orb -top-20 right-10 h-96 w-96 bg-primary/25" />

      {/* HERO */}
      <section className="container relative pt-20 pb-16 md:pt-28">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/80 bg-card/60 backdrop-blur mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-mono text-muted-foreground">Community · Cố vấn nghề nghiệp Việt Nam</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-5">
            Cùng nhau hiểu thị trường <span className="text-gradient">tốt hơn.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Một cộng đồng cố vấn, recruiter, researcher chia sẻ cách dùng dữ liệu để tư vấn nghề nghiệp có trách nhiệm.
          </p>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="container relative pb-20">
        <div className="grid md:grid-cols-3 gap-5">
          {stats.map((s, i) => (
            <motion.a
              href={s.href}
              key={s.label}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.32, 0.72, 0, 1] as const }}
              className="group relative p-7 rounded-2xl border border-border bg-card/80 backdrop-blur shadow-card hover:border-primary/40 hover:shadow-elevated transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-secondary group-hover:bg-primary/10 flex items-center justify-center mb-5 transition-colors">
                <s.icon className="h-5 w-5 text-foreground/70 group-hover:text-primary transition-colors" />
              </div>
              <div className="font-display text-4xl font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-80 group-hover:opacity-100">
                {s.cta} <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* VOICES */}
      <section className="relative bg-secondary/20">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-16 bg-gradient-to-b from-border/18 via-primary/5 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute inset-x-10 bottom-0 h-16 bg-gradient-to-t from-border/14 via-primary/5 to-transparent blur-2xl" />
        <div className="container py-20 md:py-24">
          <motion.div {...fadeUp} className="max-w-2xl mb-12 text-center mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">Voices</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Người thật, dùng thật, nói thật.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {voices.map((v, i) => (
              <motion.div
                key={v.name}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.32, 0.72, 0, 1] as const }}
                className="p-7 rounded-2xl border border-border bg-card shadow-card"
              >
                <p className="text-sm leading-relaxed text-foreground/85 mb-6">"{v.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-data flex items-center justify-center text-primary-foreground font-display text-sm font-bold">
                    {v.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{v.name}</div>
                    <div className="text-xs text-muted-foreground">{v.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        {/* FAQ */}
      </section>

      <section className="container relative pb-8">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">FAQ</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Câu hỏi thường gặp
            </h2>
            <p className="text-muted-foreground">
              Mọi thứ bạn cần biết trước khi bắt đầu.
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
        </motion.div>
      </section>

      <section className="container py-20">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-secondary/40 p-10 md:p-14 text-center shadow-elevated"
        >
          <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Sẵn sàng tham gia cộng đồng?
            </h2>
            <p className="text-muted-foreground mb-7 max-w-lg mx-auto">
              Tạo tài khoản miễn phí để nhận bản tin tuần và truy cập kênh Discord nội bộ.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-data text-primary-foreground hover:shadow-glow transition-all"
            >
              <Link to="/login">
                Tham gia ngay <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
});
Community.displayName = "Community";

export default Community;
