import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const },
};

const tiers = [
  {
    name: "Free",
    price: "0₫",
    period: "mãi mãi",
    desc: "Trải nghiệm pipeline insight aggregate.",
    cta: "Bắt đầu miễn phí",
    highlight: false,
    features: [
      "10 câu hỏi phân tích / tháng",
      "Dữ liệu cập nhật hàng tuần",
      "Mọi insight đều có nguồn tham khảo",
      "Xuất kết quả dạng markdown",
    ],
  },
  {
    name: "Pro",
    price: "299k",
    period: "/ tháng",
    desc: "Cho cố vấn nghề nghiệp & researcher độc lập.",
    cta: "Nâng cấp Pro",
    highlight: true,
    features: [
      "Không giới hạn câu hỏi",
      "So sánh tuần / tháng / quý",
      "Lưu lịch sử & gắn nhãn nghiên cứu",
      "Export PDF có watermark nguồn",
      "Hỗ trợ qua email trong 24h",
    ],
  },
  {
    name: "Enterprise",
    price: "Liên hệ",
    period: "",
    desc: "Cho team HR, trường học, agency.",
    cta: "Đặt lịch demo",
    highlight: false,
    features: [
      "Quota tuỳ chỉnh & SSO",
      "Dashboard team chia sẻ",
      "API truy cập aggregate insight",
      "SLA & audit log đầy đủ",
      "Onboarding + đào tạo riêng",
    ],
  },
];

const Pricing = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Glow backdrop */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div className="glow-orb -top-32 -left-20 h-96 w-96 bg-primary/30" />
      <div className="glow-orb top-40 right-0 h-80 w-80 bg-primary-glow/25" />

      <section className="container relative pt-20 pb-12 md:pt-28">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/80 bg-card/60 backdrop-blur mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-mono text-muted-foreground">Pricing đơn giản · Không ràng buộc</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-5">
            Chọn gói phù hợp với <span className="text-gradient">cách bạn làm việc.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Bắt đầu miễn phí. Nâng cấp khi cần phân tích sâu hơn. Huỷ bất cứ lúc nào.
          </p>
        </motion.div>
      </section>

      <section className="container relative pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.32, 0.72, 0, 1] as const }}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                t.highlight
                  ? "border-primary/50 bg-card shadow-elevated ring-1 ring-primary/20"
                  : "border-border bg-card/80 backdrop-blur shadow-card"
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-gradient-data text-primary-foreground text-[11px] font-mono shadow-glow">
                  Phổ biến nhất
                </div>
              )}
              <h3 className="font-display text-xl font-bold">{t.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.period}</span>
              </div>

              <Button
                asChild
                size="lg"
                className={`mt-6 ${
                  t.highlight
                    ? "bg-gradient-data text-primary-foreground hover:shadow-glow transition-all"
                    : ""
                }`}
                variant={t.highlight ? "default" : "outline"}
              >
                <Link to="/login">
                  {t.cta} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>

              <ul className="mt-8 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp} className="mt-16 max-w-2xl mx-auto text-center text-sm text-muted-foreground">
          Mọi gói đều giữ nguyên cam kết minh bạch: chỉ tổng hợp dữ liệu công khai, không lưu nội dung tin tuyển dụng gốc, mọi
          con số đều có nguồn tham khảo.
        </motion.div>
      </section>
    </div>
  );
};

export default Pricing;