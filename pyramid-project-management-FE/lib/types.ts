export type Priority = "urgent" | "high" | "medium" | "low" | "none"

export type TaskStatus = "todo" | "doing" | "completed" | "onhold"

export type ProjectStatus = "backlog" | "todo" | "in-progress" | "done"

export interface Member {
  id: string
  name: string
  initials: string
  avatar?: string
}

export interface Profile extends Member {
  email: string
  title?: string
  username?: string
}

export interface Label {
  id: string
  name: string
}

export interface Comment {
  id: string
  author: Member
  timestamp: string
  body: string
}

export interface Update {
  id: string
  author: Member
  text: string
  timestamp: string
}

export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  status: TaskStatus
  memberIds: string[]
  dueDate: string
  labels: string[]
  reporterId?: string
  projectId?: string
  subtasks?: SubTask[]
  comments?: Comment[]
  updates?: Update[]
}

export interface SubTask {
  id: string
  title: string
  priority: Priority
  memberIds: string[]
  dueDate: string
}

export interface Project {
  id: string
  name: string
  priority: Priority
  leadId?: string
  dueDate: string
}

export type FieldKey =
  | "priority"
  | "members"
  | "dueDate"
  | "labels"
  | "status"
  | "reporter"

export type ViewMode = "list" | "board"

/* ---------- API request/response DTOs ---------- */

export interface CreateTaskInput {
  title: string
  description?: string
  priority?: Priority
  status?: TaskStatus
  memberIds?: string[]
  dueDate?: string
  labels?: string[]
  reporterId?: string
  projectId?: string
}

export type UpdateTaskInput = Partial<CreateTaskInput>

export interface CreateProjectInput {
  name: string
  priority?: Priority
  leadId?: string
  dueDate?: string
}

export type UpdateProjectInput = Partial<CreateProjectInput>

export interface CreateCommentInput {
  body: string
}

export interface CreateSubtaskInput {
  title: string
  priority?: Priority
  memberIds?: string[]
  dueDate?: string
}

export interface UpdateProfileInput {
  name?: string
  email?: string
  title?: string
  username?: string
}

export interface TaskQuery {
  status?: TaskStatus
  priority?: Priority
  search?: string
  projectId?: string
}

export interface AuthResponse {
  token: string
  user: Profile
}
