import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo } from "react";
import InputText from "@/components/ui/InputText";
import InputTextArea from "@/components/ui/InputTextArea";
import Btn from "@/components/ui/Btn";
import SelectInput from "@/components/ui/SelectInput";
import { OPTIONS } from "@/constants/others";

export const VALIDATION_SCHEMA = Yup.object().shape({
  wallet_type: Yup.string().required("Requied Wallet type*"),
  amount: Yup.string().required("Amount Required*"),
});

const WithDrawRequestForm = ({
  data = {},
  onAction = (values: any) => {},
  onCloseModal = () => {},
  loading = false,
  RequestError = {},
}: any) => {
  const { values, handleChange, errors, handleSubmit, setErrors } = useFormik({
    initialValues: {
      wallet_type: data?.wallet_type ?? "",
      amount: data?.amount ?? "",
      acc_no: data?.acc_no ?? "",
      acc_name: data?.acc_name ?? "",
      ifsc_code: data?.ifsc_code ?? "",
      bank_name: data?.bank_name ?? "",
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
      <SelectInput
        name="wallet_type"
        label="Select Wallet *"
        placeholder="Select Wallet"
        options={OPTIONS.WALLET_TYPE}
        onChange={handleChange}
        error={errors}
        value={values}
      />
      <InputText
        name="amount"
        label="Amount *"
        placeholder="Enter Amount"
        onChange={handleChange}
        error={errors}
        value={values}
      />

      <InputText
        name="acc_no"
        label="Account Number"
        placeholder="Enter Amount"
        onChange={handleChange}
        error={errors}
        value={values}
        readOnly={true}
      />
      <InputText
        name="ifsc_code"
        label="IFSC CODE"
        placeholder="Enter Amount"
        onChange={handleChange}
        error={errors}
        value={values}
        readOnly={true}
      />
      <InputText
        name="acc_name"
        label="Account Name"
        placeholder="Enter Amount"
        onChange={handleChange}
        error={errors}
        value={values}
        readOnly={true}
      />
      <InputText
        name="bank_name"
        label="Bank Name"
        placeholder="Enter Amount"
        onChange={handleChange}
        error={errors}
        value={values}
        readOnly={true}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Btn title="Cancel" onClick={onCloseModal} uiType="secondary" />
        <Btn title={"Submit"} isLoading={loading} onClick={handleSubmit} />
      </div>
    </form>
  );
};

export default WithDrawRequestForm;
