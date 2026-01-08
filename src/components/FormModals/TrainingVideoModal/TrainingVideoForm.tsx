import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo } from "react";
import InputText from "@/components/ui/InputText";
import InputTextArea from "@/components/ui/InputTextArea";
import YouTubeInputText from "@/components/ui/YouTubeInput";
import SelectInput from "@/components/ui/SelectInput";
import moment from "moment";
import Btn from "@/components/ui/Btn";
import CheckboxInput from "@/components/ui/CheckboxInput";
import { OPTIONS } from "@/constants/others";
import FileUpload from "@/components/FileUpload";

export const VALIDATION_SCHEMA = Yup.object().shape({
  description: Yup.string().required("Required description*"),
  day: Yup.string().required("Required day*"),
  youtube_link: Yup.string()
    .nullable()
    .test(
      "youtube-or-video",
      "Either YouTube link or Video path is required*",
      function (value) {
        const { video_path } = this.parent;
        if (
          (value && value.trim() !== "") ||
          (video_path && video_path.trim() !== "")
        ) {
          return true;
        }
        return false;
      }
    ),

  video_path: Yup.string()
    .nullable()
    .test(
      "video-or-youtube",
      "Either Video path or YouTube link is required*",
      function (value) {
        const { youtube_link } = this.parent;
        if (
          (value && value.trim() !== "") ||
          (youtube_link && youtube_link.trim() !== "")
        ) {
          return true;
        }
        return false;
      }
    ),
  // showing_date: Yup.string().required("Required Date"),
});

const TrainingVideoForm = ({
  data = {},
  onAction = (values: any) => {},
  onCloseModal = () => {},
  loading = false,
  RequestError = {},
}: any) => {
  const { values, handleChange, errors, handleSubmit, setErrors } = useFormik({
    initialValues: {
      title: data?.title ?? "",
      description: data?.description ?? "",
      youtube_link: data?.youtube_link ?? "",
      day: data?.day ?? "",
      is_active: data?.is_active ?? 1,
    },
    onSubmit: async (values: any) => {
      onAction(values);
    },

    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: VALIDATION_SCHEMA,
  });

  useMemo(() => {
    if (RequestError && Object.keys(RequestError).length) {
      setErrors(RequestError);
    }
  }, [RequestError]);

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputText
          name="title"
          label="Title *"
          placeholder="Enter video title"
          onChange={handleChange}
          error={errors}
          value={values}
        />
        <InputTextArea
          name="description"
          label="Description *"
          placeholder="Enter Video Description"
          onChange={handleChange}
          error={errors}
          value={values}
        />
        <SelectInput
          name="day"
          label="Day *"
          placeholder="Select Day"
          options={OPTIONS.DAYS}
          onChange={handleChange}
          error={errors}
          value={values}
        />

        <div>
          <div className="space-y-3">
            <FileUpload
              name="video_path"
              onChange={handleChange}
              error={errors}
              value={values}
            />
            <div className="text-center text-gray-500">OR</div>
            <YouTubeInputText
              name="youtube_link"
              onChange={handleChange}
              error={errors}
              value={values}
            />
          </div>
        </div>
        <CheckboxInput
          label="Is Active?"
          name="is_active"
          value={values}
          onChange={handleChange}
          error={errors}
        />

        {/* <InputText
          type="Date"
          name="showing_date"
          label="Showing Date *"
          placeholder="Enter Show Date"
          onChange={handleChange}
          error={errors}
          value={values}
        /> */}
        <div className="flex justify-end space-x-3 pt-4">
          <Btn title="Cancel" onClick={onCloseModal} uiType="secondary" />
          <Btn title={"Submit"} isLoading={loading} onClick={handleSubmit} />
        </div>
      </form>
    </div>
  );
};

export default TrainingVideoForm;
