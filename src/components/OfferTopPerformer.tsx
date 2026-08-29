import { useEffect } from "react";
import { Trophy, Crown, ChevronRight } from "lucide-react";
import { useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";

/**
 * Dashboard spotlight for whoever currently leads the offer leaderboard.
 *
 * Renders nothing at all unless three things hold, mirroring the gating on
 * the Offers page:
 *   1. the admin has the offer switched on (`is_active`),
 *   2. its start time has passed (`has_started` — a scheduled offer stays
 *      hidden until then; the server sends the flag so a wrong phone clock
 *      can't reveal it early),
 *   3. someone is actually on the board.
 *
 * An offer that is off, not yet started, or has no players leaves the
 * dashboard exactly as it was — no empty card, no placeholder.
 */
export default function OfferTopPerformer() {
  const { navigate } = useQueryParams();
  const { data: statusData } = useGetCall(SERVICE.OFFER_STATUS);

  const status = statusData?.data;
  const isActive = Boolean(status?.is_active);
  const hasStarted = isActive && Boolean(status?.has_started);

  // Only fetched once the offer is actually running — an inactive or
  // scheduled offer costs no extra request.
  const { data: topData, fetchApi: loadTop } = useGetCall(
    SERVICE.OFFER_TOP_LIST,
    { avoidFetch: true }
  );

  useEffect(() => {
    if (hasStarted) {
      loadTop({});
    }
  }, [hasStarted]);

  const leader: any = (topData?.data ?? [])[0];

  if (!hasStarted || !leader) return null;

  const displayName = String(leader.name ?? "").trim();
  const username = String(leader.username ?? "").trim();

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 p-4 text-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center min-w-0">
          <Trophy className="w-5 h-5 mr-2 shrink-0" />
          <p className="text-sm font-semibold truncate">
            {status?.title ? status.title : "Offer"} &middot; Rank 1
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold shrink-0 ml-2">
          <Crown className="w-3 h-3 mr-1" /> Leader
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div className="min-w-0">
          <p className="truncate text-2xl font-bold leading-tight">
            {displayName || username || "N/A"}
          </p>
          {displayName && username ? (
            <p className="truncate text-sm text-white/80">{username}</p>
          ) : null}
        </div>
        <div className="text-right shrink-0 pl-3">
          <p className="text-xs text-white/80">Points</p>
          <p className="text-2xl font-bold tabular-nums">{leader.points ?? 0}</p>
        </div>
      </div>

      {/* The Offer menu is gated on the same is_active flag we already
          checked, so this can never land on a hidden page. */}
      <button
        type="button"
        onClick={() => navigate.push("/portal/user/offers")}
        className="mt-4 w-full inline-flex items-center justify-center rounded-xl bg-white/20 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/30 active:scale-[0.99]"
      >
        See others
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
}
