import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const intendedPath = `${location.pathname}${location.search}${location.hash}`;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Toast on next tick to avoid setState during render
    setTimeout(() => {
      toast.info("Đăng nhập để sử dụng phân tích", {
        description: "Tính năng này yêu cầu tài khoản. Đăng nhập miễn phí trong 30 giây.",
      });
    }, 0);
    return <Navigate to={`/login?next=${encodeURIComponent(intendedPath)}`} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
