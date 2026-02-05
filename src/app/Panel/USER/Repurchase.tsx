//@ts-nocheck
import React from "react";
import { Package, Clock } from "lucide-react";
import DailyVideoWarning from "@/components/DailyVideoWarning";
import TrainingVideoWarning from "@/components/TrainingVideoWarning";

const RepurchasePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 safe-area-inset-bottom pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 safe-area-inset-top">
        <h1 className="text-xl font-bold text-gray-900">Continuity Purchase</h1>
        <p className="text-sm text-gray-600 mt-1">Exciting features coming soon!</p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 py-12 min-h-[calc(100vh-140px)]">
        {/* Coming Soon Image */}
        <div className="relative mb-8">
          <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
            <div className="text-center">
              <Package className="w-24 h-24 text-white mx-auto mb-4" />
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 rounded-full px-4 py-2 font-bold text-sm shadow-lg animate-bounce">
                Soon
              </div>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-purple-300 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-blue-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Coming Soon Text */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Coming Soon!
          </h2>
         
        </div>

        

        {/* Notification */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg w-full max-w-md">
          <div className="flex items-center justify-center">
            <Clock className="w-6 h-6 text-white mr-3" />
            <p className="text-white font-medium">We'll notify you when it's ready!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Repurchase() {
  return (
    <DailyVideoWarning>
      <TrainingVideoWarning>
        <RepurchasePage />
      </TrainingVideoWarning>
    </DailyVideoWarning>
  );
}
