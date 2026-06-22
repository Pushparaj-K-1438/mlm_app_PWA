import { useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { CONNECTION_ERROR_EVENT } from "@/utils/connection";

/**
 * Full-screen, mobile-friendly "we couldn't reach the server" screen. Shown
 * when the device goes offline or any API call fails to reach the backend
 * (instead of the browser's raw "site can't be reached" page or an ugly
 * "Failed to fetch" toast). Auto-clears when the device comes back online.
 */
export default function ConnectionError() {
  const [visible, setVisible] = useState<boolean>(
    typeof navigator !== "undefined" && navigator.onLine === false
  );

  useEffect(() => {
    const showIt = () => setVisible(true);
    const hideIt = () => setVisible(false);

    window.addEventListener(CONNECTION_ERROR_EVENT, showIt);
    window.addEventListener("offline", showIt);
    window.addEventListener("online", hideIt);

    return () => {
      window.removeEventListener(CONNECTION_ERROR_EVENT, showIt);
      window.removeEventListener("offline", showIt);
      window.removeEventListener("online", hideIt);
    };
  }, []);

  if (!visible) return null;

  const retry = () => {
    setVisible(false);
    // Reload through the cached app shell so the failed requests re-run.
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 safe-area-inset-top safe-area-inset-bottom">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <WifiOff className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Connection Problem</h1>
        <p className="mt-3 leading-relaxed text-gray-600">
          Sorry, we couldn't reach our servers. Please check your internet
          connection and try again.
        </p>

        <button
          onClick={retry}
          className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg transition-transform active:scale-95"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Try Again
        </button>

        <p className="mt-4 text-xs text-gray-400">
          We'll reconnect automatically once you're back online.
        </p>
      </div>
    </div>
  );
}
