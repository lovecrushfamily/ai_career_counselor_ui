import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Database, TrendingUp, Building2, Briefcase, Sparkles, Globe2, Download, Loader2, Handshake, Pin, PinOff } from "lucide-react";
import { getMarketSnapshot, type RangeKey } from "@/lib/marketData";
import { exportDashboardPdf } from "@/lib/exportReport";
import { KpiCard } from "./KpiCard";
import { MarketLineChart } from "./MarketLineChart";
import { MyNetworkPanel } from "./MyNetworkPanel";
import { CustomizeNetworkDrawer } from "./CustomizeNetworkDrawer";
import { useMyNetwork } from "@/hooks/useMyNetwork";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const RANGES: RangeKey[] = ["week", "month", "quarter", "year"];

export const DashboardPanel = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [range, setRange] = useState<RangeKey>("month");
  const [exporting, setExporting] = useState(false);
  const [showMyFirst, setShowMyFirst] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const { entries, isPinned, pin, update, unpin } = useMyNetwork();

  const snapshot = useMemo(() => getMarketSnapshot(range), [range]);

  const sortedCompanies = useMemo(() => {
    if (!showMyFirst || entries.length === 0) return snapshot.companies;
    const pinnedSet = new Set(entries.map((e) => e.company_name));
    return [...snapshot.companies].sort((a, b) => {
      const ap = pinnedSet.has(a.name) ? 0 : 1;
      const bp = pinnedSet.has(b.name) ? 0 : 1;
      return ap - bp;
    });
  }, [snapshot.companies, entries, showMyFirst]);

  const networkIndustries = useMemo(
    () => new Set(entries.map((e) => e.industry).filter(Boolean) as string[]),
    [entries]
  );

  const handleExport = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      await exportDashboardPdf({
        element: reportRef.current,
        snapshot,
        lang: i18n.resolvedLanguage?.startsWith("en") ? "en" : "vi",
      });
    } catch (e) {
      console.error(e);
      toast({ title: "Export PDF failed", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-5">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
              {t("dashboard.title")}
              {showMyFirst && entries.length > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30">
                  <Handshake className="h-3 w-3" /> {t("network.personalizedView")}
                </span>
              )}
            </h2>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              {t("analyze.demo")} · {new Date(snapshot.generatedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Button onClick={() => setDrawerOpen(true)} size="sm" variant="outline" className="gap-2">
              <Handshake className="h-4 w-4" /> {t("network.customize")}
            </Button>
            <div className="inline-flex rounded-xl glass-surface p-1">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                    range === r ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t(`dashboard.range.${r}`)}
                </button>
              ))}
            </div>
            <Button onClick={handleExport} disabled={exporting} size="sm" className="bg-gradient-data text-primary-foreground hover:opacity-90 gap-2">
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {exporting ? t("dashboard.exportingPdf") : t("dashboard.exportPdf")}
            </Button>
          </div>
        </div>

        {/* Captured area */}
        <div ref={reportRef} className="space-y-5">
          {/* My Network */}
          <MyNetworkPanel
            entries={entries}
            onCustomize={() => setDrawerOpen(true)}
            onUnpin={unpin}
          />

          {/* Top KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <KpiCard icon={<Database className="h-3.5 w-3.5" />} label={t("dashboard.kpi.totalJds")} value={snapshot.totalJds.toLocaleString()} delta={snapshot.deltaPct} accent="primary" />
            <KpiCard icon={<TrendingUp className="h-3.5 w-3.5" />} label={t("dashboard.kpi.delta")} value={`${snapshot.deltaPct >= 0 ? "+" : ""}${snapshot.deltaPct}%`} hint={t("dashboard.vs")} accent="success" />
            <KpiCard icon={<Building2 className="h-3.5 w-3.5" />} label={t("dashboard.kpi.newCompanies")} value={snapshot.newCompanies} accent="accent" />
            <KpiCard icon={<Briefcase className="h-3.5 w-3.5" />} label={t("dashboard.kpi.medianSalary")} value={snapshot.medianSalary} hint="VND / month" accent="primary" />
            <KpiCard icon={<Sparkles className="h-3.5 w-3.5" />} label={t("dashboard.kpi.topSkill")} value={snapshot.topSkill.name} delta={snapshot.topSkill.delta} accent="success" />
            <KpiCard icon={<Globe2 className="h-3.5 w-3.5" />} label={t("dashboard.kpi.topField")} value={snapshot.topField.name} delta={snapshot.topField.delta} accent="accent" />
          </div>

          {/* Center: line chart */}
          <div className="glass-surface rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display text-base font-semibold">{t("dashboard.trendTitle")}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{t("dashboard.trendDesc")}</p>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">{t(`dashboard.range.${range}`)}</span>
            </div>
            <div className="h-[340px]">
              <MarketLineChart data={snapshot.trend} keys={snapshot.trendKeys} />
            </div>
          </div>

          {/* Bottom 3-col: platforms, companies, industries */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Platforms */}
            <div className="glass-surface rounded-2xl p-5 shadow-card">
              <h3 className="font-display text-sm font-semibold mb-3 flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-primary" /> {t("dashboard.platforms")}
              </h3>
              <div className="space-y-3">
                {snapshot.platforms.map((p) => (
                  <div key={p.name}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium">{p.name}</span>
                      <span className="font-mono text-muted-foreground">
                        {p.share}% · {p.jds.toLocaleString()}{" "}
                        <span className={p.delta >= 0 ? "text-success" : "text-destructive"}>
                          ({p.delta >= 0 ? "+" : ""}{p.delta}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-gradient-data" style={{ width: `${p.share * 2.5}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Companies */}
            <div className="glass-surface rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-3 gap-2">
                <h3 className="font-display text-sm font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> {t("dashboard.companies")}
                </h3>
                {entries.length > 0 && (
                  <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer">
                    <Switch checked={showMyFirst} onCheckedChange={setShowMyFirst} className="scale-75" />
                    <span>{t("network.showMyFirst")}</span>
                  </label>
                )}
              </div>
              <ul className="space-y-2">
                {sortedCompanies.slice(0, 8).map((c, i) => {
                  const pinned = isPinned(c.name);
                  return (
                    <li
                      key={c.name}
                      className={cn(
                        "flex items-center gap-3 text-xs rounded-lg -mx-1 px-1 py-1 transition-colors",
                        pinned && "bg-primary/5 border-l-2 border-l-primary",
                        !pinned && showMyFirst && entries.length > 0 && "opacity-60"
                      )}
                    >
                      <span className="font-mono text-muted-foreground w-5">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-foreground font-medium truncate flex items-center gap-1.5">
                          {pinned && <Handshake className="h-3 w-3 text-primary shrink-0" />}
                          {c.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{c.industry}</div>
                      </div>
                      <button
                        onClick={() =>
                          pinned
                            ? unpin(c.name)
                            : pin({ company_name: c.name, industry: c.industry, relationship: "partner" })
                        }
                        className={cn(
                          "shrink-0 p-1 rounded-md transition-colors",
                          pinned ? "text-primary hover:bg-primary/10" : "text-muted-foreground/40 hover:text-primary hover:bg-primary/10"
                        )}
                        title={pinned ? t("network.unpin") : t("network.pin")}
                      >
                        {pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                      </button>
                      <div className="text-right shrink-0 w-12">
                        <div className="font-mono">{c.jds}</div>
                        <div className={cn("text-[10px] font-mono", c.delta >= 0 ? "text-success" : "text-destructive")}>
                          {c.delta >= 0 ? "+" : ""}{c.delta}%
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Industries */}
            <div className="glass-surface rounded-2xl p-5 shadow-card">
              <h3 className="font-display text-sm font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" /> {t("dashboard.industries")}
              </h3>
              <ul className="space-y-2.5">
                {snapshot.industries.map((ind) => {
                  const max = Math.max(...snapshot.industries.map((x) => x.jds));
                  const inNetwork = networkIndustries.has(ind.name);
                  return (
                    <li key={ind.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium flex items-center gap-1.5">
                          {inNetwork && <Handshake className="h-3 w-3 text-primary" />}
                          {ind.name}
                        </span>
                        <span className={cn("font-mono", ind.delta >= 0 ? "text-success" : "text-destructive")}>
                          {ind.delta >= 0 ? "+" : ""}{ind.delta}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-secondary overflow-hidden">
                        <div className={cn("h-full", inNetwork ? "bg-primary" : "bg-accent/70")} style={{ width: `${(ind.jds / max) * 100}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <CustomizeNetworkDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          marketCompanies={snapshot.companies}
          entries={entries}
          onPin={pin}
          onUpdate={update}
          onUnpin={unpin}
        />
      </div>
    </div>
  );
};