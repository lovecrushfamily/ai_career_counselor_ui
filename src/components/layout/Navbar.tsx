import { Link, NavLink, useNavigate } from "react-router-dom";
import { Activity, Sun, Moon, LogOut, User as UserIcon, ShieldCheck } from "lucide-react";
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

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Activity className="h-5 w-5 text-primary" strokeWidth={2.5} />
            <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            AI <span className="text-primary">Career Counselor</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/analyze" data-tour="nav-analyze" className={navLinkClass}>Phân tích</NavLink>
          <NavLink to="/guide" className={navLinkClass}>Hướng dẫn</NavLink>
          <NavLink to="/faq" data-tour="nav-faq" className={navLinkClass}>FAQ</NavLink>
          {user && <NavLink to="/profile" className={navLinkClass}>Hồ sơ</NavLink>}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Admin
              </span>
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Chuyển giao diện">
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
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Đăng nhập</Button>
              <Button size="sm" onClick={() => navigate("/login")} className="bg-gradient-data text-primary-foreground hover:opacity-90 transition-opacity">
                Bắt đầu
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
