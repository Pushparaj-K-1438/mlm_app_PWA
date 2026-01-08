import React, { useEffect, useState } from "react";
import loader_loop_gif from "@/assets/loader_loop.gif";
import { RefreshCw } from "lucide-react"; // Using Heroicons for the refresh icon

interface LoaderProps {
  height?: number | string;
  width?: number | string;
}

const Loader: React.FC<LoaderProps> = ({ height = 100, width = 100 }) => {
  return (
    <>
     <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-emerald-400 animate-spin shadow-[0_0_12px_#a78bfa]"></div>
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-indigo-600 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_#6366f1]"></div>
      </div>
    </div>

    </>
  );
};

export default Loader;
