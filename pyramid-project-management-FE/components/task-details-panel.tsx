"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Settings2,
  Circle,
  Users,
  CalendarDays,
  ArrowRight,
  Tag,
  User,
  BarChart3,
  Check,
  Folder,
} from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PriorityBars } from "@/components/priority-indicator"
import { LabelChip } from "@/components/label-chip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useTaskActions, useMembers, useLabels, useProjects } from "@/lib/hooks"
import { currentUser, priorityMeta, statusMeta, listStatuses, boardStatuses } from "@/lib/data"
import type { Task, TaskStatus, Priority } from "@/lib/types"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[88px_1fr] items-center gap-2 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  )
}

function DateChip({ label, icon }: { label: string; icon?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs">
      {icon ? <CalendarDays className="size-3 text-muted-foreground" /> : null}
      {label}
    </span>
  )
}

export function TaskDetailsPanel({ task }: { task: Task }) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  )
  const [detailsOpen, setDetailsOpen] = useState(true)
  const [updatesOpen, setUpdatesOpen] = useState(true)
  const { updateTask } = useTaskActions()

  const handleStatusChange = (status: TaskStatus) => {
    updateTask(task.id, { status })
    toast.success(`Status updated to ${statusMeta[status].label}`)
  }

  const handlePriorityChange = (priority: Priority) => {
    updateTask(task.id, { priority })
    toast.success(`Priority updated to ${priorityMeta[priority].label}`)
  }

  const handleDateChange = (date: Date | undefined) => {
    setStartDate(date)
    if (date) {
      updateTask(task.id, { dueDate: formatShort(date) })
      toast.success("Due date updated")
    }
  }

  const { members } = useMembers()
  const { labels } = useLabels()
  
  const toggleMember = (memberId: string) => {
    const current = task.memberIds || []
    const next = current.includes(memberId)
      ? current.filter(id => id !== memberId)
      : [...current, memberId]
    updateTask(task.id, { memberIds: next })
    toast.success("Members updated")
  }
  
  const setReporter = (memberId: string) => {
    updateTask(task.id, { reporterId: memberId })
    toast.success("Reporter updated")
  }
  
  const toggleLabel = (label: string) => {
    const current = task.labels || []
    const next = current.includes(label)
      ? current.filter(l => l !== label)
      : [...current, label]
    updateTask(task.id, { labels: next })
    toast.success("Labels updated")
  }

  const { projects } = useProjects()
  const setProject = (projectId: string) => {
    updateTask(task.id, { projectId })
    toast.success("Project updated")
  }

  return (
    <aside className="flex w-full flex-col gap-4 lg:w-80">
      <div className="rounded-xl border border-border p-4">
        <div className="mb-2 flex items-center justify-between">
          <button type="button" onClick={() => setDetailsOpen(o => !o)} className="flex items-center gap-1.5 text-sm font-semibold">
            {detailsOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
            Details
          </button>
          <div className="flex items-center gap-1 text-muted-foreground">
            <button type="button" aria-label="Add detail" onClick={() => toast.info("Add detail coming soon")} className="rounded-md p-1 hover:bg-muted">
              <Plus className="size-4" />
            </button>
            <button type="button" aria-label="Detail settings" onClick={() => toast.info("Detail settings coming soon")} className="rounded-md p-1 hover:bg-muted">
              <Settings2 className="size-4" />
            </button>
          </div>
        </div>

        {detailsOpen ? (
        <div className="divide-y divide-border/60">
          <Row label="Status">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex outline-none items-center gap-1.5 rounded-md px-1.5 py-0.5 -ml-1.5 hover:bg-muted transition-colors">
                <Circle className="size-3 fill-amber-500 text-amber-500" />
                {statusMeta[task.status].label}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {boardStatuses.map(s => (
                  <DropdownMenuItem key={s} onClick={() => handleStatusChange(s)}>
                    {statusMeta[s].label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </Row>
          <Row label="Priority">
            <DropdownMenu>
              <DropdownMenuTrigger className={`inline-flex outline-none items-center gap-1.5 rounded-md px-1.5 py-0.5 -ml-1.5 hover:bg-muted transition-colors ${priorityMeta[task.priority].color}`}>
                <PriorityBars priority={task.priority} />
                {priorityMeta[task.priority].label}
                <ChevronDown className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {(Object.entries(priorityMeta) as [Priority, { label: string }][]).map(([p, meta]) => (
                  <DropdownMenuItem key={p} onClick={() => handlePriorityChange(p)}>
                    {meta.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </Row>
          <Row label="Members">
            <div className="flex flex-wrap items-center gap-1.5">
              {(task.memberIds ?? []).map(id => {
                const m = members.find(x => x.id === id)
                if (!m) return null
                return (
                  <Avatar key={id} className="size-5">
                    <AvatarImage src={m.avatar || "/placeholder.svg"} alt={m.name} />
                    <AvatarFallback className="text-[9px]">{m.initials}</AvatarFallback>
                  </Avatar>
                )
              })}
              <Popover>
                <PopoverTrigger aria-label="Add members" className="flex size-5 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted outline-none">
                  <Plus className="size-3" />
                </PopoverTrigger>
                <PopoverContent align="start" className="w-56 p-0">
                  <Command>
                    <CommandInput placeholder="Search members..." />
                    <CommandList>
                      <CommandEmpty>No member found.</CommandEmpty>
                      <CommandGroup>
                        {members.map(m => (
                          <CommandItem key={m.id} value={m.name} onSelect={() => toggleMember(m.id)}>
                            <div className="mr-2 flex size-4 items-center justify-center">
                              {task.memberIds?.includes(m.id) ? <Check className="size-3" /> : null}
                            </div>
                            <Avatar className="mr-2 size-5">
                              <AvatarImage src={m.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-[9px]">{m.initials}</AvatarFallback>
                            </Avatar>
                            {m.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </Row>
          <Row label="Dates">
            <Popover>
              <PopoverTrigger className="inline-flex items-center gap-1.5">
                <DateChip label={startDate ? formatShort(startDate) : "Start"} icon />
                <ArrowRight className="size-3 text-muted-foreground" />
                <DateChip label="End" icon />
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={handleDateChange} />
              </PopoverContent>
            </Popover>
          </Row>
          <Row label="Labels">
            <div className="flex flex-wrap items-center gap-1.5">
              {task.labels.map((l) => (
                <LabelChip key={l} label={l} />
              ))}
              <Popover>
                <PopoverTrigger aria-label="Add label" className="flex size-5 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted outline-none">
                  <Plus className="size-3" />
                </PopoverTrigger>
                <PopoverContent align="start" className="w-56 p-0">
                  <Command>
                    <CommandInput placeholder="Search labels..." />
                    <CommandList>
                      <CommandEmpty>No label found.</CommandEmpty>
                      <CommandGroup>
                        {labels.map(l => (
                          <CommandItem key={l} value={l} onSelect={() => toggleLabel(l)}>
                            <div className="mr-2 flex size-4 items-center justify-center">
                              {task.labels?.includes(l) ? <Check className="size-3" /> : null}
                            </div>
                            {l}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </Row>
          <Row label="Project">
            <Popover>
              <PopoverTrigger className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 -ml-1.5 hover:bg-muted transition-colors outline-none text-muted-foreground hover:text-foreground">
                <Folder className="size-3.5" />
                {projects.find(p => p.id === task.projectId)?.name || "Unassigned"}
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-0">
                <Command>
                  <CommandInput placeholder="Search projects..." />
                  <CommandList>
                    <CommandEmpty>No project found.</CommandEmpty>
                    <CommandGroup>
                      {projects.map(p => (
                        <CommandItem key={p.id} value={p.name} onSelect={() => setProject(p.id)}>
                          <div className="mr-2 flex size-4 items-center justify-center">
                            {task.projectId === p.id ? <Check className="size-3" /> : null}
                          </div>
                          {p.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </Row>
          <Row label="Teams">
            <button type="button" onClick={() => toast.info("New workspace coming soon")} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <Plus className="size-3.5" />
              New workspace
            </button>
          </Row>
          <Row label="Reporter">
            <Popover>
              <PopoverTrigger className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 -ml-1.5 hover:bg-muted transition-colors outline-none">
                <Avatar className="size-5">
                  <AvatarImage src={members.find(m => m.id === task.reporterId)?.avatar || currentUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-[9px]">{members.find(m => m.id === task.reporterId)?.initials || currentUser.initials}</AvatarFallback>
                </Avatar>
                {members.find(m => m.id === task.reporterId)?.name || "You"}
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-0">
                <Command>
                  <CommandInput placeholder="Search members..." />
                  <CommandList>
                    <CommandEmpty>No member found.</CommandEmpty>
                    <CommandGroup>
                      {members.map(m => (
                        <CommandItem key={m.id} value={m.name} onSelect={() => { setReporter(m.id); }}>
                          <div className="mr-2 flex size-4 items-center justify-center">
                            {task.reporterId === m.id ? <Check className="size-3" /> : null}
                          </div>
                          <Avatar className="mr-2 size-5">
                            <AvatarImage src={m.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-[9px]">{m.initials}</AvatarFallback>
                          </Avatar>
                          {m.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </Row>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border p-4">
        <button type="button" onClick={() => setUpdatesOpen(o => !o)} className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
          {updatesOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          Updates
        </button>
        {updatesOpen ? (
        <ul className="flex flex-col gap-3">
          {(task.updates ?? []).map((u) => (
            <li key={u.id} className="flex items-start gap-2.5">
              {u.text.includes("priority") ? (
                <span className="mt-0.5 text-red-500">
                  <BarChart3 className="size-4" />
                </span>
              ) : (
                <Avatar className="mt-0.5 size-5">
                  <AvatarImage src={u.author.avatar || "/placeholder.svg"} alt={u.author.name} />
                  <AvatarFallback className="text-[9px]">{u.author.initials}</AvatarFallback>
                </Avatar>
              )}
              <p className="text-sm leading-snug">
                <span className="font-medium">You</span>{" "}
                <span className="text-muted-foreground">
                  {u.text} · {u.timestamp}
                </span>
              </p>
            </li>
          ))}
        </ul>
        ) : null}
      </div>
    </aside>
  )
}

function formatShort(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
