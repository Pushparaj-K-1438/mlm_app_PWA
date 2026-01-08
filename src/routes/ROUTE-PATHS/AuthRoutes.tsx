import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "@/components/ui/Loadable";
import AuthLayout from "@/layout/AuthLayout";
import Register from "@/app/Auth/Register";

// Lazy-loaded component
const Login = Loadable(lazy(() => import("../../app/Auth/Login")));
const Welcome = Loadable(lazy(() => import("../../app/Auth/Welcome")));

// Properly typed route config
const AuthRoutes = {
    path: "",
    element: <AuthLayout />,
    children: [
        {
            path: "",
            element: <Welcome />,
        },
        {
            path: "login",
            element: <Login />,
        },
        {
            path: "register",
            element: <Register />,
        },
    ],
};

export default AuthRoutes;
