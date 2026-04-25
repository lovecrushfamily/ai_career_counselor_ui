import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

/**
 * Toggle gọn chuyển VN ↔ EN. Đặt cạnh theme toggle.
 */
export const LanguageToggle = () => {
  const { i18n, t } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || "vi").startsWith("en") ? "en" : "vi";
  const next = current === "vi" ? "en" : "vi";

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 px-2 gap-1.5 font-mono text-xs uppercase tracking-wider"
      onClick={() => i18n.changeLanguage(next)}
      aria-label={`${t("lang.switchTo")} ${t(`lang.${next}`)}`}
    >
      <Languages className="h-3.5 w-3.5 opacity-70" />
      <span className={current === "vi" ? "text-foreground" : "text-muted-foreground"}>VN</span>
      <span className="text-muted-foreground/40">/</span>
      <span className={current === "en" ? "text-foreground" : "text-muted-foreground"}>EN</span>
    </Button>
  );
};