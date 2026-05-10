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

  // === CRISP CHAT (links positioniert) ===
  useEffect(() => {
    if (window.$crisp || document.querySelector('script[src*="crisp.chat"]')) {
      return;
    }

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "f8df0bc3-ed86-4f5c-bd08-ee77d29ffb48";

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async