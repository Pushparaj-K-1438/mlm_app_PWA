// @ts-nocheck
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import PortalLayout from "@/layout/PortalLayout";
import Loadable from "@/components/ui/Loadable";

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
const NormalUserRoutes = {
  path: "portal/user",
  element: <PortalLayout />,
  children: [
    {
      path: "dashboard",
      element: <UserDashboard />,
    },

    {
      path: "daily-video-watch",
      element: <DailyVideoWatch />,
    },
    {
      path: "training-program",
      element: <TrainingProgram />,
    },
    {
      path: "promotion-videos",
      element: <PromotionVideos />,
    },
    {
      path: "pin-requests",
      element: <PinRequests />,
    },
    {
      path: "referrals",
      element: <ReferralTree />,
    },
    {
      path: "earnings-history",
      element: <EarningsHistory />,
    },
    {
      path: "withdraw-requests",
      element: <WithdrawRequests />,
    },
    {
      path: "youtube-channels",
      element: <YoutubeChannels />,
    },
    {
      path: "profile-settings",
      element: <Profile />,
    },
    {
      path: "scratch-card",
      element: <ScratchCard />,
    },
    {
      path: "contact-us",
      element: <ContactUs />,
    },
    {
      path: "repurchase",
      element: <Repurchase />,
    },
    {
      path: "sbi-life",
      element: <SBILife />,
    },
  ],
};

export default NormalUserRoutes;
