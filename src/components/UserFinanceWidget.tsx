import { SERVICE } from "@/constants/services";
import { useGetCall } from "@/hooks";
import Lib from "@/utils/Lib";
import Loader from "./ui/Loader";
import { Wallet, CreditCard, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

const UserFinanceWidget = () => {
  const { data: profileInfo, loading } = useGetCall(SERVICE.GET_PROFILE);
  
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const cashWallet = (profileInfo?.data?.quiz_total_withdraw || 0) - (profileInfo?.data?.quiz_total_earning || 0);
  const scratchWallet = (profileInfo?.data?.scratch_total_withdraw || 0) - (profileInfo?.data?.scratch_total_earning || 0);
  const growWallet = (profileInfo?.data?.saving_total_withdraw || 0) - (profileInfo?.data?.saving_total_earning || 0);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5 text-green-600" />
          </div>
        
        </div>
        <p className="text-xs text-gray-500">Cash Wallet</p>
        <p className="text-xl font-bold text-gray-900">
          ₹{Lib.formatAmount(Math.abs(cashWallet))}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-purple-600" />
          </div>
         
        </div>
        <p className="text-xs text-gray-500">Scratch Wallet</p>
        <p className="text-xl font-bold text-gray-900">
          ₹{Lib.formatAmount(Math.abs(scratchWallet))}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
        
        </div>
        <p className="text-xs text-gray-500">Grow Wallet</p>
        <p className="text-xl font-bold text-gray-900">
          ₹{Lib.formatAmount(Math.abs(growWallet))}
        </p>
      </div>
    </div>
  );
};

export default UserFinanceWidget;