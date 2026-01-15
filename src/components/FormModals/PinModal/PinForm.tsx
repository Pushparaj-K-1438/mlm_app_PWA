import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo } from "react";
import InputText from "@/components/ui/InputText";
import Btn from "@/components/ui/Btn";
import { OPTIONS } from "@/constants/others";
import SelectInput from "@/components/ui/SelectInput";
import { Info, Crown, AlertCircle } from "lucide-react";

export const VALIDATION_SCHEMA = Yup.object().shape({
  level: Yup.string().required("Required Upgrade Level*"),
});

const PinForm = ({
  data = {},
  onAction = (values: any) => {},
  onCloseModal = () => {},
  loading = false,
  RequestError = {},
}: any) => {
  const { values, handleChange, errors, handleSubmit, setErrors } = useFormik({
    initialValues: {
      current_level: data?.current_level ?? "",
      level: "",
    },
    onSubmit: async (values: any) => {
      onAction(values);
    },

    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: VALIDATION_SCHEMA,
  });
  const currentLevel = data?.current_level;

  const getLevelName = (level: string | number) => {
    const levelMap: { [key: string]: string } = {
      "": "Trainee",
      "0": "Promoter",
      "1": "Promoter Level 1",
      "2": "Promoter Level 2",
      "3": "Promoter Level 3",
      "4": "Promoter Level 4",
    };
    return levelMap[level.toString()] || `Level ${level}`;
  };

  const displayCurrentLevel = getLevelName(currentLevel);

  const availableOptions = useMemo(() => {
    const currentLevelStr = currentLevel.toString();

    if (!currentLevelStr || currentLevelStr === "") {
      return OPTIONS.PROMOTER_LEVEL.filter((option) => option.value === "0");
    }

    if (currentLevelStr === "0") {
      return OPTIONS.PROMOTER_LEVEL.filter((option) => option.value === "1");
    }

    if (currentLevelStr === "1") {
      return OPTIONS.PROMOTER_LEVEL.filter((option) =>
        ["2", "3", "4"].includes(option.value)
      );
    }

    if (currentLevelStr === "2") {
      return OPTIONS.PROMOTER_LEVEL.filter((option) =>
        ["3", "4"].includes(option.value)
      );
    }

    if (currentLevelStr === "3") {
      return OPTIONS.PROMOTER_LEVEL.filter((option) => option.value === "4");
    }

    if (currentLevelStr === "4") {
      return [];
    }

    return [];
  }, [currentLevel]);

  const isMaxLevel = currentLevel.toString() === "4";

  useMemo(() => {
    if (RequestError && Object.keys(RequestError).length) {
      setErrors(RequestError);
    }
  }, [RequestError, setErrors]);

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Current Level Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4">
            <Crown className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-600 font-medium">Current Level</p>
            <p className="text-xl font-bold text-blue-900">{displayCurrentLevel}</p>
          </div>
        </div>
      </div>

      {/* Upgrade Level Select */}
      <div>
        <SelectInput
          name="level"
          label="Upgrade to Level *"
          placeholder={
            isMaxLevel ? "Maximum level reached" : "Select Upgrade Level"
          }
          options={availableOptions}
          onChange={handleChange}
          error={errors}
          value={values}
          disabled={isMaxLevel}
        />
        {isMaxLevel && (
          <div className="mt-2 flex items-center text-amber-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            You have reached the maximum level
          </div>
        )}
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-amber-900 mb-2">Important Notes:</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Pin requests are reviewed by admin</li>
              <li>• Approval may take 1-3 business days</li>
              <li>• You'll be notified when your pin is ready</li>
              <li>• Activation requires additional information</li>
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
          disabled={loading || isMaxLevel}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            "Submit Request"
          )}
        </button>
      </div>
    </form>
  );
};

export default PinForm;