import { useActionCall, useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { useEffect } from "react";
import Lib from "@/utils/Lib";

import Modal from "@/components/ui/Modal";
import Loader from "@/components/ui/Loader";
import TraningQuizForm from "./TraningQuizForm";

const TraningQuizFormModal = ({ recoilApi = () => {} }) => {
  const { searchParams, updateSearchParam } = useQueryParams();
  const Edit = searchParams.get("Edit") || undefined;
  const title = searchParams.get("Title") || undefined;
  const TrainingVideoId = searchParams.get("TrainingVideoId") || undefined;

  const {
    Post,
    Put,
    error: RequestError,
    loading: actionLoading,
  } = useActionCall(SERVICE.TRAININGVIDEOQUIZES);
  const { data, loading, error } = useGetCall(SERVICE.TRAININGVIDEOQUIZES, {
    avoidFetch: !Boolean(Edit),
    key: Edit,
  });

  const closeModal = () => {
    updateSearchParam({
      deleteParams: ["Modal", "Edit", "Duplicate", "TrainingVideoId", "Title"],
    });
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
      title={`${Edit ? "Edit" : "Add"} Quiz ${title ? `for ${title}` : ""}`}
      onClose={closeModal}
      modalSize="lg"
    >
      {loading ? (
        <Loader />
      ) : (
        <TraningQuizForm
          data={data?.data ?? { training_video_id: TrainingVideoId ?? 0 }}
          onAction={onAction}
          RequestError={RequestError}
          onCloseModal={closeModal}
          loading={actionLoading}
        />
      )}
    </Modal>
  );
};

export default TraningQuizFormModal;
