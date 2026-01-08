import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Wallet,
  TrendingUp,
  Calendar,
  Download,
  DollarSign,
  Gift,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Icon,
  Filter,
  Search,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import { SERVICE } from "@/constants/services";
import { useGetCall, useQueryParams } from "@/hooks";
import UIHelpers from "@/utils/UIhelper";
import FilterTab from "@/components/FilterTab";
import UserFinanceWidget from "@/components/UserFinanceWidget";
import DailyVideoWarning from "@/components/DailyVideoWarning";
import TrainingVideoWarning from "@/components/TrainingVideoWarning";
import Lib from "@/utils/Lib";

const getWalletColor = (wallet) => {
  if (wallet < 5) {
    return "text-green-600 bg-green-100";
  } else if (wallet === 5) {
    return "text-purple-600 bg-purple-100";
  } else if (wallet === 6) {
    return "text-orange-600 bg-orange-100";
  }
  return "text-gray-600 bg-gray-100";
};

const getWalletIcon = (wallet) => {
  if (wallet < 5) {
    return <DollarSign className="w-4 h-4" />;
  } else if (wallet === 5) {
    return <Gift className="w-4 h-4" />;
  } else if (wallet === 6) {
    return <TrendingUp className="w-4 h-4" />;
  }
  return <Wallet className="w-4 h-4" />;
};

function EarningsHistoryPage() {
  const { defaultFilter } = useQueryParams();
  const [filter, setFilter] = useState(defaultFilter);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const {
    data: earningsHistory,
    loading: earningsHistoryLoading,
    setQuery,
  } = useGetCall(SERVICE.EARNINGS_HISTORY, {
    avoidFetch: true,
  });

  const EarningsHistoryAPI = () => {
    setQuery(filter);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    EarningsHistoryAPI();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useEffect(() => {
    EarningsHistoryAPI();
  }, [filter]);

  const formatAmount = (amount, wallet) => {
    const sign = amount >= 0 ? "+" : "";
    return `${sign}₹${Lib.formatAmount(Math.abs(amount))}`;
  };

  return (
    <div className="w-full pb-24 px-4 bg-gray-50 min-h-screen">
      {/* Header Section - Native App Style */}
      <div className="py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Earnings History
          </h1>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-full ${isRefreshing ? 'bg-blue-100' : 'bg-white'} shadow-sm active:scale-95 transition-transform`}
          >
            <RefreshCw className={`w-5 h-5 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className="text-gray-600">
          Track all your earnings, bonuses, and transactions
        </p>
      </div>

      {/* Summary Cards */}
      <UserFinanceWidget />

      {/* Filter Section - Native App Style */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Filter className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center text-sm font-medium text-blue-600 active:scale-95 transition-transform ${showFilter ? 'rotate-180' : ''}`}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {showFilter && (
          <div className="pt-2 border-t border-gray-100">
            <FilterTab
              filter={filter}
              setFilter={setFilter}
              TABLE_FILTER={["SEARCH"]}
            />
          </div>
        )}
      </div>

      {/* Mobile Card List View - Native App Style */}
      <div className="space-y-4">
        {earningsHistoryLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : earningsHistory?.data?.length > 0 ? (
          earningsHistory.data.map((row: any, index: number) => (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.99] transition-transform"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full ${getWalletColor(row.earning_type)}`}>
                      {getWalletIcon(row.earning_type)}
                      <span className="ml-1">
                        {row.earning_type == 6
                          ? "Grow"
                          : row.earning_type == 5
                            ? "Scratch"
                            : "Cash"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {UIHelpers.DateFormat(row.earning_date)}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 leading-tight">
                    {(() => {
                      switch (row.earning_type) {
                        case 1: return "Session 1 - Set 1 Video Earning";
                        case 2: return "Session 1 - Set 2 Video Earning";
                        case 3: return "Session 2 - Set 1 Video Earning";
                        case 4: return "Session 2 - Set 2 Video Earning";
                        case 5: return "Scratch Card Earning";
                        case 6: return "Savings Earning";
                        default: return "Unknown Earning Type";
                      }
                    })()}
                  </h3>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold flex items-center ${row.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {row.amount >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {formatAmount(row.amount, row.wallet)}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Transaction ID: {row.id}
                </div>
                <button className="text-xs text-blue-600 font-medium active:scale-95 transition-transform">
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <div className="mx-auto h-16 w-16 text-gray-300 flex items-center justify-center rounded-full bg-gray-50 mb-4">
              <DollarSign className="h-8 w-8" />
            </div>
            <h3 className="mt-2 text-base font-medium text-gray-900">No earnings found</h3>
            <p className="mt-2 text-sm text-gray-500">Your earnings history will appear here.</p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium active:scale-95 transition-transform">
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Simple Pagination Controls if needed, assuming API handles page/limit via filter */}
      {earningsHistory?.pageInfo?.total_records > earningsHistory?.data?.length && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-white rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-700 active:scale-95 transition-transform"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default function EarningsHistory() {
  return (
    <DailyVideoWarning>
      <TrainingVideoWarning>
        <EarningsHistoryPage />
      </TrainingVideoWarning>
    </DailyVideoWarning>
  );
}