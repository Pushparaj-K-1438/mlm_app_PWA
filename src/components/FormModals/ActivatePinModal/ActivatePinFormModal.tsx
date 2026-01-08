import { useActionCall, useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { useEffect } from "react";
import Lib from "@/utils/Lib";

import Modal from "@/components/ui/Modal";
import Loader from "@/components/ui/Loader";
import PinForm from "./ActivatePinForm";

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
    <Modal
      title={`${Edit ? "Edit" : "Activate Pin"}`}
      onClose={closeModal}
    >
      {loading ? (
        <Loader />
      ) : (
        <PinForm
          data={data?.data[0] ?? {}}
          onAction={onAction}
          RequestError={RequestError}
          onCloseModal={closeModal}
        />
      )}
    </Modal>
  );
};

export default ActivatePinFormModal;
