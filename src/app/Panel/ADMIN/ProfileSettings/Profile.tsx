import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InputText from "@/components/ui/InputText";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useActionCall, useGetCall } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";
import Lib from "@/utils/Lib";
import { useFormik } from "formik";
import Btn from "@/components/ui/Btn";
import { useEffect, useMemo } from "react";
import PasswordInput from "@/components/ui/PasswordInput";

export const USER_VALIDATION_SCHEMA = Yup.object().shape({
  first_name: Yup.string().required("Required First Name*"),
  last_name: Yup.string().required("Required Last Name*"),
  mobile: Yup.string().required("Required Mobile number*"),
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
export const ADMIN_BANK_VALIDATION_SCHEMA = Yup.object().shape({
  account_number: Yup.string().required("Account Number is required*"),
  account_holder_name: Yup.string().required("Account Holder Name is required*"),
  ifsc_code: Yup.string().required("IFSC Code is required*"),
  bank_name: Yup.string().required("Bank Name is required*"),
  branch_name: Yup.string().required("Branch Name is required*"),
  whatsapp_number: Yup.string().required("WhatsApp Number is required*"),
});
export const SCRATCH_REFERRAL_VALIDATION_SCHEMA = Yup.object().shape({
  is_active: Yup.boolean().required("Is Active status is required*"),
  referral_code: Yup.string().required("Referral Code is required*"),
});

const Profile = () => {
  const {
    loading,
    setQuery,
    data: profileData,
  } = useGetCall(SERVICE.GET_PROFILE);

  const {
    loading: bankloading,
    setQuery: setBankQuery,
    data: bankData,
  } = useGetCall(SERVICE.GET_ADMIN_BANK_DETAILS);

  const {
    Post: updateAdminBank,
    error: adminBankRequestError,
    loading: adminBankUploadingLoading,
  } = useActionCall(SERVICE.ADMIN_BANK_DETAILS_UPDATE);

  const {
    values: adminBankValues,
    handleChange: handleAdminBankChange,
    errors: adminBankErrors,
    handleSubmit: handleAdminBankSubmit,
    setErrors: setAdminBankError,
  } = useFormik({
    initialValues: {
      account_number: bankData?.data?.account_number ?? "",
      account_holder_name: bankData?.data?.account_holder_name ?? "",
      ifsc_code: bankData?.data?.ifsc_code ?? "",
      bank_name: bankData?.data?.bank_name ?? "",
      branch_name: bankData?.data?.branch_name ?? "",
      whatsapp_number: bankData?.data?.whatsapp_number ?? "",
    },
    onSubmit: async (values: any) => {
      let response = await updateAdminBank(values);
      if (response) {
        setBankQuery({});
      }
    },

    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: ADMIN_BANK_VALIDATION_SCHEMA,
    enableReinitialize: true,
  });

  useMemo(() => {
    if (adminBankRequestError && Object.keys(adminBankRequestError).length) {
      setAdminBankError(adminBankRequestError);
    }
  }, [adminBankRequestError]);

  const {
    Patch: updateProfile,
    error: RequestError,
    loading: profileUploadingLoading,
  } = useActionCall(SERVICE.PROFILE_UPDATE);

  const {
    Patch: updatePassword,
    loading: passwordUploadingLoading,
  } = useActionCall(SERVICE.CHANGE_PASSWORD);

  const {
    loading: scratchReferralLoading,
    setQuery: setScratchReferralQuery,
    data: scratchReferralData,
  } = useGetCall(SERVICE.GET_ADDITIONAL_SCRAT);

  const {
    Post: updateScratchReferral,
    error: scratchReferralError,
    loading: scratchReferralUploadingLoading,
  } = useActionCall(SERVICE.ADDITIONAL_SCRAT_UPDATE);

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

  const {
    values: scratchReferralValues,
    handleChange: handleScratchReferralChange,
    errors: scratchReferralErrors,
    handleSubmit: handleScratchReferralSubmit,
    setErrors: setScratchReferralError,
    setFieldValue: setScratchReferralFieldValue,
  } = useFormik({
    initialValues: {
      is_active: scratchReferralData?.data?.is_active ?? false,
      referral_code: scratchReferralData?.data?.referral_code ?? "",
    },
    onSubmit: async (values: any) => {
      let response = await updateScratchReferral(values);
      if (response) {
        setScratchReferralQuery({});
      }
    },

    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: SCRATCH_REFERRAL_VALIDATION_SCHEMA,
    enableReinitialize: true,
  });

  useMemo(() => {
    if (RequestError && Object.keys(RequestError).length) {
      setProfileError(RequestError);
    }
  }, [RequestError]);

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <InputText
                        name="first_name"
                        label="First Name *"
                        placeholder="Enter First Name"
                        onChange={handleProfileChange}
                        error={profileErros}
                        value={profileValues}
                      />
                    </div>
                    <div className="space-y-2">
                      <InputText
                        name="last_name"
                        label="Last Name *"
                        placeholder="Enter Last Name"
                        onChange={handleProfileChange}
                        error={profileErros}
                        value={profileValues}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <InputText
                      name="mobile"
                      label="Mobile *"
                      type="number"
                      placeholder="Phone Number"
                      onChange={handleProfileChange}
                      error={profileErros}
                      value={profileValues}
                    />
                  </div>
                  <Btn
                    title="Save Changes"
                    onClick={handleProfileSubmit}
                    isLoading={profileUploadingLoading}
                  />
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

              {/* Bank Informations */}
              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <CardTitle>Bank Informations</CardTitle>
                  </div>
                  <CardDescription>
                    Your bank details and information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <InputText
                        name="account_number"
                        label="Account Number *"
                        placeholder="Enter Account Number"
                        onChange={handleAdminBankChange}
                        error={adminBankErrors}
                        value={adminBankValues}
                      />
                    </div>
                    <div className="space-y-2">
                      <InputText
                        name="account_holder_name"
                        label="Account Holder Name *"
                        placeholder="Enter Account Holder Name"
                        onChange={handleAdminBankChange}
                        error={adminBankErrors}
                        value={adminBankValues}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <InputText
                        name="ifsc_code"
                        label="IFSC Code *"
                        placeholder="Enter IFSC Code"
                        onChange={handleAdminBankChange}
                        error={adminBankErrors}
                        value={adminBankValues}
                      />
                    </div>
                    <div className="space-y-2">
                      <InputText
                        name="bank_name"
                        label="Bank Name *"
                        placeholder="Enter Bank Name"
                        onChange={handleAdminBankChange}
                        error={adminBankErrors}
                        value={adminBankValues}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <InputText
                        name="branch_name"
                        label="Branch Name *"
                        placeholder="Enter Branch Name"
                        onChange={handleAdminBankChange}
                        error={adminBankErrors}
                        value={adminBankValues}
                      />
                    </div>
                    <div className="space-y-2">
                      <InputText
                        name="whatsapp_number"
                        label="WhatsApp Number *"
                        placeholder="Enter WhatsApp Number"
                        onChange={handleAdminBankChange}
                        error={adminBankErrors}
                        value={adminBankValues}
                      />
                    </div>
                  </div>

                  <Btn
                    title="Save Bank Details"
                    onClick={handleAdminBankSubmit}
                    isLoading={adminBankUploadingLoading}
                  />
                </CardContent>
              </Card>

              {/* Additional Scratch Referrals */}
              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <CardTitle>Additional Scratch Referrals</CardTitle>
                  </div>
                  <CardDescription>
                    Manage your additional scratch referral settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={scratchReferralValues.is_active || false}
                      onChange={(e) => setScratchReferralFieldValue('is_active', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <Label htmlFor="is_active" className="text-sm font-medium">
                      Is Active
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <InputText
                      name="referral_code"
                      label="Referral Code *"
                      placeholder="Enter Referral Code"
                      onChange={handleScratchReferralChange}
                      error={scratchReferralErrors}
                      value={scratchReferralValues}
                    />
                  </div>
                  <Btn
                    title="Update Scratch Referrals"
                    onClick={handleScratchReferralSubmit}
                    isLoading={scratchReferralUploadingLoading}
                  />
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
