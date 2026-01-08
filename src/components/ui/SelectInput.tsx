const SelectInput = ({
  label = "Select Option",
  placeholder = "Choose...",
  options = [],
  onChange = () => {},
  name = "selectName",
  error = {},
  value = {},
  readOnly = false,
}: any) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <select
          id={name}
          name={name}
          value={value[name] || ""}
          onChange={onChange}
          disabled={readOnly}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="">{placeholder}</option>
          {options.map((opt: any, idx: number) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <p className="text-sm text-red-800 pt-1" role="alert">
          {error[name]}
        </p>
      </div>
    </div>
  );
};

export default SelectInput;
