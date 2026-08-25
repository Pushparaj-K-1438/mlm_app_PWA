/**
 * A stable per-device id, sent with every login.
 *
 * Why: an IP address identifies a NETWORK, not a device. A whole household —
 * or an entire mobile carrier behind CGNAT — shares one IP, so "10 accounts on
 * one IP" says nothing by itself. This id is generated once per install and
 * kept in local storage, so the same id turning up under several accounts is
 * strong evidence they are being used from the same phone.
 *
 * Limits, so the admin data isn't over-trusted:
 *   • clearing app data / reinstalling / a fresh browser profile produces a
 *     NEW id, so a changed id is not proof of a different person;
 *   • it is not a secret and can be edited by a determined user.
 * Treat a repeated id as a strong signal, never as proof on its own.
 */

const STORAGE_KEY = "device_uid";

function createId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through to the manual generator */
  }
  // Fallback for older WebViews without crypto.randomUUID.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Existing id for this device, creating and storing one on first use. */
export function getDeviceId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;

    const id = createId();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    // Storage blocked (private mode) — still send something for this session
    // rather than nothing.
    return createId();
  }
}

/** Screen size, e.g. "412x915" — a cheap extra discriminator. */
export function getScreenSize(): string {
  try {
    return `${window.screen?.width ?? 0}x${window.screen?.height ?? 0}`;
  } catch {
    return "";
  }
}
