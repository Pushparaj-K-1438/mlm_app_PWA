import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { Crown, CheckCircle, Clock, ArrowUp, CircleX } from "lucide-react";
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
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Pin Requests & Upgrades
        </h1>
        <p className="mt-2 text-gray-600">
          Request level upgrades and activate approved pins to unlock new
          features
        </p>
      </div>

      {/* Current Level & Upgrade Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Crown className="w-5 h-5 mr-2" />
            Current Level & Upgrade Options
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-gray-600">Current Level</div>
                <div className="text-2xl font-bold text-gray-900">
                  {getLevelName(
                    pinRequests?.data[0]?.user?.current_promoter_level
                  )}{" "}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Available Upgrades:</h4>
            {pinRequests?.data?.length > 0 ? (
              (() => {
                const latestData = pinRequests.data[0];
                if (!latestData) return null;
                // If level 3 — show "Maximum Level Reached"
                if (latestData?.user?.current_promoter_level === 4) {
                  return (
                    <div className="text-center py-8">
                      <Crown className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Maximum Level Reached
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        You've reached the highest available level for your
                        current path!
                      </p>
                    </div>
                  );
                }

                // Otherwise show request card
                return (
                  <div
                    key={latestData.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <ArrowUp className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <div
                          className={`font-medium ${getLevelColor(
                            latestData?.user?.current_promoter_level
                          )}`}
                        >
                          {getLevelName(
                            latestData?.user?.current_promoter_level + 1
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Unlock advanced features and higher earnings
                        </div>
                      </div>
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Request Level Upgrade
                      </button>
                    );
                  })()}
                  </div>
                );
              })()
            ) : (
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <ArrowUp className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">
                      Request Level Upgrade
                    </div>
                    <div className="text-sm text-gray-500">
                      Unlock advanced features and higher earnings
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    updateSearchParam({
                      options: {
                        Modal: MODAL_OPEN.PIN_REQUEST_MODAL,
                      },
                    })
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Request Level Upgrade
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Available Pins for Activation */}
      {pinRequests?.data?.some((pin) => pin.status === 1) && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Pins Ready for Activation
          </h3>
          <div className="space-y-4">
            {pinRequests?.data
              ?.filter((pin) => pin.status === 1)
              .map((pin) => (
                <div
                  key={pin.id}
                  className="bg-white rounded-lg p-4 border border-green-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        Upgrade to {getLevelName(pin.level)}
                      </div>
                      <div className="text-sm text-gray-600">
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
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Activate Pin
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Pin Request History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Pin Request History
          </h3>
        </div>
        <div className="p-6">
          {pinRequests?.data?.length > 0 ? (
            <div className="space-y-4">
              {pinRequests?.data.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      <ArrowUp className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div
                        className={`font-medium ${getLevelColor(
                          request.level
                        )}`}
                      >
                        Upgrade to {getLevelName(request.level)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getDateLabel(request)}
                        {new Date(getDateToShow(request)).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Crown className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No Pin Requests
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't made any pin requests yet.
              </p>
            </div>
          )}
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
