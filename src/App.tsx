import React from "react";
import { Toaster } from "@/components/ui/Toaster";
import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter } from "react-router-dom";
// NOTE: the desktop tree (routes/AllRoutes + routes/ROUTE-PATHS/*) is dead — it
// was behind a hard-coded `isMobileApp = true`, so it could never render, yet
// importing it here dragged PortalLayout, AuthLayout, Register and
// WithDrawRequest into the main bundle for every user. The files are still on
// disk; re-add the import if the desktop tree is ever brought back.
import MobileRoutes from "./mobile/routes/MobileRoutes";
import { AuthProvider } from "./context/AuthContext";
// import { ThemeProvider } from "./context/ThemeContext";
import { DataProvider } from "./context/DataContext";
import ConnectionError from "@/components/ConnectionError";

// This app is mobile-only: MobileRoutes is the single route tree that ships.
//
// @tanstack/react-query was previously mounted here as a provider, but nothing
// in the app ever called useQuery/useMutation (all data goes through the
// useGetCall / useActionCall hooks), so it was removed — it was pure weight in
// the main bundle. Re-add QueryClientProvider if react-query is ever adopted.
const App: React.FC = () => {
  return (
    <BrowserRouter>
        {/* <ThemeProvider> */}
        <AuthProvider>
          <DataProvider>
            <TooltipProvider>
              <MobileRoutes />
              <Toaster />
              <HotToaster />
              <Sonner />
              <ConnectionError />
            </TooltipProvider>
          </DataProvider>
        </AuthProvider>
      {/* </ThemeProvider> */}
    </BrowserRouter>
  );
};

export default App;
