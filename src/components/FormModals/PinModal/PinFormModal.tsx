import { useActionCall, useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { useEffect } from "react";
import Lib from "@/utils/Lib";

import Modal from "@/components/ui/Modal";
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

  console.log({ useData });
  return (
    <Modal
      title={`${Edit ? "Edit" : "Request Level Upgrade"}`}
      onClose={closeModal}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          {useData ? (
            <PinForm
              data={{ current_level: useData?.data?.current_promoter_level }}
              onAction={onAction}
              RequestError={RequestError}
              onCloseModal={closeModal}
            />
          ) : (
            "Something went wrong!"
          )}
        </>
      )}
    </Modal>
  );
};

export default PinConfirmationForm;
