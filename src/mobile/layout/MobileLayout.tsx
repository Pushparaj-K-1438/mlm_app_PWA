import React, { ReactNode, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Video,
  GraduationCap,
  Trophy,
  Youtube,
  Users,
  Pin,
  Package,
  Banknote,
  CreditCard,
  GitPullRequestCreateArrow,
  Phone,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  UserCircle,
  ShoppingCart,
  Shield,
  HelpCircle,
  FileText,
  MessageSquare,
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
import BirthdayModal from "@/components/BirthdayModal";

interface MobileLayoutProps {
  children?: ReactNode;
}

// Top-level user menu paths. Pressing browser-back from any of these (when
// no modal is open) should jump straight to the dashboard rather than
// drilling back through previously-visited menus. Dashboard itself is
// deliberately NOT in this list — back from dashboard keeps default
// browser behavior.
const USER_DASHBOARD_PATH = "/portal/user/dashboard";
const TOP_LEVEL_USER_MENUS = [
  "/portal/user/daily-video-watch",
  "/portal/user/training-program",
  "/portal/user/promotion-videos",
  "/portal/user/pin-requests",
  "/portal/user/box-requests",
  "/portal/user/referrals",
  "/portal/user/earnings-history",
  "/portal/user/withdraw-requests",
  "/portal/user/youtube-channels",
  "/portal/user/profile-settings",
  "/portal/user/scratch-card",
  "/portal/user/contact-us",
  "/portal/user/support-help",
  "/portal/user/suggestions",
  "/portal/user/terms-and-conditions",
  "/portal/user/repurchase",
  "/portal/user/sbi-life",
];

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
        label: "Product Pin",
        path: "/portal/user/pin-requests",
        icon: Pin,
        color: "from-teal-500 to-cyan-600",
      },
      {
        id: "box-requests",
        label: "Plan Product",
        path: "/portal/user/box-requests",
        icon: Package,
        color: "from-amber-500 to-orange-600",
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
        id: "repurchase",
        label: "Continuity Purchase",
        path: "/portal/user/repurchase",
        icon: ShoppingCart,
        color: "from-orange-500 to-amber-600",
      },
      {
        id: "sbi-life",
        label: "SBI Life",
        path: "/portal/user/sbi-life",
        icon: Shield,
        color: "from-blue-500 to-indigo-600",
      },
      {
        id: "contact-us",
        label: "Contact Us",
        path: "/portal/user/contact-us",
        icon: Phone,
        color: "from-green-500 to-emerald-600",
      },
      {
        id: "support-help",
        label: "Support & Help",
        path: "/portal/user/support-help",
        icon: HelpCircle,
        color: "from-blue-500 to-indigo-600",
      },
      {
        id: "suggestions",
        label: "Suggestions",
        path: "/portal/user/suggestions",
        icon: MessageSquare,
        color: "from-cyan-500 to-blue-600",
      },
      {
        id: "terms-and-conditions",
        label: "Terms & Conditions",
        path: "/portal/user/terms-and-conditions",
        icon: FileText,
        color: "from-slate-500 to-gray-600",
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
      { path: "/portal/admin/dashboard", icon: LayoutDashboard, label: "Home" },
      { path: "/portal/admin/users", icon: Users, label: "Users" },
      { path: "/portal/admin/pin-requests", icon: Pin, label: "Pins" },
      { path: "/portal/admin/training-videos", icon: GraduationCap, label: "Training" },
      { path: "/portal/admin/profile-settings", icon: UserCircle, label: "Profile" },
    ];
  } else if (role === ROLE.USER) {
    return [
      { path: "/portal/user/dashboard", icon: LayoutDashboard, label: "Home" },
      { path: "/portal/user/daily-video-watch", icon: Video, label: "Daily" },
      { path: "/portal/user/training-program", icon: GraduationCap, label: "Training" },
      { path: "/portal/user/referrals", icon: Users, label: "Promoters" },
      { path: "/portal/user/profile-settings", icon: UserCircle, label: "Profile" },
    ];
  }
  return [];
};

