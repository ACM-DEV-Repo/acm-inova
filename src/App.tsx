import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import LandingPageV2 from "./pages/LandingPageV2";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { AdminLayout } from "./components/admin/layout/AdminLayout";

// Admin — lazy loaded (not needed for public LP visitors)
const LandingPagesV2 = lazy(() => import("./pages/admin/LandingPagesV2"));
const LPEditorV2 = lazy(() => import("./pages/admin/landpage/LPEditorV2"));

const AdminFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Entrada */}
          <Route path="/" element={<Navigate to="/admin/lps" replace />} />
          {/* Login */}
          <Route path="/login" element={<Login />} />
          {/* LP publica */}
          <Route path="/l/:slug" element={<LandingPageV2 />} />
          {/* Admin com sidebar — rotas que usam o layout global */}
          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin/lps" element={<Suspense fallback={<AdminFallback />}><LandingPagesV2 /></Suspense>} />
          </Route>
          {/* Editor — full-screen próprio, fora do AdminLayout */}
          <Route path="/admin/lps/:lpKey" element={<ProtectedRoute><Suspense fallback={<AdminFallback />}><LPEditorV2 /></Suspense></ProtectedRoute>} />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
