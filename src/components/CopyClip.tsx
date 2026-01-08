import Swal from "sweetalert2";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CopyIcon } from "lucide-react";

const CopyClipBoard = ({ text }) => {
  const handleCopied = () => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Copied!",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  };
  return (
    <CopyToClipboard text={text} onCopy={handleCopied}>
      <span className="flex gap-1 cursor-pointer">
        {text} <CopyIcon size={16} />
      </span>
    </CopyToClipboard>
  );
};

export default CopyClipBoard;
