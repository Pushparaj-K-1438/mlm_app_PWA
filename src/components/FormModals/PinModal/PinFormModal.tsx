import { useActionCall, useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { useEffect } from "react";
import Lib from "@/utils/Lib";
import { X, ArrowLeft, Crown, CheckCircle } from "lucide-react";

import Loader from "@/components/ui/Loader";
import PinForm from "./PinForm";

const PinConfirmationForm = ({ recoilApi = () => {} }) => {
  const { searchParams, updateSearchParam } = useQueryParams();
  const Edit = searchParams.get("Edit") || undefined;
  const {
    Post,
    Put,
    error: RequestError,
  } = useActionCall(SERVICE.USER_PROMOTERS);
  const {
    data: useData,
    loading,
    error,
  } = useGetCall(SERVICE.GET_PROFILE, {
    avoidFetch: false,
  });

  const closeModal = () => {
    updateSearchParam({ deleteParams: ["Modal", "Edit", "Duplicate"] });
  };

  useEffect(() => {
    if (error) {
      closeModal();
    }
  }, [error]);

  const onAction = async (formPayload: any) => {
    let response = undefined;

    let formatPayload = Lib.payloadFormat(formPayload, "");
    if (Edit) {
      response = await Put(Edit, formatPayload);
    } else {
      response = await Post(formatPayload);
    }

    if (response) {
      //Close the Modal
      recoilApi();
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 bottom-20 z-50 bg-black bg-opacity-50 flex items-end justify-center safe-area-inset-bottom">
      <div className="bg-white w-full max-w-lg rounded-t-3xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {Edit ? "Edit Pin Request" : "Request Level Upgrade"}
              </h2>
            </div>
            <button
              onClick={closeModal}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600">Loading your profile...</p>
            </div>
          ) : useData ? (
            <div className="space-y-6">
              {/* Current Level Info */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Crown className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Current Level</p>
                    <p className="text-lg font-bold text-blue-900">
                      {useData?.data?.current_promoter_level !== undefined && 
                       useData?.data?.current_promoter_level !== null
                        ? `Level ${useData?.data?.current_promoter_level}`
                        : "Trainee"
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <PinForm
                data={{ current_level: useData?.data?.current_promoter_level }}
                onAction={onAction}
                RequestError={RequestError}
                onCloseModal={closeModal}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-gray-600">Something went wrong!</p>
              <button
                onClick={closeModal}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinConfirmationForm;