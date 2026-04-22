import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Database,
  Clock,
  Quote,
  Workflow,
  TrendingDown,
  Bot,
  Hourglass,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FAQ from "./FAQ";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] as const },
};

const Landing = () => {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-[600px] grid-pattern pointer-events-none opacity-60" />

        <div className="container relative pt-20 pb-24 md:pt-28 md:pb-32">
          <motion.div {...fadeUp} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/80 bg-card/50 backdrop-blur mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
              <span className="text-xs font-mono text-muted-foreground">
                Cập nhật gần nhất: <span className="text-foreground">Tuần này</span>
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              Thị trường tuyển dụng thay đổi <span className="text-gradient">mỗi tuần.</span>
              <br />
              Insight của bạn thì sao?
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
              AI Career Counselor tổng hợp dữ liệu công khai từ các nền tảng tuyển dụng, cung cấp{" "}
              <span className="text-foreground font-medium">insight aggregate có nguồn tham khảo</span> và{" "}
              <span className="text-foreground font-medium">cập nhật hàng tuần</span> —
              dành riêng cho cố vấn nghề nghiệp.
            </p>

            <div data-tour="hero-cta" className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-gradient-data text-primary-foreground hover:opacity-90 transition-opacity shadow-glow">
                <Link to="/login">
                  Bắt đầu phân tích <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/faq">Xem cách hoạt động</Link>
              </Button>
            </div>

            {/* Stat strip */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
              {[
                { value: "7", unit: "ngày", label: "Chu kỳ cập nhật" },
                { value: "100%", unit: "", label: "Có nguồn tham khảo" },
                { value: "4+", unit: "", label: "Nền tảng" },
                { value: "0", unit: "", label: "Gợi ý JD cá nhân" },
              ].map((s) => (
                <div key={s.label} className="border-l border-border pl-4">
                  <div className="font-display text-2xl font-bold">
                    {s.value}<span className="text-muted-foreground text-sm font-mono ml-1">{s.unit}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="container py-20 md:py-28">
        <motion.div {...fadeUp} className="max-w-2xl mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">01 — Vấn đề</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Cố vấn nghề nghiệp đang chạy đua với thị trường — bằng tay.
          </h2>
          <p className="text-muted-foreground text-lg">
            Nhu cầu kỹ năng dao động nhanh, nhưng dữ liệu để tư vấn lại đến chậm, không nguồn, hoặc đã cũ.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: Hourglass,
              title: "Thống kê thủ công mất hàng tuần",
              desc: "Mở từng nền tảng, đếm tay, ghép Excel. Xong thì thị trường đã đổi.",
            },
            {
              icon: Bot,
              title: "LLM trả lời nhanh — nhưng không nguồn",
              desc: "Con số nghe hợp lý, không ai biết đến từ đâu. Không pipeline. Không kiểm chứng.",
            },
            {
              icon: TrendingDown,
              title: "Insight cũ → tư vấn lệch",
              desc: "Một kỹ năng có thể tăng hoặc giảm 30% nhu cầu chỉ trong vài tuần. Bạn không thể đợi.",
            },
          ].map((p, i) => (
            <motion.div
              key={p.title}
              {...fadeUp}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.32, 0.72, 0, 1] as const }}
              className="group relative p-6 rounded-xl border border-border bg-card shadow-card hover:border-primary/40 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <p.icon className="h-5 w-5 text-foreground/70 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SOLUTION */}
      <section className="relative">
        <div className="absolute inset-0 bg-secondary/30" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="container relative py-20 md:py-28">
          <motion.div {...fadeUp} className="max-w-2xl mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">02 — Giải pháp</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Pipeline minh bạch. Insight aggregate. Cập nhật hàng tuần.
            </h2>
            <p className="text-muted-foreground text-lg">
              AI Career Counselor tự động tổng hợp, chuẩn hoá và phân tích dữ liệu công khai — bạn nhận insight kèm nguồn tham khảo.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: Database,
                title: "Tổng hợp dữ liệu công khai",
                desc: "Theo dõi xu hướng từ TopCV, VietnamWorks, ITviec, LinkedIn — chỉ lưu số liệu aggregate, không lưu nội dung tin tuyển dụng gốc.",
                code: "aggregate(platform, week)",
              },
              {
                icon: Clock,
                title: "Cập nhật hàng tuần",
                desc: "Mỗi tuần một snapshot mới. So sánh tuần này vs tuần trước, tháng này vs tháng trước.",
                code: "Δ react_demand = +12.4% w/w",
              },
              {
                icon: Quote,
                title: "Mỗi con số có nguồn tham khảo",
                desc: "Số liệu kèm nền tảng nguồn và thời điểm tổng hợp, giúp bạn đối chiếu khi cần.",
                code: 'source: ["topcv", "itviec"] · w16',
              },
              {
                icon: Workflow,
                title: "Pipeline minh bạch",
                desc: "Bạn biết dữ liệu được tổng hợp thế nào, lọc ra sao, theo bước nào. Không hộp đen.",
                code: "fetch → normalize → aggregate",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.32, 0.72, 0, 1] as const }}
                className="p-6 rounded-xl border border-border bg-card shadow-card"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-gradient-data flex items-center justify-center shadow-glow">
                    <f.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{f.desc}</p>
                    <code className="text-xs font-mono text-primary/80 bg-secondary/60 px-2 py-1 rounded inline-block">
                      {f.code}
                    </code>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ANTI-PITCH */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="container py-20 md:py-28">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">03 — Chúng tôi KHÔNG làm gì</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-10">
            Định vị rõ ràng để bạn không kỳ vọng nhầm.
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-left">
            <div className="p-6 rounded-xl border border-destructive/30 bg-destructive/5">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="h-5 w-5 text-destructive" />
                <span className="font-display font-semibold">Không làm</span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· Tư vấn nghề nghiệp cho từng cá nhân</li>
                <li>· Gợi ý JD cụ thể / khớp ứng viên</li>
                <li>· Hiển thị nội dung tin tuyển dụng gốc</li>
                <li>· Chấm điểm CV / so khớp hồ sơ</li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-success/30 bg-success/5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="font-display font-semibold">Có làm</span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· Tổng hợp xu hướng kỹ năng (aggregate)</li>
                <li>· Theo dõi biến động hàng tuần</li>
                <li>· Cung cấp nguồn tham khảo cho mọi số liệu</li>
                <li>· Pipeline minh bạch, có thể audit</li>
              </ul>
            </div>
          </div>

          <p className="mt-10 text-base md:text-lg text-muted-foreground italic max-w-2xl mx-auto">
            "Chúng tôi cung cấp <span className="text-foreground font-medium">insight aggregate đã được phân tích</span>
            {" "}để cố vấn nghề nghiệp ra quyết định — không thay thế quyết định đó."
          </p>
        </motion.div>
      </section>

      {/* DEMO PREVIEW */}
      <section className="relative">
        <div className="absolute inset-0 bg-secondary/20" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="container relative py-20 md:py-28">
          <motion.div {...fadeUp} className="max-w-2xl mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">04 — Xem qua</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Hỏi bằng ngôn ngữ tự nhiên. Nhận số kèm nguồn.
            </h2>
          </motion.div>

          <motion.div {...fadeUp} className="max-w-3xl rounded-2xl border border-border bg-card shadow-elevated overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/40">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
              </div>
              <span className="font-mono text-xs text-muted-foreground ml-2">ai-career-counselor / analyze</span>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground text-sm">
                  Nhu cầu React Developer tại Hà Nội tuần này thay đổi thế nào?
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-7 w-7 shrink-0 rounded-md bg-gradient-data flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm leading-relaxed">
                    Tuần 16/2026, nhu cầu React Developer tại Hà Nội ghi nhận{" "}
                    <span className="font-mono font-semibold text-foreground">~847 tin (aggregate)</span>,{" "}
                    <span className="font-mono text-success">+12.4% so với tuần trước</span>.
                    Mức lương trung vị: <span className="font-mono font-semibold">22–35tr</span>.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["topcv", "vietnamworks", "itviec"].map((s) => (
                      <span key={s} className="text-[11px] font-mono px-2 py-0.5 rounded border border-border bg-secondary/60 text-muted-foreground">
                        ↗ {s}
                      </span>
                    ))}
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-border bg-secondary/60 text-muted-foreground">
                      tổng hợp: tuần 16/2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="container py-24 md:py-32">
          <motion.div {...fadeUp} className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-secondary/40 p-10 md:p-16 text-center shadow-elevated">
            <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Sẵn sàng nắm bắt thị trường <span className="text-gradient">theo tuần?</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                Đăng ký miễn phí. Bắt đầu phân tích trong 30 giây.
              </p>
              <Button asChild size="lg" className="bg-gradient-data text-primary-foreground hover:opacity-90 transition-opacity shadow-glow">
                <Link to="/login">
                  Tạo tài khoản <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="container py-20 md:py-28">
          <FAQ />
        </div>
      </section>
    </>
  );
};

export default Landing;
