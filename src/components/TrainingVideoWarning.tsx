import { SERVICE } from "@/constants/services";
import { useGetCall } from "@/hooks";
import Loader from "./ui/Loader";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const TrainingVideoWarning = ({ children }) => {
  const { data, loading } = useGetCall(SERVICE.GET_PROFILE);
  if (loading) {
    return <Loader />;
  }

  if (data?.data?.training_status === 2) {
    return <>{children}</>;
  }
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex h-screen items-center justify-center">
      <div className="bg-blue-50 border border-blue-200 rounded-xl py-6 px-12 h-fit">
        <h3 className="text-lg font-medium text-blue-900 mb-3 flex">
          <AlertTriangle className="mr-3" /> Important Instructions
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            You must complete the training Programme to get access to other features
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            The video contains important updates and information for your training
            activities
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Once completed, you'll have full access to promotion videos, My Pins,
            Earnings History, Withdraw History, and other features
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Click here to watch the video:
            <Link
              to={"/portal/user/training-program"}
              rel="noopener noreferrer"
              className="ml-1 text-blue-600 hover:text-blue-800 underline"
            >
              Training Programme
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TrainingVideoWarning;
