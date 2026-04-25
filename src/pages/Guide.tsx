import { Link } from "react-router-dom";
import { ArrowRight, Play, Search, MessageSquare, BarChart3, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { restartTour } from "@/components/Walkthrough";

/**
 * Trang /guide — walkthrough tĩnh + nút khởi động lại tour tương tác.
 * Dành cho user muốn xem lại hướng dẫn bất cứ lúc nào.
 */
const steps = [
  {
    icon: Sparkles,
    title: "1. Đăng nhập",
    desc: "Bấm 'Bắt đầu' ở Navbar → đăng nhập bằng Google hoặc email. Tài khoản của bạn được dùng để lưu lịch sử chat.",
  },
  {
    icon: MessageSquare,
    title: "2. Mở trang Phân tích",
    desc: "Vào /analyze. Có 2 tab: Chatbot Agent (chat + cited sources) và Market Dashboard (line chart + KPI + export PDF).",
  },
  {
    icon: Search,
    title: "3. Đặt câu hỏi cụ thể",
    desc: "Ví dụ: 'Kỹ năng nào đang hot cho Data Engineer 2026?', 'So sánh mức lương BA vs PM ở TPHCM', 'Lộ trình chuyển từ QA sang DevOps'. AI trả lời dựa trên dữ liệu aggregate hàng tuần.",
  },
  {
    icon: BarChart3,
    title: "4. Theo dõi xu hướng",
    desc: "Widget Live Market Data hiển thị top kỹ năng & mức tăng tuần. Số liệu là tổng hợp — không có JD gốc, đảm bảo an toàn pháp lý.",
  },
  {
    icon: Shield,
    title: "5. Phản hồi để cải thiện",
    desc: "Đánh giá 👍/👎 mỗi câu trả lời. Phản hồi của bạn vào data flywheel giúp model trả lời chính xác hơn theo thời gian.",
  },
];

export default function Guide() {
  return (
    <div className="container max-w-4xl py-12 md:py-16">
      <div className="mb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">
          Hướng dẫn sử dụng
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Bắt đầu trong 5 phút
        </h1>
        <p className="text-muted-foreground text-lg">
          Mọi điều bạn cần biết để khai thác AI Career Advisor Assistant hiệu quả nhất.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => restartTour("/")} className="gap-2">
            <Play className="h-4 w-4" /> Chạy tour tương tác
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/analyze">
              Vào trang Phân tích <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {steps.map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="p-6 flex gap-4 items-start hover:shadow-card transition-shadow">
            <div className="shrink-0 h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold mb-1">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-6 bg-mesh">
        <h3 className="font-display text-lg font-semibold mb-2">💡 Mẹo nâng cao</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Chat dài → phiên cũ vẫn hiển thị bên sidebar, có thể đổi tên / xoá.</li>
          <li>• Hỏi follow-up trong cùng phiên để giữ ngữ cảnh.</li>
          <li>• Trang FAQ có sẵn câu trả lời cho nguồn dữ liệu, độ tin cậy & quyền riêng tư.</li>
          <li>• Theme sáng/tối: bấm icon 🌙/☀️ ở Navbar.</li>
        </ul>
      </Card>
    </div>
  );
}
