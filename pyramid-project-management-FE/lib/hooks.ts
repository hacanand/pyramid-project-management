"use client"

import useSWR, { useSWRConfig } from "swr"
import { api, fetcher } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"
import type {
  Comment,
  CreateCommentInput,
  CreateProjectInput,
  CreateSubtaskInput,
  CreateTaskInput,
  Member,
  Profile,
  Project,
  SubTask,
  Task,
  TaskQuery,
  UpdateProfileInput,
  UpdateProjectInput,
  UpdateTaskInput,
} from "@/lib/types"

/* ---------- queries ---------- */

export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR<Profile>(endpoints.profile.get(), fetcher)
  return { profile: data, error, isLoading, mutate }
}

export function useMembers() {
  const { data, error, isLoading } = useSWR<Member[]>(endpoints.members.list(), fetcher)
  return { members: data ?? [], error, isLoading }
}

export function useLabels() {
  const { data, error, isLoading } = useSWR<string[]>(endpoints.labels.list(), fetcher)
  return { labels: data ?? [], error, isLoading }
}

export function useTasks(query?: TaskQuery) {
  const key = endpoints.tasks.list(query)
  const { data, error, isLoading, mutate } = useSWR<Task[]>(key, fetcher)
  return { tasks: data ?? [], error, isLoading, mutate }
}

export function useTask(id: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<Task>(
    id ? endpoints.tasks.detail(id) : null,
    fetcher,
  )
  return { task: data, error, isLoading, mutate }
}

export function useProjects(query?: { search?: string; priority?: string }) {
  const key = endpoints.projects.list(query)
  const { data, error, isLoading, mutate } = useSWR<Project[]>(key, fetcher)
  return { projects: data ?? [], error, isLoading, mutate }
}

export function useProject(id: string | undefined) {
  const { data, error, isLoading } = useSWR<Project>(
    id ? endpoints.projects.detail(id) : null,
    fetcher,
  )
  return { project: data, error, isLoading }
}

export function useProjectTasks(id: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<Task[]>(
    id ? endpoints.projects.tasks(id) : null,
    fetcher,
  )
  return { tasks: data ?? [], error, isLoading, mutate }
}

/* ---------- mutations (with optimistic updates) ---------- */

const isTaskListKey = (key: unknown): key is string =>
  typeof key === "string" &&
  (key === "/tasks" || key.startsWith("/tasks?") || /^\/projects\/[^/]+\/tasks$/.test(key))

const isProjectListKey = (key: unknown): key is string =>
  typeof key === "string" && (key === "/projects" || key.startsWith("/projects?"))

export function useTaskActions() {
  const { mutate } = useSWRConfig()

  const revalidateTasks = () => mutate((key) => isTaskListKey(key))

  return {
    async createTask(input: CreateTaskInput) {
      const task = await api.post<Task>(endpoints.tasks.create(), input)
      await revalidateTasks()
      return task
    },
    async updateTask(id: string, input: UpdateTaskInput) {
      // optimistic: patch matching list rows + the detail cache
      await mutate(
        (key) => isTaskListKey(key),
        (current?: Task[]) => current?.map((t) => (t.id === id ? { ...t, ...input } : t)),
        { revalidate: false },
      )
      await mutate(
        endpoints.tasks.detail(id),
        (current?: Task) => (current ? { ...current, ...input } : current),
        { revalidate: false },
      )
      const task = await api.patch<Task>(endpoints.tasks.update(id), input)
      await Promise.all([revalidateTasks(), mutate(endpoints.tasks.detail(id))])
      return task
    },
    async deleteTask(id: string) {
      await mutate(
        (key) => isTaskListKey(key),
        (current?: Task[]) => current?.filter((t) => t.id !== id),
        { revalidate: false },
      )
      await api.delete(endpoints.tasks.remove(id))
      await revalidateTasks()
    },
    async addComment(id: string, input: CreateCommentInput) {
      const comment = await api.post<Comment>(endpoints.tasks.comments(id), input)
      await mutate(endpoints.tasks.detail(id))
      return comment
    },
    async addSubtask(id: string, input: CreateSubtaskInput) {
      const subtask = await api.post<SubTask>(endpoints.tasks.subtasks(id), input)
      await mutate(endpoints.tasks.detail(id))
      return subtask
    },
  }
}

export function useProjectActions() {
  const { mutate } = useSWRConfig()

  const revalidateProjects = () => mutate((key) => isProjectListKey(key))

  return {
    async createProject(input: CreateProjectInput) {
      const project = await api.post<Project>(endpoints.projects.create(), input)
      await revalidateProjects()
      return project
    },
    async updateProject(id: string, input: UpdateProjectInput) {
      await mutate(
        (key) => isProjectListKey(key),
        (current?: Project[]) => current?.map((p) => (p.id === id ? { ...p, ...input } : p)),
        { revalidate: false },
      )
      const project = await api.patch<Project>(endpoints.projects.update(id), input)
      await revalidateProjects()
      return project
    },
    async deleteProject(id: string) {
      await mutate(
        (key) => isProjectListKey(key),
        (current?: Project[]) => current?.filter((p) => p.id !== id),
        { revalidate: false },
      )
      await api.delete(endpoints.projects.remove(id))
      await revalidateProjects()
    },
  }
}

export function useProfileActions() {
  const { mutate } = useSWRConfig()
  return {
    async updateProfile(input: UpdateProfileInput) {
      await mutate(
        endpoints.profile.get(),
        (current?: Profile) => (current ? { ...current, ...input } : current),
        { revalidate: false },
      )
      const profile = await api.patch<Profile>(endpoints.profile.update(), input)
      await mutate(endpoints.profile.get())
      return profile
    },
  }
}
