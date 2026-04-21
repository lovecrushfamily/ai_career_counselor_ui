/**
 * Runtime environment detection.
 *
 * App có thể chạy ở 3 nơi:
 *  - Lovable preview     (id-preview--*.lovable.app)
 *  - Lovable published   (*.lovable.app, custom domain qua Lovable)
 *  - Local dev / OSS     (localhost, 127.0.0.1, IP nội bộ)
 *
 * Dùng để bật tắt feature theo môi trường (vd: walkthrough banner local,
 * disable analytics khi dev, hiện badge "DEV"...).
 */

export type Runtime = "lovable-preview" | "lovable-published" | "local" | "custom";

export interface EnvInfo {
  runtime: Runtime;
  isLovable: boolean;
  isLocal: boolean;
  isProduction: boolean;
  hostname: string;
  supabaseUrl: string;
}

const detectRuntime = (hostname: string): Runtime => {
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.") || hostname.endsWith(".local")) {
    return "local";
  }
  if (hostname.includes("id-preview--") && hostname.endsWith(".lovable.app")) {
    return "lovable-preview";
  }
  if (hostname.endsWith(".lovable.app")) {
    return "lovable-published";
  }
  return "custom";
};

export const getEnv = (): EnvInfo => {
  const hostname = typeof window !== "undefined" ? window.location.hostname : "ssr";
  const runtime = detectRuntime(hostname);
  return {
    runtime,
    isLovable: runtime === "lovable-preview" || runtime === "lovable-published",
    isLocal: runtime === "local",
    isProduction: runtime === "lovable-published" || runtime === "custom",
    hostname,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? "",
  };
};

/**
 * Log môi trường ra console một lần lúc app khởi động.
 * Giúp dev thấy ngay app đang chạy ở đâu, kết nối tới backend nào.
 */
let logged = false;
export const logRuntimeOnce = () => {
  if (logged || typeof window === "undefined") return;
  logged = true;
  const env = getEnv();
  const tag =
    env.runtime === "local"
      ? "%c[LOCAL DEV]"
      : env.runtime === "lovable-preview"
      ? "%c[LOVABLE PREVIEW]"
      : env.runtime === "lovable-published"
      ? "%c[LOVABLE PRODUCTION]"
      : "%c[CUSTOM HOST]";
  const style =
    env.runtime === "local"
      ? "background:#fbbf24;color:#000;padding:2px 6px;border-radius:3px;font-weight:bold"
      : env.runtime === "lovable-preview"
      ? "background:#3b82f6;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold"
      : "background:#10b981;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold";
  // eslint-disable-next-line no-console
  console.log(
    `${tag} AI Career Counselor`,
    style,
    `\n  host:    ${env.hostname}\n  backend: ${env.supabaseUrl || "(unset)"}\n  mode:    ${import.meta.env.MODE}`
  );
};
