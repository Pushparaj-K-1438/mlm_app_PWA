import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo } from "react";
import InputText from "@/components/ui/InputText";
import Btn from "@/components/ui/Btn";
import { OPTIONS } from "@/constants/others";
import SelectInput from "@/components/ui/SelectInput";
import InputTextArea from "@/components/ui/InputTextArea";

export const VALIDATION_SCHEMA = Yup.object().shape({
  pin: Yup.string().required("Required Pin*"),
  gift_delivery_type: Yup.string().required("Required Gift Delivery Type*"),
  wh_number: Yup.string().required("Required Mobile Number*"),
  direct_pick_date: Yup.string().when("gift_delivery_type", {
    is: "1",
    then: (schema) => schema.required("Required Direct Pick Date*"),
    otherwise: (schema) => schema.optional(),
  }),
  gift_delivery_address: Yup.string().when("gift_delivery_type", {
    is: "2",
    then: (schema) => schema.required("Required Gift Delivery Address*"),
    otherwise: (schema) => schema.optional(),
  }),
});

const ActivatePinForm = ({
  data = {},
  onAction = (values: any) => {},
  onCloseModal = () => {},
  loading = false,
  RequestError = {},
}: any) => {
  const { values, handleChange, errors, handleSubmit, setErrors } = useFormik({
    initialValues: {
      id: data?.id ?? "",
      pin: data?.pin ?? "",
      gift_delivery_type: data?.gift_delivery_type ?? "",
      gift_delivery_address: data?.gift_delivery_address ?? "",
      wh_number: data?.user?.mobile ?? "",
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

  const minSelectableDate = useMemo(() => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 25); // 25 days from today
    return minDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  }, []);

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InputText
        name="pin"
        label="Pin *"
        placeholder="Enter Pin"
        onChange={handleChange}
        error={errors}
        value={values}
        disabled
        readOnly
      />
      <InputText
        name="wh_number"
        label="Mobile Number *"
        placeholder="Enter Mobile Number"
        onChange={handleChange}
        error={errors}
        value={values}
      />
      <SelectInput
        name="gift_delivery_type"
        label="Product delivery Type *"
        placeholder="Select Product Delivery Type"
        options={OPTIONS.GIFT_DELIVERY_LEVEL}
        onChange={handleChange}
        error={errors}
        value={values}
      />
      {values.gift_delivery_type === "2" && (
        <InputTextArea
          name="gift_delivery_address"
          label="Product Delivery Address *"
          placeholder="Enter Product Delivery Address"
          onChange={handleChange}
          error={errors}
          value={values}
        />
      )}
      {values.gift_delivery_type === "1" && (
        <InputText
          name="direct_pick_date"
          label="Direct Pick Date *"
          type="date"
          placeholder="Direct Pick Date"
          onChange={handleChange}
          error={errors}
          value={values}
          minDate={minSelectableDate}
        />
      )}
      <div className="flex justify-end space-x-3 pt-4">
        <Btn title="Cancel" onClick={onCloseModal} uiType="secondary" />
        <Btn title={"Submit"} isLoading={loading} onClick={handleSubmit} />
      </div>
    </form>
  );
};

export default ActivatePinForm;
