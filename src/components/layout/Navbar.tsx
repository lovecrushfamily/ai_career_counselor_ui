import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
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
import { LanguageToggle } from "@/components/LanguageToggle";
import { RobotLogo } from "@/components/brand/RobotLogo";
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

export const Navbar = () => {
  const { t } = useTranslation();
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

  const SOLUTIONS = [
    { icon: Users2, title: t("nav.solutions"), desc: "Insight aggregate", to: "/" },
    { icon: GraduationCap, title: "Schools", desc: "Data-driven guidance", to: "/" },
    { icon: Building2, title: "HR & Talent", desc: "Skill trend benchmarks", to: "/" },
    { icon: Briefcase, title: "Recruiter", desc: "Demand shifts tracking", to: "/" },
    { icon: LineChart, title: "Researcher", desc: "Cited aggregate data", to: "/" },
    { icon: Sparkles, title: "Individual", desc: "Understand before learning", to: "/" },
  ];

  return (
    <header className="glass-surface-strong sticky top-0 z-50 isolate w-full rounded-none border-x-0 border-t-0">
      <div className="pointer-events-none absolute inset-x-6 bottom-0 h-10 bg-gradient-to-b from-border/20 via-primary/5 to-transparent blur-2xl opacity-90" />
      <div className="container relative flex h-16 items-center">
        {/* Logo - left */}
        <Link to="/" className="flex items-center gap-2.5 group mr-12">
          <RobotLogo />
          <span className="font-display text-base font-bold tracking-tight whitespace-nowrap">
            AI<span className="text-primary"> Career</span> Advisor
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
              className="glass-surface w-[560px] rounded-[1.5rem] p-0 shadow-elevated overflow-hidden"
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
              <div className="px-4 pt-1">
                <div className="soft-divider" />
              </div>
              <div className="px-4 py-3 flex items-center justify-between bg-secondary/20 backdrop-blur-sm">
                <span className="text-xs text-muted-foreground">Mỗi insight đều có nguồn tham khảo.</span>
                <Link to="/faq" className="text-xs font-semibold text-primary hover:underline">
                  Cách hoạt động →
                </Link>
              </div>
            </HoverCardContent>
          </HoverCard>

          <NavLink to="/pricing" className={navLinkClass}>{t("nav.pricing")}</NavLink>
          <NavLink to="/community" className={navLinkClass}>{t("nav.community")}</NavLink>
          {user && (
            <NavLink to="/analyze" data-tour="nav-analyze" className={navLinkClass}>
              {t("nav.analyze")}
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> {t("nav.admin")}
              </span>
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
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
                  <Sparkles className="mr-2 h-4 w-4" /> {t("nav.analyze")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserIcon className="mr-2 h-4 w-4" /> {t("nav.profile")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> {t("nav.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="hidden sm:inline-flex">
                {t("nav.login")}
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/login")}
                className="bg-gradient-data text-primary-foreground hover:shadow-glow hover:opacity-95 transition-all"
              >
                {t("nav.getStarted")}
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
        <div className="md:hidden bg-background/70 backdrop-blur-2xl">
          <div className="container pt-1">
            <div className="soft-divider" />
          </div>
          <nav className="container py-4 flex flex-col gap-1">
            {[
              { to: "/", label: t("nav.home") },
              { to: "/pricing", label: t("nav.pricing") },
              { to: "/community", label: t("nav.community") },
              ...(user ? [{ to: "/analyze", label: t("nav.analyze") }] : []),
              ...(isAdmin ? [{ to: "/admin", label: t("nav.admin") }] : []),
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
