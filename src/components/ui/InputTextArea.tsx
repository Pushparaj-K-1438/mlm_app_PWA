const InputTextArea = ({
  type = "text",
  label = "",
  placeholder = "placeholder",
  onChange = () => {},
  name = "name",
  error = {},
  value = {},
  readOnly = false,
  row = 3,
}: any) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        id={name}
        rows={row}
        name={name}
        value={value[name]}
        placeholder={placeholder}
        onChange={onChange}
        readOnly={readOnly}
        disabled={readOnly}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <p className="text-sm text-red-800 pt-1" role="alert">
        {error[name]}
      </p>
    </div>
  );
};

export default InputTextArea;
