import { useActionCall, useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { useEffect } from "react";
import Lib from "@/utils/Lib";
import { X, Key, Gift, CheckCircle } from "lucide-react";

import Loader from "@/components/ui/Loader";
import ActivatePinForm from "./ActivatePinForm";

const ActivatePinFormModal = ({ recoilApi = () => {} }) => {
  const { searchParams, updateSearchParam } = useQueryParams();
  const Edit = searchParams.get("Edit") || undefined;
  const {
    Post,
    Put,
    error: RequestError,
  } = useActionCall(SERVICE.ACTIVATE_PIN);
  const { data, loading, error } = useGetCall(SERVICE.GET_PIN_REQUESTS, {
    avoidFetch: !Boolean(Edit)
  });

  const closeModal = () => {
    updateSearchParam({ deleteParams: ["Modal", "Edit"] });
  };

  useEffect(() => {
    if (error) {
      closeModal();
    }
  }, [error]);

  const onAction = async (formPayload: any) => {
    let response = undefined;

    let formatPayload = Lib.payloadFormat(formPayload, "");
    response = await Post(formatPayload);

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
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 sm:px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3">
                <Key className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {Edit ? "Edit Pin" : "Activate Pin"}
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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Key className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600">Loading pin details...</p>
            </div>
          ) : data?.data?.[0] ? (
            <div className="space-y-6">
              {/* Pin Info */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Key className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Pin to Activate</p>
                    <p className="text-lg font-bold text-green-900">
                      {data.data[0].pin}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <ActivatePinForm
                data={data.data[0]}
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
              <p className="text-gray-600">Pin details not found!</p>
              <button
                onClick={closeModal}
                className="mt-4 px-4 sm:px-6 py-2 bg-green-600 text-white rounded-xl font-medium"
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

export default ActivatePinFormModal;