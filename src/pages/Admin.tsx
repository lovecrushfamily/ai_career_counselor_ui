import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Activity, AlertTriangle, CheckCircle2, Loader2, MessageSquare, RefreshCw,
  ThumbsDown, ThumbsUp, Timer, TrendingUp, Users, Zap,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

interface Stats {
  generated_at: string;
  totals: {
    users: number; sessions: number; messages: number; feedback: number;
    requests_7d: number; requests_24h: number; errors_24h: number;
    rate_limit_24h: number; out_of_credits_24h: number;
  };
  latency_ms: { p50: number; p95: number; p99: number };
  error_rate_7d: number;
  status_distribution: Record<string, number>;
  model_distribution: Record<string, number>;
  per_day: { date: string; ok: number; err: number; tokens: number }[];
  top_users: { user_id: string; email: string | null; requests: number }[];
  feedback: {
    total_7d: number; positives: number; negatives: number; satisfaction: number | null;
    recent_comments: { rating: number; comment: string | null; created_at: string }[];
  };
  recent_errors: { created_at: string; status: number; error: string | null; latency_ms: number }[];
}

const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--destructive))", "hsl(var(--muted-foreground))"];

const Admin = () => {
  const { session } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    if (!session) return;
    setLoading(true); setErr(null);
    try {
      const r = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-stats`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!r.ok) throw new Error(`${r.status}`);
      const data = (await r.json()) as Stats;
      setStats(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "lỗi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [session]);

  if (loading && !stats) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (err) {
    return <div className="container py-10 text-sm text-destructive">Lỗi tải dashboard: {err}</div>;
  }
  if (!stats) return null;

  const statusData = Object.entries(stats.status_distribution).map(([k, v]) => ({ name: k, value: v }));
  const modelData = Object.entries(stats.model_distribution).map(([k, v]) => ({ name: k.split("/").pop()!, value: v }));

  return (
    <div className="h-full overflow-y-auto">
      <div className="container py-6 md:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              Admin · Observability
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Theo dõi hệ thống AI Career Advisor Assistant · cập nhật {new Date(stats.generated_at).toLocaleString("vi-VN")}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Làm mới
          </Button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Kpi icon={<Users className="h-4 w-4" />} label="Người dùng" value={stats.totals.users} />
          <Kpi icon={<MessageSquare className="h-4 w-4" />} label="Phiên chat" value={stats.totals.sessions} />
          <Kpi icon={<Zap className="h-4 w-4" />} label="Request 24h" value={stats.totals.requests_24h} />
          <Kpi
            icon={<AlertTriangle className="h-4 w-4" />}
            label="Lỗi 24h"
            value={stats.totals.errors_24h}
            tone={stats.totals.errors_24h > 0 ? "danger" : "ok"}
          />
          <Kpi icon={<Timer className="h-4 w-4" />} label="Latency p50" value={`${stats.latency_ms.p50} ms`} />
          <Kpi icon={<Timer className="h-4 w-4" />} label="Latency p95" value={`${stats.latency_ms.p95} ms`} />
          <Kpi
            icon={<TrendingUp className="h-4 w-4" />}
            label="Error rate 7d"
            value={`${(stats.error_rate_7d * 100).toFixed(2)}%`}
            tone={stats.error_rate_7d > 0.05 ? "danger" : "ok"}
          />
          <Kpi
            icon={<ThumbsUp className="h-4 w-4" />}
            label="CSAT 7d"
            value={stats.feedback.satisfaction === null ? "—" : `${(stats.feedback.satisfaction * 100).toFixed(0)}%`}
          />
        </div>

        <Tabs defaultValue="usage" className="space-y-4">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="cost">AI cost</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
          </TabsList>

          {/* USAGE */}
          <TabsContent value="usage" className="space-y-4">
            <Card title="Requests / ngày (7 ngày)">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.per_day}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="ok" stackId="a" fill="hsl(var(--primary))" name="OK" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="err" stackId="a" fill="hsl(var(--destructive))" name="Lỗi" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <div className="grid md:grid-cols-2 gap-4">
              <Card title="Phân bố model">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={modelData} dataKey="value" nameKey="name" outerRadius={80} label>
                      {modelData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
              <Card title="Phân bố HTTP status">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* PERFORMANCE */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Kpi icon={<Timer className="h-4 w-4" />} label="p50" value={`${stats.latency_ms.p50} ms`} />
              <Kpi icon={<Timer className="h-4 w-4" />} label="p95" value={`${stats.latency_ms.p95} ms`} />
              <Kpi icon={<Timer className="h-4 w-4" />} label="p99" value={`${stats.latency_ms.p99} ms`} />
            </div>
            <Card title="Request 7 ngày (line)">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={stats.per_day}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="ok" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="OK" />
                  <Line type="monotone" dataKey="err" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} name="Lỗi" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* COST */}
          <TabsContent value="cost" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Kpi icon={<Zap className="h-4 w-4" />} label="Rate-limit (429) 24h" value={stats.totals.rate_limit_24h} tone={stats.totals.rate_limit_24h > 0 ? "warn" : "ok"} />
              <Kpi icon={<AlertTriangle className="h-4 w-4" />} label="Out-of-credits (402) 24h" value={stats.totals.out_of_credits_24h} tone={stats.totals.out_of_credits_24h > 0 ? "danger" : "ok"} />
              <Kpi icon={<Activity className="h-4 w-4" />} label="Tổng request 7d" value={stats.totals.requests_7d} />
            </div>
            <Card title="Tokens / ngày (ước lượng)">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.per_day}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="tokens" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* USERS */}
          <TabsContent value="users">
            <Card title="Top users theo lượng request (7d)">
              <div className="divide-y divide-border">
                {stats.top_users.length === 0 && (
                  <p className="text-sm text-muted-foreground p-2">Chưa có dữ liệu.</p>
                )}
                {stats.top_users.map((u, i) => (
                  <div key={u.user_id} className="flex items-center justify-between py-2.5 text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs text-muted-foreground w-6">{i + 1}</span>
                      <span className="truncate">{u.email ?? u.user_id.slice(0, 8)}</span>
                    </div>
                    <span className="font-mono">{u.requests} req</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* FEEDBACK */}
          <TabsContent value="feedback" className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Kpi icon={<ThumbsUp className="h-4 w-4" />} label="👍 7d" value={stats.feedback.positives} tone="ok" />
              <Kpi icon={<ThumbsDown className="h-4 w-4" />} label="👎 7d" value={stats.feedback.negatives} tone={stats.feedback.negatives > 0 ? "warn" : "ok"} />
              <Kpi
                icon={<CheckCircle2 className="h-4 w-4" />}
                label="CSAT"
                value={stats.feedback.satisfaction === null ? "—" : `${(stats.feedback.satisfaction * 100).toFixed(0)}%`}
              />
            </div>
            <Card title="Phản hồi gần đây (data flywheel)">
              <div className="space-y-3">
                {stats.feedback.recent_comments.length === 0 && (
                  <p className="text-sm text-muted-foreground">Chưa có comment nào trong 7 ngày.</p>
                )}
                {stats.feedback.recent_comments.map((c, i) => (
                  <div key={i} className="border border-border rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      {c.rating === 1 ? (
                        <ThumbsUp className="h-3 w-3 text-success" />
                      ) : (
                        <ThumbsDown className="h-3 w-3 text-destructive" />
                      )}
                      <span>{new Date(c.created_at).toLocaleString("vi-VN")}</span>
                    </div>
                    <p className="text-foreground">{c.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* ERRORS */}
          <TabsContent value="errors">
            <Card title="Lỗi gần đây (20 mới nhất)">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground border-b border-border">
                    <tr>
                      <th className="text-left py-2 pr-4 font-normal">Thời gian</th>
                      <th className="text-left py-2 pr-4 font-normal">Status</th>
                      <th className="text-left py-2 pr-4 font-normal">Latency</th>
                      <th className="text-left py-2 font-normal">Mô tả</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {stats.recent_errors.length === 0 && (
                      <tr><td colSpan={4} className="py-3 text-muted-foreground">Không có lỗi nào gần đây 🎉</td></tr>
                    )}
                    {stats.recent_errors.map((e, i) => (
                      <tr key={i}>
                        <td className="py-2 pr-4 font-mono text-xs">{new Date(e.created_at).toLocaleString("vi-VN")}</td>
                        <td className="py-2 pr-4 font-mono">
                          <span className="inline-block px-1.5 py-0.5 rounded bg-destructive/15 text-destructive text-xs">{e.status}</span>
                        </td>
                        <td className="py-2 pr-4 font-mono text-xs">{e.latency_ms ?? "—"} ms</td>
                        <td className="py-2 truncate max-w-md text-xs text-muted-foreground">{e.error ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
};

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card p-4 md:p-5">
    <h3 className="font-display text-sm font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

const Kpi = ({
  icon, label, value, tone = "default",
}: {
  icon: React.ReactNode; label: string; value: number | string;
  tone?: "default" | "ok" | "warn" | "danger";
}) => {
  const toneCls =
    tone === "danger" ? "text-destructive" :
    tone === "warn" ? "text-accent" :
    tone === "ok" ? "text-success" : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}<span>{label}</span>
      </div>
      <div className={`mt-2 font-display text-2xl font-bold ${toneCls}`}>{value}</div>
    </div>
  );
};

export default Admin;
