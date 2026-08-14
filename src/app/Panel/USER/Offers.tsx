import React, { useEffect, useMemo, useState } from "react";
import { Gift, Eye, Trophy, Clock, Medal } from "lucide-react";
import { useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";
import Lib from "@/utils/Lib";
import DailyVideoWarning from "@/components/DailyVideoWarning";

/** Split a millisecond duration into d/h/m/s parts. */
const splitDuration = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
};

const TimeBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
      <span className="text-2xl font-bold text-white tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
    </div>
    <span className="mt-1 text-[11px] uppercase tracking-wide text-white/80">
      {label}
    </span>
  </div>
);

const rankStyle = (rank: number) => {
  if (rank === 1) return "bg-amber-100 text-amber-800 ring-1 ring-amber-300";
  if (rank === 2) return "bg-gray-100 text-gray-700 ring-1 ring-gray-300";
  if (rank === 3) return "bg-orange-100 text-orange-800 ring-1 ring-orange-300";
  return "bg-blue-50 text-blue-700";
};

function OffersPage() {
  const { navigate } = useQueryParams();

  const {
    data: statusData,
    loading: statusLoading,
    fetchApi: refetchStatus,
  } = useGetCall(SERVICE.OFFER_STATUS);

  const status = statusData?.data;
  // The offer must be switched on by the admin. The menu is hidden when it
  // isn't, but the route is still reachable (bookmark / back button), so the
  // page itself must refuse to show anything too.
  const isActive = Boolean(status?.is_active);
  const hasStarted = isActive && Boolean(status?.has_started);

  // Points + leaderboard are only meaningful once the offer has started, so
  // they're fetched on demand rather than on mount.
  const {
    data: pointsData,
    loading: pointsLoading,
    fetchApi: loadPoints,
  } = useGetCall(SERVICE.MY_OFFER_POINTS, { avoidFetch: true });

  const {
    data: topData,
    loading: topLoading,
    fetchApi: loadTop,
  } = useGetCall(SERVICE.OFFER_TOP_LIST, { avoidFetch: true });

  // ── Countdown ────────────────────────────────────────────────────────────
  // Offset the device clock against the server clock so a wrong phone time
  // can't unlock (or wrongly hide) the offer.
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (
      !status ||
      !isActive ||
      hasStarted ||
      !status.start_at ||
      !status.server_time
    ) {
      setRemaining(null);
      return;
    }
    const startMs = new Date(status.start_at).getTime();
    const serverMs = new Date(status.server_time).getTime();
    const skew = serverMs - Date.now(); // server clock − device clock

    // Guard so the "time's up" refetch can only fire once. Without it, a few
    // seconds of clock skew between server and device would leave `left <= 0`
    // while the server still reports not-started, and every tick would fire
    // another request — one API call per second, forever.
    let reloaded = false;
    let id: ReturnType<typeof setInterval> | null = null;

    const tick = () => {
      const left = startMs - (Date.now() + skew);
      setRemaining(Math.max(0, left));
      if (left <= 0 && !reloaded) {
        reloaded = true;
        if (id) clearInterval(id);
        // Time's up — pull fresh status so the page flips to the live view.
        refetchStatus({});
      }
    };

    tick();
    if (!reloaded) {
      id = setInterval(tick, 1000);
    }
    return () => {
      if (id) clearInterval(id);
    };
  }, [status, isActive, hasStarted]);

  // Load the live data once the offer is running.
  useEffect(() => {
    if (hasStarted) {
      loadPoints({});
      loadTop({});
    }
  }, [hasStarted]);

  const parts = useMemo(
    () => splitDuration(remaining ?? 0),
    [remaining]
  );

  const totals = pointsData?.data ?? {};
  const topList: any[] = topData?.data ?? [];

  if (statusLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {status?.title || "Offer"}
            </h1>
            <p className="text-sm text-gray-600">
              {!isActive
                ? "No offer is running right now."
                : hasStarted
                ? "Earn points on your upgrades and your referrals' upgrades."
                : "Get ready — the offer starts soon!"}
            </p>
          </div>
        </div>
      </div>

      {!isActive ? (
        /* ── Offer switched off — nothing is shown or earned ────────────── */
        <div className="px-4 sm:px-6 mt-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Active Offer
            </h3>
            <p className="text-sm text-gray-600">
              There's no offer running at the moment. Please check back later.
            </p>
          </div>
        </div>
      ) : !hasStarted ? (
        /* ── Countdown (offer not started yet) ─────────────────────────── */
        <div className="px-4 sm:px-6 mt-6">
          <div className="rounded-3xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 p-6 shadow-lg">
            <div className="flex items-center justify-center gap-2 text-white/90 mb-4">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Offer starts in</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              {parts.days > 0 && <TimeBox value={parts.days} label="Days" />}
              <TimeBox value={parts.hours} label="Hours" />
              <TimeBox value={parts.minutes} label="Mins" />
              <TimeBox value={parts.seconds} label="Secs" />
            </div>

            {status?.start_at_label && (
              <p className="text-center text-white/85 text-sm mt-5">
                Starts on <b>{status.start_at_label}</b>
              </p>
            )}
          </div>

          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <Trophy className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">
              Points start once the offer begins
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              You'll earn points when you upgrade your promoter level, and again
              when the people you referred upgrade theirs.
            </p>
          </div>
        </div>
      ) : (
        /* ── Live offer ─────────────────────────────────────────────────── */
        <>
          {/* Your points */}
          <div className="px-4 sm:px-6 mt-6">
            <div className="rounded-3xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/85 text-sm">Your Points</p>
                  <p className="text-4xl font-extrabold text-white mt-1">
                    {pointsLoading
                      ? "..."
                      : Lib.formatAmount(totals?.total_points ?? 0)}
                  </p>
                </div>
                <button
                  onClick={() => navigate.push("/portal/user/offer-history")}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/30 transition-colors"
                  title="View my points history"
                >
                  <Eye className="w-4 h-4" />
                  History
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="rounded-2xl bg-white/15 backdrop-blur-sm p-3">
                  <p className="text-[11px] uppercase tracking-wide text-white/80">
                    Own Upgrade
                  </p>
                  <p className="text-lg font-bold text-white">
                    {Lib.formatAmount(totals?.own_points ?? 0)}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/15 backdrop-blur-sm p-3">
                  <p className="text-[11px] uppercase tracking-wide text-white/80">
                    Referral Upgrade
                  </p>
                  <p className="text-lg font-bold text-white">
                    {Lib.formatAmount(totals?.referral_points ?? 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="px-4 sm:px-6 mt-6 mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-100 flex items-center gap-2">
                <Medal className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-semibold text-gray-900">
                  Top Points
                </h3>
              </div>

              {topLoading ? (
                <div className="p-6">
                  <Loader />
                </div>
              ) : topList.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No points earned yet. Be the first!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                        <th className="px-4 py-2">Rank</th>
                        <th className="px-4 py-2">Username</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {topList.map((row) => (
                        <tr key={row.user_id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${rankStyle(
                                row.rank
                              )}`}
                            >
                              {row.rank}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {row.username}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {row.name || "-"}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-gray-900">
                            {Lib.formatAmount(row.points)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Gated behind the daily video, like the other earning screens.
export default function Offers() {
  return (
    <DailyVideoWarning>
      <OffersPage />
    </DailyVideoWarning>
  );
}
