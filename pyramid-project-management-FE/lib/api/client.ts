/**
 * Typed HTTP client.
 *
 * Every call goes through here. If a real backend is configured
 * (NEXT_PUBLIC_API_BASE_URL), it performs a real fetch with the auth token.
 * Otherwise it transparently serves the in-memory mock. Components and hooks
 * never need to know which mode is active.
 */

import { API_BASE_URL, USE_REAL_API, getAuthToken } from "./config"
import { mockRequest, ApiError } from "./mock-db"

type Method = "GET" | "POST" | "PATCH" | "DELETE"

async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  if (!USE_REAL_API) {
    // Simulate a tiny latency so optimistic UI transitions feel real.
    await new Promise((r) => setTimeout(r, 120))
    return mockRequest<T>(method, path, body)
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" }
  const token = getAuthToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const data = await res.json()
      message = data.message ?? message
    } catch {
      /* ignore parse errors */
    }
    throw new ApiError(res.status, message)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
}

/** Default SWR fetcher. */
export const fetcher = <T>(path: string) => api.get<T>(path)

export { ApiError }
