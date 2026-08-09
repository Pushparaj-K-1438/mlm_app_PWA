import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";
import Lib from "@/utils/Lib";
import DailyVideoWarning from "@/components/DailyVideoWarning";

const PAGE_SIZE = 10;

/** Compact totals tile — same treatment as the admin history view. */
const Card = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: any;
  tone: "indigo" | "emerald" | "amber";
}) => {
  const tones: Record<string, string> = {
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
  };
  return (
    <div className={`rounded-lg border px-3 py-2 ${tones[tone]}`}>
      <div className="text-[11px] uppercase tracking-wide opacity-80 leading-tight">
        {label}
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
};

const typeBadge = (optionType: number, label: string) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${
      Number(optionType) === 1
        ? "bg-emerald-100 text-emerald-800"
        : "bg-amber-100 text-amber-800"
    }`}
  >
    {label}
  </span>
);

function OfferHistoryPage() {
  const { navigate } = useQueryParams();
  const [pageNo, setPageNo] = useState(1);

  // This page is reachable by URL even when the menu is hidden, so it has to
  // check the offer is switched on before showing anything.
  const { data: statusData } = useGetCall(SERVICE.OFFER_STATUS);
  const isActive = Boolean(statusData?.data?.is_active);

  const { data, loading, setQuery } = useGetCall(SERVICE.MY_OFFER_HISTORY, {
    avoidFetch: true,
  });

  useEffect(() => {
    if (isActive) setQuery({ pageSize: PAGE_SIZE, pageNo });
  }, [pageNo, isActive]);

  const rows: any[] = data?.data ?? [];
  const totals = data?.totals ?? {};
  const totalRecords = data?.pageInfo?.total_records ?? 0;
  const totalPages = data?.pageInfo?.total_pages ?? 1;

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate.push("/portal/user/offers")}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Back to offer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Points History</h1>
            <p className="text-sm text-gray-600">
              How you earned your offer points.
            </p>
          </div>
        </div>
      </div>

      {!isActive ? (
        <div className="px-4 sm:px-6 mt-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Active Offer
            </h3>
            <p className="text-sm text-gray-600">
              There's no offer running at the moment. Please check back later.
            </p>
          </div>
        </div>
      ) : (
      <div className="px-4 sm:px-6 mt-6 space-y-4">
        {/* Totals */}
        <div className="grid grid-cols-3 gap-2">
          <Card
            label="Own Upgrade"
            value={Lib.formatAmount(totals?.own_points ?? 0)}
            tone="emerald"
          />
          <Card
            label="Referral Upgrade"
            value={Lib.formatAmount(totals?.referral_points ?? 0)}
            tone="amber"
          />
          <Card
            label="Total Points"
            value={Lib.formatAmount(totals?.total_points ?? 0)}
            tone="indigo"
          />
        </div>

        {/* Detail table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6">
              <Loader />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Upgrade</th>
                    <th className="px-3 py-2">From</th>
                    <th className="px-3 py-2 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-8 text-center text-gray-500"
                      >
                        No points earned yet.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                          {r.earned_at}
                        </td>
                        <td className="px-3 py-2">
                          {typeBadge(r.option_type, r.option_label)}
                        </td>
                        <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                          {r.level_label}
                        </td>
                        <td className="px-3 py-2 text-gray-700">
                          {Number(r.option_type) === 1 ? (
                            <span className="text-gray-400">Self</span>
                          ) : (
                            <>
                              {r.from_user ?? "-"}
                              {r.from_name ? (
                                <span className="block text-xs text-gray-400">
                                  {r.from_name}
                                </span>
                              ) : null}
                            </>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-gray-900 whitespace-nowrap">
                          +{Lib.formatAmount(r.points)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalRecords > PAGE_SIZE && (
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs text-gray-500">
              Page {pageNo} of {totalPages} • {totalRecords} records
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPageNo((p) => Math.max(1, p - 1))}
                disabled={pageNo <= 1}
                className="inline-flex items-center px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </button>
              <button
                onClick={() => setPageNo((p) => (p < totalPages ? p + 1 : p))}
                disabled={pageNo >= totalPages}
                className="inline-flex items-center px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

// Gated behind the daily video, same as the Offer page it drills in from.
export default function OfferHistory() {
  return (
    <DailyVideoWarning>
      <OfferHistoryPage />
    </DailyVideoWarning>
  );
}
