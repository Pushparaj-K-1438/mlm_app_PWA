const InputText = ({
  type = "text",
  label = "",
  placeholder = "placeholder",
  onChange = () => {},
  name = "name",
  error = {},
  value = {},
  readOnly = false,
  minDate,
  disabled,
}: any) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value[name] ?? ""}
        placeholder={placeholder}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled || readOnly}
        min={minDate}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <p className="text-sm text-red-800 pt-1" role="alert">
        {error[name]}
      </p>
    </div>
  );
};

export default InputText;
