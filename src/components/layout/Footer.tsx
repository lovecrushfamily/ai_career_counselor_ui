import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-background mt-24">
      <div className="container py-12 grid gap-8 md:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <Activity className="h-5 w-5 text-primary" strokeWidth={2.5} />
            <span className="font-display text-lg font-bold">
              Market<span className="text-primary">Pulse</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Insight thị trường tuyển dụng có nguồn, cập nhật hàng tuần. Dành cho cố vấn nghề nghiệp.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3">Sản phẩm</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/analyze" className="hover:text-foreground transition-colors">Phân tích</Link></li>
            <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
            <li><Link to="/login" className="hover:text-foreground transition-colors">Đăng nhập</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3">Pipeline</h4>
          <ul className="space-y-2 text-sm text-muted-foreground font-mono">
            <li>↳ Crawler hàng tuần</li>
            <li>↳ Chuẩn hoá kỹ năng</li>
            <li>↳ Trích dẫn nguồn</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} MarketPulse. Dữ liệu thị trường, không phải tư vấn nghề nghiệp.</span>
          <span className="font-mono">v0.1 · MVP</span>
        </div>
      </div>
    </footer>
  );
};
