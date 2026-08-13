"use client"

import { useState, type ReactNode } from "react"
import { CalendarDays } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTaskActions, useProjects } from "@/lib/hooks"
import { priorityMeta } from "@/lib/data"
import type { Priority, Task, TaskStatus } from "@/lib/types"

const PRIORITIES: Priority[] = ["none", "low", "medium", "high", "urgent"]
const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "doing", label: "Doing" },
  { value: "completed", label: "Completed" },
  { value: "onhold", label: "On Hold" },
]

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
}

export function TaskFormDialog({
  trigger,
  task,
  defaultStatus = "todo",
  projectId,
  open: controlledOpen,
  onOpenChange,
}: {
  trigger?: ReactNode
  task?: Task
  defaultStatus?: TaskStatus
  projectId?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isEdit = Boolean(task)
  const { createTask, updateTask } = useTaskActions()

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = (o: boolean) => {
    if (isControlled) onOpenChange?.(o)
    else setUncontrolledOpen(o)
  }
  const [title, setTitle] = useState(task?.title ?? "")
  const [description, setDescription] = useState(task?.description ?? "")
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "none")
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? defaultStatus)
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { projects } = useProjects()
  const [selectedProject, setSelectedProject] = useState<string>(task?.projectId ?? projectId ?? "none")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError(true)
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
        ...(dueDate ? { dueDate: formatDate(dueDate) } : {}),
        ...(selectedProject !== "none" ? { projectId: selectedProject } : {}),
      }
      if (isEdit && task) {
        await updateTask(task.id, payload)
        toast.success("Task updated")
      } else {
        await createTask(payload)
        toast.success("Task created")
      }
      setOpen(false)
      if (!isEdit) {
        setTitle("")
        setDescription("")
        setPriority("none")
        setStatus(defaultStatus)
        setDueDate(undefined)
        setSelectedProject(projectId ?? "none")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger render={trigger as React.ReactElement} /> : null}
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit task" : "Add task"}</DialogTitle>
            <DialogDescription>
              {isEdit ? "Update the task details below." : "Create a new task for your workspace."}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field data-invalid={error || undefined}>
              <FieldLabel htmlFor="task-title">Title</FieldLabel>
              <Input
                id="task-title"
                value={title}
                aria-invalid={error || undefined}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (error) setError(false)
                }}
                placeholder="e.g. Design homepage"
                autoFocus
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="task-desc">Description</FieldLabel>
              <Textarea
                id="task-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more detail (optional)"
                rows={3}
              />
            </Field>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Field className="flex-1">
                <FieldLabel>Priority</FieldLabel>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {priorityMeta[p].label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field className="flex-1">
                <FieldLabel>Status</FieldLabel>
                <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel>Due date</FieldLabel>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button type="button" variant="outline" className="w-full justify-start font-normal">
                      <CalendarDays data-icon="inline-start" />
                      {dueDate ? formatDate(dueDate) : "Pick a date"}
                    </Button>
                  }
                />
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
                </PopoverContent>
              </Popover>
            </Field>

            {!projectId && (
              <Field>
                <FieldLabel>Project</FieldLabel>
                <Select value={selectedProject} onValueChange={(v) => setSelectedProject(v || "none")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a project (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="none">None</SelectItem>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {isEdit ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
