import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo } from "react";
import InputText from "@/components/ui/InputText";
import Btn from "@/components/ui/Btn";
import { OPTIONS } from "@/constants/others";
import SelectInput from "@/components/ui/SelectInput";
import InputTextArea from "@/components/ui/InputTextArea";
import { Key, Phone, Package, Calendar, MapPin, Info, AlertCircle } from "lucide-react";

export const VALIDATION_SCHEMA = Yup.object().shape({
  pin: Yup.string().required("Required Pin*"),
  gift_delivery_type: Yup.string().required("Required Gift Delivery Type*"),
  wh_number: Yup.string().required("Required Mobile Number*"),
  direct_pick_date: Yup.string().when("gift_delivery_type", {
    is: "1",
    then: (schema) => schema.required("Required Direct Pick Date*"),
    otherwise: (schema) => schema.optional(),
  }),
  gift_delivery_address: Yup.string().when("gift_delivery_type", {
    is: "2",
    then: (schema) => schema.required("Required Gift Delivery Address*"),
    otherwise: (schema) => schema.optional(),
  }),
});

// Box allocation rules mirror the backend (PromoterBoxRequest::LEVEL_RULES):
// levels 0/1/2 get a fixed default automatically; levels 3/4 pick a quantity.
const BOX_DEFAULT_BY_LEVEL: Record<number, number> = { 0: 1, 1: 1, 2: 10 };
const BOX_OPTIONS_BY_LEVEL: Record<number, number[]> = { 3: [10, 20], 4: [10, 20, 30] };

// Plan product naming: the base Promoter (level 0) gets "Energy Plus";
// every other level gets "Health Plus". No "box" wording is shown to users.
const productName = (lvl: number) => (Number(lvl) === 0 ? "Energy Plus" : "Health Plus");

const ActivatePinForm = ({
  data = {},
  onAction = (values: any) => {},
  onCloseModal = () => {},
  loading = false,
  RequestError = {},
}: any) => {
  const level = Number(data?.level);
  const boxChoices = BOX_OPTIONS_BY_LEVEL[level] ?? [];
  const isManualBox = boxChoices.length > 0;
  const autoBoxQty = BOX_DEFAULT_BY_LEVEL[level];
  const boxCap = level === 4 ? 30 : level === 3 ? 20 : undefined;

  // L3/L4 must pick a box quantity at activation; lower levels are auto.
  const validationSchema = useMemo(
    () =>
      isManualBox
        ? VALIDATION_SCHEMA.shape({
            box_quantity: Yup.string().required("Please select number of boxes*"),
          })
        : VALIDATION_SCHEMA,
    [isManualBox]
  );

  const { values, handleChange, errors, handleSubmit, setErrors } = useFormik({
    initialValues: {
      id: data?.id ?? "",
      pin: data?.pin ?? "",
      gift_delivery_type: data?.gift_delivery_type ?? "",
      gift_delivery_address: data?.gift_delivery_address ?? "",
      wh_number: data?.user?.mobile ?? "",
      box_quantity: "",
    },
    onSubmit: async (values: any) => {
      onAction(values);
    },

    validateOnChange: false,
    validateOnBlur: true,
    validationSchema,
  });
  useMemo(() => {
    if (RequestError && Object.keys(RequestError).length) {
      setErrors(RequestError);
    }
  }, [RequestError]);

  const minSelectableDate = useMemo(() => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 25); // 25 days from today
    return minDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  }, []);

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Pin Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4">
            <Key className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-green-600 font-medium">Pin Number</p>
            <p className="text-xl font-bold text-green-900">{values.pin}</p>
          </div>
        </div>
      </div>

      {/* Mobile Number */}
      <div>
        <div className="flex items-center mb-2">
          <Phone className="w-5 h-5 text-gray-500 mr-2" />
          <label className="text-sm font-medium text-gray-700">Mobile Number *</label>
        </div>
        <InputText
          name="wh_number"
          placeholder="Enter Mobile Number"
          onChange={handleChange}
          error={errors}
          value={values}
        />
      </div>

      {/* Delivery Type */}
      <div>
        <div className="flex items-center mb-2">
          <Package className="w-5 h-5 text-gray-500 mr-2" />
          <label className="text-sm font-medium text-gray-700">Product Delivery Type *</label>
        </div>
        <SelectInput
          name="gift_delivery_type"
          placeholder="Select Product Delivery Type"
          options={OPTIONS.GIFT_DELIVERY_LEVEL}
          onChange={handleChange}
          error={errors}
          value={values}
        />
      </div>

      {/* Conditional Fields */}
      {values.gift_delivery_type === "2" && (
        <div>
          <div className="flex items-center mb-2">
            <MapPin className="w-5 h-5 text-gray-500 mr-2" />
            <label className="text-sm font-medium text-gray-700">Product Delivery Address *</label>
          </div>
          <InputTextArea
            name="gift_delivery_address"
            placeholder="Enter Product Delivery Address"
            onChange={handleChange}
            error={errors}
            value={values}
          />
        </div>
      )}

      {values.gift_delivery_type === "1" && (
        <div>
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 text-gray-500 mr-2" />
            <label className="text-sm font-medium text-gray-700">Direct Pick Date *</label>
          </div>
          <InputText
            name="direct_pick_date"
            type="date"
            placeholder="Direct Pick Date"
            onChange={handleChange}
            error={errors}
            value={values}
            minDate={minSelectableDate}
          />
          <div className="mt-2 flex items-center text-amber-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            Please select a date at least 25 days from today
          </div>
        </div>
      )}

      {/* Plan product allocation */}
      {isManualBox ? (
        <div>
          <div className="flex items-center mb-2">
            <Package className="w-5 h-5 text-gray-500 mr-2" />
            <label className="text-sm font-medium text-gray-700">
              Number of {productName(level)} *
            </label>
          </div>
          <SelectInput
            name="box_quantity"
            placeholder={`Select number of ${productName(level)}`}
            options={boxChoices.map((n) => ({
              value: String(n),
              label: `${n} ${productName(level)}`,
            }))}
            onChange={handleChange}
            error={errors}
            value={values}
          />
          {boxCap ? (
            <p className="mt-1 text-xs text-gray-500">
              You can request more later, up to {boxCap} {productName(level)} total
              for your level.
            </p>
          ) : null}
        </div>
      ) : (
        autoBoxQty != null && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center text-sm text-blue-800">
            <Package className="w-4 h-4 mr-2 flex-shrink-0" />
            You will receive {autoBoxQty} {productName(level)} with this activation.
          </div>
        )
      )}

      {/* Important Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-amber-900 mb-2">Important Notes:</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Once activated, the pin cannot be deactivated</li>
              <li>• Delivery will be processed within 7-10 business days</li>
              <li>• You will receive a confirmation message with tracking details</li>
              <li>• For any issues, please contact support</li>
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
              Activating...
            </div>
          ) : (
            "Activate Pin"
          )}
        </button>
      </div>
    </form>
  );
};

export default ActivatePinForm;