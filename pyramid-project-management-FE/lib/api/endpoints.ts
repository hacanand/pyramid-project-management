/**
 * Central registry of every API endpoint path used by the frontend.
 *
 * This is the single source of truth: SWR cache keys, the fetch client, and
 * the mock router all derive from here, and the API documentation
 * (docs/API.md) mirrors these exact paths. When you build the NestJS backend,
 * implement these routes and everything wires up automatically.
 */

import type { TaskQuery } from "@/lib/types"

function qs(query?: Record<string, string | undefined>): string {
  if (!query) return ""
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value != null && value !== "") params.set(key, value)
  }
  const s = params.toString()
  return s ? `?${s}` : ""
}

export const endpoints = {
  auth: {
    guest: () => `/auth/guest`,
    google: () => `/auth/google`,
    me: () => `/auth/me`,
  },
  profile: {
    get: () => `/users/me`,
    update: () => `/users/me`,
  },
  members: {
    list: () => `/members`,
  },
  labels: {
    list: () => `/labels`,
  },
  tasks: {
    list: (query?: TaskQuery) =>
      `/tasks${qs(query as Record<string, string | undefined> | undefined)}`,
    detail: (id: string) => `/tasks/${id}`,
    create: () => `/tasks`,
    update: (id: string) => `/tasks/${id}`,
    remove: (id: string) => `/tasks/${id}`,
    comments: (id: string) => `/tasks/${id}/comments`,
    subtasks: (id: string) => `/tasks/${id}/subtasks`,
    subtask: (id: string, subtaskId: string) => `/tasks/${id}/subtasks/${subtaskId}`,
  },
  projects: {
    list: (query?: { search?: string; priority?: string }) => `/projects${qs(query)}`,
    detail: (id: string) => `/projects/${id}`,
    create: () => `/projects`,
    update: (id: string) => `/projects/${id}`,
    remove: (id: string) => `/projects/${id}`,
    tasks: (id: string) => `/projects/${id}/tasks`,
  },
} as const
