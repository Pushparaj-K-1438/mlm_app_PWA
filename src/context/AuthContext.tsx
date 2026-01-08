import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axiosInstance from "@/utils/CustomAxios";
import { API_AUTH_USER } from "@/utils/http/apiPaths";
import Lib from "@/utils/Lib";
import { useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { ROLE } from "@/constants/others";

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
    logout: () => void;
    login: (token: string | undefined | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    const [role, setRole] = useState<number | null>(null);

    const [user, setUser] = useState<User | null>(() => {
        return null;
    });

    useEffect(() => {
        let token: string | null | undefined = Lib.getCookies("session-token");
        let decordToken: JwtPayload = token ? Lib.DecodeJwt(token) : null;

        // Only allow customer role (2)
        if (token && decordToken?.role === ROLE.USER) {
            setUpUserData(decordToken);
        } else {
            logout();
        }
    }, []);

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

    const logout = (redirect: boolean = false) => {
        setIsLoading(false);
        setRole(null);
        Lib.removeCookies("session-token");
    };

    const login = (token: string | undefined | null) => {
        let TokenDecoder: JwtPayload = Lib.DecodeJwt(token);
        let decordToken: JwtPayload = token ? Lib.DecodeJwt(token) : null;

        // Only allow customer role (2)
        if (token && decordToken?.role === ROLE.USER) {
            Lib.setCookies({
                name: "session-token",
                value: token,
                exp: decordToken?.exp ? Lib.expiredSec(decordToken?.exp ?? 1) : 1,
            });
            setUpUserData(decordToken);
            navigate.push("/portal/user/dashboard");
        } else {
            // Reject admin login attempts
            logout();
            alert("Access denied. This app is for customers only.");
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
