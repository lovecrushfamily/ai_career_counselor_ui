import { useState } from "react";
import { ChevronDown, TrendingUp, TrendingDown, CheckCircle2, Clock, BarChart3, DollarSign, AlertTriangle, Database } from "lucide-react";

interface SkillRow {
  name: string;
  tag: "critical" | "high" | "medium" | "emerging";
  jds: number;
  source: string;
  delta: number;
}

const SOURCES = [
  { name: "TopCV", color: "bg-destructive", date: "15/04/2026", status: "ok" as const },
  { name: "ITviec", color: "bg-primary", date: "15/04/2026", status: "ok" as const },
  { name: "VietnamWorks", color: "bg-success", date: "14/04/2026", status: "ok" as const },
  { name: "LinkedIn VN", color: "bg-accent", date: "13/04/2026", status: "pending" as const },
];

const SKILLS: SkillRow[] = [
  { name: "Python", tag: "critical", jds: 4820, source: "ITviec", delta: 8.3 },
  { name: "React / Next.js", tag: "critical", jds: 4210, source: "TopCV", delta: 5.1 },
  { name: "Machine Learning", tag: "critical", jds: 3190, source: "LinkedIn VN", delta: 14.7 },
  { name: "AWS / Cloud", tag: "high", jds: 2940, source: "ITviec", delta: 6.2 },
  { name: "SQL / PostgreSQL", tag: "high", jds: 2780, source: "VietnamWorks", delta: 2.4 },
  { name: "Node.js", tag: "high", jds: 2560, source: "TopCV", delta: -1.8 },
  { name: "Docker / Kubernetes", tag: "high", jds: 2340, source: "ITviec", delta: 9.1 },
  { name: "LLM / Prompt Engineering", tag: "emerging", jds: 1890, source: "LinkedIn VN", delta: 31.4 },
  { name: "Java / Spring Boot", tag: "medium", jds: 1820, source: "TopCV", delta: -3.2 },
  { name: "Cybersecurity / SOC", tag: "emerging", jds: 1640, source: "TopCV", delta: 17.8 },
  { name: "Data Engineering", tag: "high", jds: 1520, source: "ITviec", delta: 11.3 },
  { name: "TypeScript", tag: "medium", jds: 1480, source: "VietnamWorks", delta: 4.6 },
];

const TAG_STYLES: Record<SkillRow["tag"], string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  high: "bg-accent/15 text-accent border-accent/30",
  medium: "bg-primary/15 text-primary border-primary/30",
  emerging: "bg-success/15 text-success border-success/30",
};

type TabKey = "skills" | "salary" | "gaps" | "volume";

const TABS: { key: TabKey; label: string; icon: typeof BarChart3 }[] = [
  { key: "skills", label: "Skills", icon: BarChart3 },
  { key: "salary", label: "Salary", icon: DollarSign },
  { key: "gaps", label: "Gaps", icon: AlertTriangle },
  { key: "volume", label: "JD Volume", icon: Database },
];

