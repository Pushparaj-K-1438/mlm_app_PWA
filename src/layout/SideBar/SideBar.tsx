// @ts-nocheck

import React, { useState } from "react";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  LayoutDashboard,
  PackageCheck,
  PackageMinus,
  ChevronDown,
  Video,
  GraduationCap,
  Trophy,
  Youtube,
  Banknote,
  Pin,
  CreditCard,
  BanknoteArrowUp,
  GitPullRequestCreateArrow,
  Phone,
} from "lucide-react";
import { ROLE } from "@/constants/others";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Sidebar = ({
  collapsed,
  onToggle,
  onLogout,
  user,
  navigate,
  currentPath,
}) => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (id) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const getMenuItems = () => {
    let baseItems = [];
    baseItems = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path:
          user.role === ROLE.ADMIN || user.role === ROLE.SUPER_ADMIN
            ? "/portal/admin/dashboard"
            : user.role === ROLE.USER
            ? "/portal/user/dashboard"
            : "/",
        color: "from-indigo-500 to-indigo-600",
      },
    ];
    if (user.role === ROLE.ADMIN || user.role === ROLE.SUPER_ADMIN) {
      baseItems.push({
        id: "daily-videos",
        label: "Daily Videos",
        path: "/portal/admin/daily-videos",
        icon: Video,
        color: "from-pink-500 to-rose-600",
      });
      baseItems.push({
        id: "training-videos",
        label: "Training Videos",
        path: "/portal/admin/training-videos",
        icon: GraduationCap,
        color: "from-green-500 to-emerald-600",
      });
      baseItems.push({
        id: "promotion-videos",
        label: "Promotion Videos",
        path: "/portal/admin/promotion-videos",
        icon: Trophy,
        color: "from-amber-500 to-orange-600",
      });
      baseItems.push({
        id: "youtube-channels",
        label: "YouTube Channels",
        path: "/portal/admin/youtube-channels",
        icon: Youtube,
        color: "from-red-500 to-rose-600",
      });
      baseItems.push({
        id: "user-management",
        label: "User Management",
        path: "/portal/admin/users",
        icon: Users,
        color: "from-purple-500 to-violet-600",
      });
      baseItems.push({
        id: "withdraw-request",
        label: "Withdraw Request",
        path: "/portal/admin/withdraw-request",
        icon: Banknote,
        color: "from-purple-500 to-violet-600",
      });

      baseItems.push({
        id: "pin-requests",
        label: "Pin Requests",
        path: "/portal/admin/pin-requests",
        icon: Pin,
        color: "from-teal-500 to-cyan-600",
      });
      baseItems.push({
        id: "referral-settings",
        label: "Promotion Settings",
        path: "/portal/admin/referral-settings",
        icon: Settings,
        color: "from-sky-500 to-blue-600",
      });
    } else if (user.role === ROLE.USER) {
      baseItems.push(
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
          id: "my-referrals",
          label: "My Promoters",
          path: "/portal/user/referrals",
          icon: Users,
          color: "from-purple-500 to-violet-600",
        },
        {
          id: "pin-management",
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
        }
      );
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 h-16">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="w-12 h-12" />
            {/* <div className="h-8 w-8 bg-gradient-to-r from-green-600 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div> */}
            <div>
              <h1 className="font-bold text-gray-800 dark:text-white">
                Star Up
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400"></p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = !!item.children?.length;
            const isExpanded = expandedMenus[item.id];
            const isActive =
              currentPath === item.path ||
              item?.children?.some((child) => currentPath === child.path);

            return (
              <div key={item.id} className="relative group">
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {hasChildren ? (
                        <button
                          onClick={() => toggleMenu(item.id)}
                          className={cn(
                            "flex items-center w-full h-12 rounded-md transition-all duration-200 px-4",
                            isActive
                              ? `bg-gradient-to-r ${item.color} text-white shadow-lg hover:shadow-xl`
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4 flex-shrink-0 mr-3",
                              isActive
                                ? "text-white"
                                : "text-gray-500 dark:text-gray-400"
                            )}
                          />
                          <div className="flex items-center justify-between w-full min-w-0">
                            <span className="text-xs truncate">
                              {item.label}
                            </span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transform transition-transform duration-300",
                                isExpanded && "rotate-180"
                              )}
                            />
                          </div>
                        </button>
                      ) : (
                        <Link
                          to={item.path}
                          className={cn(
                            "flex items-center w-full h-12 rounded-md transition-all duration-200 px-4",
                            isActive
                              ? `bg-gradient-to-r ${item.color} text-white shadow-lg hover:shadow-xl`
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4 flex-shrink-0 mr-3",
                              isActive
                                ? "text-white"
                                : "text-gray-500 dark:text-gray-400"
                            )}
                          />
                          <span className="text-xs truncate">{item.label}</span>
                        </Link>
                      )}
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      align="center"
                      className={cn(
                        "ml-1 px-3 py-2 rounded-lg text-white shadow-xl text-sm bg-gradient-to-r",
                        item.color // dynamic gradient like "from-emerald-500 to-emerald-600"
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item.label}</span>

                        {hasChildren && isExpanded && (
                          <>
                            {item.children.map((child) => {
                              const isChildActive = currentPath === child.path;
                              return (
                                <Link
                                  key={child.id}
                                  to={child.path}
                                  className={cn(
                                    "flex items-center text-xs rounded px-2 py-1 transition-all",
                                    isChildActive
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-white"
                                      : "text-white hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                                  )}
                                >
                                  • {child.label}
                                </Link>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    {hasChildren ? (
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className={cn(
                          "flex items-center w-full h-12 rounded-md transition-all duration-200 px-4",
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg hover:shadow-xl`
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 flex-shrink-0 mr-3",
                            isActive
                              ? "text-white"
                              : "text-gray-500 dark:text-gray-400"
                          )}
                        />
                        <div className="flex items-center justify-between w-full min-w-0">
                          <span className="text-xs truncate">{item.label}</span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transform transition-transform duration-300",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </div>
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center w-full h-12 rounded-md transition-all duration-200 px-4",
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg hover:shadow-xl`
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 flex-shrink-0",
                            "mr-3",
                            isActive
                              ? "text-white"
                              : "text-gray-500 dark:text-gray-400"
                          )}
                        />
                        {!collapsed && (
                          <div className="flex items-center justify-between w-full min-w-0">
                            <span className="text-xs truncate">
                              {item.label}
                            </span>
                          </div>
                        )}
                      </Link>
                    )}
                    {hasChildren && isExpanded && (
                      <div className="ml-10 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const isChildActive = currentPath === child.path;
                          return (
                            <Link
                              key={child.id}
                              to={child.path}
                              className={cn(
                                "flex items-center text-xs rounded px-2 py-1 transition-all",
                                isChildActive
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-white"
                                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                              )}
                            >
                              • {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </nav>
      </div>
      {/* Settings button (collapsed + expanded with tooltip) */}
      {/* {user?.role === 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/portal/admin/setup">
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-3 h-11 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="center"
                className="bg-gray-800 text-white px-3 py-1.5 rounded shadow text-sm"
              >
                Settings
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link to="/portal/admin/setup" className="w-full">
              <Button
                variant="ghost"
                className="w-full justify-start px-4 h-11 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Button>
            </Link>
          )}
        </div>
      )} */}

      {/* Logout button (collapsed + expanded with tooltip) */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start px-3 h-11 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                onClick={onLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              align="center"
              className="bg-red-600 text-white px-3 py-1.5 rounded shadow text-sm"
            >
              Logout
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start px-4 h-11 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
