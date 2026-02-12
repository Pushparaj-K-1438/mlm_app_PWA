import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import axiosInstance from "@/utils/CustomAxios";
import { API_AUTH_USER } from "@/utils/http/apiPaths";
import Lib from "@/utils/Lib";
import { useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";

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
    if (token && decordToken?.role !== undefined && decordToken?.exp > now) {
      setUpUserData(decordToken);
    } else {
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
    let TokenDecoder: JwtPayload = Lib.DecodeJwt(token);
    let decordToken: JwtPayload = token ? Lib.DecodeJwt(token) : null;
    if (token && decordToken?.role !== undefined) {
      Lib.setCookies({
        name: "session-token",
        value: token,
        exp: decordToken?.exp ? Lib.expiredSec(decordToken?.exp ?? 1) : 1,
      });
      setUpUserData(decordToken);
      navigate.push(
        TokenDecoder?.role == 2
          ? "/portal/user/dashboard"
          : "/portal/admin/dashboard"
      );
    } else {
      logout();
    }
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