export const LiveMarketData = () => {
  const [tab, setTab] = useState<TabKey>("skills");
  const [sourcesOpen, setSourcesOpen] = useState(true);

  return (
    <aside className="hidden xl:flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
          <h3 className="font-display font-semibold text-sm">Live Market Data</h3>
        </div>
        <p className="text-[11px] font-mono text-muted-foreground mt-1">
          Tuần 14–20 / 04 / 2026
        </p>
      </div>

      {/* Sources */}
      <div className="border-b border-border">
        <button
          onClick={() => setSourcesOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-secondary/40 transition-colors"
        >
          <span className="text-xs font-display font-semibold">Nguồn dữ liệu</span>
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${sourcesOpen ? "" : "-rotate-90"}`} />
        </button>
        {sourcesOpen && (
          <div className="px-4 pb-3 space-y-1.5">
            {SOURCES.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span className={`h-2 w-2 rounded-full ${s.color}`} />
                <span className="flex-1 text-foreground/90">{s.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{s.date}</span>
                {s.status === "ok" ? (
                  <CheckCircle2 className="h-3 w-3 text-success" />
                ) : (
                  <Clock className="h-3 w-3 text-accent" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-mono transition-colors ${
                active
                  ? "text-primary border-b-2 border-primary -mb-px"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {tab === "skills" && (
          <div>
            <div className="px-4 py-2.5 border-b border-border bg-secondary/20">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Skill Demand · Tuần 14 / 04
              </p>
            </div>
            <ul className="divide-y divide-border/60">
              {SKILLS.map((s) => {
                const positive = s.delta >= 0;
                return (
                  <li key={s.name} className="px-4 py-3 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-foreground truncate">{s.name}</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${TAG_STYLES[s.tag]}`}>
                            {s.tag}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-muted-foreground mt-0.5">
                          {s.jds.toLocaleString()} JDs · {s.source}
                        </div>
                      </div>
                      <div className={`flex items-center gap-0.5 text-xs font-mono font-semibold shrink-0 ${positive ? "text-success" : "text-destructive"}`}>
                        {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {positive ? "+" : ""}{s.delta}%
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {tab === "salary" && (
          <div className="p-4 space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Median Salary · IT · VN
            </p>
            {[
              { role: "Junior Dev (0–2y)", range: "12 – 18tr", delta: 3.2 },
              { role: "Mid Dev (2–4y)", range: "22 – 35tr", delta: 5.8 },
              { role: "Senior Dev (5y+)", range: "40 – 65tr", delta: 4.1 },
              { role: "ML / AI Engineer", range: "35 – 80tr", delta: 12.6 },
              { role: "DevOps / SRE", range: "30 – 55tr", delta: 6.7 },
            ].map((r) => (
              <div key={r.role} className="flex items-center justify-between text-xs">
                <div>
                  <p className="text-foreground">{r.role}</p>
                  <p className="font-mono text-muted-foreground text-[11px]">{r.range}</p>
                </div>
                <span className="font-mono text-success">+{r.delta}%</span>
              </div>
            ))}
          </div>
        )}

        {tab === "gaps" && (
          <div className="p-4 space-y-3 text-xs">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Supply ↔ Demand Gap
            </p>
            {[
              { skill: "LLM / RAG", note: "Cầu vượt cung 4.2x", level: "high" },
              { skill: "Kubernetes", note: "Cầu vượt cung 2.8x", level: "high" },
              { skill: "Rust", note: "Cầu vượt cung 1.9x", level: "medium" },
              { skill: "PHP", note: "Cung vượt cầu 1.4x", level: "low" },
            ].map((g) => (
              <div key={g.skill} className="p-2.5 rounded border border-border bg-background/40">
                <p className="font-medium text-foreground">{g.skill}</p>
                <p className="font-mono text-muted-foreground text-[11px] mt-0.5">{g.note}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "volume" && (
          <div className="p-4 space-y-3 text-xs">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Tổng JD đã tổng hợp · 7 ngày
            </p>
            {SOURCES.map((s) => {
              const fake = { TopCV: 12480, ITviec: 8230, VietnamWorks: 9610, "LinkedIn VN": 6180 }[s.name] ?? 0;
              return (
                <div key={s.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-foreground/90">{s.name}</span>
                    <span className="font-mono text-muted-foreground">{fake.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full ${s.color}`} style={{ width: `${(fake / 13000) * 100}%` }} />
                  </div>
                </div>
              );
            })}
            <p className="text-[10px] text-muted-foreground italic pt-2 border-t border-border">
              Chỉ hiển thị số liệu tổng hợp (aggregate). Không lưu trữ / hiển thị nội dung tin tuyển dụng gốc.
            </p>
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-border bg-secondary/20">
        <p className="text-[10px] font-mono text-muted-foreground">
          [demo data · MVP] · Aggregate-only
        </p>
      </div>
    </aside>
  );
};
