import React, { ReactNode, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Video,
  GraduationCap,
  Trophy,
  Youtube,
  Users,
  Pin,
  Banknote,
  CreditCard,
  GitPullRequestCreateArrow,
  Phone,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROLE } from "@/constants/others";
import logo from "@/assets/logo.png";

interface MobileLayoutProps {
  children?: ReactNode;
}

// User menu items (matching sidebar)
const getUserMenuItems = (role: number) => {
  if (role === ROLE.ADMIN || role === ROLE.SUPER_ADMIN) {
    return [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/portal/admin/dashboard",
        icon: LayoutDashboard,
        color: "from-indigo-500 to-indigo-600",
      },
      {
        id: "daily-videos",
        label: "Daily Videos",
        path: "/portal/admin/daily-videos",
        icon: Video,
        color: "from-pink-500 to-rose-600",
      },
      {
        id: "training-videos",
        label: "Training Videos",
        path: "/portal/admin/training-videos",
        icon: GraduationCap,
        color: "from-green-500 to-emerald-600",
      },
      {
        id: "promotion-videos",
        label: "Promotion Videos",
        path: "/portal/admin/promotion-videos",
        icon: Trophy,
        color: "from-amber-500 to-orange-600",
      },
      {
        id: "youtube-channels",
        label: "YouTube Channels",
        path: "/portal/admin/youtube-channels",
        icon: Youtube,
        color: "from-red-500 to-rose-600",
      },
      {
        id: "users",
        label: "User Management",
        path: "/portal/admin/users",
        icon: Users,
        color: "from-purple-500 to-violet-600",
      },
      {
        id: "withdraw-request",
        label: "Withdraw Request",
        path: "/portal/admin/withdraw-request",
        icon: Banknote,
        color: "from-purple-500 to-violet-600",
      },
      {
        id: "pin-requests",
        label: "Pin Requests",
        path: "/portal/admin/pin-requests",
        icon: Pin,
        color: "from-teal-500 to-cyan-600",
      },
      {
        id: "referral-settings",
        label: "Promotion Settings",
        path: "/portal/admin/referral-settings",
        icon: Settings,
        color: "from-sky-500 to-blue-600",
      },
      {
        id: "profile-settings",
        label: "Profile Settings",
        path: "/portal/admin/profile-settings",
        icon: Settings,
        color: "from-gray-500 to-gray-600",
      },
    ];
  } else if (role === ROLE.USER) {
    return [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/portal/user/dashboard",
        icon: LayoutDashboard,
        color: "from-indigo-500 to-indigo-600",
      },
      {
        id: "daily-videos",
        label: "Daily Videos",
        path: "/portal/user/daily-video-watch",
        icon: Video,
        color: "from-pink-500 to-rose-600",
      },
      {
        id: "training-videos",
        label: "Training Videos",
        path: "/portal/user/training-program",
        icon: GraduationCap,
        color: "from-green-500 to-emerald-600",
      },
      {
        id: "promotion-videos",
        label: "Promotion Videos",
        path: "/portal/user/promotion-videos",
        icon: Trophy,
        color: "from-amber-500 to-orange-600",
      },
      {
        id: "youtube-channels",
        label: "YouTube Channels",
        path: "/portal/user/youtube-channels",
        icon: Youtube,
        color: "from-red-500 to-rose-600",
      },
      {
        id: "referrals",
        label: "My Promoters",
        path: "/portal/user/referrals",
        icon: Users,
        color: "from-purple-500 to-violet-600",
      },
      {
        id: "pin-requests",
        label: "My Pins",
        path: "/portal/user/pin-requests",
        icon: Pin,
        color: "from-teal-500 to-cyan-600",
      },
      {
        id: "earnings-history",
        label: "Earnings History",
        path: "/portal/user/earnings-history",
        icon: Banknote,
        color: "from-sky-500 to-blue-600",
      },
      {
        id: "withdraw-requests",
        label: "Withdraw Requests",
        path: "/portal/user/withdraw-requests",
        icon: GitPullRequestCreateArrow,
        color: "from-sky-500 to-blue-600",
      },
      {
        id: "scratch-card",
        label: "Scratch Card",
        path: "/portal/user/scratch-card",
        icon: CreditCard,
        color: "from-sky-500 to-blue-600",
      },
      {
        id: "contact-us",
        label: "Contact Us",
        path: "/portal/user/contact-us",
        icon: Phone,
        color: "from-green-500 to-emerald-600",
      },
      {
        id: "profile-settings",
        label: "Profile Settings",
        path: "/portal/user/profile-settings",
        icon: Settings,
        color: "from-gray-500 to-gray-600",
      },
    ];
  }
  return [];
};

