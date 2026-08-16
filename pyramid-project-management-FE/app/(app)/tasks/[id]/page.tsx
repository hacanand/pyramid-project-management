"use client"

import { use, useState } from "react"
import { notFound } from "next/navigation"
import {
  Lock,
  Eye,
  Share2,
  MoreHorizontal,
  PanelRight,
  ChevronDown,
  CalendarDays,
  Link2,
} from "lucide-react"
import { toast } from "sonner"
import { TopBar } from "@/components/top-bar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { SubtaskTable } from "@/components/subtask-table"
import { TaskComments } from "@/components/task-comments"
import { TaskDetailsPanel } from "@/components/task-details-panel"
import { LabelChip } from "@/components/label-chip"
import { Skeleton } from "@/components/ui/skeleton"
import { useTask } from "@/lib/hooks"

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { task, isLoading } = useTask(id)
  const [showPanel, setShowPanel] = useState(true)

  if (!isLoading && !task) notFound()

  return (
    <>
      <TopBar />

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex flex-col gap-6 px-6 py-6 lg:px-10 lg:py-8 lg:flex-row h-full">
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <div className="flex flex-col gap-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight text-balance">{task?.title}</h1>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" aria-label="Lock" onClick={() => toast.info("Lock coming soon")} className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted">
                        <Lock className="size-4" />
                      </button>
                      <button type="button" onClick={() => toast.info("View coming soon")} className="flex h-8 items-center gap-1.5 rounded-lg border border-border px-2 text-sm text-primary hover:bg-muted">
                        <Eye className="size-4" />1
                      </button>
                      <button type="button" aria-label="Share" onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                        toast.success("Link copied to clipboard")
                      }} className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted">
                        <Share2 className="size-4" />
                      </button>
                      <button type="button" aria-label="More" onClick={() => toast.info("More options coming soon")} className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted">
                        <MoreHorizontal className="size-4" />
                      </button>
                      <button type="button" aria-label="Toggle panel" onClick={() => setShowPanel((p: boolean) => !p)} className="flex size-8 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
                        <PanelRight className="size-4" />
                      </button>
                    </div>
                  </div>
                  {task?.description ? (
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
                      {task.description}
                    </p>
                  ) : null}
                </>
              )}
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-4">
                <span className="w-20 text-muted-foreground">Properties</span>
                {isLoading ? <Skeleton className="h-5 w-24" /> : (
                  <>
                    <span className="inline-flex items-center gap-1.5">
                      <Avatar className="size-5">
                        <AvatarFallback className="text-[9px]">A</AvatarFallback>
                      </Avatar>
                      Designer
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                      <CalendarDays className="size-3" />
                      31 Jul
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="w-20 shrink-0 text-muted-foreground">Labels</span>
                <div className="flex flex-wrap gap-1.5">
                  {isLoading ? <Skeleton className="h-5 w-16" /> : task?.labels.map((l, i) => (
                    <LabelChip key={`${l}-${i}`} label={l} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-20 text-muted-foreground">Resources</span>
                <button type="button" onClick={() => toast.info("Resources coming soon")} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                  <Link2 className="size-4" />
                  Add document or link...
                </button>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
              <button type="button" className="flex w-fit items-center gap-1.5 text-sm font-semibold">
                <ChevronDown className="size-4" />
                Subtasks
              </button>
              {isLoading ? <Skeleton className="h-20 w-full" /> : (
                <SubtaskTable subtasks={task?.subtasks ?? []} taskId={task!.id} />
              )}
            </div>

            {isLoading ? <Skeleton className="h-32 w-full" /> : (
              <TaskComments comments={task?.comments ?? []} taskId={id} />
            )}
          </div>

          {showPanel ? (
            isLoading || !task ? (
              <Skeleton className="w-full lg:w-80 h-96 rounded-xl" />
            ) : (
              <TaskDetailsPanel task={task} />
            )
          ) : null}
        </div>
      </div>
    </>
  )
}
