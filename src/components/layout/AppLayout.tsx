import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/**
 * - Footer chỉ hiện trên Landing ("/").
 * - /analyze, /admin, /login: full-screen, không cho page scroll
 *   → main = (100vh - 4rem), trang tự quản lý overflow nội bộ.
 * - Các trang khác (faq, profile, 404...): layout thường, scroll cả page bình thường.
 */
const FULL_SCREEN_ROUTES = ["/analyze", "/admin", "/login"];

export const AppLayout = () => {
  const { pathname } = useLocation();
  const showFooter = pathname === "/";
  const fullScreen = FULL_SCREEN_ROUTES.includes(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className={fullScreen ? "h-[calc(100vh-4rem)] overflow-hidden" : "flex-1"}>
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
};
