import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/**
 * Footer chỉ hiển thị trên Landing ("/").
 * Các trang còn lại dùng layout chiếm toàn bộ phần còn lại của viewport
 * (Navbar h-16 sticky → main = 100vh - 4rem). Trang con tự quản lý overflow.
 */
export const AppLayout = () => {
  const { pathname } = useLocation();
  const showFooter = pathname === "/";
  const fullBleed = !showFooter;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className={fullBleed ? "h-[calc(100vh-4rem)] overflow-hidden" : "flex-1"}>
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
};
