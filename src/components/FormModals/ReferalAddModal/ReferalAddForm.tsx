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
import { User, Calendar, Phone, MapPin, Globe, Lock, CreditCard, Check, UserPlus } from "lucide-react";

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

const ReferalAddForm = ({
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
      district: data?.district ?? "",
      pin_code: data?.pin_code ?? "",
      username: data?.username ?? "",
      password: data?.password ?? "",
      password_confirmation: data?.password_confirmation ?? "",
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
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Personal Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 text-blue-600 mr-2" />
          Personal Information
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                <label className="text-sm font-medium text-gray-700">Date of Birth *</label>
              </div>
              <InputText
                name="dob"
                type="date"
                placeholder="Date of Birth"
                onChange={handleChange}
                error={errors}
                value={values}
              />
            </div>
            <div>
              <div className="flex items-center mb-2">
                <Phone className="w-4 h-4 text-gray-500 mr-2" />
                <label className="text-sm font-medium text-gray-700">Mobile *</label>
              </div>
              <InputText
                name="mobile"
                type="number"
                placeholder="Enter Mobile Number"
                onChange={handleChange}
                error={errors}
                value={values}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 text-green-600 mr-2" />
          Location Information
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center mb-2">
                <Globe className="w-4 h-4 text-gray-500 mr-2" />
                <label className="text-sm font-medium text-gray-700">Nationality *</label>
              </div>
              <InputText
                name="nationality"
                value={values}
                onChange={handleChange}
                error={errors}
                readOnly={true}
              />
            </div>
            <SelectInput
              name="state"
              label="State *"
              placeholder="Select State"
              options={STATE_OPTIONS()}
              onChange={handleChange}
              error={errors}
              value={values}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <SelectInput
              name="district"
              label="District *"
              placeholder="Select District"
              options={DISTRICTS_OPTIONS(values?.state ?? "")}
              onChange={handleChange}
              error={errors}
              value={values}
            />
            <InputText
              name="city"
              label="City *"
              placeholder="Enter City"
              onChange={handleChange}
              error={errors}
              value={values}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
              label="Language *"
              placeholder="Select Language"
              options={OPTIONS.LANG}
              onChange={handleChange}
              error={errors}
              value={values}
            />
          </div>
        </div>
      </div>

      {/* Account Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lock className="w-5 h-5 text-purple-600 mr-2" />
          Account Information
        </h3>
        <div className="space-y-4">
          <InputText
            name="username"
            label="Username *"
            placeholder="Enter Username"
            onChange={handleChange}
            error={errors}
            value={values}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <PasswordInput
              name="password"
              label="Password *"
              placeholder="Enter Password"
              value={values}
              onChange={handleChange}
              error={errors}
            />
            <PasswordInput
              name="password_confirmation"
              label="Confirm Password *"
              placeholder="Confirm Password"
              value={values}
              onChange={handleChange}
              error={errors}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-2">
        <button
          type="button"
          onClick={onCloseModal}
          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Adding...
            </div>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Promoter
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ReferalAddForm;