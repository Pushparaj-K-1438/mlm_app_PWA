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
  Search,
  Filter,
} from "lucide-react";
import { SERVICE } from "@/constants/services";
import { useGetCall, useQueryParams } from "@/hooks";
import DataTable from "@/components/DataTable";
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

function EarningsHistoryPage() {
  const Columns: any = [
    {
      title: "Title & Description",
      key: "earning_type",
      render: (index: any, row: any) => {
        let message = "";

        switch (row.earning_type) {
          case 1:
            message = "Session 1 - Set 1 Video Earning";
            break;
          case 2:
            message = "Session 1 - Set 2 Video Earning";
            break;
          case 3:
            message = "Session 2 - Set 1 Video Earning";
            break;
          case 4:
            message = "Session 2 - Set 2 Video Earning";
            break;
          case 5:
            message = "Scratch Card Earning";
            break;
          case 6:
            message = "Savings Earning";
            break;
          default:
            message = "Unknown Earning Type";
        }
        return <div className="text-sm text-gray-900">{message}</div>;
      },
    },

    {
      title: "Date",
      key: "earning_date",
      dataIndex: "earning_date",
      sortable: true,
      render: (index: any, row: any) => (
        <div className="flex items-center text-sm text-gray-900">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          {UIHelpers.DateFormat(row.earning_date)}
        </div>
      ),
    },
    {
      title: "Wallet",
      key: "earning_type",
      render: (index: any, row: any) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getWalletColor(
            row.earning_type
          )} bg-opacity-10`}
        >
          {row.earning_type == 6
            ? "Grow"
            : row.earning_type == 5
            ? "Scratch"
            : "Cash"}
        </span>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      render: (index: any, row: any) => (
        <div className="flex items-center justify-start space-x-2">
          {formatAmount(row.amount, row.wallet)}
        </div>
      ),
    },
  ];
  const { defaultFilter } = useQueryParams();
  const [filter, setFilter] = useState(defaultFilter);

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

  useEffect(() => {
    EarningsHistoryAPI();
  }, [filter]);

  const formatAmount = (amount, wallet) => {
    const sign = amount >= 0 ? "+" : "";
    return `${sign}₹${Lib.formatAmount(Math.abs(amount))}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
        <h1 className="text-xl font-bold text-gray-900">Earnings History</h1>
        <p className="text-sm text-gray-600 mt-1">Track all your earnings and transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="px-6 mt-6">
        <UserFinanceWidget />
      </div>

      {/* Filter Section */}
      <div className="px-6 mt-6">
        <FilterTab
          filter={filter}
          setFilter={setFilter}
          TABLE_FILTER={["SEARCH"]}
        />
      </div>

      {/* Data Table */}
      <div className="px-6 mt-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable
            columns={Columns}
            data={earningsHistory?.data || []}
            loading={earningsHistoryLoading}
            filter={filter}
            setFilter={setFilter}
            totalRecords={earningsHistory?.pageInfo?.total_records ?? 0}
            searchPlaceholder="Search earnings..."
            showSearch={true}
            showPagination={true}
          />
        </div>
      </div>
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