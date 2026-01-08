import { SERVICE } from "@/constants/services";
import { useGetCall } from "@/hooks";
import Lib from "@/utils/Lib";
import Loader from "./ui/Loader";
import { ArrowDown, Clock, CreditCard, Wallet, WalletCards } from "lucide-react";

const UserFinanceWidget = () => {
  const { data: profileInfo, loading } = useGetCall(SERVICE.GET_PROFILE);
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Cash Wallet</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{" "}
              {Lib.formatAmount(Math.abs(
                (profileInfo?.data?.quiz_total_withdraw || 0) -
                  (profileInfo?.data?.quiz_total_earning || 0)
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Scratch Wallet</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{" "}
              {Lib.formatAmount(Math.abs(
                (profileInfo?.data?.scratch_total_withdraw || 0) -
                  (profileInfo?.data?.scratch_total_earning || 0)
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
            <WalletCards className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Grow Wallet</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{" "}
              {Lib.formatAmount(Math.abs(
                profileInfo?.data?.saving_total_withdraw -
                  profileInfo?.data?.saving_total_earning
              )) || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFinanceWidget;
