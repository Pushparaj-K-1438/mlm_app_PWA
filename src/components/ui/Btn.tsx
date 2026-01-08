import { cx } from "class-variance-authority";

const classes = {
  primary:
    "px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-yellow-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
  secondary:
    "px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
};

type ButtonProps = {
  isDisable?: boolean;
  type?: "button" | "submit" | "reset";
  uiType?: "primary" | "secondary";
  title?: string;
  onClick?: () => void;
  isLoading?: boolean;
  className?: string;
};

const Btn: React.FC<ButtonProps> = ({
  isDisable = false,
  uiType = "primary",
  title = "label",
  type = "button",
  onClick = () => {},
  isLoading = false,
  className = "",
}) => {
  return (
    <>
      <button
        disabled={isDisable || isLoading}
        type={type}
        className={cx(classes[uiType], className)}
        onClick={onClick}
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            processing...
          </div>
        ) : (
          title
        )}
      </button>
    </>
  );
};

export default Btn;
