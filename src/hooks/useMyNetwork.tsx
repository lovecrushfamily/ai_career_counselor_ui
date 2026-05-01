import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export type RelationshipType = "partner" | "preferred_employer" | "personal_contact" | "alumni_network";

export interface NetworkEntry {
  id: string;
  user_id: string;
  company_name: string;
  industry: string | null;
  relationship: RelationshipType;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpsertNetworkInput {
  company_name: string;
  industry?: string | null;
  relationship?: RelationshipType;
  note?: string | null;
}

export const useMyNetwork = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<NetworkEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (!user) {
      setEntries([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("advisor_network")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      console.error(error);
      toast({ title: "Network load failed", description: error.message, variant: "destructive" });
    } else {
      setEntries((data ?? []) as NetworkEntry[]);
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const isPinned = useCallback(
    (companyName: string) => entries.some((e) => e.company_name === companyName),
    [entries]
  );

  const getEntry = useCallback(
    (companyName: string) => entries.find((e) => e.company_name === companyName),
    [entries]
  );

  const pin = async (input: UpsertNetworkInput) => {
    if (!user) return;
    const { error } = await supabase.from("advisor_network").upsert(
      {
        user_id: user.id,
        company_name: input.company_name,
        industry: input.industry ?? null,
        relationship: input.relationship ?? "partner",
        note: input.note ?? null,
      },
      { onConflict: "user_id,company_name" }
    );
    if (error) {
      toast({ title: "Pin failed", description: error.message, variant: "destructive" });
      return;
    }
    await fetchEntries();
  };

  const update = async (id: string, patch: Partial<UpsertNetworkInput>) => {
    const { error } = await supabase.from("advisor_network").update(patch).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    await fetchEntries();
  };

  const unpin = async (companyName: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("advisor_network")
      .delete()
      .eq("user_id", user.id)
      .eq("company_name", companyName);
    if (error) {
      toast({ title: "Unpin failed", description: error.message, variant: "destructive" });
      return;
    }
    await fetchEntries();
  };

  return { entries, loading, isPinned, getEntry, pin, update, unpin, refetch: fetchEntries };
};