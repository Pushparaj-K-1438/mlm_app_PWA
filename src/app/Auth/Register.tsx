import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo } from "react";

import { useActionCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import UserForm from "@/components/FormModals/UserModal/UserForm";
import InputText from "@/components/ui/InputText";
import Btn from "@/components/ui/Btn";
import SelectInput from "@/components/ui/SelectInput";
import PasswordInput from "@/components/ui/PasswordInput";
import { OPTIONS } from "@/constants/others";
import { DISTRICTS_OPTIONS, STATE_OPTIONS } from "@/constants/state";
import { TrendingUp } from "lucide-react";
import Loader from "@/components/ui/Loader";
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

export default function Register() {
  const { searchParams, navigate } = useQueryParams();

  const referalCode = searchParams.get("promoter_code");
  const [loading, setLoading] = useState(true);

  const {
    Post,
    error: RequestError,
    loading: actionLoading,
  } = useActionCall(SERVICE.REGISTER);
  const { values, handleChange, errors, handleSubmit, setErrors } = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      dob: "",
      mobile: "",
      nationality: "India",
      state: "",
      city: "",
      district: "",
      pin_code: "",
      username: "",
      password: "",
      password_confirmation: "",
      language: "",
      referral_code: referalCode,
    },
    onSubmit: async (values: any) => {
      //onAction(values);
      const response = await Post(values, "Successfully Register");
      if (response) {
        navigate.push("/login");
      }
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
  useEffect(() => {
    if (!referalCode) {
      navigate.push("/login");
    }
    setLoading(false);
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to="/"
          className="flex justify-center items-center space-x-3 mb-6"
        >
          
          <img
            src="/src/assets/logo.png"
            alt="Starup Logo"
            className="h-8 w-auto"
          />
        </Link>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Register
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
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
                label="Select Mother tongue*"
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
                onChange={handleChange}
                error={errors}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <PasswordInput
                name="password_confirmation"
                label="Confirm Password *"
                placeholder="Enter Password"
                value={values}
                onChange={handleChange}
                error={errors}
              />

              <InputText
                name="referral_code"
                label="Promoter Code *"
                placeholder="Enter Password"
                onChange={handleChange}
                error={errors}
                value={values}
                readOnly={true}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Btn
                title={"Register"}
                className="w-full"
                isLoading={actionLoading}
                onClick={handleSubmit}
              />
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
