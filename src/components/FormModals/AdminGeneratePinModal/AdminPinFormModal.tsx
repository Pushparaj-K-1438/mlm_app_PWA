import { useActionCall, useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { useEffect, useCallback } from "react";
import Lib from "@/utils/Lib";
import Modal from "@/components/ui/Modal";
import PinConfirmationForm from "./AdminPinForm";

const PinConfirmationFormModal = ({ recoilApi = () => {}, pinRequestId, allPinRequestsData }) => {
  const { searchParams, updateSearchParam } = useQueryParams();
  const Edit = searchParams.get("Edit") || undefined;
  const userDataString = searchParams.get("userData") || "{}";
  const userData = JSON.parse(userDataString);

  const {
    Post,
    error,
  } = useActionCall(SERVICE.GENERATE_PIN);

  const closeModal = useCallback(() => {
    updateSearchParam({ deleteParams: ["Modal", "Edit", "Duplicate", "pinRequestId", "userData"] });
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
      title={`${Edit ? "Edit" : "Generate Pin Confirmation"}`}
      onClose={closeModal}
    >
      <PinConfirmationForm
        onAction={onAction}
        onCloseModal={closeModal}
        userData={userData}
        allPinRequestsData={allPinRequestsData}
      />
    </Modal>
  );
};

export default PinConfirmationFormModal;
