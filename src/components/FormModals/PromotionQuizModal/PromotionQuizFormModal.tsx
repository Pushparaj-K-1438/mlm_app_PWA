import { useActionCall, useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { useEffect } from "react";
import Lib from "@/utils/Lib";

import Modal from "@/components/ui/Modal";
import Loader from "@/components/ui/Loader";
import PromotionQuizForm from "./PromotionQuizForm";

const PromotionQuizFormModal = ({ recoilApi = () => {} }) => {
  const { searchParams, updateSearchParam } = useQueryParams();
  const Edit = searchParams.get("Edit") || undefined;
  const title = searchParams.get("Title") || undefined;
  const PromotionVideoId = searchParams.get("PromotionVideoId") || undefined;

  const {
    Post,
    Put,
    error: RequestError,
    loading:actionLoading
  } = useActionCall(SERVICE.PROMOTIONVIDEOQUIZES);
  const { data, loading, error } = useGetCall(SERVICE.PROMOTIONVIDEOQUIZES, {
    avoidFetch: !Boolean(Edit),
    key: Edit,
  });

  const closeModal = () => {
    updateSearchParam({
      deleteParams: ["Modal", "Edit", "Duplicate", "Title", "PromotionVideoId"],
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
        <PromotionQuizForm
          data={data?.data ?? { promotion_video_id: PromotionVideoId ?? 0 }}
          onAction={onAction}
          RequestError={RequestError}
          onCloseModal={closeModal}
          loading={actionLoading}
        />
      )}
    </Modal>
  );
};

export default PromotionQuizFormModal;
