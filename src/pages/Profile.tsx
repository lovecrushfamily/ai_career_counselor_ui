import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Sun, Moon, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  theme_preference: string;
}

interface SessionRow {
  id: string;
  title: string;
  updated_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: p }, { data: s }] = await Promise.all([
        supabase.from("profiles").select("display_name, avatar_url, theme_preference").eq("user_id", user.id).maybeSingle(),
        supabase.from("chat_sessions").select("id, title, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(10),
      ]);
      if (p) {
        setProfile(p);
        setDisplayName(p.display_name ?? "");
      }
      if (s) setSessions(s);
      setLoading(false);
    };
    load();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, theme_preference: theme })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Lỗi lưu hồ sơ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Đã lưu" });
    }
  };

  if (loading) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-12 md:py-16 space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-2">Hồ sơ</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Cài đặt tài khoản</h1>
      </div>

      <Card className="p-6 space-y-5 shadow-card">
        <h2 className="font-display text-lg font-semibold">Thông tin cơ bản</h2>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user?.email ?? ""} disabled className="font-mono text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name">Tên hiển thị</Label>
          <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Nguyễn Văn A" />
        </div>
      </Card>

      <Card className="p-6 space-y-5 shadow-card">
        <h2 className="font-display text-lg font-semibold">Giao diện</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === "dark" ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-muted-foreground" />}
            <div>
              <p className="text-sm font-medium">Chế độ tối</p>
              <p className="text-xs text-muted-foreground">Mặc định cho cảm giác data-product</p>
            </div>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
        </div>
      </Card>

      <Card className="p-6 space-y-4 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Phiên gần đây</h2>
          <Link to="/analyze" className="text-sm text-primary hover:underline">Mở phân tích →</Link>
        </div>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có phiên phân tích nào.</p>
        ) : (
          <ul className="divide-y divide-border">
            {sessions.map((s) => (
              <li key={s.id} className="py-3 flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="flex-1 text-sm truncate">{s.title}</span>
                <span className="text-xs font-mono text-muted-foreground">
                  {new Date(s.updated_at).toLocaleDateString("vi-VN")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-gradient-data text-primary-foreground hover:opacity-90">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Lưu thay đổi</>}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
