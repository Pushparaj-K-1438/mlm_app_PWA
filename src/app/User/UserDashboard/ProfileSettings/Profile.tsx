import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InputText from "@/components/ui/InputText";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Lock, Camera, Shield, CreditCard, ChevronRight, AlertCircle, CheckCircle, Edit3, Eye, EyeOff } from "lucide-react";
import { useActionCall, useGetCall } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";
import Lib from "@/utils/Lib";
import { useFormik } from "formik";
import Btn from "@/components/ui/Btn";
import { useMemo, useState } from "react";
import { OPTIONS } from "@/constants/others";
import { STATE_OPTIONS, DISTRICTS_OPTIONS } from "@/constants/state";
import SelectInput from "@/components/ui/SelectInput";
import PasswordInput from "@/components/ui/PasswordInput";

export const USER_VALIDATION_SCHEMA = Yup.object().shape({
  first_name: Yup.string().required("Required First Name*"),
  last_name: Yup.string().required("Required Last Name*"),
  mobile: Yup.string().required("Required Mobile number*"),
  dob: Yup.string().required("Required Date of Birth*"),
  nationality: Yup.string().required("Required Nationality*"),
  state: Yup.string().required("Required State*"),
  district: Yup.string().required("Required District*"),
  city: Yup.string().required("Required City*"),
  pin_code: Yup.string().required("Required Pin Code*"),
  language: Yup.string().required("Required Language*"),
});
export const BANK_VALIDATION_SCHEMA = Yup.object().shape({
  bank_name: Yup.string().required("Required Bank Name*"),
  branch_name: Yup.string().required("Required Branch Name*"),
  ifsc_code: Yup.string().required("Required IFSC Code*"),
  acc_no: Yup.string().required("Required Account Number*"),
  acc_name: Yup.string().required("Required Account Name*"),
});
export const PASSWORD_VALIDATION_SCHEMA = Yup.object().shape({
  current_password: Yup.string().required("Password is required*"),
  new_password: Yup.string()
    .required("Password is required*")
    .min(8, "Password must be at least 8 characters"),
  password_confirmation: Yup.string()
    .required("Password confirmation is required*")
    .oneOf(
      [Yup.ref("new_password"), null],
      "Confirm Passwords must match New Password"
    ),
});

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    loading,
    setQuery,
    data: profileData,
  } = useGetCall(SERVICE.GET_PROFILE);

  const {
    Patch: updateProfile,
    error: RequestError,
    loading: profileUploadingLoading,
  } = useActionCall(SERVICE.PROFILE_UPDATE);

  const {
    loading: bankloading,
    setQuery: setBankQuery,
    data: bankData,
  } = useGetCall(SERVICE.GET_BANK_DETAILS);

  const {
    Post: updateBank,
    error: bankRequestError,
    loading: bankUploadingLoading,
  } = useActionCall(SERVICE.BANK_DETAILS_UPDATE);


  const { Patch: updatePassword, loading: passwordUploadingLoading } =
    useActionCall(SERVICE.CHANGE_PASSWORD);

  const isProfileLocked = profileData?.data?.is_profile_updated === 1;
  const isBankLocked = bankData?.data?.is_editable === 1;
  const uploading = profileUploadingLoading || bankUploadingLoading || false;

  const {
    values: profileValues,
    handleChange: handleProfileChange,
    errors: profileErros,
    handleSubmit: handleProfileSubmit,
    setErrors: setProfileError,
  } = useFormik({
    initialValues: {
      first_name: profileData?.data?.first_name ?? "",
      last_name: profileData?.data?.last_name ?? "",
      mobile: profileData?.data?.mobile ?? "",
      email: profileData?.data?.email ?? "",
      dob: profileData?.data?.dob ?? "",
      nationality: profileData?.data?.nationality ?? "",
      state: profileData?.data?.state ?? "",
      district: profileData?.data?.district ?? "",
      city: profileData?.data?.city ?? "",
      pin_code: profileData?.data?.pin_code ?? "",
      language: profileData?.data?.language ?? "",
    },
    onSubmit: async (values: any) => {
      let response = await updateProfile(values);
      if (response) {
        setQuery({});
      }
    },

    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: USER_VALIDATION_SCHEMA,
    enableReinitialize: true,
  });

  const {
    values: bankValues,
    handleChange: handleBankChange,
    errors: bankErros,
    handleSubmit: handleBankSubmit,
    setErrors: setBankError,
  } = useFormik({
    initialValues: {
      bank_name: bankData?.data?.bank_name ?? "",
      branch_name: bankData?.data?.branch_name ?? "",
      ifsc_code: bankData?.data?.ifsc_code ?? "",
      acc_no: bankData?.data?.acc_no ?? "",
      acc_name: bankData?.data?.acc_name ?? ""
    },
    onSubmit: async (values: any) => {
      let response = await updateBank(values);
      if (response) {
        setBankQuery({});
      }
    },

    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: BANK_VALIDATION_SCHEMA,
    enableReinitialize: true,
  });

  const {
    values: passwordValues,
    handleChange: handleChangePassword,
    errors: passwordErrors,
    handleSubmit: handlePasswordSubmit,
  } = useFormik({
    initialValues: {
      current_password: "",
      new_password: "",
      password_confirmation: "",
    },
    onSubmit: async (values: any) => {
      updatePassword(values);
    },

    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: PASSWORD_VALIDATION_SCHEMA,
  });

  useMemo(() => {
    if (RequestError && Object.keys(RequestError).length) {
      setProfileError(RequestError);
    }
  }, [RequestError]);

  useMemo(() => {
    if (bankRequestError && Object.keys(bankRequestError).length) {
      setBankError(bankRequestError);
    }
  }, [bankRequestError]);

  return (
    <div className="w-full pb-24 px-4 bg-gray-50 min-h-screen">
      {/* Header Section - Native App Style */}
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <main className="space-y-6">
          {/* Profile Overview Card - Mobile Native Style */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {Lib.breakTextWhileSpace(
                    `${profileData?.data?.first_name} ${profileData?.data?.last_name}`
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 active:scale-95 transition-transform">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {profileData?.data?.first_name} {profileData?.data?.last_name}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{profileData?.data?.email}</p>

              <div className="w-full grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-500">Rewards</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-500">Points</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation - Mobile Native Style */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-1 flex">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-2xl text-sm font-medium transition-all ${activeTab === "profile"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600"
                }`}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("bank")}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-2xl text-sm font-medium transition-all ${activeTab === "bank"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600"
                }`}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Bank
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-2xl text-sm font-medium transition-all ${activeTab === "security"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600"
                }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              Security
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                {isProfileLocked && (
                  <div className="flex items-center text-xs text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Locked
                  </div>
                )}
              </div>

              {isProfileLocked && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 mb-6">
                  <div className="flex">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Profile Locked</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Your profile has been locked and cannot be edited. Please contact support if you need to make changes.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <InputText
                      name="first_name"
                      label="First Name *"
                      placeholder="Enter First Name"
                      onChange={isProfileLocked ? undefined : handleProfileChange}
                      error={isProfileLocked ? {} : profileErros}
                      value={profileValues}
                      disabled={isProfileLocked}
                      readOnly={isProfileLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <InputText
                      name="last_name"
                      label="Last Name *"
                      placeholder="Enter Last Name"
                      onChange={isProfileLocked ? undefined : handleProfileChange}
                      error={isProfileLocked ? {} : profileErros}
                      value={profileValues}
                      disabled={isProfileLocked}
                      readOnly={isProfileLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <InputText
                      name="mobile"
                      label="Mobile *"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Phone Number"
                      onChange={isProfileLocked ? undefined : handleProfileChange}
                      error={isProfileLocked ? {} : profileErros}
                      value={profileValues || ''}
                      disabled={isProfileLocked}
                      readOnly={isProfileLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <InputText
                      type="Date"
                      name="dob"
                      label="Date of Birth *"
                      placeholder="Enter Date of Birth"
                      onChange={isProfileLocked ? undefined : handleProfileChange}
                      error={isProfileLocked ? {} : profileErros}
                      value={profileValues}
                      disabled={isProfileLocked}
                      readOnly={isProfileLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <InputText
                      name="nationality"
                      label="Nationality *"
                      type="text"
                      placeholder="Nationality"
                      onChange={isProfileLocked ? undefined : handleProfileChange}
                      error={isProfileLocked ? {} : profileErros}
                      value={profileValues}
                      disabled={isProfileLocked}
                      readOnly={isProfileLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <SelectInput
                      name="state"
                      label="Select State *"
                      placeholder="Select State"
                      options={STATE_OPTIONS()}
                      onChange={isProfileLocked ? undefined : handleProfileChange}
                      error={isProfileLocked ? {} : profileErros}
                      value={profileValues}
                      disabled={isProfileLocked}
                      readOnly={isProfileLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <SelectInput
                      name="district"
                      label="Select District *"
                      placeholder="Select District"
                      options={DISTRICTS_OPTIONS(profileValues?.state ?? "")}
                      onChange={isProfileLocked ? undefined : handleProfileChange}
                      error={isProfileLocked ? {} : profileErros}
                      value={profileValues}
                      disabled={isProfileLocked}
                      readOnly={isProfileLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <InputText
                      name="city"
                      label="City *"
                      placeholder="Enter City"
                      onChange={isProfileLocked ? undefined : handleProfileChange}
                      error={isProfileLocked ? {} : profileErros}
                      value={profileValues}
                      disabled={isProfileLocked}
                      readOnly={isProfileLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <InputText
                      name="pin_code"
                      label="Pin Code *"
                      placeholder="Enter Pin Code"
                      onChange={isProfileLocked ? undefined : handleProfileChange}
                      error={isProfileLocked ? {} : profileErros}
                      value={profileValues}
                      disabled={isProfileLocked}
                      readOnly={isProfileLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <SelectInput
                      name="language"
                      label="Select Mother tongue*"
                      placeholder="Select Mother tongue"
                      options={OPTIONS.LANG}
                      onChange={isProfileLocked ? undefined : handleProfileChange}
                      error={isProfileLocked ? {} : profileErros}
                      value={profileValues}
                      disabled={isProfileLocked}
                      readOnly={isProfileLocked}
                    />
                  </div>
                </div>

                {!isProfileLocked && (
                  <Btn
                    title="Save Changes"
                    type="button"
                    onClick={handleProfileSubmit}
                    className="w-full py-3 mt-6 rounded-full"
                    isLoading={uploading}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === "bank" && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Bank Information</h3>
                {isBankLocked && (
                  <div className="flex items-center text-xs text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Locked
                  </div>
                )}
              </div>

              {isBankLocked && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 mb-6">
                  <div className="flex">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Bank Details Locked</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Your bank details have been locked and cannot be edited. Please contact support if you need to make changes.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <InputText
                      name="acc_no"
                      label="Account Number *"
                      placeholder="Enter Account Number"
                      onChange={isBankLocked ? undefined : handleBankChange}
                      error={isBankLocked ? {} : bankErros}
                      value={bankValues}
                      disabled={isBankLocked}
                      readOnly={isBankLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <InputText
                      name="acc_name"
                      label="Account Name *"
                      placeholder="Enter Account Name"
                      onChange={isBankLocked ? undefined : handleBankChange}
                      error={isBankLocked ? {} : bankErros}
                      value={bankValues}
                      disabled={isBankLocked}
                      readOnly={isBankLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <InputText
                      name="bank_name"
                      label="Bank Name *"
                      type="text"
                      placeholder="Enter Bank Name"
                      onChange={isBankLocked ? undefined : handleBankChange}
                      error={isBankLocked ? {} : bankErros}
                      value={bankValues}
                      disabled={isBankLocked}
                      readOnly={isBankLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <InputText
                      type="text"
                      name="ifsc_code"
                      label="IFSC Code *"
                      placeholder="Enter IFSC Code"
                      onChange={isBankLocked ? undefined : handleBankChange}
                      error={isBankLocked ? {} : bankErros}
                      value={bankValues}
                      disabled={isBankLocked}
                      readOnly={isBankLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <InputText
                      name="branch_name"
                      label="Branch Name *"
                      type="text"
                      placeholder="Enter Branch Name"
                      onChange={isBankLocked ? undefined : handleBankChange}
                      error={isBankLocked ? {} : bankErros}
                      value={bankValues}
                      disabled={isBankLocked}
                      readOnly={isBankLocked}
                    />
                  </div>
                </div>

                {!isBankLocked && (
                  <Btn
                    title="Save Changes"
                    type="button"
                    onClick={handleBankSubmit}
                    className="w-full py-3 mt-6 rounded-full"
                    isLoading={uploading}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Security Settings</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
                  <div className="flex">
                    <Shield className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Password Security</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <InputText
                      name="current_password"
                      label="Current Password *"
                      placeholder="Enter Current Password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordValues}
                      onChange={handleChangePassword}
                      error={passwordErrors}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-9 text-gray-500"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <InputText
                      name="new_password"
                      label="New Password *"
                      placeholder="Enter New Password"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordValues}
                      onChange={handleChangePassword}
                      error={passwordErrors}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-9 text-gray-500"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <InputText
                      name="password_confirmation"
                      label="Confirm Password *"
                      placeholder="Enter Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordValues}
                      onChange={handleChangePassword}
                      error={passwordErrors}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-9 text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Btn
                  title="Update Password"
                  onClick={handlePasswordSubmit}
                  className="w-full py-3 mt-6 rounded-full"
                  isLoading={passwordUploadingLoading}
                />
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default Profile;