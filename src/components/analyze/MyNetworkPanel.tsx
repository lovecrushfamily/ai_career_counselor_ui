import { useTranslation } from "react-i18next";
import { Handshake, Star, Pin, Settings2, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NetworkEntry, RelationshipType } from "@/hooks/useMyNetwork";

const RELATIONSHIP_STYLE: Record<RelationshipType, { label: string; cls: string }> = {
  partner: { label: "🤝 Partner", cls: "bg-primary/10 text-primary border-primary/30" },
  preferred_employer: { label: "⭐ Preferred", cls: "bg-success/10 text-success border-success/30" },
  personal_contact: { label: "👤 Contact", cls: "bg-accent/15 text-accent border-accent/30" },
  alumni_network: { label: "🎓 Alumni", cls: "bg-secondary text-foreground border-border" },
};

interface Props {
  entries: NetworkEntry[];
  onCustomize: () => void;
  onUnpin: (companyName: string) => void;
}

export const MyNetworkPanel = ({ entries, onCustomize, onUnpin }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="glass-surface rounded-2xl p-5 shadow-card border-l-4 border-l-primary">
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Handshake className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-sm font-semibold leading-tight">{t("network.title")}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">{t("network.subtitle")}</p>
          </div>
        </div>
        <Button onClick={onCustomize} size="sm" variant="outline" className="gap-1.5 text-xs h-8">
          <Settings2 className="h-3.5 w-3.5" />
          {t("network.customize")}
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-border/60">
          <Star className="h-6 w-6 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">{t("network.empty")}</p>
          <Button onClick={onCustomize} variant="ghost" size="sm" className="mt-2 text-xs gap-1.5">
            <Pin className="h-3.5 w-3.5" /> {t("network.startPinning")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {entries.map((e) => {
            const style = RELATIONSHIP_STYLE[e.relationship];
            return (
              <div
                key={e.id}
                className="rounded-xl bg-secondary/40 border border-border/60 p-3 flex flex-col gap-1.5 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate flex items-center gap-1.5">
                      <Handshake className="h-3.5 w-3.5 text-primary shrink-0" />
                      {e.company_name}
                    </div>
                    {e.industry && (
                      <div className="text-[10px] text-muted-foreground mt-0.5">{e.industry}</div>
                    )}
                  </div>
                  <button
                    onClick={() => onUnpin(e.company_name)}
                    className="text-muted-foreground hover:text-destructive transition-colors text-[10px]"
                    title={t("network.unpin")}
                  >
                    ✕
                  </button>
                </div>
                <span className={cn("inline-flex w-fit items-center text-[10px] font-medium px-2 py-0.5 rounded-full border", style.cls)}>
                  {style.label}
                </span>
                {e.note && (
                  <div className="flex items-start gap-1 text-[11px] text-muted-foreground mt-1 leading-snug">
                    <StickyNote className="h-3 w-3 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{e.note}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};