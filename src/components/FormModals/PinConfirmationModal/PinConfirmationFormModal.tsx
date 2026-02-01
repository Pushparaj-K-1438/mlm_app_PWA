import { useActionCall, useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { useEffect, useCallback } from "react";
import Lib from "@/utils/Lib";
import { X, FileText, CheckCircle } from "lucide-react";
import PinConfirmationForm from "./PinConfirmationForm";

const PinConfirmationFormModal = ({ recoilApi = () => {}, pinRequestId }) => {
  const { searchParams, updateSearchParam } = useQueryParams();
  const Edit = searchParams.get("Edit") || undefined;
  const {
    Post,
    error,
  } = useActionCall(SERVICE.ACCEPT_TERMS);

  const closeModal = useCallback(() => {
    updateSearchParam({ deleteParams: ["Modal", "Edit", "Duplicate"] });
  }, [updateSearchParam]);

  useEffect(() => {
    if (error) {
      closeModal();
    }
  }, [error, closeModal]);

  const onAction = async (formPayload: { current_level?: string }) => {
    let response = undefined;

    const formatPayload = Lib.payloadFormat({ ...formPayload, id: pinRequestId }, "");
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
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {Edit ? "Edit Terms" : "Terms Confirmation"}
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
          <PinConfirmationForm
            onAction={onAction}
            onCloseModal={closeModal}
          />
        </div>
      </div>
    </div>
  );
};

export default PinConfirmationFormModal;