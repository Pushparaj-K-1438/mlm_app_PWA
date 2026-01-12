import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Wallet,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Building,
  Smartphone,
  ArrowDownRight,
  Calendar,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import UIHelpers from "@/utils/UIhelper";
import { MODAL_OPEN, WIDTHDROW_STATUS } from "@/constants/others";
import { useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";
import UserFinanceWidget from "@/components/UserFinanceWidget";
import DataTable from "@/components/DataTable";
import WithDrawRequestModal from "@/components/FormModals/WithDrawRequestModal/WithDrawRequestModal";
import Lib from "@/utils/Lib";
import FilterTab from "@/components/FilterTab";
import { Dialog } from "@/components/ui/dialog";
import DailyVideoWarning from "@/components/DailyVideoWarning";
import TrainingVideoWarning from "@/components/TrainingVideoWarning";

const getStatusBadge = (status) => {
  const badges = {
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
      text: "Pending",
    },
    processing: {
      color: "bg-blue-100 text-blue-800",
      icon: Clock,
      text: "Processing",
    },
    completed: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
      text: "Completed",
    },
    rejected: {
      color: "bg-red-100 text-red-800",
      icon: XCircle,
      text: "Rejected",
    },
  };
  const badge = badges[status] || badges.pending;
  const Icon = badge.icon;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${badge.color}`}
    >
      <Icon className="w-4 h-4 mr-1" />
      {badge.text}
    </span>
  );
};

const formatAmount = (amount) => {
  const sign = amount >= 0 ? "+" : "";
  return `${sign}₹${Lib.formatAmount(Math.abs(amount))}`;
};
function WithdrawRequestsPage() {
  const Columns: any = [
    {
      title: "Request Details",
      render: (index: any, row: any) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5 text-green-600" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              Withdrawal Request
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Method & Account",
      render: (index: any, row: any) => (
        <div className="flex items-center">
          {row?.bank_detail?.id && (
            <>
              <Building className="w-4 h-4 text-gray-400 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-900 capitalize">
                  {row?.bank_detail?.bank_name} -
                </div>
                <div className="text-sm text-gray-500">
                  {Lib.maskLast4Digits(row?.bank_detail?.acc_no)}
                </div>
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      title: "Date",
      key: "request_at",
      dataIndex: "request_at",
      sortable: true,
      render: (index: any, row: any) => (
        <div>
          <div className="flex items-center text-sm text-gray-900">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {UIHelpers.DateFormat(row.request_at)}
          </div>
          {["completed", "rejected"].includes(WIDTHDROW_STATUS[row.status]) && (
            <div className="text-xs text-gray-500">
              {WIDTHDROW_STATUS[row.status]}:{" "}
              {UIHelpers.DateFormat(row.updated_at)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      render: (index: any, row: any) => (
        <>
          {" "}
          {getStatusBadge(WIDTHDROW_STATUS[row.status])}
          {row.status === 3 && (
            <p className="text-sm text-gray-500 mt-2 flex item-center gap-1">
              <MessageCircle size={16} />
              {row.reason}
            </p>
          )}
        </>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      render: (index: any, row: any) => (
        <div className="flex items-center justify-start space-x-2">
          {formatAmount(row.amount)}
        </div>
      ),
    },
  ];

  const { defaultFilter, updateSearchParam, searchParams } = useQueryParams();
  const Modal = searchParams.get("Modal") || undefined;
  const [filter, setFilter] = useState(defaultFilter);

  const {
    data: withDrawHistoryInfo,
    loading: widthDrawHistoryLoading,
    setQuery,
  } = useGetCall(SERVICE.WITHDRAW_HISTRY, {
    avoidFetch: true,
  });

  const withdrawHistoryAPI = () => {
    setQuery(filter);
  };

  useEffect(() => {
    withdrawHistoryAPI();
  }, [filter]);

  if (widthDrawHistoryLoading) {
    return <Loader />;
  }
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Withdrawal Requests
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your withdrawal requests and track payment status
            </p>
          </div>
          <button
            onClick={() =>
              updateSearchParam({
                options: { Modal: MODAL_OPEN.WITHDRAW_REQUEST },
              })
            }
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Withdrawal
          </button>
        </div>
      </div>

      {/* Balance Overview */}
      <UserFinanceWidget />

      {/* Withdrawal Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Withdrawal Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Minimum withdrawal amount: ₹100
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              30 days once withdrawal
            </li>
          </ul>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Ensure account details are accurate
            </li>
          </ul>
        </div>
      </div>

      <FilterTab
        filter={filter}
        setFilter={setFilter}
        TABLE_FILTER={["SEARCH"]}
      />

      {/* Withdrawals Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <DataTable
          columns={Columns}
          data={withDrawHistoryInfo?.data || []}
          loading={widthDrawHistoryLoading}
          filter={filter}
          setFilter={setFilter}
          totalRecords={withDrawHistoryInfo?.pageInfo?.total_records ?? 0}
          searchPlaceholder="Search training videos..."
          showSearch={true}
          showPagination={true}
        />
      </div>

      {Modal == MODAL_OPEN.WITHDRAW_REQUEST && (
        <WithDrawRequestModal recoilApi={withdrawHistoryAPI} />
      )}
    </div>
  );
}

export default function WithdrawRequests() {
  return (
    <DailyVideoWarning>
      <TrainingVideoWarning>
        <WithdrawRequestsPage />
      </TrainingVideoWarning>
    </DailyVideoWarning>
  );
}
