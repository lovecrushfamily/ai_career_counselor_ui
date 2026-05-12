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
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
              AI Career Advisor Assistant tổng hợp dữ liệu công khai từ các nền tảng tuyển dụng, cung cấp{" "}
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
        <div className="pointer-events-none absolute inset-x-10 top-0 h-16 bg-gradient-to-b from-border/18 via-primary/5 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute inset-x-10 bottom-0 h-16 bg-gradient-to-t from-border/14 via-primary/5 to-transparent blur-2xl" />
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
        </div>
      </section>

      {/* SOLUTION */}
      <section className="relative">
        <div className="absolute inset-0 bg-secondary/30" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-16 bg-gradient-to-b from-border/18 via-primary/5 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute inset-x-10 bottom-0 h-16 bg-gradient-to-t from-border/14 via-primary/5 to-transparent blur-2xl" />
        <div className="container relative py-20 md:py-28">
          <motion.div {...fadeUp} className="max-w-2xl mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">02 — Giải pháp</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Pipeline minh bạch. Insight aggregate. Cập nhật hàng tuần.
            </h2>
            <p className="text-muted-foreground text-lg">
              AI Career Advisor Assistant tự động tổng hợp, chuẩn hoá và phân tích dữ liệu công khai — bạn nhận insight kèm nguồn tham khảo.
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
        <div className="pointer-events-none absolute inset-x-10 top-0 h-16 bg-gradient-to-b from-border/18 via-accent/5 to-transparent blur-2xl" />
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
        </div>
      </section>

      {/* WEEKLY CRAWL & CITATIONS */}
      <section className="relative">
        <div className="absolute inset-0 bg-secondary/20" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-16 bg-gradient-to-b from-border/18 via-primary/5 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute inset-x-10 bottom-0 h-16 bg-gradient-to-t from-border/14 via-primary/5 to-transparent blur-2xl" />
        <div className="container relative py-20 md:py-28">
          <motion.div {...fadeUp} className="max-w-2xl mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">04 — Pipeline minh bạch</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Crawl hàng tuần. Mọi con số đều có <span className="text-gradient">nguồn tham khảo.</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Pipeline tổng hợp dữ liệu công khai từ thị trường tuyển dụng Việt Nam, chạy theo lịch cố định và đính kèm trích dẫn nguồn cho từng insight aggregate.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Weekly crawl card */}
            <motion.div {...fadeUp} className="rounded-2xl border border-border/40 bg-card/80 backdrop-blur-xl p-6 md:p-8 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-lg bg-gradient-data flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-display font-semibold">Chu kỳ crawl hàng tuần</span>
                <span className="ml-auto inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-success/30 bg-success/10 text-[11px] font-mono text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
                  Live
                </span>
              </div>

              <ul className="space-y-3 text-sm">
                {[
                  { label: "Quét nguồn", val: "Thứ Hai · 02:00 ICT", note: "TopCV · VietnamWorks · ITviec · LinkedIn VN · Glints" },
                  { label: "Chuẩn hoá & dedup", val: "~2–4 giờ", note: "Loại trùng JD, chuẩn hoá kỹ năng & chức danh" },
                  { label: "Tổng hợp aggregate", val: "Thứ Hai · 08:00 ICT", note: "Counts, deltas, share — không lưu JD gốc" },
                  { label: "Phát hành", val: "Thứ Hai · 09:00 ICT", note: "Cập nhật dashboard & chatbot toàn hệ thống" },
                ].map((step, i) => (
                  <li key={step.label} className="flex gap-3">
                    <span className="font-mono text-xs text-muted-foreground shrink-0 w-5 pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-medium">{step.label}</span>
                        <span className="font-mono text-xs text-primary">{step.val}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{step.note}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>Lần phát hành gần nhất</span>
                <span className="text-foreground">Tuần 19/2026 · 09:04 ICT</span>
              </div>
            </motion.div>

            {/* Source citations card */}
            <motion.div {...fadeUp} className="rounded-2xl border border-border/40 bg-card/80 backdrop-blur-xl p-6 md:p-8 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
                  <Quote className="h-4 w-4 text-accent" />
                </div>
                <span className="font-display font-semibold">Trích dẫn nguồn</span>
                <span className="ml-auto text-[11px] font-mono text-muted-foreground">100% có nguồn</span>
              </div>

              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Mỗi câu trả lời đính kèm danh sách nền tảng + tuần tổng hợp. Không URL JD cụ thể, không trích nguyên văn mô tả công việc.
              </p>

              {/* Sample citation */}
              <div className="rounded-xl border border-border/50 bg-secondary/25 p-4">
                <p className="text-sm leading-relaxed mb-3">
                  Nhu cầu <span className="font-mono font-semibold text-foreground">React Developer</span> tại Hà Nội tuần này:{" "}
                  <span className="font-mono font-semibold">~847 tin</span>{" "}
                  <span className="font-mono text-success">(+12.4%)</span>.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { src: "topcv", n: 312 },
                    { src: "vietnamworks", n: 224 },
                    { src: "itviec", n: 186 },
                    { src: "linkedin-vn", n: 125 },
                  ].map((s) => (
                    <span key={s.src} className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded border border-border bg-card text-muted-foreground">
                      <Database className="h-3 w-3 text-primary" />
                      {s.src}
                      <span className="text-foreground">· {s.n}</span>
                    </span>
                  ))}
                  <span className="inline-flex items-center text-[11px] font-mono px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary">
                    tổng hợp · tuần 19/2026
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border border-border/40 bg-secondary/15 p-3">
                  <div className="font-display text-lg font-bold">5</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Nền tảng nguồn</div>
                </div>
                <div className="rounded-lg border border-border/40 bg-secondary/15 p-3">
                  <div className="font-display text-lg font-bold">~38k</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">JD aggregate / tuần</div>
                </div>
                <div className="rounded-lg border border-border/40 bg-secondary/15 p-3">
                  <div className="font-display text-lg font-bold">0</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">JD gốc lưu trữ</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-16 bg-gradient-to-b from-border/18 via-primary/5 to-transparent blur-2xl" />
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
    </>
  );
};

export default Landing;