export default function MobileLayout({ children }: MobileLayoutProps) {
  const { role, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = role !== undefined && role !== null;
  const isAdmin = role === ROLE.ADMIN || role === ROLE.SUPER_ADMIN;

  // Back-to-dashboard guard.
  // When ROLE.USER is on a top-level menu page AND no modal is open
  // (modals in this app use a `?Modal=...` query param), the next browser
  // back press should land on the dashboard rather than the previously
  // visited menu. Mechanism: push a sentinel history entry so the first
  // back press fires popstate while we're still on the same URL; handler
  // intercepts and navigates to dashboard with replace (so forward arrow
  // doesn't bounce back). Inner pages / open modals are excluded so their
  // natural back behavior (close modal, go to parent) is preserved.
  const isModalOpen = !!searchParams.get("Modal");
  const shouldGuardBack =
    role === ROLE.USER &&
    TOP_LEVEL_USER_MENUS.includes(location.pathname) &&
    !isModalOpen;

  useEffect(() => {
    if (!shouldGuardBack) return;

    window.history.pushState(null, "", window.location.href);

    const onPopState = () => {
      navigate(USER_DASHBOARD_PATH, { replace: true });
    };

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [shouldGuardBack, navigate]);

  // Don't show bottom navigation on login/register pages
  const hideNavPaths = ["/login", "/register"];
  const shouldHideNav = hideNavPaths.some((path) => location.pathname === path);

  const menuItems = getUserMenuItems(role);
  const bottomNavItems = getBottomNavItems(role);

  // Get user info for header
  const userName = user?.username || user?.name || "User";

  return (
    <div className="min-h-screen bg-gray-50 pb-20 safe-area-inset-bottom">
      {/* Top Header */}
      {isLoggedIn && !shouldHideNav && (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 shadow-sm z-40 safe-area-inset-top">
          <div className="flex items-center justify-between px-4 h-16">
            {/* Logo and hamburger menu */}
            <div className="flex items-center space-x-3">
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SheetHeader className="p-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center p-2">
                          <img src={logo} alt="Starup" className="w-full h-full object-contain" />
                        </div>
                        <SheetTitle className="text-xl font-bold text-gray-800">Menu</SheetTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMenuOpen(false)}
                        className="h-8 w-8 rounded-full"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </SheetHeader>

                  {/* User Info */}
                  <div className="p-5 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="flex items-center space-x-4">
                      <div className="h-14 w-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-lg truncate">{userName}</p>
                        <p className="text-xs text-white/80">
                          {isAdmin ? "Administrator" : "Promoter"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="flex-1 overflow-y-auto max-h-[calc(100vh-265px)]">
                    <nav className="p-4 space-y-2">
                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                          <Link
                            key={item.id}
                            to={item.path}
                            onClick={() => setMenuOpen(false)}
                            className={cn(
                              "flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 group",
                              isActive
                                ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                                : "text-gray-700 hover:bg-gray-100"
                            )}
                          >
                            <div className={cn(
                              "p-2 rounded-lg mr-3",
                              isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-gray-200"
                            )}>
                              <Icon
                                className={cn(
                                  "h-5 w-5",
                                  isActive ? "text-white" : "text-gray-600"
                                )}
                              />
                            </div>
                            <span className="font-medium">{item.label}</span>
                            {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Logout Button */}
                  <div className="p-4 border-t bg-gray-50">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-12"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      <span className="font-medium">Logout</span>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center p-2">
                          <img src={logo} alt="Starup" className="w-full h-full object-contain" />
                        </div>
                <span className="font-bold text-xl text-gray-800">Starup</span>
              </div>
            </div>

            {/* Notification or profile button in header */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200"
              onClick={() => navigate('/portal/user/profile-settings')}
            >
              <UserCircle className="h-6 w-6 text-gray-600" />
            </Button>
          </div>
        </header>
      )}

      {/* Main content with top padding for header */}
      <div className={cn("w-full", isLoggedIn && !shouldHideNav && "pt-16")}>
        {children || <Outlet />}
      </div>

      {/* Bottom Navigation Bar - Only show when logged in */}
      {isLoggedIn && !shouldHideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl z-50 safe-area-inset-bottom">
          <div className="flex justify-around items-center h-20">
            {bottomNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full transition-all duration-200 relative",
                    isActive ? "text-blue-600" : "text-gray-500"
                  )}
                >
                  {isActive && (
                    <div className="absolute top-0 w-10 h-1 bg-blue-600 rounded-b-full"></div>
                  )}
                  <div className={cn(
                    "p-2 rounded-xl transition-all duration-200",
                    isActive ? "bg-blue-50" : ""
                  )}>
                    <Icon
                      className={cn("w-6 h-6", isActive && "text-blue-600")}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-1 font-medium",
                      isActive ? "text-blue-600" : "text-gray-500"
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

      {/* Birthday Modal */}
      <BirthdayModal />
    </div>
  );
}