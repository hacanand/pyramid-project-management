"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, Plus, MoreHorizontal, Folder } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PriorityLabel } from "@/components/priority-indicator"
import { MemberAvatars } from "@/components/member-avatars"
import { LabelChip } from "@/components/label-chip"
import { TaskFormDialog } from "@/components/task-form-dialog"
import { cn } from "@/lib/utils"
import { getMember } from "@/lib/data"
import { useTaskActions, useProjects } from "@/lib/hooks"
import type { FieldKey, Task, TaskStatus } from "@/lib/types"

export function TaskListGroup({
  title,
  tasks,
  fields,
  showAddRow = true,
  defaultStatus = "todo",
  projectId,
}: {
  title: string
  tasks: Task[]
  fields: Record<FieldKey, boolean>
  showAddRow?: boolean
  defaultStatus?: TaskStatus
  projectId?: string
}) {
  const [open, setOpen] = useState(true)
  const { projects } = useProjects()

  const colCount =
    1 +
    (fields.priority ? 1 : 0) +
    (fields.members ? 1 : 0) +
    (fields.dueDate ? 1 : 0) +
    (fields.labels ? 1 : 0) +
    (fields.status ? 1 : 0) +
    (fields.reporter ? 1 : 0) +
    1

  return (
    <section className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-fit items-center gap-1.5 text-sm font-semibold"
      >
        {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        {title}
      </button>

      {open ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[800px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Task</th>
                {fields.priority ? <th className="px-4 py-2.5 font-medium">Priority</th> : null}
                {fields.members ? <th className="px-4 py-2.5 font-medium">Members</th> : null}
                {fields.dueDate ? <th className="px-4 py-2.5 font-medium">Due Date</th> : null}
                {fields.labels ? <th className="px-4 py-2.5 font-medium">Labels</th> : null}
                {fields.status ? <th className="px-4 py-2.5 font-medium">Status</th> : null}
                {fields.reporter ? <th className="px-4 py-2.5 font-medium">Reporter</th> : null}
                <th className="px-4 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const project = !projectId && task.projectId ? projects.find(p => p.id === task.projectId) : null
                
                return (
                <tr key={task.id} className="group border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Link href={`/tasks/${task.id}`} className="font-medium hover:underline">
                        {task.title}
                      </Link>
                      {project ? (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/50">
                          <Folder className="size-2.5" />
                          <span className="truncate max-w-[120px]">{project.name}</span>
                        </div>
                      ) : null}
                    </div>
                  </td>
                  {fields.priority ? (
                    <td className="px-4 py-2.5">
                      <PriorityLabel priority={task.priority} />
                    </td>
                  ) : null}
                  {fields.members ? (
                    <td className="px-4 py-2.5">
                      <MemberAvatars memberIds={task.memberIds} />
                    </td>
                  ) : null}
                  {fields.dueDate ? (
                    <td className="px-4 py-2.5 whitespace-nowrap text-foreground/80">{task.dueDate}</td>
                  ) : null}
                  {fields.labels ? (
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {task.labels.map((l, i) => (
                          <LabelChip key={`${l}-${i}`} label={l} />
                        ))}
                      </div>
                    </td>
                  ) : null}
                  {fields.status ? (
                    <td className="px-4 py-2.5 capitalize text-foreground/80">{task.status}</td>
                  ) : null}
                  {fields.reporter ? (
                    <td className="px-4 py-2.5 text-foreground/80">{getMember(task.reporterId)?.name ?? "—"}</td>
                  ) : null}
                  <td className="px-4 py-2.5 text-right">
                    <RowActions taskId={task.id} />
                  </td>
                </tr>
                )
              })}
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={colCount} className="px-4 py-6 text-center text-muted-foreground">
                    No tasks
                  </td>
                </tr>
              ) : null}
              {showAddRow ? (
                <tr>
                  <td colSpan={colCount} className="px-3 py-2">
                    <TaskFormDialog
                      defaultStatus={defaultStatus}
                      projectId={projectId}
                      trigger={
                        <button
                          type="button"
                          className={cn(
                            "flex items-center gap-1.5 rounded-md px-1 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground",
                          )}
                        >
                          <Plus className="size-4" />
                          Add Task
                        </button>
                      }
                    />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

function RowActions({ taskId }: { taskId: string }) {
  const { deleteTask } = useTaskActions()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100 aria-expanded:opacity-100"
        aria-label="Task actions"
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem>Move</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => deleteTask(taskId)}>Delete</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