// Bottom navigation items (most frequently used)
const getBottomNavItems = (role: number) => {
  if (role === ROLE.ADMIN || role === ROLE.SUPER_ADMIN) {
    return [
      { path: "/portal/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/portal/admin/users", icon: Users, label: "Users" },
      { path: "/portal/admin/pin-requests", icon: Pin, label: "Pins" },
      { path: "/portal/admin/training-videos", icon: GraduationCap, label: "Training" },
      { path: "/portal/admin/profile-settings", icon: Settings, label: "Profile" },
    ];
  } else if (role === ROLE.USER) {
    return [
      { path: "/portal/user/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/portal/user/daily-video-watch", icon: Video, label: "Daily" },
      { path: "/portal/user/training-program", icon: GraduationCap, label: "Training" },
      { path: "/portal/user/referrals", icon: Users, label: "Promoters" },
      { path: "/portal/user/profile-settings", icon: Settings, label: "Profile" },
    ];
  }
  return [];
};

export default function MobileLayout({ children }: MobileLayoutProps) {
  const { role, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = role !== undefined && role !== null;
  const isAdmin = role === ROLE.ADMIN || role === ROLE.SUPER_ADMIN;

  // Don't show bottom navigation on login/register pages
  const hideNavPaths = ["/login", "/register"];
  const shouldHideNav = hideNavPaths.some((path) => location.pathname === path);

  const menuItems = getUserMenuItems(role);
  const bottomNavItems = getBottomNavItems(role);

  // Get user info for header
  const userName = user?.username || user?.name || "User";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Header */}
      {isLoggedIn && !shouldHideNav && (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40">
          <div className="flex items-center justify-between px-4 h-14">
            {/* Logo and hamburger menu */}
            <div className="flex items-center space-x-3">
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SheetHeader className="p-4 border-b">
                    <div className="flex items-center space-x-3">
                      <img src={logo} alt="Starup" className="w-10 h-10" />
                      <SheetTitle className="text-lg">Menu</SheetTitle>
                    </div>
                  </SheetHeader>

                  {/* User Info */}
                  <div className="p-4 border-b bg-gradient-to-r from-green-50 to-blue-50">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-gradient-to-r from-green-600 to-yellow-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{userName}</p>
                        <p className="text-xs text-gray-500">
                          {isAdmin ? "Administrator" : "Promoter"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
                    <nav className="p-2 space-y-1">
                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                          <Link
                            key={item.id}
                            to={item.path}
                            onClick={() => setMenuOpen(false)}
                            className={cn(
                              "flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200",
                              isActive
                                ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                                : "text-gray-700 hover:bg-gray-100"
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5 flex-shrink-0",
                                isActive ? "text-white" : "text-gray-500"
                              )}
                            />
                            <span className="ml-3 font-medium">{item.label}</span>
                            {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Logout Button */}
                  <div className="p-4 border-t">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <img src={logo} alt="Starup" className="w-8 h-8" />
              <span className="font-bold text-gray-900">Starup</span>
            </div>

            {/* Logout button in header */}
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>
      )}

      {/* Main content with top padding for header */}
      <div className={cn("w-full", isLoggedIn && !shouldHideNav && "pt-14")}>
        {children || <Outlet />}
      </div>

      {/* Bottom Navigation Bar - Only show when logged in */}
      {isLoggedIn && !shouldHideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="flex justify-around items-center h-16">
            {bottomNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full transition-colors duration-200",
                    isActive ? "text-green-600" : "text-gray-500"
                  )}
                >
                  <Icon
                    className={cn("w-6 h-6", isActive && "fill-green-100")}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span
                    className={cn(
                      "text-xs mt-1 font-medium",
                      isActive ? "text-green-600" : "text-gray-500"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
