import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  User,
  Crown,
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useGetCall, useQueryParams } from "@/hooks";
import {
  MODAL_OPEN,
  PROMOTER_LEVEL,
  WIDTHDROW_STATUS,
} from "@/constants/others";
import { SERVICE } from "@/constants/services";
import DataTable from "@/components/DataTable";
import UIHelpers from "@/utils/UIhelper";
import Swal from "sweetalert2";
import FilterTab from "@/components/FilterTab";
import Lib from "@/utils/Lib";
import UserFormModal from "@/components/FormModals/UserModal/UserFormModal";

const getRoleBadgeColor = (role) => {
  const colors = {
    trainee: "bg-red-100 text-red-800",
    promotor: "bg-blue-100 text-blue-800",
    promotor1: "bg-green-100 text-green-800",
    promotor2: "bg-purple-100 text-purple-800",
    promotor3: "bg-yellow-100 text-yellow-800",
    promotor4: "bg-pink-100 text-pink-800",
  };
  return colors[role] || "bg-gray-100 text-gray-800";
};

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

const getStatusBadgeColor = (status) => {
  return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
};

const formatAmount = (withdraw: any, total: any) => {
  return Lib.formatAmount(Math.abs(withdraw - total) || 0);
};
export default function UserManagement() {
  const Columns: any = [
    {
      title: "User",
      key: "id",
      sortable: true,
      render: (index: any, row: any) => {
        return (
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {row.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {row.username}
              </div>
              <div className="text-sm text-gray-500"> {row.mobile}</div>
            </div>
          </div>
        );
      },
    },
      {
      title: "Referred By",
      key: "referral_by",
      sortable: true,
      render: (index: any, row: any) => {
        return (
          <div className="flex items-center">
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {row.referrer?.username}
              </div>
              <div className="text-sm text-gray-500"> {row.referrer?.mobile}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Join Date",
      key: "created_at",
      sortable: true,
      render: (index: any, row: any) => {
        return (
          <div className="flex items-center">
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {UIHelpers.DateFormat(row?.created_at)}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Title & Description",
      key: "title",
      render: (index: any, row: any) => (
        <div>
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
              PROMOTER_LEVEL[row?.current_promoter_level]
            )}`}
          >
            {PROMOTER_LEVEL[row?.current_promoter_level] ?? "Trainee"}
          </span>
          <div className="text-xs text-gray-500 mt-1 capitalize">
            {row?.language}
          </div>
        </div>
      ),
    },
    {
      title: "Earnings",
      render: (index: any, row: any) => {
        return (
          <div>
            <div className="text-sm text-gray-900">
              <div>
                Cash Wallet: ₹
                {formatAmount(
                  row?.quiz_total_withdraw,
                  row?.quiz_total_earning
                )}
              </div>
              <div>
                Scratch wallet: ₹
                {formatAmount(
                  row?.scratch_total_earning,
                  row?.scratch_total_withdraw
                )}
              </div>
              <div>
                Grow Wallet: ₹
                {formatAmount(
                  row?.saving_total_earning,
                  row?.saving_total_withdraw
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Training",
      render: (index: any, row: any) => (
        <div>{getStatusBadge(WIDTHDROW_STATUS[row.training_status])}</div>
      ),
    },
    {
      title: "Status",
      render: (index: any, row: any) => (
        <button
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${getStatusBadgeColor(
            row?.is_active
          )}`}
        >
          {row?.is_active ? "Active" : "InActive"}
        </button>
      ),
    },
    {
      title: "Action",
      key: "video_path",
      render: (index: any, row: any) => (
        <div className="flex items-center justify-start space-x-2">
          {/* <a
            href={
              row?.video_path
                ? Lib.CloudPath(row?.video_path)
                : row?.youtube_link || "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-900 p-1"
            title="View Video"
          >
            <Eye className="w-4 h-4" />
          </a> */}
          <button
            onClick={() =>
              updateSearchParam({
                options: {
                  Modal: MODAL_OPEN.USER_MODAL,
                  Edit: row.id,
                },
              })
            }
            className="text-indigo-600 hover:text-indigo-900 p-1"
            title="Edit Video"
          >
            <Edit className="w-4 h-4" />
          </button>
          {/* <button
            onClick={() => ConfirmDeleteModal(row.id)}
            className="text-red-600 hover:text-red-900 p-1"
            title="Delete Video"
          >
            <Trash2 className="w-4 h-4" />
          </button> */}
        </div>
      ),
    },
  ];

  const { defaultFilter, updateSearchParam, searchParams } = useQueryParams();
  const Modal = searchParams.get("Modal") || undefined;
  const [filter, setFilter] = useState(defaultFilter);

  const { loading, setQuery, data } = useGetCall(SERVICE.GET_ALL_REFERRALS, {
    avoidFetch: true,
  });

  // Fetch admin dashboard data for stats
  const { data: adminDashboardData, loading: adminDashboardLoading } =
    useGetCall(SERVICE.ADMIN_DASHBOARD);

  // const { loading: deleteLoading, Delete: DeleteTrainingVideo } = useActionCall(
  //   SERVICE.TRAININGVIDEOS
  // );

  const getUsers = () => {
    setQuery(filter);
  };

  useEffect(() => {
    getUsers();
  }, [filter]);

  // const ConfirmDeleteModal = async (value: string) => {
  //   const swalWithTailwind = Swal.mixin({
  //     customClass: {
  //       confirmButton:
  //         "bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md shadow-sm transition-all duration-200 ml-3",
  //       cancelButton:
  //         "bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-md shadow-sm transition-all duration-200",
  //       popup:
  //         "rounded-xl shadow-2xl border border-gray-200 bg-white p-6 dark:bg-gray-800 dark:border-gray-700",
  //       title: "text-lg font-semibold text-gray-800 dark:text-gray-100",
  //       htmlContainer: "text-gray-600 dark:text-gray-300",
  //     },
  //     buttonsStyling: false,
  //   });

  //   swalWithTailwind
  //     .fire({
  //       title: "Are you sure?",
  //       text: "You won't be able to revert this!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes, delete it!",
  //       cancelButtonText: "No, cancel!",
  //       reverseButtons: true,
  //       padding: "2em",
  //       backdrop: true,
  //     })
  //     .then(async (result) => {
  //       if (result.isConfirmed) {
  //         const resp = await DeleteTrainingVideo(value);
  //         if (resp) {
  //           TrainingVideoAPI();
  //           Swal.fire({
  //             icon: "success",
  //             title: "Deleted!",
  //             text: "Your record has been deleted successfully.",
  //             confirmButtonText: "OK",
  //             customClass: {
  //               confirmButton:
  //                 "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200",
  //             },
  //           });
  //         }
  //       }
  //     });
  // };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage all platform users and their permissions
            </p>
          </div>
          <button
            onClick={() =>
              updateSearchParam({
                options: { Modal: MODAL_OPEN.USER_MODAL },
              })
            }
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {adminDashboardLoading
                  ? "..."
                  : adminDashboardData?.data?.total_users || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {adminDashboardLoading
                  ? "..."
                  : adminDashboardData?.data?.total_active_users || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New This Day</p>
              <p className="text-2xl font-semibold text-gray-900">
                {adminDashboardLoading
                  ? "..."
                  : adminDashboardData?.data?.new_users_today || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                New This Month
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {adminDashboardLoading
                  ? "..."
                  : adminDashboardData?.data?.new_users_this_month || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Filters and Search */}
      <FilterTab
        filter={filter}
        setFilter={setFilter}
        TABLE_FILTER={["SEARCH", "PROMOTER_LEVEL", "FROM_DATE", "TO_DATE"]}
      />
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <DataTable
          columns={Columns}
          data={data?.data ?? []}
          pageSize={filter.pageSize}
          currentPage={filter.pageNo}
          totalRecords={data?.pageInfo?.total_records ?? 0}
          onPageChange={(page: any) =>
            setFilter((prv) => ({ ...prv, pageNo: page }))
          }
          sortBy={filter.sortBy}
          sortDir={filter.sortDir}
          setSort={(sortData: any) => {
            setFilter((prv) => ({
              ...prv,
              sortBy: sortData.key ?? "",
              sortDir: sortData.sort ?? "",
            }));
          }}
          enableSerial={true}
          isLoading={loading}
          setPageSize={(pageSize: number) => {
            setFilter((prv) => ({ ...prv, pageNo: 1, pageSize: pageSize }));
          }}
        />
      </div>

      {Modal === MODAL_OPEN.USER_MODAL && (
        <UserFormModal recoilApi={getUsers} />
      )}
    </div>
  );
}
