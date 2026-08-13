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
import { useProjectActions } from "@/lib/hooks"
import { priorityMeta } from "@/lib/data"
import type { Priority, Project } from "@/lib/types"

const PRIORITIES: Priority[] = ["none", "low", "medium", "high", "urgent"]

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
}

export function ProjectFormDialog({
  trigger,
  project,
}: {
  trigger: ReactNode
  project?: Project
}) {
  const isEdit = Boolean(project)
  const { createProject, updateProject } = useProjectActions()

  const [open, setOpen] = useState(false)
  const [name, setName] = useState(project?.name ?? "")
  const [priority, setPriority] = useState<Priority>(project?.priority ?? "none")
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError(true)
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        name: name.trim(),
        priority,
        ...(dueDate ? { dueDate: formatDate(dueDate) } : {}),
      }
      if (isEdit && project) {
        await updateProject(project.id, payload)
        toast.success("Project updated")
      } else {
        await createProject(payload)
        toast.success("Project created")
      }
      setOpen(false)
      if (!isEdit) {
        setName("")
        setPriority("none")
        setDueDate(undefined)
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit project" : "Add project"}</DialogTitle>
            <DialogDescription>
              {isEdit ? "Update the project details below." : "Create a new project for your workspace."}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field data-invalid={error || undefined}>
              <FieldLabel htmlFor="project-name">Name</FieldLabel>
              <Input
                id="project-name"
                value={name}
                aria-invalid={error || undefined}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError(false)
                }}
                placeholder="e.g. Develop Login Feature"
                autoFocus
              />
            </Field>

            <Field>
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
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {isEdit ? "Save changes" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
