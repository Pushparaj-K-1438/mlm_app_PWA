import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PackageSearch, X, ChevronRight } from "lucide-react";
import { useGetCall, useQueryParams } from "@/hooks";
import { SERVICE } from "@/constants/services";

const BOX_PAGE = "/portal/user/box-requests";

/**
 * Nudges the user to confirm whether a dispatched product actually arrived.
 *
 * The server decides who is overdue (5 days after a direct handover, 10 after
 * a courier) — the window lives there so it can't drift from the data.
 *
 * Behaviour asked for: it keeps coming back on every menu until the user
 * actually marks the product. The X dismisses it for the CURRENT screen only;
 * navigating anywhere brings it back. Only marking Delivered or Not Received
 * stops it for good.
 */
export default function ProductStatusReminder() {
  const location = useLocation();
  const { navigate } = useQueryParams();
  const [dismissed, setDismissed] = useState(false);

  const { data, fetchApi } = useGetCall(SERVICE.BOX_STATUS_REMINDERS);

  const pending: any[] = data?.data ?? [];
  const count = pending.length;
  const first = pending[0];

  // A dismissal lasts until the next navigation — that is what makes this a
  // persistent reminder rather than a one-off toast.
  useEffect(() => {
    setDismissed(false);
  }, [location.pathname]);

  // Re-check on navigation ONLY while something is outstanding. Once the user
  // has confirmed everything the list is empty and we stop asking, so a user
  // with nothing pending costs exactly one request per session.
  useEffect(() => {
    if (count > 0) {
      fetchApi({});
    }
  }, [location.pathname]);

  // Nothing to chase, dismissed for this screen, or the user is already on the
  // page that has the buttons — showing it there would just cover them.
  if (!count || dismissed || location.pathname.startsWith(BOX_PAGE)) {
    return null;
  }

  const days = Number(first?.days_since_sent ?? 0);

  return (
    <div className="fixed inset-x-0 bottom-24 z-40 px-4 safe-area-inset-bottom">
      <div className="mx-auto max-w-md rounded-2xl border border-amber-200 bg-white shadow-xl">
        <div className="flex items-start gap-3 p-4">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
            <PackageSearch className="h-5 w-5 text-amber-700" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">
              Update your product status
            </p>
            <p className="mt-0.5 text-xs text-gray-600">
              {count > 1
                ? `${count} products were sent to you and are still unconfirmed. `
                : `Your product was sent ${days > 0 ? `${days} days ago` : "recently"}${
                    first?.dispatch_label ? ` by ${first.dispatch_label}` : ""
                  }. `}
              Please tell us whether it arrived.
            </p>

            <button
              type="button"
              onClick={() => navigate.push(BOX_PAGE)}
              className="mt-2 inline-flex items-center text-xs font-semibold text-amber-800"
            >
              Mark it now
              <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Close"
            className="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
