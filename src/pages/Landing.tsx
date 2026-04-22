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