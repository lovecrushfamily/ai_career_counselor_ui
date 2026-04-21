import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AdminRoute } from "@/components/layout/AdminRoute";
import Landing from "./pages/Landing";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Analyze from "./pages/Analyze";
import Admin from "./pages/Admin";
import Guide from "./pages/Guide";
import NotFound from "./pages/NotFound";
import { Walkthrough } from "@/components/Walkthrough";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Walkthrough />
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/analyze" element={<ProtectedRoute><Analyze /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
