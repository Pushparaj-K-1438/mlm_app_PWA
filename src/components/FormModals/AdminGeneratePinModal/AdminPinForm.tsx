import { useFormik } from "formik";
import { useState } from "react";
import Btn from "@/components/ui/Btn";

const PinConfirmationForm = ({
  data = {},
  onAction = (values: any) => {},
  onCloseModal = () => {},
  loading = false,
  userData = {},
  allPinRequestsData,
}: any) => {
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      current_level: data?.level ?? "",
    },
    onSubmit: async (values: any) => {
      onAction(values);
    },
  });
  // Find the specific user data from all pin requests
  const currentUserData = allPinRequestsData?.data?.find((request: any) =>
    request.id.toString() === userData.id?.toString()
  );

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* User Information Display */}
      {currentUserData?.user && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-2">User Information:</h4>
          <div className="text-sm text-gray-700">
            <p><span className="font-medium">Name:</span> {currentUserData.user.first_name}</p>
            <p><span className="font-medium">UserName:</span> {currentUserData.user.username}</p>
            <p><span className="font-medium">Mobile:</span> {currentUserData.user.mobile}</p>
            <p><span className="font-medium">State:</span> {currentUserData.user.dob}</p>
            <p><span className="font-medium">City:</span> {currentUserData.user.city}</p>
            <p><span className="font-medium">State:</span> {currentUserData.user.state}</p>
          </div>
        </div>
      )}
      <div className="flex justify-end space-x-3 pt-4">
        <Btn title={"Accept"} isLoading={loading} onClick={handleSubmit} />
      </div>
    </form>
  );
};

export default PinConfirmationForm;
