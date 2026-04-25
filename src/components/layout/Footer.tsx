import { Github, Twitter, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RobotLogo } from "@/components/brand/RobotLogo";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="relative bg-background mt-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-16 bg-gradient-to-b from-primary/10 via-border/10 to-transparent blur-3xl opacity-90" />
      <div className="container py-14 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <RobotLogo />
            <span className="font-display text-base font-bold">
              AI<span className="text-primary"> Career</span> Advisor
            </span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">{t("footer.tagline")}</p>
          <div className="mt-5 flex items-center gap-2">
            {[
              { icon: Github, href: "#" },
              { icon: Twitter, href: "#" },
              { icon: MessageSquare, href: "#" },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="h-8 w-8 rounded-lg border border-border bg-card hover:border-primary/50 hover:text-primary text-muted-foreground flex items-center justify-center transition-colors"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3">{t("footer.product")}</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/pricing" className="hover:text-foreground transition-colors">{t("nav.pricing")}</Link></li>
            <li><Link to="/guide" className="hover:text-foreground transition-colors">{t("footer.guide")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3">{t("footer.company")}</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/community" className="hover:text-foreground transition-colors">{t("nav.community")}</Link></li>
            <li><a href="#" className="hover:text-foreground transition-colors">{t("footer.newsletter")}</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">{t("footer.contact")}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3">{t("footer.pipeline")}</h4>
          <ul className="space-y-2.5 text-xs text-muted-foreground font-mono">
            <li>↳ {t("footer.p1")}</li>
            <li>↳ {t("footer.p2")}</li>
            <li>↳ {t("footer.p3")}</li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="soft-divider" />
      </div>
      <div>
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} AI Career Advisor Assistant. {t("footer.rights")}</span>
          <span className="font-mono">v0.1 · MVP</span>
        </div>
      </div>
    </footer>
  );
};
