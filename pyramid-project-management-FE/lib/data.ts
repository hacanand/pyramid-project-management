import type { Member, Profile, Task, Project, TaskStatus, Priority } from "./types"

export const currentUser: Profile = {
  id: "dexter",
  name: "Dexter",
  initials: "DX",
  avatar: "/avatars/dexter.png",
  email: "Dexter@gmail.com",
  title: "Designer",
  username: "Dexuser",
}

export const members: Member[] = [
  currentUser,
  { id: "chris", name: "Chris Nolan", initials: "CN" },
  { id: "ankit", name: "Ankit Dutta", initials: "AD", avatar: "/avatars/dexter.png" },
  { id: "admin", name: "Admin", initials: "AD", avatar: "/avatars/dexter.png" },
  { id: "qa", name: "QA Team", initials: "QA", avatar: "/avatars/dexter.png" },
  { id: "designer", name: "Designer", initials: "DS", avatar: "/avatars/dexter.png" },
  { id: "security", name: "Security", initials: "SE", avatar: "/avatars/dexter.png" },
]

export const allLabels = [
  "Research",
  "Design",
  "Development",
  "Testing",
  "Deployment",
  "Passed",
  "Updated",
  "Audit",
  "Scheduled",
]

export const statusMeta: Record<TaskStatus, { label: string }> = {
  todo: { label: "To Do" },
  doing: { label: "Doing" },
  completed: { label: "Completed" },
  onhold: { label: "On Hold" },
}

export const listStatuses: TaskStatus[] = ["todo", "doing", "completed"]
export const boardStatuses: TaskStatus[] = ["todo", "doing", "completed", "onhold"]

function makeListTasks(status: TaskStatus): Task[] {
  return [
    {
      id: `${status}-design-homepage`,
      title: "Design Homepage",
      priority: "high",
      status,
      memberIds: ["dexter"],
      dueDate: "12 Sep 2026",
      labels: ["Design"],
      reporterId: "dexter",
      projectId: "design-homepage",
    },
    {
      id: `${status}-develop-login`,
      title: "Develop Login Feature",
      priority: "low",
      status,
      memberIds: ["chris"],
      dueDate: "15 Sep 2026",
      labels: ["Development"],
      reporterId: "dexter",
      projectId: "develop-login",
    },
    {
      id: `${status}-test-payment`,
      title: "Test Payment Gateway",
      priority: "medium",
      status,
      memberIds: [],
      dueDate: "18 Sep 2026",
      labels: ["Testing"],
      reporterId: "dexter",
      projectId: "test-payment",
    },
  ]
}

