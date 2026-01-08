import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import InputText from "./InputText";

interface PasswordInputProps {
  name: string;
  label: string;
  placeholder?: string;
  value: any;
  onChange: (e: React.ChangeEvent<any>) => void;
  error?: any;
  [key: string]: any;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  label,
  placeholder = "Enter password",
  value,
  onChange,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <InputText
        name={name}
        label={label}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        onChange={onChange}
        error={error}
        value={value}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
