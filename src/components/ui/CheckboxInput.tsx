import { CheckSquare } from "lucide-react";

const CheckboxInput = ({
  label = "Active Status",
  name = "is_active",
  onChange = () => {},
  error = {},
  value = {},
  readOnly = false,
}: any) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-1">
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={!!value[name]}
            onChange={(e) =>
              onChange({
                target: {
                  name,
                  value: e.target.checked ? 1 : 0,
                },
              })
            }
            disabled={readOnly}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span>{label}</span>
        </label>
        <p className="text-sm text-red-800 pt-1" role="alert">
          {error[name]}
        </p>
      </div>
    </div>
  );
};

export default CheckboxInput;
