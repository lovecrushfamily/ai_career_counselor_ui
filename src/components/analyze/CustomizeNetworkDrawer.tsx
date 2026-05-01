import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pin, PinOff, Plus, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CompanyAgg } from "@/lib/marketData";
import type { NetworkEntry, RelationshipType } from "@/hooks/useMyNetwork";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  marketCompanies: CompanyAgg[];
  entries: NetworkEntry[];
  onPin: (input: { company_name: string; industry?: string | null; relationship?: RelationshipType; note?: string | null }) => Promise<void>;
  onUpdate: (id: string, patch: Partial<{ relationship: RelationshipType; note: string | null; industry: string | null }>) => Promise<void>;
  onUnpin: (companyName: string) => Promise<void>;
}

const RELATIONSHIP_OPTIONS: { value: RelationshipType; labelKey: string }[] = [
  { value: "partner", labelKey: "network.rel.partner" },
  { value: "preferred_employer", labelKey: "network.rel.preferred_employer" },
  { value: "personal_contact", labelKey: "network.rel.personal_contact" },
  { value: "alumni_network", labelKey: "network.rel.alumni_network" },
];

export const CustomizeNetworkDrawer = ({ open, onOpenChange, marketCompanies, entries, onPin, onUpdate, onUnpin }: Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [customName, setCustomName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRel, setEditRel] = useState<RelationshipType>("partner");
  const [editNote, setEditNote] = useState("");

  const entryByName = new Map(entries.map((e) => [e.company_name, e]));
  const filtered = marketCompanies.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const startEdit = (entry: NetworkEntry) => {
    setEditingId(entry.id);
    setEditRel(entry.relationship);
    setEditNote(entry.note ?? "");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await onUpdate(editingId, { relationship: editRel, note: editNote || null });
    setEditingId(null);
  };

  const addCustom = async () => {
    const name = customName.trim();
    if (!name) return;
    await onPin({ company_name: name, relationship: "partner" });
    setCustomName("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">{t("network.drawerTitle")}</SheetTitle>
          <SheetDescription>{t("network.drawerDesc")}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Add custom */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("network.addCustom")}
            </label>
            <div className="flex gap-2">
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={t("network.customPlaceholder")}
                onKeyDown={(e) => e.key === "Enter" && addCustom()}
              />
              <Button onClick={addCustom} size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" /> {t("network.add")}
              </Button>
            </div>
          </div>

          {/* My pinned */}
          {entries.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("network.myPinned")} ({entries.length})
              </label>
              <div className="space-y-2">
                {entries.map((e) => {
                  const isEditing = editingId === e.id;
                  return (
                    <div key={e.id} className="rounded-xl border border-border/60 bg-secondary/30 p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate">{e.company_name}</div>
                          {e.industry && <div className="text-[10px] text-muted-foreground">{e.industry}</div>}
                        </div>
                        <div className="flex items-center gap-1">
                          {!isEditing && (
                            <Button onClick={() => startEdit(e)} variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              {t("network.edit")}
                            </Button>
                          )}
                          <Button
                            onClick={() => onUnpin(e.company_name)}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                          >
                            <PinOff className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="space-y-2">
                          <Select value={editRel} onValueChange={(v) => setEditRel(v as RelationshipType)}>
                            <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {RELATIONSHIP_OPTIONS.map((o) => (
                                <SelectItem key={o.value} value={o.value} className="text-xs">{t(o.labelKey)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Textarea
                            value={editNote}
                            onChange={(ev) => setEditNote(ev.target.value)}
                            placeholder={t("network.notePlaceholder")}
                            rows={2}
                            className="text-xs"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button onClick={() => setEditingId(null)} variant="ghost" size="sm" className="h-7 text-xs gap-1">
                              <X className="h-3 w-3" /> {t("common.cancel")}
                            </Button>
                            <Button onClick={saveEdit} size="sm" className="h-7 text-xs gap-1">
                              <Save className="h-3 w-3" /> {t("common.save")}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">
                            {t(`network.rel.${e.relationship}`)}
                          </span>
                          {e.note && <span className="text-muted-foreground italic truncate ml-2">"{e.note}"</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Browse market companies */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("network.browseMarket")}
            </label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("network.searchPlaceholder")}
            />
            <div className="space-y-1.5 max-h-[40vh] overflow-y-auto pr-1">
              {filtered.map((c) => {
                const pinned = entryByName.has(c.name);
                return (
                  <div
                    key={c.name}
                    className={cn(
                      "flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm",
                      pinned ? "bg-primary/5 border-primary/30" : "bg-card border-border/60"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground">{c.industry} · {c.jds} JDs</div>
                    </div>
                    {pinned ? (
                      <Button onClick={() => onUnpin(c.name)} variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground">
                        <PinOff className="h-3.5 w-3.5" /> {t("network.unpin")}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onPin({ company_name: c.name, industry: c.industry, relationship: "partner" })}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                      >
                        <Pin className="h-3.5 w-3.5" /> {t("network.pin")}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};