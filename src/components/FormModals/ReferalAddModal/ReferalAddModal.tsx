import { useActionCall, useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { useEffect } from "react";
import Lib from "@/utils/Lib";

import Modal from "@/components/ui/Modal";
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
    <Modal
      title={`${Edit ? "Edit" : "Add"} Promoter `}
      modalSize="lg"
      onClose={closeModal}
    >
      {loading ? (
        <Loader />
      ) : (
        <ReferalAddForm
          data={data?.data ?? {}}
          onAction={onAction}
          RequestError={RequestError}
          onCloseModal={closeModal}
          loading={actionLoading}
        />
      )}
    </Modal>
  );
};

export default ReferalAddModal;
