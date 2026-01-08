import { useActionCall, useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { useEffect } from "react";
import Lib from "@/utils/Lib";
import { Banknote, Plus } from "lucide-react";

import Modal from "@/components/ui/Modal";
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
    <Modal title={`Withdrawal Request`} onClose={closeModal}>
      {bankInfoLoading ? (
        <Loader />
      ) : (
        <div>
          {bankInfo?.data?.id ? (
            <div>
              <WithDrawRequestForm
                data={{ ...bankInfo?.data }}
                onAction={onAction}
                RequestError={RequestError}
                onCloseModal={closeModal}
                loading={actionLoading}
              />
            </div>
          ) : (
            <div className="mt-12 max-w-md mx-auto bg-white rounded-lg p-6 text-center">
              <Banknote className="mx-auto mb-4 flex justify-center items-center" />
              <p className="text-sm font-bold mb-2">
                Please add your bank information to enable withdrawal requests.
              </p>

              <Link
                to={"/portal/user/profile-settings"}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Bank
              </Link>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default WithDrawRequestModal;
