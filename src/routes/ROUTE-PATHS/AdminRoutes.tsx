// @ts-nocheck
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import PortalLayout from "@/layout/PortalLayout";
import Loadable from "@/components/ui/Loadable";
import path from "path";
import WithDrawRequest from "@/app/Panel/ADMIN/WithDrawRequest/WithDrawRequest";

const AdminDashboard = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/Dashboard/Dashboard"))
);
const UserManagement = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/UserManagement/UserManagement"))
);
const YoutubeChannels = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/YoutubeChannels/YoutubeChannels"))
);
const TrainingVideos = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/TrainingVideos/TrainingVideos"))
);
const DailyVideos = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/DailyVideos/DailyVideos"))
);
const PromotionVideos = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/PromotionVideos/PromotionVideos"))
);
const ReferralSettings = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/ReferralSettings/ReferralSettings"))
);
const PinRequests = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/PinRequests/PinRequests"))
);
const UserProfile = Loadable(
  lazy(() => import("@/app/Panel/ADMIN/ProfileSettings/Profile"))
);
const AdminRoutes = {
  path: "portal/admin",
  element: <PortalLayout />,
  children: [
    {
      path: "dashboard",
      element: <AdminDashboard />,
    },
    {
      path: "daily-videos",
      element: <DailyVideos />,
    },
    {
      path: "users",
      element: <UserManagement />,
    },
    {
      path: "youtube-channels",
      element: <YoutubeChannels />,
    },
    {
      path: "training-videos",
      element: <TrainingVideos />,
    },
    {
      path: "promotion-videos",
      element: <PromotionVideos />,
    },
    {
      path: "referral-settings",
      element: <ReferralSettings />,
    },
    {
      path: "pin-requests",
      element: <PinRequests />,
    },
    {
      path: "profile-settings",
      element: <UserProfile />,
    },
    {
      path: "withdraw-request",
      element: <WithDrawRequest />,
    },
  ],
};

export default AdminRoutes;
