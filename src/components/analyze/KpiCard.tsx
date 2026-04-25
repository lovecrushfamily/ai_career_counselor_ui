import { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon?: ReactNode;
  label: string;
  value: string | number;
  delta?: number;
  hint?: string;
  accent?: "primary" | "success" | "accent" | "destructive";
  className?: string;
}

export const KpiCard = ({ icon, label, value, delta, hint, accent = "primary", className }: Props) => {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className={cn("glass-surface rounded-2xl p-4 flex flex-col gap-2 shadow-card", className)}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon && (
          <span className={cn(
            "h-6 w-6 rounded-md flex items-center justify-center",
            accent === "primary" && "bg-primary/10 text-primary",
            accent === "success" && "bg-success/10 text-success",
            accent === "accent" && "bg-accent/10 text-accent",
            accent === "destructive" && "bg-destructive/10 text-destructive",
          )}>
            {icon}
          </span>
        )}
        <span className="truncate">{label}</span>
      </div>
      <div className="font-display text-2xl font-bold tracking-tight">{value}</div>
      {(delta !== undefined || hint) && (
        <div className="flex items-center justify-between text-[11px]">
          {delta !== undefined && (
            <span className={cn(
              "inline-flex items-center gap-0.5 font-mono font-semibold",
              positive ? "text-success" : "text-destructive"
            )}>
              {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {positive ? "+" : ""}{delta}%
            </span>
          )}
          {hint && <span className="text-muted-foreground truncate">{hint}</span>}
        </div>
      )}
    </div>
  );
};