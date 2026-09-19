// ── Client-side fetch helpers ───────────────────────────────
// Every browser call to our API goes through apiFetch so that:
//   • the double-submit CSRF header is attached automatically
//   • JSON parsing + error normalisation happens in one place
//   • credentials are always included (HTTP-only session cookie)

export function readCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data ?? {};
    this.code = data?.code ?? null;
  }
}

/**
 * fetch() wrapper for /api/* routes.
 * @returns {Promise<any>} parsed JSON body (throws ApiError on failure)
 */
export async function apiFetch(path, { method = "GET", body, headers = {}, signal, ...rest } = {}) {
  const csrf = readCookie("ielts_csrf");
  const res = await fetch(path, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    signal,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(csrf ? { "x-csrf-token": csrf } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: false, error: "Unexpected server response." };
    }
  }

  if (!res.ok || data?.success === false) {
    throw new ApiError(data?.error ?? `Request failed (${res.status}).`, res.status, data);
  }
  return data;
}

export const apiGet = (path, opts) => apiFetch(path, { ...opts, method: "GET" });
export const apiPost = (path, body, opts) => apiFetch(path, { ...opts, method: "POST", body });
