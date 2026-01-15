// @ts-nocheck
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Search,
  Settings,
  Moon,
  Sun,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/InputText";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Sidebar from "./SideBar/SideBar";
import Header from "./Header/Header";
import { useAuth } from "@/context/AuthContext";
import { Outlet } from "react-router-dom";
import DailyVideoFormModal from "@/components/FormModals/DailyVideoModal/DailyVideoFormModal";
import { ROLE } from "@/constants/others";

const roleLabels: Record<number, string> = {
  0: "Admin",
  2: "User",
};

const PortalLayout = () => {
  const { user, role, logout } = useAuth();
  const userObj = typeof user === "string" ? JSON.parse(user) : user;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // call logout from context
    // optionally redirect or show message here
  };

  const getPageTitle = (): string => {
    const path = location.pathname;
    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/daily":
        return "Purchase Orders";

      default:
        return role === ROLE.ADMIN || role === ROLE.SUPER_ADMIN ? "Admin Panel" : "User Panel";
    }
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={{
          role,
          ...user,
        }}
        navigate={navigate}
        currentPath={location.pathname}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        } bg-gray-50 dark:bg-gray-900`}
      >
        {/* Header */}
        {headerVisible && (
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="items-center space-x-2 hidden md:flex">
                <div className="h-8 w-8 bg-gradient-to-r from-green-600 to-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{role === ROLE.ADMIN || role === ROLE.SUPER_ADMIN ? "AP" : "UP"}</span>
                </div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  {getPageTitle()}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4">
                    <h3 className="font-semibold">Notifications</h3>
                    <div className="mt-2 space-y-2">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium">New PO Created</p>
                        <p className="text-xs text-gray-600">
                          PO-00051 by John Doe
                        </p>
                      </div>
                      <div className="p-2 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium">Design Approved</p>
                        <p className="text-xs text-gray-600">
                          Drawing for PO-00048
                        </p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu> */}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-gradient-to-r from-green-600 to-yellow-600 text-white">
                        {userObj?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {userObj?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {roleLabels[userObj?.role]}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Link to={role === ROLE.ADMIN || role === ROLE.SUPER_ADMIN ? "/portal/admin/profile-settings" : "/portal/user/profile-settings"} className="flex">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className={`p-2 ${headerVisible ? "" : "pt-2"} min-h-screen`}>
          <div className="fixed bottom-4 right-4 z-50"></div>
          {/* <main className={`p-2 w-screen overflow-x-auto ${headerVisible ? "pt-2" : ""} min-h-screen`}> */}
          {/* {children} */}
          <Outlet context={{ sidebarCollapsed }} />
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