const boardExtras: Task[] = [
  {
    id: "write-api-documentation",
    title: "Write API Documentation",
    description:
      "Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.",
    priority: "high",
    status: "todo",
    memberIds: ["admin"],
    dueDate: "29 Jul 2026",
    labels: ["Research", "Design", "Development", "Testing", "Deployment"],
    reporterId: "dexter",
    subtasks: [
      { id: "s1", title: "Subtask 1", priority: "high", memberIds: ["dexter"], dueDate: "12 Sep 2026" },
      { id: "s2", title: "Subtask 2", priority: "low", memberIds: ["chris"], dueDate: "15 Sep 2026" },
      { id: "s3", title: "Subtask 3", priority: "medium", memberIds: [], dueDate: "18 Sep 2026" },
    ],
    comments: [
      { id: "c1", author: members[2], timestamp: "just now", body: "dsds" },
    ],
    updates: [
      { id: "u1", author: currentUser, text: "changed priority from No priority to Urgent", timestamp: "Aug 2026" },
      { id: "u2", author: currentUser, text: "posted an update", timestamp: "Aug 2026" },
    ],
  },
  {
    id: "implement-search-function",
    title: "Implement Search Function",
    priority: "high",
    status: "todo",
    memberIds: ["admin"],
    dueDate: "29 Jul 2026",
    labels: ["Deployment", "Deployment"],
    reporterId: "dexter",
  },
  {
    id: "deploy-to-production",
    title: "Deploy to Production",
    priority: "high",
    status: "todo",
    memberIds: ["admin"],
    dueDate: "29 Jul 2026",
    labels: ["Deployment", "Deployment"],
    reporterId: "dexter",
  },
  {
    id: "code-review-completed",
    title: "Code Review Completed",
    priority: "medium",
    status: "doing",
    memberIds: ["admin"],
    dueDate: "29 Jul 2026",
    labels: ["Deployment", "Deployment"],
    reporterId: "dexter",
  },
  {
    id: "design-mockups-finalized",
    title: "Design Mockups Finalized",
    priority: "medium",
    status: "doing",
    memberIds: ["admin"],
    dueDate: "29 Jul 2026",
    labels: ["Deployment", "Deployment"],
    reporterId: "dexter",
  },
  {
    id: "feature-testing-passed",
    title: "Feature Testing Passed",
    priority: "high",
    status: "completed",
    memberIds: ["qa"],
    dueDate: "30 Jul 2026",
    labels: ["Testing", "Passed"],
    reporterId: "dexter",
  },
  {
    id: "ui-design-updated",
    title: "UI Design Updated",
    priority: "medium",
    status: "completed",
    memberIds: ["designer"],
    dueDate: "31 Jul 2026",
    labels: ["Design", "Updated"],
    reporterId: "dexter",
  },
  {
    id: "security-audit-scheduled",
    title: "Security Audit Scheduled",
    priority: "high",
    status: "completed",
    memberIds: ["security"],
    dueDate: "01 Aug 2026",
    labels: ["Audit", "Scheduled"],
    reporterId: "dexter",
  },
  {
    id: "ui-review",
    title: "UI Review",
    priority: "medium",
    status: "onhold",
    memberIds: ["designer"],
    dueDate: "02 Aug 2026",
    labels: ["Design", "Review"],
    reporterId: "dexter",
  },
  {
    id: "backend-integration",
    title: "Backend Integration",
    priority: "high",
    status: "onhold",
    memberIds: ["admin"],
    dueDate: "03 Aug 2026",
    labels: ["Dev", "Development"],
    reporterId: "dexter",
  },
  {
    id: "user-feedback",
    title: "User Feedback Review",
    priority: "low",
    status: "onhold",
    memberIds: ["qa"],
    dueDate: "04 Aug 2026",
    labels: ["Product", "Research"],
    reporterId: "dexter",
  },
  {
    id: "performance-optimization",
    title: "Performance Optimization",
    priority: "medium",
    status: "onhold",
    memberIds: ["admin"],
    dueDate: "05 Aug 2026",
    labels: ["Engineering", "Optimization"],
    reporterId: "dexter",
  },
]

export const tasks: Task[] = [
  ...makeListTasks("todo"),
  ...makeListTasks("doing"),
  ...makeListTasks("completed"),
  ...boardExtras,
]

export const projects: Project[] = [
  { id: "design-homepage", name: "Design Homepage", priority: "high", leadId: "dexter", dueDate: "12 Sep 2026" },
  { id: "develop-login", name: "Develop Login Feature", priority: "low", leadId: "chris", dueDate: "15 Sep 2026" },
  { id: "test-payment", name: "Test Payment Gateway", priority: "medium", leadId: undefined, dueDate: "18 Sep 2026" },
]

export function getMember(id?: string): Member | undefined {
  return members.find((m) => m.id === id)
}

export function getTask(id: string): Task | undefined {
  return tasks.find((t) => t.id === id)
}

export const priorityMeta: Record<Priority, { label: string; color: string }> = {
  urgent: { label: "Urgent", color: "text-red-600" },
  high: { label: "High", color: "text-red-500" },
  medium: { label: "Medium", color: "text-amber-500" },
  low: { label: "Low", color: "text-muted-foreground" },
  none: { label: "No Priority", color: "text-muted-foreground" },
}
