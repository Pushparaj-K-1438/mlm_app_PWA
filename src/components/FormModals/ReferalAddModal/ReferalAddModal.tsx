import { useActionCall, useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { useEffect } from "react";
import Lib from "@/utils/Lib";
import { X, UserPlus, CheckCircle } from "lucide-react";
import Loader from "@/components/ui/Loader";
import ReferalAddForm from "./ReferalAddForm";

const ReferalAddModal = ({ recoilApi = () => {} }) => {
  const { searchParams, updateSearchParam } = useQueryParams();
  const Edit = undefined;
  const Duplicate = searchParams.get("Duplicate") || undefined;
  const {
    Post,
    Put,
    error: RequestError,
    loading: actionLoading,
  } = useActionCall(SERVICE.REFERRALS);
  const { data, loading, error } = useGetCall(SERVICE.REFERRALS, {
    avoidFetch: !Boolean(Edit ?? Duplicate),
    key: Edit ?? Duplicate,
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
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 sm:px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Add Promoter</h2>
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
                <UserPlus className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600">Loading form...</p>
            </div>
          ) : (
            <ReferalAddForm
              data={data?.data ?? {}}
              onAction={onAction}
              RequestError={RequestError}
              onCloseModal={closeModal}
              loading={actionLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferalAddModal;