/**
 * In-memory mock backend.
 *
 * Mirrors the exact REST contract documented in docs/API.md so the frontend
 * behaves identically whether it talks to this mock or a real NestJS server.
 * State lives at module scope, so mutations persist for the browser session.
 */

import {
  currentUser as seedUser,
  members as seedMembers,
  allLabels,
  tasks as seedTasks,
  projects as seedProjects,
} from "@/lib/data"
import type {
  Comment,
  CreateCommentInput,
  CreateProjectInput,
  CreateSubtaskInput,
  CreateTaskInput,
  Profile,
  Project,
  SubTask,
  Task,
  UpdateProfileInput,
  UpdateProjectInput,
  UpdateTaskInput,
} from "@/lib/types"

/* ---------- mutable state (seeded once) ---------- */

let profile: Profile = { ...seedUser }
let tasks: Task[] = seedTasks.map((t) => ({ ...t }))
let projects: Project[] = seedProjects.map((p) => ({ ...p }))

/* ---------- helpers ---------- */

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
}

function findTask(id: string): Task {
  const task = tasks.find((t) => t.id === id)
  if (!task) throw new ApiError(404, `Task ${id} not found`)
  return task
}

function findProject(id: string): Project {
  const project = projects.find((p) => p.id === id)
  if (!project) throw new ApiError(404, `Project ${id} not found`)
  return project
}

/* ---------- resource operations ---------- */

const db = {
  getProfile: () => profile,
  updateProfile: (input: UpdateProfileInput): Profile => {
    profile = { ...profile, ...input }
    return profile
  },

  listMembers: () => seedMembers,
  listLabels: () => allLabels,

  listTasks: (query: {
    status?: string
    priority?: string
    search?: string
    projectId?: string
  }): Task[] => {
    return tasks.filter((t) => {
      if (query.status && t.status !== query.status) return false
      if (query.priority && t.priority !== query.priority) return false
      if (query.projectId && t.projectId !== query.projectId) return false
      if (query.search && !t.title.toLowerCase().includes(query.search.toLowerCase())) return false
      return true
    })
  },
  getTask: (id: string) => findTask(id),
  createTask: (input: CreateTaskInput): Task => {
    const task: Task = {
      id: uid("task"),
      title: input.title,
      description: input.description,
      priority: input.priority ?? "none",
      status: input.status ?? "todo",
      memberIds: input.memberIds ?? [],
      dueDate: input.dueDate ?? todayLabel(),
      labels: input.labels ?? [],
      reporterId: input.reporterId ?? profile.id,
      projectId: input.projectId,
      subtasks: [],
      comments: [],
      updates: [],
    }
    tasks = [...tasks, task]
    return task
  },
  updateTask: (id: string, input: UpdateTaskInput): Task => {
    const task = findTask(id)
    Object.assign(task, input)
    return task
  },
  deleteTask: (id: string): { id: string } => {
    findTask(id)
    tasks = tasks.filter((t) => t.id !== id)
    return { id }
  },

  addComment: (id: string, input: CreateCommentInput): Comment => {
    const task = findTask(id)
    const comment: Comment = {
      id: uid("comment"),
      author: profile,
      timestamp: "just now",
      body: input.body,
    }
    task.comments = [...(task.comments ?? []), comment]
    return comment
  },

  addSubtask: (id: string, input: CreateSubtaskInput): SubTask => {
    const task = findTask(id)
    const subtask: SubTask = {
      id: uid("subtask"),
      title: input.title,
      priority: input.priority ?? "none",
      memberIds: input.memberIds ?? [],
      dueDate: input.dueDate ?? todayLabel(),
    }
    task.subtasks = [...(task.subtasks ?? []), subtask]
    return subtask
  },
  updateSubtask: (id: string, subtaskId: string, input: Partial<CreateSubtaskInput>): SubTask => {
    const task = findTask(id)
    const subtask = task.subtasks?.find((s) => s.id === subtaskId)
    if (!subtask) throw new ApiError(404, `Subtask ${subtaskId} not found`)
    Object.assign(subtask, input)
    return subtask
  },
  deleteSubtask: (id: string, subtaskId: string): { id: string } => {
    const task = findTask(id)
    task.subtasks = (task.subtasks ?? []).filter((s) => s.id !== subtaskId)
    return { id: subtaskId }
  },

  listProjects: (query: { search?: string; priority?: string }): Project[] => {
    return projects.filter((p) => {
      if (query.priority && p.priority !== query.priority) return false
      if (query.search && !p.name.toLowerCase().includes(query.search.toLowerCase())) return false
      return true
    })
  },
  getProject: (id: string) => findProject(id),
  createProject: (input: CreateProjectInput): Project => {
    const project: Project = {
      id: uid("project"),
      name: input.name,
      priority: input.priority ?? "none",
      leadId: input.leadId,
      dueDate: input.dueDate ?? todayLabel(),
    }
    projects = [...projects, project]
    return project
  },
  updateProject: (id: string, input: UpdateProjectInput): Project => {
    const project = findProject(id)
    Object.assign(project, input)
    return project
  },
  deleteProject: (id: string): { id: string } => {
    findProject(id)
    projects = projects.filter((p) => p.id !== id)
    return { id }
  },
  listProjectTasks: (id: string): Task[] => {
    findProject(id)
    return tasks.filter((t) => t.projectId === id)
  },
}

