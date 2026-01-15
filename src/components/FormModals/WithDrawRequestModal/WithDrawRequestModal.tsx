import { useActionCall, useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { useEffect } from "react";
import Lib from "@/utils/Lib";
import { Banknote, Plus, X, Wallet, AlertCircle } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { Link } from "react-router-dom";
import WithDrawRequestForm from "./WithDrawRequestForm";

const WithDrawRequestModal = ({ recoilApi = () => {} }) => {
  const { searchParams, updateSearchParam } = useQueryParams();
  const Edit = searchParams.get("Edit") || undefined;
  const Duplicate = searchParams.get("Duplicate") || undefined;
  const {
    Post,
    Put,
    error: RequestError,
    loading: actionLoading,
  } = useActionCall(SERVICE.WITHDRAW_REQUEST);

  const { data: bankInfo, loading: bankInfoLoading } = useGetCall(
    SERVICE.GET_BANK_INFO
  );

  const closeModal = () => {
    updateSearchParam({ deleteParams: ["Modal", "Edit", "Duplicate"] });
  };

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
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 sm:px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Withdrawal Request</h2>
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
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {bankInfoLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600">Loading bank information...</p>
            </div>
          ) : 
          
          
          // bankInfo?.data?.id ? (
          //   <WithDrawRequestForm
          //     data={{ ...bankInfo?.data }}
          //     onAction={onAction}
          //     RequestError={RequestError}
          //     onCloseModal={closeModal}
          //     loading={actionLoading}
          //   />
          // ) : (
          //   <div className="flex flex-col items-center justify-center py-12">
          //     <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          //       <Banknote className="w-8 h-8 text-red-600" />
          //     </div>
          //     <h3 className="text-lg font-semibold text-gray-900 mb-2">
          //       Bank Information Required
          //     </h3>
          //     <p className="text-gray-600 text-center mb-6">
          //       Please add your bank information to enable withdrawal requests.
          //     </p>
          //     <Link
          //       to="/portal/user/profile-settings"
          //       onClick={closeModal}
          //       className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
          //     >
          //       <Plus className="w-4 h-4 mr-2" />
          //       Add Bank Information
          //     </Link>
          //   </div>
          // )
          
            <WithDrawRequestForm
              data={{ ...bankInfo?.data }}
              onAction={onAction}
              RequestError={RequestError}
              onCloseModal={closeModal}
              loading={actionLoading}
            />
          
          }
        </div>
      </div>
    </div>
  );
};

export default WithDrawRequestModal;