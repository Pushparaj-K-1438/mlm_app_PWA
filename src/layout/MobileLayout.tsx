// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Home,
    PlayCircle,
    DollarSign,
    Users,
    UserCircle,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Wallet,
    Trophy,
    Bell,
    Settings,
    HelpCircle,
    Shield,
    Star,
    TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { Outlet } from "react-router-dom";
import { ROLE } from "@/constants/others";

const MobileLayout = () => {
    const { user, logout } = useAuth();
    const userObj = typeof user === "string" ? JSON.parse(user) : user;
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Bottom navigation items with enhanced icons
    const bottomNavItems = [
        {
            icon: Home,
            activeIcon: Home,
            label: "Home",
            path: "/portal/user/dashboard",
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            icon: PlayCircle,
            activeIcon: PlayCircle,
            label: "Videos",
            path: "/portal/user/daily-video-watch",
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
        {
            icon: DollarSign,
            activeIcon: TrendingUp,
            label: "Earnings",
            path: "/portal/user/earnings-history",
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            icon: Users,
            activeIcon: Users,
            label: "Referrals",
            path: "/portal/user/referrals",
            color: "text-orange-600",
            bgColor: "bg-orange-100",
        },
        {
            icon: UserCircle,
            activeIcon: UserCircle,
            label: "Profile",
            path: "/portal/user/profile-settings",
            color: "text-pink-600",
            bgColor: "bg-pink-100",
        },
    ];

    // Secondary menu items (in hamburger) with enhanced icons
    const secondaryMenuItems = [
        {
            icon: PlayCircle,
            label: "Training Program",
            path: "/portal/user/training-program",
            color: "text-indigo-600",
            bgColor: "bg-indigo-100",
        },
        {
            icon: Trophy,
            label: "Promotion Videos",
            path: "/portal/user/promotion-videos",
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
        {
            icon: Wallet,
            label: "PIN Requests",
            path: "/portal/user/pin-requests",
            color: "text-yellow-600",
            bgColor: "bg-yellow-100",
        },
        {
            icon: DollarSign,
            label: "Withdraw Requests",
            path: "/portal/user/withdraw-requests",
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            icon: PlayCircle,
            label: "YouTube Channels",
            path: "/portal/user/youtube-channels",
            color: "text-red-600",
            bgColor: "bg-red-100",
        },
        {
            icon: Trophy,
            label: "Scratch Card",
            path: "/portal/user/scratch-card",
            color: "text-orange-600",
            bgColor: "bg-orange-100",
        },
        {
            icon: UserCircle,
            label: "Contact Us",
            path: "/portal/user/contact-us",
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
    ];

    const isActivePath = (path: string) => location.pathname === path;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Mobile Header with Enhanced Design */}
            <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100'
                : 'bg-white/80 backdrop-blur-sm border-b border-gray-100/50'
                }`}>
                <div className="flex items-center justify-between px-4 h-16">
                    {/* Left: Menu Toggle */}
                    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 h-10 w-10 rounded-full hover:bg-gray-100 transition-all duration-200"
                            >
                                <Menu className="h-5 w-5 text-gray-700" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 p-0 bg-white">
                            <div className="flex flex-col h-full">
                                {/* Enhanced User Info */}
                                <div className="p-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="h-14 w-14 border-3 border-white shadow-lg">
                                            <AvatarImage src="/placeholder.svg" />
                                            <AvatarFallback className="bg-white text-blue-600 font-bold text-lg">
                                                {userObj?.name?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-base font-semibold text-white truncate">
                                                {userObj?.name}
                                            </p>
                                            <p className="text-sm text-white/90">Premium Member</p>
                                            <div className="flex items-center mt-1">
                                                <Star className="h-3 w-3 text-yellow-300 mr-1" />
                                                <span className="text-xs text-white/80">Level 5</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Menu Items */}
                                <div className="flex-1 overflow-y-auto py-2">
                                    {secondaryMenuItems.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setMenuOpen(false)}
                                            className={`flex items-center justify-between px-4 py-3 mx-2 mb-1 rounded-xl transition-all duration-200 ${isActivePath(item.path)
                                                ? `${item.bgColor} ${item.color} font-medium shadow-sm`
                                                : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-1.5 rounded-lg ${isActivePath(item.path)
                                                    ? 'bg-white/20'
                                                    : `${item.bgColor} ${item.color}`
                                                    }`}>
                                                    <item.icon className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium">{item.label}</span>
                                            </div>
                                            <ChevronRight className={`h-4 w-4 ${isActivePath(item.path)
                                                ? 'text-current opacity-70'
                                                : 'text-gray-400'
                                                }`} />
                                        </Link>
                                    ))}
                                </div>

                                {/* Enhanced Logout Section */}
                                <div className="p-4 border-t border-gray-100">
                                    <Button
                                        variant="destructive"
                                        className="w-full h-12 rounded-xl shadow-sm text-base font-medium transition-all duration-200"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Center: Logo/Title */}
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-md flex items-center justify-center">
                            <span className="text-white font-bold text-lg">CP</span>
                        </div>
                        <div>
                            {/* <h1 className="text-lg font-bold text-gray-900">Customer Portal</h1> */}
                            <p className="text-xs text-gray-500">Welcome back!</p>
                        </div>
                    </div>

                    {/* Right: Notifications and User Avatar */}
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 h-10 w-10 rounded-full hover:bg-gray-100 transition-all duration-200 relative"
                        >
                            <Bell className="h-5 w-5 text-gray-700" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-0 h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10 ring-2 ring-gray-200 hover:ring-blue-500 transition-all duration-200">
                                        <AvatarImage src="/placeholder.svg" />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white text-sm font-bold">
                                            {userObj?.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-gray-100 p-2">
                                <div className="px-3 py-2 text-sm font-semibold text-gray-900 border-b border-gray-100 mb-2">
                                    My Account
                                </div>
                                <DropdownMenuItem asChild className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors">
                                    <Link to="/portal/user/profile-settings" className="flex items-center w-full">
                                        <UserCircle className="mr-3 h-4 w-4 text-gray-500" />
                                        Profile Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors">
                                    <Settings className="mr-3 h-4 w-4 text-gray-500" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors">
                                    <HelpCircle className="mr-3 h-4 w-4 text-gray-500" />
                                    Help & Support
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gray-100 my-1" />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="p-3 text-red-600 hover:bg-red-50 cursor-pointer rounded-lg transition-colors"
                                >
                                    <LogOut className="mr-3 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Main Content with Enhanced Padding */}
            <main className="flex-1 overflow-y-auto pb-20 pt-6 px-4">
                <Outlet />
            </main>

            {/* Enhanced Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-around h-16">
                    {bottomNavItems.map((item) => {
                        const isActive = isActivePath(item.path);
                        const Icon = isActive ? item.activeIcon : item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-all duration-200 ${isActive
                                    ? `${item.color}`
                                    : "text-gray-500"
                                    }`}
                            >
                                <div className={`relative transition-all duration-200 ${isActive ? "scale-110" : "scale-100"
                                    }`}>
                                    {isActive && (
                                        <div className={`absolute -top-1 -right-1 w-2 h-2 ${item.color.replace('text', 'bg')} rounded-full`}></div>
                                    )}
                                    <Icon className="h-6 w-6" />
                                </div>
                                <span className={`text-xs font-medium mt-1 transition-all duration-200 ${isActive ? "font-semibold" : "font-normal"
                                    }`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default MobileLayout;