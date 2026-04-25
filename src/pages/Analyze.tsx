import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, BarChart3 } from "lucide-react";
import { ChatbotPanel } from "@/components/analyze/ChatbotPanel";
import { DashboardPanel } from "@/components/analyze/DashboardPanel";

const Analyze = () => {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "dashboard" ? "dashboard" : "chat";

  return (
    <div className="h-full bg-gradient-to-b from-background via-background to-secondary/10 p-3 md:p-4 flex flex-col">
      <Tabs
        value={tab}
        onValueChange={(v) => setParams({ tab: v }, { replace: true })}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="self-start mb-3 glass-surface bg-transparent border border-border/30 h-10">
          <TabsTrigger value="chat" className="gap-2 data-[state=active]:bg-gradient-data data-[state=active]:text-primary-foreground">
            <MessageSquare className="h-4 w-4" /> {t("analyze.tabs.chat")}
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-gradient-data data-[state=active]:text-primary-foreground">
            <BarChart3 className="h-4 w-4" /> {t("analyze.tabs.dashboard")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 mt-0 min-h-0 data-[state=inactive]:hidden">
          <ChatbotPanel />
        </TabsContent>
        <TabsContent value="dashboard" className="flex-1 mt-0 min-h-0 data-[state=inactive]:hidden overflow-hidden">
          <DashboardPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analyze;
