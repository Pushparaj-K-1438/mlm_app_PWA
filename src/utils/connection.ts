import toast from "react-hot-toast";

export const CONNECTION_ERROR_EVENT = "app:connection-error";

/**
 * True for a real connectivity failure — fetch() itself rejected (server
 * unreachable, connection refused, DNS failure, offline, CORS). HTTP error
 * statuses (4xx/5xx) do NOT reject fetch, so they don't count here; those keep
 * their normal toast handling.
 */
export const isNetworkError = (error: any): boolean => {
  if (error instanceof TypeError) return true;
  const msg = String(error?.message || "").toLowerCase();
  return (
    msg.includes("failed to fetch") ||
    msg.includes("network request failed") ||
    msg.includes("load failed") ||
    msg.includes("networkerror")
  );
};

/** Raise the global "can't reach the server" overlay. */
export const showConnectionError = (): void => {
  try {
    window.dispatchEvent(new CustomEvent(CONNECTION_ERROR_EVENT));
  } catch {
    /* no-op */
  }
};

/**
 * Route an API failure: connectivity problems raise the full-screen overlay;
 * everything else keeps the existing inline toast.
 */
export const reportApiError = (error: any): void => {
  if (isNetworkError(error)) {
    showConnectionError();
  } else {
    toast.error(error?.message || "Something went wrong");
  }
};
