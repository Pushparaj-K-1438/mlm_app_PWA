import React, { useMemo } from "react";
import { Toaster } from "@/components/ui/Toaster";
import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./routes/AllRoutes";
import MobileRoutes from "./mobile/routes/MobileRoutes";
import { AuthProvider } from "./context/AuthContext";
// import { ThemeProvider } from "./context/ThemeContext";
import { DataProvider } from "./context/DataContext";
const queryClient = new QueryClient();

const App: React.FC = () => {
  // Detect if the app is running as a mobile app or on a mobile device
  // const isMobileApp = useMemo(() => {
  //   // Check if it's a PWA (standalone mode)
  //   const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
  //                       (window.navigator as any).standalone === true;

  //   // Check if mobile device
  //   const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  //     navigator.userAgent
  //   ) || window.innerWidth < 768;
  //   // Use mobile routes if it's a PWA or a small screen device
  //   return isStandalone || isMobileDevice;
  // }, []);
    const isMobileApp=true;

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* <ThemeProvider> */}
        <AuthProvider>
          <DataProvider>
            <TooltipProvider>
              {isMobileApp ? <MobileRoutes /> : <AllRoutes />}
              <Toaster />
              <HotToaster />
              <Sonner />
            </TooltipProvider>
          </DataProvider>
        </AuthProvider>
        {/* </ThemeProvider> */}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
