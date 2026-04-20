import { Navigate } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading } = useIsAdmin();

  if (authLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!isAdmin) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="max-w-md text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="font-display text-xl font-bold">Không có quyền truy cập</h2>
          <p className="text-sm text-muted-foreground">
            Trang <code className="font-mono">/admin</code> chỉ dành cho email nằm trong allowlist
            <code className="font-mono"> ADMIN_EMAILS</code>. Liên hệ chủ dự án để được cấp quyền.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
