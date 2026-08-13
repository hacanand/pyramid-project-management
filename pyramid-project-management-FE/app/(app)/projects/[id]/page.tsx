"use client"

import { use } from "react"
import { TasksView } from "@/components/tasks-view"
import { useProject } from "@/lib/hooks"

export default function ProjectTasksPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { project } = useProject(id)
  
  const crumbs = [
    { label: "Projects", href: "/projects" },
    { label: project?.name ?? "..." }
  ]

  return <TasksView projectId={id} crumbs={crumbs} />
}