/* ---------- mock router ---------- */

type Method = "GET" | "POST" | "PATCH" | "DELETE"

/**
 * Routes a method + path (relative, e.g. "/tasks/abc") to the mock db.
 * Returns the same JSON shape the real backend is expected to return.
 */
export function mockRequest<T>(method: Method, path: string, body?: unknown): T {
  const [rawPath, rawQuery = ""] = path.split("?")
  const segments = rawPath.split("/").filter(Boolean)
  const query = Object.fromEntries(new URLSearchParams(rawQuery))
  const [root, id, sub, subId] = segments

  const b = (body ?? {}) as any

  // auth
  if (root === "auth") {
    if (sub === undefined && id === "guest" && method === "POST")
      return { token: uid("guest-token"), user: profile } as T
    if (sub === undefined && id === "google" && method === "POST")
      return { token: uid("google-token"), user: profile } as T
    if (id === "me" && method === "GET") return profile as T
  }

  // profile
  if (root === "users" && id === "me") {
    if (method === "GET") return db.getProfile() as T
    if (method === "PATCH") return db.updateProfile(b) as T
  }

  if (root === "members" && !id && method === "GET") return db.listMembers() as T
  if (root === "labels" && !id && method === "GET") return db.listLabels() as T

  // tasks
  if (root === "tasks") {
    if (!id && method === "GET") return db.listTasks(query) as T
    if (!id && method === "POST") return db.createTask(b) as T
    if (id && !sub && method === "GET") return db.getTask(id) as T
    if (id && !sub && method === "PATCH") return db.updateTask(id, b) as T
    if (id && !sub && method === "DELETE") return db.deleteTask(id) as T
    if (id && sub === "comments" && method === "POST") return db.addComment(id, b) as T
    if (id && sub === "subtasks" && !subId && method === "POST") return db.addSubtask(id, b) as T
    if (id && sub === "subtasks" && subId && method === "PATCH")
      return db.updateSubtask(id, subId, b) as T
    if (id && sub === "subtasks" && subId && method === "DELETE")
      return db.deleteSubtask(id, subId) as T
  }

  // projects
  if (root === "projects") {
    if (!id && method === "GET") return db.listProjects(query) as T
    if (!id && method === "POST") return db.createProject(b) as T
    if (id && !sub && method === "GET") return db.getProject(id) as T
    if (id && !sub && method === "PATCH") return db.updateProject(id, b) as T
    if (id && !sub && method === "DELETE") return db.deleteProject(id) as T
    if (id && sub === "tasks" && method === "GET") return db.listProjectTasks(id) as T
  }

  throw new ApiError(404, `No mock handler for ${method} ${path}`)
}
