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
  Filter,
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
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Withdrawal Requests
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your withdrawal requests and track payment status
            </p>
          </div>
          <button
            onClick={() =>
              updateSearchParam({
                options: { Modal: MODAL_OPEN.WITHDRAW_REQUEST },
              })
            }
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Withdrawal
          </button>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="px-6 mt-6">
        <UserFinanceWidget />
      </div>

      {/* Withdrawal Guidelines */}
      <div className="px-6 mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Withdrawal Guidelines
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <div className="font-medium text-blue-900">Minimum withdrawal amount</div>
                <div className="text-sm text-blue-700">₹100</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <div className="font-medium text-blue-900">Withdrawal frequency</div>
                <div className="text-sm text-blue-700">Once every 30 days</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <div className="font-medium text-blue-900">Account accuracy</div>
                <div className="text-sm text-blue-700">Ensure account details are accurate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="px-6 mt-6">
        <FilterTab
          filter={filter}
          setFilter={setFilter}
          TABLE_FILTER={["SEARCH"]}
        />
      </div>

      {/* Withdrawals Table */}
      <div className="px-6 mt-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable
            columns={Columns}
            data={withDrawHistoryInfo?.data || []}
            loading={widthDrawHistoryLoading}
            filter={filter}
            setFilter={setFilter}
            totalRecords={withDrawHistoryInfo?.pageInfo?.total_records ?? 0}
            searchPlaceholder="Search withdrawals..."
            showSearch={true}
            showPagination={true}
            showMobileView={true}
          />
        </div>
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