"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { TopBar } from "@/components/top-bar"
import { TasksToolbar } from "@/components/tasks-toolbar"
import { TaskListGroup } from "@/components/task-list-group"
import { TaskBoard } from "@/components/task-board"
import { TaskFormDialog } from "@/components/task-form-dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useTasks } from "@/lib/hooks"
import { listStatuses, statusMeta } from "@/lib/data"
import type { FieldKey, Priority, ViewMode } from "@/lib/types"

const defaultFields: Record<FieldKey, boolean> = {
  priority: true,
  members: true,
  dueDate: true,
  labels: false,
  status: false,
  reporter: false,
}

export function TasksView({
  crumbs,
  projectId,
}: {
  crumbs?: { label: string; href?: string }[]
  projectId?: string
}) {
  const [view, setView] = useState<ViewMode>("list")
  const [fields, setFields] = useState<Record<FieldKey, boolean>>(defaultFields)
  const [search, setSearch] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null)

  useEffect(() => {
    const savedView = localStorage.getItem("tasks-view-mode") as ViewMode
    if (savedView === "list" || savedView === "board") {
      setView(savedView)
    }
    const savedFields = localStorage.getItem("tasks-view-fields")
    if (savedFields) {
      try {
        setFields(JSON.parse(savedFields))
      } catch {
        // ignore
      }
    }
  }, [])

  const { tasks, isLoading } = useTasks({
    search: search.trim() || undefined,
    priority: priorityFilter ?? undefined,
    projectId,
  })

  const handleViewChange = (v: ViewMode) => {
    setView(v)
    localStorage.setItem("tasks-view-mode", v)
  }

  const toggleField = (key: FieldKey) => {
    setFields((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      localStorage.setItem("tasks-view-fields", JSON.stringify(next))
      return next
    })
  }

  return (
    <>
      <TopBar crumbs={crumbs} />

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
            <TasksToolbar
              search={search}
              onSearchChange={setSearch}
              searchOpen={searchOpen}
              onSearchOpenChange={setSearchOpen}
              view={view}
              onViewChange={handleViewChange}
              fields={fields}
              onToggleField={toggleField}
              priorityFilter={priorityFilter}
              onPriorityChange={setPriorityFilter}
              addButton={
                <TaskFormDialog
                  projectId={projectId}
                  trigger={
                    <Button size="sm">
                      <Plus data-icon="inline-start" />
                      Add Task
                    </Button>
                  }
                />
              }
            />
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-9 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          ) : view === "list" ? (
            <div className="flex flex-col gap-6">
              {listStatuses.map((status) => (
                <TaskListGroup
                  key={status}
                  title={statusMeta[status].label}
                  defaultStatus={status}
                  projectId={projectId}
                  tasks={tasks.filter((t) => t.status === status)}
                  fields={fields}
                />
              ))}
            </div>
          ) : (
            <TaskBoard tasks={tasks} fields={fields} projectId={projectId} />
          )}
        </div>
      </div>
    </>
  )
}
