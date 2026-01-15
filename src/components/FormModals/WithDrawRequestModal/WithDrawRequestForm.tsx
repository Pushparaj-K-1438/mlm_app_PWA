import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo } from "react";
import InputText from "@/components/ui/InputText";
import InputTextArea from "@/components/ui/InputTextArea";
import Btn from "@/components/ui/Btn";
import SelectInput from "@/components/ui/SelectInput";
import { OPTIONS } from "@/constants/others";
import { Wallet, CreditCard, Building, AlertCircle, Check } from "lucide-react";

export const VALIDATION_SCHEMA = Yup.object().shape({
  wallet_type: Yup.string().required("Requied Wallet type*"),
  amount: Yup.string().required("Amount Required*"),
});

const WithDrawRequestForm = ({
  data = {},
  onAction = (values: any) => { },
  onCloseModal = () => { },
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
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Wallet Selection */}
      <div>
        <div className="flex items-center mb-2">
          <Wallet className="w-5 h-5 text-gray-500 mr-2" />
          <label className="text-sm font-medium text-gray-700">Select Wallet *</label>
        </div>
        <SelectInput
          name="wallet_type"
          placeholder="Select Wallet"
          options={OPTIONS.WALLET_TYPE}
          onChange={handleChange}
          error={errors}
          value={values}
        />
      </div>

      {/* Amount Input */}
      <div>
        <div className="flex items-center mb-2">
          <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
          <label className="text-sm font-medium text-gray-700">Amount *</label>
        </div>
        <InputText
          name="amount"
          placeholder="Enter Amount"
          onChange={handleChange}
          error={errors}
          value={values}
        />
      </div>

      {/* Bank Information Section */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center mb-4">
          <Building className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-700">Bank Information</h3>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center mb-2">
              <span className="text-xs text-gray-500 mr-2">A/C No:</span>
            </div>
            <InputText
              name="acc_no"
              value={values}
              readOnly={true}
              className="bg-white border-gray-200"
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <span className="text-xs text-gray-500 mr-2">IFSC:</span>
            </div>
            <InputText
              name="ifsc_code"
              value={values}
              readOnly={true}
              className="bg-white border-gray-200"
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <span className="text-xs text-gray-500 mr-2">A/C Name:</span>
            </div>
            <InputText
              name="acc_name"
              value={values}
              readOnly={true}
              className="bg-white border-gray-200"
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <span className="text-xs text-gray-500 mr-2">Bank:</span>
            </div>
            <InputText
              name="bank_name"
              value={values}
              readOnly={true}
              className="bg-white border-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-amber-900 mb-2">Important Notes:</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Withdrawal requests are processed within 3-5 business days</li>
              <li>• Minimum withdrawal amount is ₹100</li>
              <li>• You can make only one withdrawal request per month</li>
              <li>• Ensure your bank details are accurate to avoid delays</li>
            </ul>
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
          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Submit Request
            </>
          )}
        </button>
      </div>

    </form>
  );
};

export default WithDrawRequestForm;