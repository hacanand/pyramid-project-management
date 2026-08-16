"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, MoreHorizontal, GripVertical, CalendarDays, Folder } from "lucide-react"
import { toast } from "sonner"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LabelChip } from "@/components/label-chip"
import { TaskFormDialog } from "@/components/task-form-dialog"
import { boardStatuses, statusMeta, getMember } from "@/lib/data"
import { useTaskActions, useProjects } from "@/lib/hooks"
import type { FieldKey, Task, TaskStatus } from "@/lib/types"

export function TaskBoard({
  tasks: propTasks,
  fields,
  projectId,
}: {
  tasks: Task[]
  fields: Record<FieldKey, boolean>
  projectId?: string
}) {
  const [tasks, setTasks] = useState(propTasks)
  const { updateTask } = useTaskActions()
  const [columns, setColumns] = useState<TaskStatus[]>(boardStatuses)

  useEffect(() => {
    const saved = localStorage.getItem("task-board-columns")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setColumns(parsed)
        }
      } catch {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    setTasks(propTasks)
  }, [propTasks])

  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<"Task" | "Column" | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const onDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string)
    setActiveType(e.active.data.current?.type as "Task" | "Column")
  }

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e
    if (!over) return

    const activeType = active.data.current?.type
    if (activeType !== "Task") return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const activeTask = tasks.find((t) => t.id === activeId)
    const overTask = tasks.find((t) => t.id === overId)

    if (!activeTask) return

    const isOverColumn = boardStatuses.includes(overId as TaskStatus)

    if (overTask && activeTask.status !== overTask.status) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, status: overTask.status } : t
        )
      )
    } else if (isOverColumn && activeTask.status !== overId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, status: overId as TaskStatus } : t
        )
      )
    }
  }

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    setActiveId(null)
    setActiveType(null)

    const activeType = active.data.current?.type
    const activeId = active.id as string

    if (!over) {
      if (activeType === "Task") {
        setTasks(propTasks)
      }
      return
    }

    const overId = over.id as string

    if (activeType === "Column") {
      if (activeId !== overId) {
        setColumns((prev) => {
          const oldIndex = prev.indexOf(activeId as TaskStatus)
          const newIndex = prev.indexOf(overId as TaskStatus)
          const newArr = arrayMove(prev, oldIndex, newIndex)
          localStorage.setItem("task-board-columns", JSON.stringify(newArr))
          return newArr
        })
      }
      return
    }

    const activeTask = tasks.find((t) => t.id === activeId)
    if (!activeTask) return

    const originalTask = propTasks.find((t) => t.id === activeId)
    if (originalTask && originalTask.status !== activeTask.status) {
       updateTask(activeId, { status: activeTask.status })
    }
  }

  const onDragCancel = () => {
    setActiveId(null)
    setActiveType(null)
    setTasks(propTasks)
  }

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full min-h-[500px]">
        <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
          {columns.map((status) => {
            const columnTasks = tasks.filter((t) => t.status === status)
            return (
              <BoardColumn
                key={status}
                status={status}
                tasks={columnTasks}
                fields={fields}
                projectId={projectId}
              />
            )
          })}
        </SortableContext>
      </div>
      <DragOverlay>
        {activeType === "Column" && activeId ? (
          <div className="rotate-2 scale-105 opacity-90 cursor-grabbing">
            <BoardColumn
              status={activeId as TaskStatus}
              tasks={tasks.filter((t) => t.status === activeId)}
              fields={fields}
              projectId={projectId}
              isOverlay
            />
          </div>
        ) : activeType === "Task" && activeTask ? (
          <div className="rotate-2 scale-105 opacity-90 cursor-grabbing">
            <BoardCard task={activeTask} fields={fields} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function BoardColumn({
  status,
  tasks,
  fields,
  projectId,
  isOverlay,
}: {
  status: TaskStatus
  tasks: Task[]
  fields: Record<FieldKey, boolean>
  projectId?: string
  isOverlay?: boolean
}) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: status,
    data: { type: "Column", status },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging && !isOverlay) {
    return (
      <div ref={setNodeRef} style={style} className="flex w-72 shrink-0 rounded-xl border-2 border-primary border-dashed bg-primary/5 opacity-50 h-[500px]" />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex w-72 shrink-0 flex-col rounded-xl bg-muted/50 h-max max-h-full ${isOverlay ? 'shadow-2xl' : ''}`}
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div {...attributes} {...listeners} className="cursor-grab hover:cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-muted-foreground/10">
          <GripVertical className="size-4 text-muted-foreground/60" />
        </div>
        <span className="text-sm font-semibold">{statusMeta[status].label}</span>
        <div className="ml-auto flex items-center gap-1">
          <TaskFormDialog
            defaultStatus={status}
            projectId={projectId}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="size-6 text-muted-foreground hover:bg-background"
                aria-label="Add task"
              >
                <Plus className="size-4" />
              </Button>
            }
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toast.info("Column options coming soon")}
            aria-label="Column options"
            className="size-6 text-muted-foreground hover:bg-background"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-2 pb-2 min-h-[4rem]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} fields={fields} projectId={projectId} />
          ))}
        </SortableContext>

        <TaskFormDialog
          defaultStatus={status}
          projectId={projectId}
          trigger={
            <Button
              variant="ghost"
              className="w-full justify-start gap-1.5 px-2 py-2 text-sm text-muted-foreground hover:bg-background mt-1"
            >
              <Plus className="size-4" />
              Add Task
            </Button>
          }
        />
      </div>
    </div>
  )
}

function SortableTask({ task, fields, projectId }: { task: Task; fields: Record<FieldKey, boolean>; projectId?: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className="rounded-lg border-2 border-primary border-dashed bg-primary/5 p-3 opacity-50 h-24" />
    )
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab hover:cursor-grab active:cursor-grabbing">
      <BoardCard task={task} fields={fields} projectId={projectId} />
    </div>
  )
}

function BoardCard({ task, fields, isDragging, projectId }: { task: Task; fields: Record<FieldKey, boolean>; isDragging?: boolean; projectId?: string }) {
  const member = getMember(task.memberIds[0])
  const { projects } = useProjects()
  const project = !projectId && task.projectId ? projects.find(p => p.id === task.projectId) : null

  return (
    <div
      className={`group flex flex-col gap-3 rounded-lg border border-border bg-background p-3 shadow-sm transition-shadow hover:shadow-md relative ${isDragging ? 'opacity-100 shadow-xl' : ''}`}
    >
      <Link href={`/tasks/${task.id}`} className="absolute inset-0 z-0 rounded-lg">
        <span className="sr-only">View task details</span>
      </Link>
      
      <div className="flex items-start justify-between gap-2 relative z-10 pointer-events-none">
        <span className="text-sm font-medium leading-snug">{task.title}</span>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Task options"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toast.info("Task options coming soon")
          }}
          className="size-6 shrink-0 opacity-0 transition-all hover:bg-muted group-hover:opacity-100 pointer-events-auto"
        >
          <MoreHorizontal className="size-4 text-muted-foreground" />
        </Button>
      </div>

      {fields.members || fields.dueDate ? (
        <div className="flex items-center justify-between relative z-10 pointer-events-none">
          {fields.members ? (
            <div className="flex items-center gap-1.5">
              {member ? (
                <>
                  <Avatar className="size-5">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="text-[9px]">{member.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{member.name}</span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">Unassigned</span>
              )}
            </div>
          ) : (
            <span />
          )}
          {fields.dueDate ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive">
              <CalendarDays className="size-3" />
              {task.dueDate}
            </span>
          ) : null}
        </div>
      ) : null}

      {fields.labels ? (
        <div className="flex flex-wrap gap-1 relative z-10 pointer-events-none">
          {task.labels.slice(0, 2).map((l, i) => (
            <LabelChip key={`${l}-${i}`} label={l} />
          ))}
        </div>
      ) : null}

      {project ? (
        <div className="flex items-center gap-1 text-xs text-muted-foreground relative z-10 pointer-events-none mt-1">
          <Folder className="size-3" />
          <span className="truncate">{project.name}</span>
        </div>
      ) : null}
    </div>
  )
}
