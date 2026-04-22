import { Activity, Github, Twitter, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="relative bg-background mt-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-16 bg-gradient-to-b from-primary/10 via-border/10 to-transparent blur-3xl opacity-90" />
      <div className="container py-14 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-data flex items-center justify-center shadow-glow">
              <Activity className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display text-base font-bold">
              AI<span className="text-primary"> Career</span> Counselor
            </span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Tổng hợp insight thị trường tuyển dụng cập nhật hàng tuần. Dành cho cố vấn nghề nghiệp, recruiter và researcher.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {[
              { icon: Github, href: "#" },
              { icon: Twitter, href: "#" },
              { icon: MessageSquare, href: "#" },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="h-8 w-8 rounded-lg border border-border bg-card hover:border-primary/50 hover:text-primary text-muted-foreground flex items-center justify-center transition-colors"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3">Product</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
            <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
            <li><Link to="/guide" className="hover:text-foreground transition-colors">Hướng dẫn</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/community" className="hover:text-foreground transition-colors">Community</Link></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Bản tin tuần</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Liên hệ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3">Pipeline</h4>
          <ul className="space-y-2.5 text-xs text-muted-foreground font-mono">
            <li>↳ Tổng hợp dữ liệu công khai</li>
            <li>↳ Chuẩn hoá kỹ năng</li>
            <li>↳ Aggregate insight</li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="soft-divider" />
      </div>
      <div>
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} AI Career Counselor. Insight thị trường, không phải tư vấn nghề nghiệp cá nhân.</span>
          <span className="font-mono">v0.1 · MVP</span>
        </div>
      </div>
    </footer>
  );
};
