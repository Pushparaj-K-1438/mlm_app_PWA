import React, { useState } from "react";
import {
  Users,
  Share2,
  Crown,
  TrendingUp,
  User,
  Gift,
  Link as LinkIcon,
  Plus,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import Lib from "@/utils/Lib";
import { useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";
import DailyVideoWarning from "@/components/DailyVideoWarning";
import { MODAL_OPEN } from "@/constants/others";
import ReferalAddModal from "@/components/FormModals/ReferalAddModal/ReferalAddModal";
import TrainingVideoWarning from "@/components/TrainingVideoWarning";

function ReferralPage() {
  const { defaultFilter, updateSearchParam, searchParams } = useQueryParams();
  const Modal = searchParams.get("Modal") || undefined;

  const { loading: profileLoading, data: profileData } = useGetCall(
    SERVICE.GET_PROFILE
  );
  const {
    loading: referalLoading,
    data: referalData,
    setQuery,
  } = useGetCall(SERVICE.REFERRALS, {
    query: {
      pageSize: 1000,
    },
  });

  // Fetch user dashboard data for stats
  const { data: userDashboardData, loading: userDashboardLoading } = useGetCall(SERVICE.USER_DASHBOARD);
  const getReferalAPI = () => {
    setQuery({
      query: {
        pageSize: 1000,
      },
    });
  };

  const [copiedLink, setCopiedLink] = useState(false);

  // Mock data fallback for referral link
  const mockReferralData = {
    referralLink: profileData?.data?.referral_code ?
      `${Lib.getBaseURL()}/register?promoter_code=${profileData.data.referral_code}` :
      `${Lib.getBaseURL()}/register?promoter_code=demo`
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(mockReferralData.referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join PromoHub",
          text: "Join me on PromoHub and start earning today!",
          url: mockReferralData.referralLink,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      copyReferralLink();
    }
  };

  const getLevelColor = (level: string | number | null | undefined) => {
    // Handle null, undefined, or empty values
    if (!level && level !== 0) {
      return "text-blue-600 bg-blue-100";
    }

    // Convert to string for consistent handling
    const levelStr = String(level);

    const colors: { [key: string]: string } = {
      "0": "text-green-600 bg-green-100",      // Promoter
      "1": "text-purple-600 bg-purple-100",    // Promoter Level 1
      "2": "text-yellow-600 bg-yellow-100",    // Promoter Level 2
      "3": "text-pink-600 bg-pink-100",        // Promoter Level 3
      "4": "text-indigo-600 bg-indigo-100",    // Promoter Level 4
      "5": "text-red-600 bg-red-100",         // Higher levels
    };

    return colors[levelStr] || "text-gray-600 bg-gray-100";
  };
  const getLevelName = (level: string | number | null | undefined) => {
    // Handle null, undefined, or empty values
    if (!level && level !== 0) {
      return "Trainee";
    }

    // Convert to string for consistent handling
    const levelStr = String(level);

    const levelMap: { [key: string]: string } = {
      "0": "Promoter",
      "1": "Promoter Level 1",
      "2": "Promoter Level 2",
      "3": "Promoter Level 3",
      "4": "Promoter Level 4",
      "5": "Promoter Level 5",
    };

    return levelMap[levelStr] || `Level ${level}`;
  };
  const getStatusColor = (status) => {
    return status === "active" ? "text-green-600" : "text-red-600";
  };

  if (profileLoading || referalLoading || userDashboardLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Promoters Network</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your promoters network</p>
          </div>
          <button
            onClick={() =>
              updateSearchParam({
                options: { Modal: MODAL_OPEN.REFERAL_MODAL },
              })
            }
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Promoter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Total Promoters</p>
                <p className="text-xl font-bold text-gray-900">
                  {userDashboardLoading ? '...' : (userDashboardData?.data?.total_referrals || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Active Members</p>
                <p className="text-xl font-bold text-gray-900">
                  {" "}
                  {userDashboardLoading ? '...' : (userDashboardData?.data?.active_referrals || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Total Earnings</p>
                <p className="text-xl font-bold text-gray-900">
                  ₹{userDashboardLoading ? '...' : (userDashboardData?.data?.scratch_wallet || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Your Level</p>
                <p className="text-xl font-bold text-gray-900">
                  {userDashboardLoading ? '...' : (userDashboardData?.data?.current_promoter_level || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <div className="flex items-center">
              <LinkIcon className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Your Promoter Link</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <input
                type="text"
                value={`${Lib.getBaseURL()}/register?promoter_code=${
                  profileData?.data?.referral_code
                }`}
                readOnly
                className="w-full bg-transparent border-none outline-none text-gray-900 text-sm"
              />
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={copyReferralLink}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-colors ${
                  copiedLink
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </>
                )}
              </button>
              <button
                onClick={shareReferralLink}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <h4 className="font-medium text-blue-900 mb-2">
                How to Earn More:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Share your promoter link with friends and family</li>
                <li>• Earn cashback for each successful promoter</li>
                <li>• Higher levels unlock better promoter rewards</li>
                <li>• Active promoters contribute to your monthly earnings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Tree */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Promoter Genealogy Tree</h3>
            </div>
          </div>
          <div className="p-6">
            {/* Root Node (Current User) */}
            <div className="mb-6">
              <div className="flex items-center py-4 px-6 bg-gradient-to-r from-green-600 to-yellow-600 text-white rounded-2xl">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-2">
                  <Crown className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">
                      {profileData?.data?.username}
                    </span>
                    <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">You</span>
                  </div>
                  <div className="text-sm opacity-90">
                    {profileData?.data?.mobile} • Network Leader
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full whitespace-nowrap">
                    {getLevelName(userDashboardData?.data?.current_promoter_level)}
                  </span>
                </div>
              </div>
            </div>

            {/* Referral Tree */}
            {referalData?.data?.length ? (
              <div className="space-y-3">
                {referalData?.data?.map((referalUser) => (
                  <div className="ml-4">
                    <div className="flex items-center py-3 px-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center flex-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {referalUser?.username}
                            </span>
                            <span
                              className={`text-xs font-medium ${getStatusColor(
                                referalUser?.is_active ? "active" : "inactive"
                              )}`}
                            >
                              {referalUser?.is_active ? "active" : "inactive"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {referalUser.mobile} • Joined{" "}
                            {referalUser.created_at_formatted}
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getLevelColor(
                              referalUser?.current_promoter_level
                            )}`}
                          >
                            {getLevelName(referalUser?.current_promoter_level ?? "")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Promoters Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start sharing your promoter link to build your network!
                </p>
                <button
                  onClick={shareReferralLink}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Promoter Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Referral Tips */}
      <div className="px-6 mt-6 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Promoter Success Tips
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-gray-900">
                    Personal Approach
                  </div>
                  <div className="text-sm text-gray-600">
                    Share with people you know and trust
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-gray-900">
                    Explain Benefits
                  </div>
                  <div className="text-sm text-gray-600">
                    Help them understand the earning potential
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-gray-900">Provide Support</div>
                  <div className="text-sm text-gray-600">
                    Guide new members through the process
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-gray-900">Stay Active</div>
                  <div className="text-sm text-gray-600">
                    Lead by example with consistent activity
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {Modal == MODAL_OPEN.REFERAL_MODAL && (
        <ReferalAddModal recoilApi={getReferalAPI} />
      )}
    </div>
  );
}

export default function ReferralTree() {
  return (
    <DailyVideoWarning>
      <TrainingVideoWarning>
        <ReferralPage />
      </TrainingVideoWarning>
    </DailyVideoWarning>
  );
}