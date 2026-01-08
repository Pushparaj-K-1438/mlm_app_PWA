import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo } from "react";
import InputText from "@/components/ui/InputText";
import Btn from "@/components/ui/Btn";
import { OPTIONS } from "@/constants/others";
import SelectInput from "@/components/ui/SelectInput";

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
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InputText
        name="current_level"
        label="Current Level *"
        placeholder="Trainee"
        onChange={handleChange}
        error={errors}
        value={{ current_level: displayCurrentLevel }}
        disabled
        readOnly
      />
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Pin requests are reviewed by admin</li>
          <li>• Approval may take 1-3 business days</li>
          <li>• You'll be notified when your pin is ready</li>
          <li>• Activation requires additional information</li>
        </ul>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Btn title="Cancel" onClick={onCloseModal} uiType="secondary" />
        <Btn
          title={"Submit Request"}
          isLoading={loading}
          onClick={handleSubmit}
          isDisable={isMaxLevel}
        />
      </div>
    </form>
  );
};

export default PinForm;
