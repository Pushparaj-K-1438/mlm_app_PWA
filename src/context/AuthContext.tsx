import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/CustomAxios";
import { API_AUTH_USER } from "@/utils/http/apiPaths";
import Lib from "@/utils/Lib";
import { useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { ROLE } from "@/constants/others";

// PWA is the end-user surface only. Admin/super-admin must use the web console.
const ALLOWED_ROLES: number[] = [ROLE.USER];

interface User {
  id: string;
  username: string;
  role: number;
  [key: string]: unknown;
}

export type JwtPayload = {
  [key: string]: any;
};
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  role?: number | null;
  logout: (redirect?: boolean) => void;
  login: (token: string | undefined | null) => void;
}

// Create context with initial undefined (will throw if used outside provider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { navigate } = useQueryParams();
  const location = useLocation();
  const [role, setRole] = useState<number | null>(null);

  const [user, setUser] = useState<User | null>(() => {
    return null;
  });

  useEffect(() => {
    setIsLoading(true);
    let token: string | null | undefined = Lib.getCookies("session-token");
    let decordToken: JwtPayload = token ? Lib.DecodeJwt(token) : null;
    const now = Math.floor(Date.now() / 1000);
    const hasLiveToken =
      !!token && decordToken?.role !== undefined && decordToken?.exp > now;
    if (hasLiveToken && ALLOWED_ROLES.includes(decordToken.role)) {
      setUpUserData(decordToken);
    } else {
      if (hasLiveToken) {
        // Stale admin session — explain why we're kicking them back to login.
        toast.error("Admin accounts must use the web console.");
      }
      logout(true);
    }
  }, [location.pathname]);

  const setUpUserData = (decordToken: any) => {
    setRole(decordToken?.role);
    setUser((prv) => ({
      name: decordToken?.username,
      id: decordToken?.id,
      username: decordToken?.username,
      role: decordToken?.role,
    }));
    setIsLoading(false);
  };

  // Function to handle logout
  const logout = (redirect: boolean = false) => {
    setIsLoading(false);
    setRole(null);
    Lib.removeCookies("session-token");
  };

  const login = (token: string | undefined | null) => {
    let decordToken: JwtPayload = token ? Lib.DecodeJwt(token) : null;
    if (!token || decordToken?.role === undefined) {
      logout();
      return;
    }
    if (!ALLOWED_ROLES.includes(decordToken.role)) {
      toast.error("Admin accounts must use the web console.");
      logout();
      return;
    }
    Lib.setCookies({
      name: "session-token",
      value: token,
      exp: decordToken?.exp ? Lib.expiredSec(decordToken?.exp ?? 1) : 1,
    });
    setUpUserData(decordToken);
    navigate.push("/portal/user/dashboard");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    role,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
