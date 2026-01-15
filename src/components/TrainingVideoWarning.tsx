import { SERVICE } from "@/constants/services";
import { useGetCall } from "@/hooks";
import Loader from "./ui/Loader";
import { Link } from "react-router-dom";
import { AlertTriangle, Play, Clock, BookOpen, ArrowRight, Award } from "lucide-react";

const TrainingVideoWarning = ({ children }) => {
  const { data, loading } = useGetCall(SERVICE.GET_PROFILE);

  if (loading) {
    return <Loader />;
  }

  if (data?.data?.training_status === 2) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 safe-area-inset-bottom pb-20 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Warning Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header with Icon */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-center">Training Required</h3>
            <p className="text-center text-blue-100 mt-2">
              Complete the training program to unlock all features
            </p>
          </div>

          {/* Instructions */}
          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Complete Training</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    You must complete the training Programme to get access to other features
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Learn Important Skills</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    The video contains important updates and information for your training activities
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Unlock Features</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Once completed, you'll have full access to promotion videos, My Pins, Earnings History, Withdraw History, and other features
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action Button */}
            <Link
              to="/portal/user/training-program"
              className="w-full flex items-center justify-center px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Training Program
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            This is a required 7-day training program to get started
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainingVideoWarning;