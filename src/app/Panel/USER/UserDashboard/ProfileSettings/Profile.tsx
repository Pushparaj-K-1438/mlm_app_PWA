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
import { User, Lock } from "lucide-react";
import { useActionCall, useGetCall } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";
import Lib from "@/utils/Lib";
import { useFormik } from "formik";
import Btn from "@/components/ui/Btn";
import {useMemo } from "react";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account and preferences
        </p>
      </div>
      {/* Main Content */}
      {loading ? (
        <Loader />
      ) : (
        <main className="container p-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview Card */}
            <Card className="lg:col-span-1 shadow-soft h-fit">
              <CardHeader className="text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-background shadow-elegant">
                      <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                        <AvatarFallback className="bg-transparent text-white text-3xl font-bold">
                          {Lib.breakTextWhileSpace(
                            `${profileData?.data?.first_name} ${profileData?.data?.last_name}`
                          )}
                        </AvatarFallback>
                      </div>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">
                      {profileData?.data?.first_name}{" "}
                      {profileData?.data?.last_name}
                    </h3>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Settings Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <CardTitle>Personal Information</CardTitle>
                  </div>
                  <CardDescription>
                    Update your personal details and information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  { isProfileLocked &&
                    <div className="text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-md mt-4">
                      Your profile has been locked and cannot be edited. Please contact support if you need to make changes.
                    </div>
                  }
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {!isProfileLocked && 
                    <Btn
                      title="Save Changes"
                      type="button"
                      onClick={handleProfileSubmit}
                      className="w-fit px-6 mt-4"
                      isLoading={uploading}
                    />
                  }
                </CardContent>
              </Card>

              {/* Bank Informations */}
              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <CardTitle>Bank Informations</CardTitle>
                  </div>
                  <CardDescription>
                    Update your bank details and information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  { isBankLocked &&
                    <div className="text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-md mt-4">
                      Your profile has been locked and cannot be edited. Please contact support if you need to make changes.
                    </div>
                  }
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                 
                      
                  {!isBankLocked && 
                    <Btn
                      title="Save Changes"
                      type="button"
                      onClick={handleBankSubmit}
                      className="w-fit px-6 mt-4"
                      isLoading={uploading}
                    />
                  }
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    <CardTitle>Security</CardTitle>
                  </div>
                  <CardDescription>
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <PasswordInput
                      name="current_password"
                      label="Current Password *"
                      placeholder="Enter Current Password"
                      value={passwordValues}
                      onChange={handleChangePassword}
                      error={passwordErrors}
                    />
                  </div>
                  <div className="space-y-2">
                    <PasswordInput
                      name="new_password"
                      label="Password *"
                      placeholder="Enter New Password"
                      value={passwordValues}
                      onChange={handleChangePassword}
                      error={passwordErrors}
                    />
                  </div>
                  <div className="space-y-2">
                    <PasswordInput
                      name="password_confirmation"
                      label="Password *"
                      placeholder="Enter Confirm Password"
                      value={passwordValues}
                      onChange={handleChangePassword}
                      error={passwordErrors}
                    />
                  </div>

                  <Btn
                    title="Update Password"
                    onClick={handlePasswordSubmit}
                    isLoading={passwordUploadingLoading}
                  />

                  <Separator className="my-4" />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};
export default Profile;
