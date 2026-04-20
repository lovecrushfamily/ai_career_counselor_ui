import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Admin = email có thể gọi edge function admin-stats thành công.
 * Allowlist được cấu hình qua secret ADMIN_EMAILS phía server.
 */
export const useIsAdmin = () => {
  const { user, session, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !session) { setIsAdmin(false); return; }
    let cancelled = false;
    (async () => {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-stats`;
      try {
        const r = await fetch(url, {
          method: "OPTIONS",
        });
        // Real check: HEAD-style probe via GET; we just check status from a tiny call
        const r2 = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!cancelled) setIsAdmin(r2.status !== 401 && r2.status !== 403);
      } catch {
        if (!cancelled) setIsAdmin(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user, session, authLoading]);

  return { isAdmin, loading: authLoading || isAdmin === null };
};
