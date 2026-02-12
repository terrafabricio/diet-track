import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import Login from "./pages/Login";
import AppDashboard from "./pages/AppDashboard";
import ReceberNF from "./pages/ReceberNF";
import ImportarAF from "./pages/ImportarAF";
import Confrontar from "./pages/Confrontar";
import Relatorios from "./pages/Relatorios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<AppLayout><AppDashboard /></AppLayout>} />
          <Route path="/app/receber" element={<AppLayout><ReceberNF /></AppLayout>} />
          <Route path="/app/importar-af" element={<AppLayout><ImportarAF /></AppLayout>} />
          <Route path="/app/confrontar" element={<AppLayout><Confrontar /></AppLayout>} />
          <Route path="/app/relatorios" element={<AppLayout><Relatorios /></AppLayout>} />
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
