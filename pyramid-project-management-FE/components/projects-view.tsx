"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Plus, MoreHorizontal, Search, X } from "lucide-react"
import { TopBar } from "@/components/top-bar"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { FieldsMenu } from "@/components/fields-menu"
import { FilterMenu } from "@/components/filter-menu"
import { ProjectFormDialog } from "@/components/project-form-dialog"
import { PriorityLabel } from "@/components/priority-indicator"
import { MemberAvatars } from "@/components/member-avatars"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjects, useProjectActions } from "@/lib/hooks"
import type { FieldKey, Priority } from "@/lib/types"

const defaultFields: Record<FieldKey, boolean> = {
  priority: true,
  members: true,
  dueDate: true,
  labels: false,
  status: false,
  reporter: false,
}

export function ProjectsView() {
  const [search, setSearch] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null)
  const [fields, setFields] = useState<Record<FieldKey, boolean>>(defaultFields)

  const { projects, isLoading } = useProjects()
  const { deleteProject } = useProjectActions()

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch = search.trim()
        ? p.name.toLowerCase().includes(search.trim().toLowerCase())
        : true
      const matchesPriority = priorityFilter ? p.priority === priorityFilter : true
      return matchesSearch && matchesPriority
    })
  }, [projects, search, priorityFilter])

  return (
    <>
      <TopBar />

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex flex-col gap-6 px-6 py-6 lg:px-10 lg:py-8 h-full">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
            <div className="flex items-center gap-2">
              {searchOpen ? (
                <InputGroup className="w-full max-w-md">
                  <InputGroupAddon>
                    <Search className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    autoFocus
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <InputGroupAddon align="inline-end">
                    <button
                      type="button"
                      aria-label="Close search"
                      onClick={() => {
                        setSearch("")
                        setSearchOpen(false)
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  </InputGroupAddon>
                </InputGroup>
              ) : (
                <Button variant="outline" size="icon-sm" aria-label="Search" onClick={() => setSearchOpen(true)}>
                  <Search />
                </Button>
              )}
              <FieldsMenu
                view="list"
                onViewChange={() => {}}
                fields={fields}
                onToggleField={(k) => setFields((prev) => ({ ...prev, [k]: !prev[k] }))}
                showViewToggle={false}
              />
              <FilterMenu priorityFilter={priorityFilter} onPriorityChange={setPriorityFilter} />
              <ProjectFormDialog
                trigger={
                  <Button size="sm">
                    <Plus data-icon="inline-start" />
                    Add Project
                  </Button>
                }
              />
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-hidden rounded-xl border border-border">
            <table className="w-full min-w-[600px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Projects</th>
                  <th className="px-4 py-2.5 font-medium">Priority</th>
                  <th className="px-4 py-2.5 font-medium">Lead</th>
                  <th className="px-4 py-2.5 font-medium">Due Date</th>
                  <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-4 py-3"><Skeleton className="size-6 rounded-full" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-4 py-3 text-right"><Skeleton className="ml-auto size-6 rounded" /></td>
                    </tr>
                  ))
                ) : filtered.map((p) => (
                  <tr key={p.id} className="group border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <Link href={`/projects/${p.id}`} className="font-medium text-primary hover:underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <PriorityLabel priority={p.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <MemberAvatars memberIds={p.leadId ? [p.leadId] : []} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-foreground/80">{p.dueDate}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-muted hover:text-foreground aria-expanded:opacity-100"
                          aria-label="Project actions"
                        >
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuGroup>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              variant="destructive"
                              onClick={() => deleteProject(p.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} className="px-3 py-2">
                    <ProjectFormDialog
                      trigger={
                        <button
                          type="button"
                          className="flex items-center gap-1.5 rounded-md px-1 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Plus className="size-4" />
                          Add Projects
                        </button>
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

