import React, { useEffect, useState } from "react";
import { AlertTriangle, Info } from "lucide-react";

export default function Error500({
  title = "Something Went Wrong",
  description,
  colorCode,
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div
        className={`${
          colorCode == "red-700" ? "bg-red-50" : "bg-yellow-50"
        } border ${
          colorCode == "red-700" ? "border-red-200" : "border-yellow-200"
        }  rounded-lg p-8 max-w-xl text-center shadow-sm`}
      >
        <div className="flex justify-center mb-3">
          <Info className={`w-8 h-8 text-${colorCode}`} />
          {/* <AlertTriangle className="w-8 h-8 text-red-700" /> */}
        </div>
        <h3 className={`text-2xl font-semibold text-${colorCode} mb-2`}>
          {title}
        </h3>
        <p className={`text-${colorCode}`}>{description}</p>
      </div>
    </div>
  );
}
