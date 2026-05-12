import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Activity, Plus, Send, Sparkles, Loader2, MessageSquare, Trash2, Brain } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CitedSourcesPanel, MOCK_CITATIONS, type Citation } from "./CitedSourcesPanel";

interface Msg {
  role: "user" | "assistant";
  content: string;
}
interface SessionRow { id: string; title: string; updated_at: string; }

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export const ChatbotPanel = () => {
  const { t } = useTranslation();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [reasoning, setReasoning] = useState<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  const SUGGESTED = [
    t("analyze.placeholder"),
    "So sánh demand React vs Vue tại VN tháng này",
    "Top 5 kỹ năng tăng nhu cầu nhanh nhất tuần qua",
    "Mức lương trung vị Data Engineer 3 năm KN",
  ];

  useEffect(() => {
    if (!user) return;
    supabase
      .from("chat_sessions")
      .select("id, title, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .then(({ data }) => { if (data) setSessions(data); });
  }, [user]);

  useEffect(() => {
    if (!activeSessionId) { setMessages([]); setCitations([]); return; }
    supabase
      .from("chat_messages")
      .select("role, content")
      .eq("session_id", activeSessionId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data.filter((m) => m.role !== "system") as Msg[]);
      });
  }, [activeSessionId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const newSession = () => { setActiveSessionId(null); setMessages([]); setCitations([]); setReasoning(undefined); };

  const deleteSession = async (id: string) => {
    await supabase.from("chat_sessions").delete().eq("id", id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) newSession();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !user || streaming) return;
    setInput("");
    setStreaming(true);
    setReasoning(t("analyze.thinking") + "...");

    const userMsg: Msg = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);

    let sessionId = activeSessionId;
    if (!sessionId) {
      const title = text.slice(0, 60);
      const { data, error } = await supabase
        .from("chat_sessions")
        .insert({ user_id: user.id, title })
        .select("id, title, updated_at")
        .single();
      if (error || !data) {
        toast({ title: "Không tạo được phiên", variant: "destructive" });
        setStreaming(false);
        return;
      }
      sessionId = data.id;
      setActiveSessionId(sessionId);
      setSessions((prev) => [data, ...prev]);
    }

    await supabase.from("chat_messages").insert({
      session_id: sessionId, user_id: user.id, role: "user", content: text,
    });

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token ?? ""}` },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) toast({ title: "Quá nhiều yêu cầu", variant: "destructive" });
        else if (resp.status === 402) toast({ title: "Hết credit AI", variant: "destructive" });
        else toast({ title: "Lỗi gọi AI", variant: "destructive" });
        setStreaming(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = ""; let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx); buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) upsert(delta);
          } catch { buf = line + "\n" + buf; break; }
        }
      }

      if (assistantSoFar) {
        await supabase.from("chat_messages").insert({
          session_id: sessionId, user_id: user.id, role: "assistant", content: assistantSoFar,
        });
        await supabase.from("chat_sessions").update({ updated_at: new Date().toISOString() }).eq("id", sessionId);
        // Mock citations + reasoning (MVP — pipeline thật sẽ trả về structured)
        setCitations(MOCK_CITATIONS);
        setReasoning(
          `1. Parse intent: aggregate query về "${text.slice(0, 40)}..."\n` +
          `2. Lookup snapshot tuần W16/2026 từ pipeline aggregate.\n` +
          `3. Cross-ref ${MOCK_CITATIONS.length} nguồn JD aggregate.\n` +
          `4. Trả số kèm Δ% w/w, format markdown.`
        );
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Lỗi kết nối", variant: "destructive" });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_320px] gap-4 h-full min-h-0">
      {/* Sessions */}
      <aside data-tour="sessions-list" className="glass-surface hidden lg:flex flex-col rounded-[1.25rem] shadow-card overflow-hidden min-h-0">
        <div className="p-3">
          <Button onClick={newSession} variant="outline" className="w-full justify-start gap-2">
            <Plus className="h-4 w-4" /> {t("analyze.newSession")}
          </Button>
        </div>
        <div className="px-3"><div className="soft-divider" /></div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.length === 0 && <p className="text-xs text-muted-foreground p-3">{t("analyze.noSessions")}</p>}
          {sessions.map((s) => (
            <div
              key={s.id}
              className={`group flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${
                activeSessionId === s.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
              onClick={() => setActiveSessionId(s.id)}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1 truncate">{s.title}</span>
              <button onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }} className="opacity-0 group-hover:opacity-100" aria-label="del">
                <Trash2 className="h-3.5 w-3.5 hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <section className="glass-surface flex flex-col rounded-[1.25rem] shadow-card overflow-hidden min-h-0">
        <div className="px-5 py-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <span className="font-display font-semibold">{t("analyze.title")}</span>
        </div>
        <div className="px-5"><div className="soft-divider" /></div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 md:p-8">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto py-10">
              <div className="text-center mb-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-data shadow-glow mb-4">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">{t("analyze.emptyTitle")}</h2>
                <p className="text-sm text-muted-foreground">{t("analyze.emptyDesc")}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {SUGGESTED.slice(1).map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left p-4 rounded-xl border border-border/35 bg-background/65 backdrop-blur-sm hover:border-primary/35 hover:bg-secondary/35 transition-all text-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                  {m.role === "assistant" && (
                    <div className="h-8 w-8 shrink-0 rounded-md bg-gradient-data flex items-center justify-center mt-0.5">
                      <Sparkles className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className={m.role === "user"
                    ? "max-w-[80%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm"
                    : "flex-1 prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-secondary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none"
                  }>
                    {m.role === "user" ? m.content : <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>}
                  </div>
                </div>
              ))}
              {streaming && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3 items-center">
                  <div className="h-8 w-8 shrink-0 rounded-md bg-gradient-data flex items-center justify-center">
                    <Brain className="h-4 w-4 text-primary-foreground animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{t("analyze.thinking")}</span>
                    <Loader2 className="h-3 w-3 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-3"><div className="soft-divider" /></div>
        <form
          data-tour="chat-input"
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="bg-background/30 p-3 backdrop-blur-md flex gap-2"
        >
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("analyze.placeholder")} disabled={streaming} className="flex-1" />
          <Button type="submit" disabled={streaming || !input.trim()} className="bg-gradient-data text-primary-foreground hover:opacity-90">
            {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </section>

      {/* Cited sources */}
      <CitedSourcesPanel citations={citations} reasoning={reasoning} />
    </div>
  );
};