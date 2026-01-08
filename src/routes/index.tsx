import { useRoutes, Navigate } from "react-router-dom";
import AuthRoutes from "./ROUTE-PATHS/AuthRoutes";
import NormalUserRoutes from "./ROUTE-PATHS/NormalUserRoutes";
import { useAuth } from "@/context/AuthContext";

const AppRoutes = () => {
    const { isLoading, role } = useAuth();

    const routes = useRoutes([
        AuthRoutes,
        NormalUserRoutes,
        {
            path: "*",
            element: <Navigate to={role === 2 ? "/portal/user/dashboard" : "/login"} replace />,
        },
    ]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return routes;
};

export default AppRoutes;
