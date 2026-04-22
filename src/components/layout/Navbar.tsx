import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Activity,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Users2,
  Building2,
  LineChart,
  GraduationCap,
  Briefcase,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useState } from "react";

const SOLUTIONS = [
  { icon: Users2, title: "Cố vấn nghề nghiệp", desc: "Insight aggregate theo tuần.", to: "/" },
  { icon: GraduationCap, title: "Trường & Đại học", desc: "Định hướng dựa trên dữ liệu.", to: "/" },
  { icon: Building2, title: "HR & Talent team", desc: "So sánh xu hướng kỹ năng.", to: "/" },
  { icon: Briefcase, title: "Recruiter", desc: "Theo dõi biến động nhu cầu.", to: "/" },
  { icon: LineChart, title: "Researcher", desc: "Số liệu có nguồn tham khảo.", to: "/" },
  { icon: Sparkles, title: "Cá nhân", desc: "Hiểu thị trường trước khi học.", to: "/" },
];

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const linkBase = "nav-underline text-sm font-medium transition-colors";
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${linkBase} ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`;

  const isSolutionsActive = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center">
        {/* Logo - left */}
        <Link to="/" className="flex items-center gap-2.5 group mr-12">
          <div className="relative h-8 w-8 rounded-lg bg-gradient-data flex items-center justify-center shadow-glow">
            <Activity className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent border-2 border-background animate-pulse-dot" />
          </div>
          <span className="font-display text-base font-bold tracking-tight">
            AI<span className="text-primary"> Career</span> Counselor
          </span>
        </Link>

        {/* Nav - left aligned */}
        <nav className="hidden md:flex items-center gap-8 flex-1">
          {/* Solutions dropdown */}
          <HoverCard openDelay={80} closeDelay={120}>
            <HoverCardTrigger asChild>
              <button
                className={`${linkBase} inline-flex items-center gap-1 ${
                  isSolutionsActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Solutions <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent
              align="start"
              sideOffset={18}
              className="w-[560px] p-0 border-border/60 bg-background/95 backdrop-blur-xl shadow-elevated rounded-2xl overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-1 p-3">
                {SOLUTIONS.map((s) => (
                  <Link
                    key={s.title}
                    to={s.to}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/70 transition-colors group"
                  >
                    <div className="h-9 w-9 shrink-0 rounded-lg bg-secondary group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                      <s.icon className="h-4 w-4 text-foreground/70 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold leading-tight">{s.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="border-t border-border/60 px-4 py-3 flex items-center justify-between bg-secondary/30">
                <span className="text-xs text-muted-foreground">Mỗi insight đều có nguồn tham khảo.</span>
                <Link to="/faq" className="text-xs font-semibold text-primary hover:underline">
                  Cách hoạt động →
                </Link>
              </div>
            </HoverCardContent>
          </HoverCard>

          <NavLink to="/pricing" className={navLinkClass}>Pricing</NavLink>
          <NavLink to="/community" className={navLinkClass}>Community</NavLink>
          <NavLink to="/faq" data-tour="nav-faq" className={navLinkClass}>FAQ</NavLink>
          {user && (
            <NavLink to="/analyze" data-tour="nav-analyze" className={navLinkClass}>
              Phân tích
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Admin
              </span>
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Chuyển giao diện" className="hidden sm:inline-flex">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline truncate max-w-[120px]">
                    {user.email?.split("@")[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/analyze")}>
                  <Sparkles className="mr-2 h-4 w-4" /> Phân tích
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserIcon className="mr-2 h-4 w-4" /> Hồ sơ
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="hidden sm:inline-flex">
                Log in
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/login")}
                className="bg-gradient-data text-primary-foreground hover:shadow-glow hover:opacity-95 transition-all"
              >
                Get started
              </Button>
            </>
          )}

          {/* Mobile menu trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl">
          <nav className="container py-4 flex flex-col gap-1">
            {[
              { to: "/", label: "Trang chủ" },
              { to: "/pricing", label: "Pricing" },
              { to: "/community", label: "Community" },
              { to: "/faq", label: "FAQ" },
              ...(user ? [{ to: "/analyze", label: "Phân tích" }] : []),
              ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
            ].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
