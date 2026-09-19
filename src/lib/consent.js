// ── Cookie consent (client) ─────────────────────────────────
// Nothing non-essential (analytics) runs before an explicit choice.
// The choice itself is stored in a first-party cookie so the server
// could also read it if a future feature needs that.

export const CONSENT_COOKIE = "ielts_consent";
export const CONSENT_VERSION = 1;

export const CONSENT = { ALL: "all", ESSENTIAL: "essential" };

export function readConsent() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )ielts_consent=([^;]*)/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    if (parsed?.v !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(level) {
  if (typeof document === "undefined") return null;
  const value = { level, v: CONSENT_VERSION, at: new Date().toISOString() };
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; path=/; max-age=${oneYear}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent("ielts:consent", { detail: value }));
  return value;
}

export const analyticsAllowed = () => readConsent()?.level === CONSENT.ALL;
