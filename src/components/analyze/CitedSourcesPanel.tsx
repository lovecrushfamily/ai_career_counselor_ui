import { useTranslation } from "react-i18next";
import { ExternalLink, FileText, Quote, Brain, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Citation {
  platform: string;
  role: string;
  url: string;
  crawled: string;
  snippet?: string;
}

interface Props {
  citations: Citation[];
  reasoning?: string;
}

/**
 * Side panel chỉ show LINK nguồn (không show raw JD content).
 * Có collapsible "Reasoning" cho thinking trace nếu có.
 */
export const CitedSourcesPanel = ({ citations, reasoning }: Props) => {
  const { t } = useTranslation();
  const [reasonOpen, setReasonOpen] = useState(false);

  return (
    <aside className="glass-surface hidden xl:flex flex-col rounded-[1.25rem] shadow-card overflow-hidden min-h-0">
      <div className="px-4 py-3 flex items-center gap-2">
        <Quote className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold text-sm">{t("analyze.sources")}</h3>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground">{citations.length}</span>
      </div>
      <div className="px-4"><div className="soft-divider" /></div>

      {/* Reasoning collapsible */}
      {reasoning && (
        <>
          <button
            onClick={() => setReasonOpen((v) => !v)}
            className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-secondary/40 transition-colors"
          >
            <Brain className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-display font-semibold flex-1 text-left">{t("analyze.reasoning")}</span>
            <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", reasonOpen ? "" : "-rotate-90")} />
          </button>
          {reasonOpen && (
            <div className="px-4 pb-3">
              <div className="text-[11px] text-muted-foreground leading-relaxed bg-secondary/30 rounded-lg p-3 whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
                {reasoning}
              </div>
            </div>
          )}
          <div className="px-4"><div className="soft-divider" /></div>
        </>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {citations.length === 0 ? (
          <div className="p-4 text-center">
            <FileText className="h-8 w-8 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-xs text-muted-foreground">{t("analyze.noSources")}</p>
          </div>
        ) : (
          citations.map((c, i) => (
            <a
              key={i}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group p-3 rounded-xl border border-border/40 bg-background/50 hover:border-primary/40 hover:bg-secondary/40 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-border bg-secondary/60 text-muted-foreground">
                  {c.platform}
                </span>
                <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary shrink-0" />
              </div>
              <div className="text-xs font-medium text-foreground line-clamp-2 mb-1">
                {c.role}
              </div>
              {c.snippet && (
                <p className="text-[10px] text-muted-foreground line-clamp-1 italic">"{c.snippet}"</p>
              )}
              <div className="text-[10px] font-mono text-muted-foreground mt-1.5">
                {t("analyze.crawled")}: {c.crawled}
              </div>
            </a>
          ))
        )}
      </div>

      <div className="px-4"><div className="soft-divider" /></div>
      <div className="bg-secondary/15 px-4 py-2 backdrop-blur-sm">
        <p className="text-[10px] font-mono text-muted-foreground">
          {t("analyze.noRaw")}
        </p>
      </div>
    </aside>
  );
};

/** Mock citations cho mỗi câu trả lời (demo MVP) */
export const MOCK_CITATIONS: Citation[] = [
  { platform: "TopCV", role: "Senior React Developer", url: "https://www.topcv.vn/", crawled: "2026-W16", snippet: "3+ năm React, Next.js, TypeScript..." },
  { platform: "ITviec", role: "Frontend Engineer (Remote)", url: "https://itviec.com/", crawled: "2026-W16", snippet: "React/Vue, mid-level, English required" },
  { platform: "VietnamWorks", role: "Fullstack Developer", url: "https://www.vietnamworks.com/", crawled: "2026-W16", snippet: "Node.js + React, Hà Nội/HCM" },
  { platform: "LinkedIn", role: "ML Engineer (LLM)", url: "https://www.linkedin.com/jobs/", crawled: "2026-W15", snippet: "Python, PyTorch, RAG, prompt eng." },
];