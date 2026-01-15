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
import { TrendingUp, User, Calendar, Phone, MapPin, Globe, Lock, CheckCircle } from "lucide-react";
import Loader from "@/components/ui/Loader";
import logo from "@/assets/logo.png";

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
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const {
    Post,
    error: RequestError,
    loading: actionLoading,
  } = useActionCall(SERVICE.REGISTER);
  
  const { values, handleChange, errors, handleSubmit, setErrors, touched, setTouched } = useFormik({
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
  }, []);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step) => {
    // Validate fields for current step
    let fieldsToValidate = [];
    
    if (step === 1) {
      fieldsToValidate = ['first_name', 'last_name', 'dob', 'mobile'];
    } else if (step === 2) {
      fieldsToValidate = ['nationality', 'state', 'district', 'city', 'pin_code', 'language'];
    } else if (step === 3) {
      fieldsToValidate = ['username', 'password', 'password_confirmation'];
    }
    
    const touchedFields = {};
    fieldsToValidate.forEach(field => {
      touchedFields[field] = true;
    });
    
    setTouched(touchedFields);
    
    // Check if any of the fields in this step have errors
    const hasErrors = fieldsToValidate.some(field => errors[field]);
    
    return !hasErrors;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  const handleSubmitStep = () => {
    if (validateStep(currentStep)) {
      handleSubmit();
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center safe-area-inset-bottom pb-20">
      <div className="px-6 sm:px-0 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <Link
            to="/"
            className="flex items-center space-x-3"
          >
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center p-2">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Join us to start your journey
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[...Array(totalSteps)].map((_, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                index + 1 <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {index + 1 < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < totalSteps - 1 && (
                <div className={`w-full h-1 mx-2 ${
                  index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                </div>
                
                <div className="space-y-4">
                  <InputText
                    name="first_name"
                    label="First Name *"
                    placeholder="Enter First Name"
                    onChange={handleChange}
                    error={errors}
                    value={values}
                    touched={touched}
                  />
                  <InputText
                    name="last_name"
                    label="Last Name *"
                    placeholder="Enter Last Name"
                    onChange={handleChange}
                    error={errors}
                    value={values}
                    touched={touched}
                  />
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <InputText
                      name="dob"
                      label="Date Of Birth *"
                      type="date"
                      placeholder="Date Of Birth"
                      onChange={handleChange}
                      error={errors}
                      value={values}
                      touched={touched}
                      className="pl-12"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <InputText
                      name="mobile"
                      label="Mobile *"
                      type="number"
                      placeholder="Enter Mobile Number"
                      onChange={handleChange}
                      error={errors}
                      value={values}
                      touched={touched}
                      className="pl-12"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location Information */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Location Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Globe className="w-5 h-5 text-gray-400" />
                    </div>
                    <InputText
                      name="nationality"
                      label="Nationality *"
                      value={values}
                      onChange={handleChange}
                      error={errors}
                      readOnly={true}
                      className="pl-12"
                    />
                  </div>
                  <SelectInput
                    name="state"
                    label="Select State *"
                    placeholder="Select State"
                    options={STATE_OPTIONS()}
                    onChange={handleChange}
                    error={errors}
                    value={values}
                    touched={touched}
                  />
                  <SelectInput
                    name="district"
                    label="Select District *"
                    placeholder="Select District"
                    options={DISTRICTS_OPTIONS(values?.state ?? "")}
                    onChange={handleChange}
                    error={errors}
                    value={values}
                    touched={touched}
                  />
                  <InputText
                    name="city"
                    label="City *"
                    placeholder="Enter City"
                    onChange={handleChange}
                    error={errors}
                    value={values}
                    touched={touched}
                  />
                  <InputText
                    name="pin_code"
                    label="Pin Code *"
                    placeholder="Enter Pin Code"
                    onChange={handleChange}
                    error={errors}
                    value={values}
                    touched={touched}
                  />
                  <SelectInput
                    name="language"
                    label="Select Mother tongue*"
                    placeholder="Select Mother tongue"
                    options={OPTIONS.LANG}
                    onChange={handleChange}
                    error={errors}
                    value={values}
                    touched={touched}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Account Information */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
                </div>
                
                <div className="space-y-4">
                  <InputText
                    name="username"
                    label="Username *"
                    placeholder="Enter Username"
                    onChange={handleChange}
                    error={errors}
                    value={values}
                    touched={touched}
                  />
                  <PasswordInput
                    name="password"
                    label="Password *"
                    placeholder="Enter Password"
                    value={values}
                    onChange={handleChange}
                    error={errors}
                    touched={touched}
                  />
                  <PasswordInput
                    name="password_confirmation"
                    label="Confirm Password *"
                    placeholder="Confirm Password"
                    value={values}
                    onChange={handleChange}
                    error={errors}
                    touched={touched}
                  />
                  <InputText
                    name="referral_code"
                    label="Promoter Code *"
                    placeholder="Promoter Code"
                    onChange={handleChange}
                    error={errors}
                    value={values}
                    readOnly={true}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
              <div className="flex-1" />
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <Btn
                  title={"Register"}
                  className="px-6 py-3"
                  isLoading={actionLoading}
                  onClick={handleSubmitStep}
                />
              )}
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign In
            </Link>
          </p>
          <div className="mt-4">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}