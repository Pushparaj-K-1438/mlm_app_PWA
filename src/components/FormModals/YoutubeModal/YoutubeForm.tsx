import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo } from "react";
import InputText from "@/components/ui/InputText";
import InputTextArea from "@/components/ui/InputTextArea";
import YouTubeInputText from "@/components/ui/YouTubeInput";
import Btn from "@/components/ui/Btn";
import CheckboxInput from "@/components/ui/CheckboxInput";

export const VALIDATION_SCHEMA = Yup.object().shape({
  channel_name: Yup.string().required("Required Channel Name*"),
  description: Yup.string().required("Required description*"),
  url: Yup.string().required("Required URL*"),
});

const YoutubeForm = ({
  data = {},
  onAction = (values: any) => {},
  onCloseModal = () => {},
  loading = false,
  RequestError = {},
}: any) => {
  const { values, handleChange, errors, handleSubmit, setErrors } = useFormik({
    initialValues: {
      channel_name: data?.channel_name ?? "",
      description: data?.description ?? "",
      url: data?.url ?? "",
      is_active: data?.is_active ?? 1,
      is_running: data?.is_running ?? 1,
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
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InputText
        name="channel_name"
        label="Channel Name *"
        placeholder="Enter Channel Name"
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
      <YouTubeInputText
        name="url"
        label="URL *"
        placeholder="Enter URL"
        onChange={handleChange}
        error={errors}
        value={values}
      />
      <CheckboxInput
        label="Is Active?"
        name="is_active"
        value={values}
        onChange={handleChange}
        error={errors}
      />
      <CheckboxInput
        label="Is Running?"
        name="is_running"
        value={values}
        onChange={handleChange}
        error={errors}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Btn title="Cancel" onClick={onCloseModal} uiType="secondary" />
        <Btn title={"Submit"} isLoading={loading} onClick={handleSubmit} />
      </div>
    </form>
  );
};

export default YoutubeForm;
