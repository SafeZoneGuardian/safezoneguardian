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

  // === CRISP CHAT (stark nach links) ===
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

    // Warte länger und setze Position aggressiv auf links
    const interval = setInterval(() => {
      if (window.$crisp) {
        window.$crisp.push(["config", "position:reverse", [true]]);
        window.$crisp.push(["do", "chat:show"]);
        // Extra CSS Override für mehr Sicherheit
        const style = document.createElement('style');
        style.innerHTML = `
          .crisp-client .cc-chat-window { left: 20px !important; right: auto !important; }
        `;
        document.head.appendChild(style);
        
        clearInterval(interval);
      }
    }, 1500);
  }, []);

  // === CACHE FIX GEGEN WHITE SCREEN ===
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => reg.unregister());
      });
    }

    if (window.caches) {
      window.caches.keys().then((names) => {
        names.forEach((name) => window.caches.delete(name));
      });
    }

    try {
      localStorage.setItem('szg_version', Date.now().toString());
    } catch (e) {}
  }, []);

  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>