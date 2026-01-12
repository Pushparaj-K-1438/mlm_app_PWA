import { Navigate, useRoutes } from "react-router-dom";
import AuthRoutes from "./ROUTE-PATHS/AuthRoutes";
import AdminRoutes from "./ROUTE-PATHS/AdminRoutes";
import NormalUserRoutes from "./ROUTE-PATHS/NormalUserRoutes";
import { useAuthRole } from "@/hooks/useAuthRole";
import { useAuth } from "@/context/AuthContext";
import { ROLE } from "@/constants/others";
export default function AllRoutes(): React.ReactElement | null {
  const { isLoading, role } = useAuth();
  const routes = [];
  if (role === ROLE.ADMIN || role === ROLE.SUPER_ADMIN) {
    routes.push(AdminRoutes);
  } else if (role === ROLE.USER) {
    routes.push(NormalUserRoutes);
  } else {
    routes.push(AuthRoutes);
  }

  routes.push({
    path: "*",
    element: (
      <Navigate
        to={
          role === ROLE.ADMIN || role === ROLE.SUPER_ADMIN
            ? "/portal/admin/dashboard"
            : role === ROLE.USER
            ? "/portal/user/dashboard"
            : "/"
        }
        replace
      />
    ),
  });

  const routeElements = useRoutes(routes);

  // Show loading spinner while authentication is being verified
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return routeElements;
}
