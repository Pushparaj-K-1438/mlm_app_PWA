const InputText = ({
  type = "text",
  label = "",
  placeholder = "placeholder",
  onChange = () => { },
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
        className="w-full h-12 px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
      />
      <p className="text-sm text-red-800 pt-1" role="alert">
        {error[name]}
      </p>
    </div>
  );
};

export default InputText;
