/**
 * API configuration.
 *
 * When `NEXT_PUBLIC_API_BASE_URL` is set (e.g. your NestJS backend), every
 * request in the app is sent to that base URL. When it is NOT set, the app
 * transparently falls back to an in-memory mock so the frontend is fully
 * usable on its own. Switching to the real backend requires ZERO code
 * changes — just set the environment variable.
 */

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "")

/** True when a real backend base URL is configured. */
export const USE_REAL_API = API_BASE_URL.length > 0

/** localStorage key used to persist the auth token returned by the backend. */
export const AUTH_TOKEN_KEY = "pyramid-auth-token"

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return
  if (token) window.localStorage.setItem(AUTH_TOKEN_KEY, token)
  else window.localStorage.removeItem(AUTH_TOKEN_KEY)
}
