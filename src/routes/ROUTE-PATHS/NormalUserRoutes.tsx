// @ts-nocheck
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import MobileLayout from "@/layout/MobileLayout";
import Loadable from "@/components/ui/Loadable";

const UserDashboard = Loadable(
    lazy(() => import("@/app/User/UserDashboard/UserDashboard"))
);

const DailyVideoWatch = Loadable(
    lazy(() => import("@/app/User/DailyVideoWatch"))
);
const TrainingProgram = Loadable(
    lazy(() => import("@/app/User/TrainingProgram"))
);
const PromotionVideos = Loadable(
    lazy(() => import("@/app/User/PromotionVideos"))
);
const PinRequests = Loadable(
    lazy(() => import("@/app/User/PinRequests"))
);
const ReferralTree = Loadable(
    lazy(() => import("@/app/User/ReferralTree"))
);
const EarningsHistory = Loadable(
    lazy(() => import("@/app/User/EarningsHistory"))
);
const WithdrawRequests = Loadable(
    lazy(() => import("@/app/User/WithdrawRequests"))
);
const YoutubeChannels = Loadable(
    lazy(() => import("@/app/User/YoutubeChannels"))
);
const Profile = Loadable(
    lazy(() => import("@/app/User/UserDashboard/ProfileSettings/Profile"))
);
const ScratchCard = Loadable(
    lazy(() => import("@/app/User/ScratchCard"))
);
const ContactUs = Loadable(
    lazy(() => import("@/app/User/ContactUs"))
);

const NormalUserRoutes = {
    path: "portal/user",
    element: <MobileLayout />,
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
    ],
};

export default NormalUserRoutes;
