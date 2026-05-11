import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {

  // === CRISP CHAT (auf der linken Seite) ===
  useEffect(() => {
    if (window.$crisp || document.querySelector('script[src*="crisp.chat"]')) {
      return;
    }

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "f8df0bc3-ed86-4f5c-bd08-ee77d29ffb48";

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);

    // Chat nach links verschieben
    const interval = setInterval(() => {
      if (window.$crisp) {
        window.$crisp.push(["config", "position:reverse", [true]]);
        window.$crisp.push(["do", "chat:show"]);
        clearInterval(interval);
      }
    }, 1200);
  }, []);

  // === STARKER CACHE FIX GEGEN WHITE SCREEN ===
  useEffect(() => {
    // Service Worker deaktivieren
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => {
          reg.unregister();
        });
      });
    }

    // Alle Browser-Caches löschen
    if (window.caches) {
      window.caches.keys().then((names) => {
        names.forEach((name) => {
          window.caches.delete(name);
        });
      });
    }

    // Versionierung für besseres Cache-Busting
    try {
      localStorage.setItem('szg_version', Date.now().toString());
    } catch (e) {}
  }, []);

  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;