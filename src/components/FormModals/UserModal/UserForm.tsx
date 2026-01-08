import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo } from "react";
import InputText from "@/components/ui/InputText";
import SelectInput from "@/components/ui/SelectInput";
import PasswordInput from "@/components/ui/PasswordInput";
import moment from "moment";
import Btn from "@/components/ui/Btn";
import CheckboxInput from "@/components/ui/CheckboxInput";
import { OPTIONS } from "@/constants/others";
import { STATE_OPTIONS, DISTRICTS_OPTIONS } from "@/constants/state";

export const VALIDATION_SCHEMA = Yup.object().shape({
  first_name: Yup.string().required("First Name is required*"),
  last_name: Yup.string().required("Last Name is required*"),
  dob: Yup.string().required("Date of Birth is required*"),
  mobile: Yup.string()
    .required("Mobile number is required*")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
  nationality: Yup.string().required("Nationality is required*"),
  state: Yup.string().required("State is required*"),
  city: Yup.string().required("City is required*"),
  language: Yup.string().required("Language is required*"),
  district: Yup.string().required("District is required*"),
  pin_code: Yup.string()
    .required("Pin Code is required*")
    .matches(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit Pin Code"),
  username: Yup.string().required("Username is required*"),
  password: Yup.string()
    .required("Password is required*")
    .min(8, "Password must be at least 8 characters"),
  password_confirmation: Yup.string()
    .required("Password confirmation is required*")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});
const UserForm = ({
  data = {},
  onAction = (values: any) => {},
  onCloseModal = () => {},
  loading = false,
  RequestError = {},
}: any) => {
  const { values, handleChange, errors, handleSubmit, setErrors } = useFormik({
    initialValues: {
      first_name: data?.first_name ?? "",
      last_name: data?.last_name ?? "",
      dob: data?.dob ?? "",
      mobile: data?.mobile ?? "",
      nationality: data?.nationality ?? "India",
      state: data?.state ?? "",
      city: data?.city ?? "",
      language: data?.language ?? "",
      district: data?.district ?? "",
      pin_code: data?.pin_code ?? "",
      username: data?.username ?? "",
      password: data?.pwd_text ?? "",
      password_confirmation: data?.pwd_text ?? "",
      is_active: data?.is_active ?? 1,

      bank_name: data?.bank_name ?? "",
      branch_name: data?.branch_name ?? "",
      ifsc_code: data?.ifsc_code ?? "",
      acc_no: data?.acc_no ?? "",
      acc_name: data?.acc_name ?? "",
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <InputText
          name="first_name"
          label="First Name *"
          placeholder="Enter First Name"
          onChange={handleChange}
          error={errors}
          value={values}
        />
        <InputText
          name="last_name"
          label="Last Name *"
          placeholder="Enter Last Name"
          onChange={handleChange}
          error={errors}
          value={values}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <InputText
          name="dob"
          label="Date Of Birth *"
          type="date"
          placeholder="Date Of Birth"
          onChange={handleChange}
          error={errors}
          value={values}
        />
        <InputText
          name="mobile"
          label="Mobile *"
          type="number"
          placeholder="Enter Mobile Number"
          onChange={handleChange}
          error={errors}
          value={values}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <InputText
          name="nationality"
          label="Nationality *"
          value={values}
          onChange={handleChange}
          error={errors}
          readOnly={true}
        />
        <SelectInput
          name="state"
          label="Select State *"
          placeholder="Select State"
          options={STATE_OPTIONS()}
          onChange={handleChange}
          error={errors}
          value={values}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <SelectInput
          name="district"
          label="Select District *"
          placeholder="Select District"
          options={DISTRICTS_OPTIONS(values?.state ?? "")}
          onChange={handleChange}
          error={errors}
          value={values}
        />
        <InputText
          name="city"
          label="city *"
          placeholder="Enter City"
          onChange={handleChange}
          error={errors}
          value={values}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <InputText
          name="pin_code"
          label="Pin Code *"
          placeholder="Enter Pin Code"
          onChange={handleChange}
          error={errors}
          value={values}
        />
        <SelectInput
          name="language"
          label="Select mother tongue *"
          placeholder="Select Mother tongue"
          options={OPTIONS.LANG}
          onChange={handleChange}
          error={errors}
          value={values}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <InputText
          name="username"
          label="Username *"
          placeholder="Enter Username"
          onChange={handleChange}
          error={errors}
          value={values}
        />

        <PasswordInput
          name="password"
          label="Password *"
          placeholder="Enter Password"
          value={values}
          readOnly={!!data?.id}
          onChange={handleChange}
          error={errors}
          className={data?.id ? "opacity-75 cursor-not-allowed" : ""}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <PasswordInput
          name="password_confirmation"
          label="Confirm Password *"
          placeholder="Enter Password"
          value={values}
          readOnly={!!data?.id}
          onChange={handleChange}
          error={errors}
          className={data?.id ? "opacity-75 cursor-not-allowed" : ""}
        />

        <CheckboxInput
          label="Is Active?"
          name="is_active"
          value={values}
          onChange={handleChange}
          error={errors}
        />
      </div>

      <hr />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <InputText
            name="acc_no"
            label="Account Number"
            placeholder="Enter Account Number"
            value={values}
            onChange={handleChange}
            error={errors}
          />
        </div>
        <div className="space-y-2">
          <InputText
            name="acc_name"
            label="Account Name "
            placeholder="Enter Account Name"
            value={values}
            onChange={handleChange}
            error={errors}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <InputText
            name="bank_name"
            label="Bank Name "
            type="text"
            placeholder="Enter Bank Name"
            value={values}
            onChange={handleChange}
            error={errors}
          />
        </div>
        <div className="space-y-2">
          <InputText
            type="text"
            name="ifsc_code"
            label="IFSC Code "
            placeholder="Enter IFSC Code"
            value={values}
            onChange={handleChange}
            error={errors}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <InputText
            name="branch_name"
            label="Branch Name *"
            type="text"
            placeholder="Enter Branch Name"
            value={values}
            onChange={handleChange}
            error={errors}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Btn title="Cancel" onClick={onCloseModal} uiType="secondary" />
        <Btn title={"Submit"} isLoading={loading} onClick={handleSubmit} />
      </div>
    </form>
  );
};

export default UserForm;
