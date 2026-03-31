import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import LandingPageV2 from "./pages/LandingPageV2";

// Admin — lazy loaded (not needed for public LP visitors)
const LandingPagesV2 = lazy(() => import("./pages/admin/LandingPagesV2"));
const LPEditorV2 = lazy(() => import("./pages/admin/landpage/LPEditorV2"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Tela de entrada — lista de LPs */}
          <Route path="/" element={<Navigate to="/admin/lps" replace />} />
          {/* LP publica */}
          <Route path="/l/:slug" element={<LandingPageV2 />} />
          {/* Admin — lazy loaded */}
          <Route path="/admin/lps" element={<Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}><LandingPagesV2 /></Suspense>} />
          <Route path="/admin/lps/:lpKey" element={<Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}><LPEditorV2 /></Suspense>} />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
