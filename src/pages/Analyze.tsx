import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Activity, Plus, Send, Sparkles, Loader2, MessageSquare, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface SessionRow {
  id: string;
  title: string;
  updated_at: string;
}

const SUGGESTED = [
  "So sánh demand React vs Vue tại VN tháng này",
  "Top 5 kỹ năng tăng nhu cầu nhanh nhất tuần qua",
  "Mức lương trung vị Data Engineer 3 năm KN",
  "Nhu cầu DevOps tại HCM thay đổi thế nào tháng vừa rồi?",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const Analyze = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load sessions
  useEffect(() => {
    if (!user) return;
    supabase
      .from("chat_sessions")
      .select("id, title, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        if (data) setSessions(data);
      });
  }, [user]);

  // Load messages of active session
  useEffect(() => {
    if (!activeSessionId) {
      setMessages([]);
      return;
    }
    supabase
      .from("chat_messages")
      .select("role, content")
      .eq("session_id", activeSessionId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data.filter((m) => m.role !== "system") as Msg[]);
      });
  }, [activeSessionId]);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const newSession = () => {
    setActiveSessionId(null);
    setMessages([]);
  };

  const deleteSession = async (id: string) => {
    await supabase.from("chat_sessions").delete().eq("id", id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) newSession();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !user || streaming) return;
    setInput("");
    setStreaming(true);

    const userMsg: Msg = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);

    // Ensure session exists
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

    // Persist user message
    await supabase.from("chat_messages").insert({
      session_id: sessionId,
      user_id: user.id,
      role: "user",
      content: text,
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? ""}`,
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast({ title: "Quá nhiều yêu cầu", description: "Thử lại sau ít phút.", variant: "destructive" });
        } else if (resp.status === 402) {
          toast({ title: "Hết credit AI", description: "Nạp thêm tại Settings → Workspace → Usage.", variant: "destructive" });
        } else {
          toast({ title: "Lỗi gọi AI", variant: "destructive" });
        }
        setStreaming(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) upsert(delta);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }

      // Persist assistant message
      if (assistantSoFar) {
        await supabase.from("chat_messages").insert({
          session_id: sessionId,
          user_id: user.id,
          role: "assistant",
          content: assistantSoFar,
        });
        await supabase.from("chat_sessions").update({ updated_at: new Date().toISOString() }).eq("id", sessionId);
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Lỗi kết nối", variant: "destructive" });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="container py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 h-[calc(100vh-8rem)]">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-3 border-b border-border">
            <Button onClick={newSession} variant="outline" className="w-full justify-start gap-2">
              <Plus className="h-4 w-4" /> Phiên mới
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions.length === 0 && (
              <p className="text-xs text-muted-foreground p-3">Chưa có phiên nào.</p>
            )}
            {sessions.map((s) => (
              <div
                key={s.id}
                className={`group flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${
                  activeSessionId === s.id
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
                onClick={() => setActiveSessionId(s.id)}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1 truncate">{s.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Xoá"
                >
                  <Trash2 className="h-3.5 w-3.5 hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat */}
        <section className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="font-display font-semibold">Phân tích thị trường</span>
            <span className="ml-auto text-xs font-mono text-muted-foreground">
              [mock data — MVP]
            </span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 md:p-8">
            {messages.length === 0 ? (
              <div className="max-w-2xl mx-auto py-10">
                <div className="text-center mb-8">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-data shadow-glow mb-4">
                    <Sparkles className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h2 className="font-display text-2xl font-bold mb-2">Hỏi về thị trường tuyển dụng</h2>
                  <p className="text-sm text-muted-foreground">
                    Mọi câu trả lời sẽ kèm trích dẫn nguồn và thời điểm crawl.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {SUGGESTED.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-left p-4 rounded-lg border border-border bg-background hover:border-primary/50 hover:bg-secondary/40 transition-all text-sm"
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
                    <div
                      className={`${
                        m.role === "user"
                          ? "max-w-[80%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm"
                          : "flex-1 prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-secondary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none"
                      }`}
                    >
                      {m.role === "user" ? m.content : <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>}
                    </div>
                  </div>
                ))}
                {streaming && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3">
                    <div className="h-8 w-8 shrink-0 rounded-md bg-gradient-data flex items-center justify-center">
                      <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                    </div>
                    <div className="flex items-center gap-1 pt-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse-dot" />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="border-t border-border p-3 flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi về nhu cầu kỹ năng, mức lương, biến động tuần..."
              disabled={streaming}
              className="flex-1"
            />
            <Button type="submit" disabled={streaming || !input.trim()} className="bg-gradient-data text-primary-foreground hover:opacity-90">
              {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Analyze;
