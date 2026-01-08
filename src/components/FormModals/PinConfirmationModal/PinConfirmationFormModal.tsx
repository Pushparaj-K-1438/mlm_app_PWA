import { useActionCall, useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { useEffect, useCallback } from "react";
import Lib from "@/utils/Lib";
import Modal from "@/components/ui/Modal";
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
    <Modal
      title={`${Edit ? "Edit" : "Term Confirmation"}`}
      onClose={closeModal}
    >
      <PinConfirmationForm
        onAction={onAction}
        onCloseModal={closeModal}
      />
    </Modal>
  );
};

export default PinConfirmationFormModal;
