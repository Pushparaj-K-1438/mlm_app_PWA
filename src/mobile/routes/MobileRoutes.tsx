import { Navigate, useRoutes } from "react-router-dom";
import { lazy } from "react";
import Loadable from "@/components/ui/Loadable";
import { useAuth } from "@/context/AuthContext";
import { ROLE } from "@/constants/others";
import MobileLayout from "@/mobile/layout/MobileLayout";

// Lazy-loaded Auth components
const Login = Loadable(lazy(() => import("@/app/Auth/Login")));
const Register = Loadable(lazy(() => import("@/app/Auth/Register")));

// Lazy-loaded User components
const UserDashboard = Loadable(
  lazy(() => import("@/app/Panel/USER/UserDashboard/UserDashboard"))
);
const DailyVideoWatch = Loadable(
  lazy(() => import("@/app/Panel/USER/DailyVideoWatch"))
);
const TrainingProgram = Loadable(
  lazy(() => import("@/app/Panel/USER/TrainingProgram"))
);
const PromotionVideos = Loadable(
  lazy(() => import("@/app/Panel/USER/PromotionVideos"))
);
const PinRequests = Loadable(
  lazy(() => import("@/app/Panel/USER/PinRequests"))
);
const ReferralTree = Loadable(
  lazy(() => import("@/app/Panel/USER/ReferralTree"))
);
const EarningsHistory = Loadable(
  lazy(() => import("@/app/Panel/USER/EarningsHistory"))
);
const WithdrawRequests = Loadable(
  lazy(() => import("@/app/Panel/USER/WithdrawRequests"))
);
const YoutubeChannels = Loadable(
  lazy(() => import("@/app/Panel/USER/YoutubeChannels"))
);
const Profile = Loadable(
  lazy(() => import("@/app/Panel/USER/UserDashboard/ProfileSettings/Profile"))
);
const ScratchCard = Loadable(
  lazy(() => import("@/app/Panel/USER/ScratchCard"))
);
const ContactUs = Loadable(
  lazy(() => import("@/app/Panel/USER/ContactUs"))
);
const Repurchase = Loadable(
  lazy(() => import("@/app/Panel/USER/Repurchase"))
);
const SBILife = Loadable(
  lazy(() => import("@/app/Panel/USER/SBILife"))
);

// Lazy-loaded Admin components
const AdminDashboard = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/Dashboard/Dashboard"))
);
const AdminUserManagement = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/UserManagement/UserManagement"))
);
const AdminYoutubeChannels = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/YoutubeChannels/YoutubeChannels"))
);
const TrainingVideos = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/TrainingVideos/TrainingVideos"))
);
const DailyVideos = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/DailyVideos/DailyVideos"))
);
const AdminPromotionVideos = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/PromotionVideos/PromotionVideos"))
);
const ReferralSettings = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/ReferralSettings/ReferralSettings"))
);
const AdminPinRequests = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/PinRequests/PinRequests"))
);
const AdminProfile = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/ProfileSettings/Profile"))
);
const WithDrawRequest = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/WithDrawRequest/WithDrawRequest"))
);

export default function MobileRoutes(): React.ReactElement | null {
  const { isLoading, role } = useAuth();
  const routes = [];

  // Auth routes (shown when not logged in)
  const authRoutes = {
    path: "/",
    element: <MobileLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ],
  };

  // User routes (shown when logged in as user)
  const userRoutes = {
    path: "/",
    element: <MobileLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/portal/user/dashboard" replace />,
      },
      {
        path: "login",
        element: <Navigate to="/portal/user/dashboard" replace />,
      },
      {
        path: "portal/user/dashboard",
        element: <UserDashboard />,
      },
      {
        path: "portal/user/daily-video-watch",
        element: <DailyVideoWatch />,
      },
      {
        path: "user/daily-video",
        element: <Navigate to="/portal/user/daily-video-watch" replace />,
      },
      {
        path: "portal/user/training-program",
        element: <TrainingProgram />,
      },
      {
        path: "user/training",
        element: <Navigate to="/portal/user/training-program" replace />,
      },
      {
        path: "portal/user/promotion-videos",
        element: <PromotionVideos />,
      },
      {
        path: "user/promotion-videos",
        element: <Navigate to="/portal/user/promotion-videos" replace />,
      },
      {
        path: "portal/user/pin-requests",
        element: <PinRequests />,
      },
      {
        path: "portal/user/referrals",
        element: <ReferralTree />,
      },
      {
        path: "user/referral-tree",
        element: <Navigate to="/portal/user/referrals" replace />,
      },
      {
        path: "portal/user/earnings-history",
        element: <EarningsHistory />,
      },
      {
        path: "portal/user/withdraw-requests",
        element: <WithdrawRequests />,
      },
      {
        path: "portal/user/youtube-channels",
        element: <YoutubeChannels />,
      },
      {
        path: "portal/user/profile-settings",
        element: <Profile />,
      },
      {
        path: "user/profile",
        element: <Navigate to="/portal/user/profile-settings" replace />,
      },
      {
        path: "portal/user/scratch-card",
        element: <ScratchCard />,
      },
      {
        path: "portal/user/contact-us",
        element: <ContactUs />,
      },
      {
        path: "portal/user/repurchase",
        element: <Repurchase />,
      },
      {
        path: "portal/user/sbi-life",
        element: <SBILife />,
      },
      {
        path: "*",
        element: <Navigate to="/portal/user/dashboard" replace />,
      },
    ],
  };

  // Admin routes (shown when logged in as admin)
  const adminRoutes = {
    path: "/",
    element: <MobileLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/portal/admin/dashboard" replace />,
      },
      {
        path: "login",
        element: <Navigate to="/portal/admin/dashboard" replace />,
      },
      {
        path: "portal/admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "admin/dashboard",
        element: <Navigate to="/portal/admin/dashboard" replace />,
      },
      {
        path: "portal/admin/daily-videos",
        element: <DailyVideos />,
      },
      {
        path: "portal/admin/users",
        element: <AdminUserManagement />,
      },
      {
        path: "admin/users",
        element: <Navigate to="/portal/admin/users" replace />,
      },
      {
        path: "portal/admin/youtube-channels",
        element: <AdminYoutubeChannels />,
      },
      {
        path: "portal/admin/training-videos",
        element: <TrainingVideos />,
      },
      {
        path: "admin/training-videos",
        element: <Navigate to="/portal/admin/training-videos" replace />,
      },
      {
        path: "portal/admin/promotion-videos",
        element: <AdminPromotionVideos />,
      },
      {
        path: "portal/admin/referral-settings",
        element: <ReferralSettings />,
      },
      {
        path: "portal/admin/pin-requests",
        element: <AdminPinRequests />,
      },
      {
        path: "admin/pin-requests",
        element: <Navigate to="/portal/admin/pin-requests" replace />,
      },
      {
        path: "portal/admin/profile-settings",
        element: <AdminProfile />,
      },
      {
        path: "admin/profile",
        element: <Navigate to="/portal/admin/profile-settings" replace />,
      },
      {
        path: "portal/admin/withdraw-request",
        element: <WithDrawRequest />,
      },
      {
        path: "*",
        element: <Navigate to="/portal/admin/dashboard" replace />,
      },
    ],
  };

  if (role === ROLE.ADMIN || role === ROLE.SUPER_ADMIN) {
    routes.push(adminRoutes);
  } else if (role === ROLE.USER) {
    routes.push(userRoutes);
  } else {
    routes.push(authRoutes);
  }

  const routeElements = useRoutes(routes);

  // Show loading spinner while authentication is being verified
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return routeElements;
}
