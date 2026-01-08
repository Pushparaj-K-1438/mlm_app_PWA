import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { Crown, CheckCircle, Clock, ArrowUp, CircleX, Info, ChevronRight, Star } from "lucide-react";
import { useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { MODAL_OPEN } from "@/constants/others";
import PinFormModal from "@/components/FormModals/PinModal/PinFormModal";
import ActivatePinFormModal from "@/components/FormModals/ActivatePinModal/ActivatePinFormModal";
import { OPTIONS } from "@/constants/others";
import PinConfirmationFormModal from "@/components/FormModals/PinConfirmationModal/PinConfirmationFormModal";
import DailyVideoWarning from "@/components/DailyVideoWarning";
import TrainingVideoWarning from "@/components/TrainingVideoWarning";

function PinRequestsPage() {
  const { user } = useAuth();
  const { defaultFilter, updateSearchParam, searchParams } = useQueryParams();
  const Modal = searchParams.get("Modal") || undefined;
  const [filter, setFilter] = useState(defaultFilter);
  const {
    data: pinRequests,
    loading: pinRequestsLoading,
    setQuery,
  } = useGetCall(SERVICE.GET_PIN_REQUESTS);
  const pinRequestConfirmationModal =
    pinRequests?.data?.[0]?.user?.promoter_status === 1;
  const getLevelColor = (level: number) => {
    if (level === undefined || level === null) {
      return "text-gray-600";
    }
    const colors = {
      0: "text-blue-600",
      1: "text-green-600",
      2: "text-purple-600",
      3: "text-yellow-600",
      4: "text-pink-600",
    };
    return colors[level] || "text-gray-600";
  };
  const getLevelName = (level: number) => {
    if (level === undefined || level === null) {
      return "Trainee";
    }
    const names = OPTIONS.PROMOTER_LEVEL;
    return (
      names.find((name) => name.value === level.toString())?.label ||
      `Level ${level}`
    );
  };

  const getDateToShow = (item) => {
    if (item.activated_at) {
      return item.activated_at;
    } else if (item.pin_generated_at) {
      return item.pin_generated_at;
    } else {
      return item.created_at;
    }
  };

  const getDateLabel = (item) => {
    if (item.activated_at) {
      return "Activated on ";
    } else if (item.pin_generated_at) {
      return "Requested on ";
    } else {
      return "Created on ";
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      0: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        text: "Pending Review",
      },
      1: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "Ready to Activate",
      },
      2: {
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
        text: "Activated",
      },
      3: { color: "bg-red-100 text-red-800", icon: CircleX, text: "Rejected" },
    };
    const badge = badges[status] || badges[0];
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${badge.color}`}
      >
        <Icon className="w-4 h-4 mr-1" />
        {badge.text}
      </span>
    );
  };
  const PinRequestAPI = useCallback(() => {
    setQuery(filter);
  }, [filter]);

  useEffect(() => {
    PinRequestAPI();
  }, [PinRequestAPI]);

  const ActivatePinAPI = useCallback(() => {
    setQuery(filter);
  }, [filter]);

  useEffect(() => {
    ActivatePinAPI();
  }, [ActivatePinAPI]);

  if (pinRequestsLoading) {
    return (
      <div className="w-full pb-24 px-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 px-4 bg-gray-50 min-h-screen">
      {/* Header Section - Native App Style */}
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Pin Requests & Upgrades
        </h1>
        <p className="text-gray-600 mt-1">
          Request level upgrades and activate approved pins to unlock new features
        </p>
      </div>

      {/* Current Level & Upgrade Options - Mobile Native Style */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 flex items-center">
            <Crown className="w-4 h-4 mr-2 text-yellow-500" />
            Current Level & Upgrade Options
          </h3>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-4 border border-blue-100">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-md">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <div className="text-sm text-gray-600 mb-1">Current Level</div>
              <div className="text-xl font-bold text-gray-900">
                {getLevelName(
                  pinRequests?.data[0]?.user?.current_promoter_level
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm">
              <span className="text-sm font-medium text-gray-700">
                Level {pinRequests?.data[0]?.user?.current_promoter_level || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Available Upgrades:</h4>
          {pinRequests?.data?.length > 0 ? (
            (() => {
              const latestData = pinRequests.data[0];
              if (!latestData) return null;
              // If level 4 — show "Maximum Level Reached"
              if (latestData?.user?.current_promoter_level === 4) {
                return (
                  <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                        <Star className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-medium text-gray-900">
                          Maximum Level Reached
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          You've reached the highest available level for your current path!
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              // Otherwise show request card
              return (
                <div
                  key={latestData.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <ArrowUp className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-medium text-base ${getLevelColor(
                            latestData?.user?.current_promoter_level + 1
                          )}`}
                        >
                          Upgrade to {getLevelName(
                            latestData?.user?.current_promoter_level + 1
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Unlock advanced features and higher earnings
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  {(() => {
                    const promoterStatus = pinRequests?.data[0]?.user?.promoter_status;
                    return (promoterStatus === null || promoterStatus === "" || promoterStatus === 4) && (
                      <button
                        onClick={() =>
                          updateSearchParam({
                            options: {
                              Modal: MODAL_OPEN.PIN_REQUEST_MODAL,
                            },
                          })
                        }
                        className="w-full mt-3 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium active:scale-95 transition-transform"
                      >
                        Request Level Upgrade
                      </button>
                    );
                  })()}
                </div>
              );
            })()
          ) : (
            <div
              className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <ArrowUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-base text-gray-900">
                      Request Level Upgrade
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Unlock advanced features and higher earnings
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <button
                onClick={() =>
                  updateSearchParam({
                    options: {
                      Modal: MODAL_OPEN.PIN_REQUEST_MODAL,
                    },
                  })
                }
                className="w-full mt-3 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium active:scale-95 transition-transform"
              >
                Request Level Upgrade
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Available Pins for Activation - Mobile Native Style */}
      {pinRequests?.data?.some((pin) => pin.status === 1) && (
        <div className="bg-green-50 rounded-3xl p-5 mb-6 border border-green-100">
          <h3 className="text-base font-semibold text-green-900 mb-4 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Pins Ready for Activation
          </h3>
          <div className="space-y-3">
            {pinRequests?.data
              ?.filter((pin) => pin.status === 1)
              .map((pin) => (
                <div
                  key={pin.id}
                  className="bg-white rounded-2xl p-4 border border-green-100 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        Upgrade to {getLevelName(pin.level)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {getDateLabel(pin)}
                        {new Date(getDateToShow(pin)).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        updateSearchParam({
                          options: {
                            Modal: MODAL_OPEN.ACTIVATE_PIN_MODAL,
                            Edit: pin.id,
                          },
                        })
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium active:scale-95 transition-transform"
                    >
                      Activate Pin
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Pin Request History - Mobile Native Style */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-base font-semibold text-gray-900">
            Pin Request History
          </h3>
        </div>
        <div className="p-5">
          {pinRequests?.data?.length > 0 ? (
            <div className="space-y-3">
              {pinRequests?.data.map((request) => (
                <div
                  key={request.id}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-100 active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                        <ArrowUp className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-medium text-sm ${getLevelColor(
                            request.level
                          )}`}
                        >
                          Upgrade to {getLevelName(request.level)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getDateLabel(request)}
                          {new Date(getDateToShow(request)).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                No Pin Requests
              </h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                You haven't made any pin requests yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Card - Mobile Native Style */}
      <div className="mt-6 bg-blue-50 rounded-3xl p-5 border border-blue-100">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-base font-semibold text-blue-900 mb-2">
              Pin Request Process
            </h3>
            <p className="text-sm text-blue-800">
              Request a pin upgrade, wait for approval, then activate it to unlock new features and increase your earning potential.
            </p>
          </div>
        </div>
      </div>

      {Modal == MODAL_OPEN.PIN_REQUEST_MODAL && (
        <PinFormModal recoilApi={PinRequestAPI} />
      )}
      {Modal == MODAL_OPEN.ACTIVATE_PIN_MODAL && (
        <ActivatePinFormModal recoilApi={ActivatePinAPI} />
      )}
      {pinRequestConfirmationModal && (
        <PinConfirmationFormModal
          recoilApi={PinRequestAPI}
          pinRequestId={pinRequests?.data?.[0]?.id}
        />
      )}
    </div>
  );
}

export default function PinRequests() {
  return (
    <DailyVideoWarning>
      <TrainingVideoWarning>
        <PinRequestsPage />
      </TrainingVideoWarning>
    </DailyVideoWarning>
  );
}