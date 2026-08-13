"use client"

import type { ReactNode } from "react"
import { Search, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { FieldsMenu } from "@/components/fields-menu"
import { FilterMenu } from "@/components/filter-menu"
import type { FieldKey, Priority, ViewMode } from "@/lib/types"

export function TasksToolbar({
  search,
  onSearchChange,
  searchOpen,
  onSearchOpenChange,
  view,
  onViewChange,
  fields,
  onToggleField,
  priorityFilter,
  onPriorityChange,
  addLabel = "Add Task",
  addButton,
  showViewToggle = true,
}: {
  search: string
  onSearchChange: (v: string) => void
  searchOpen: boolean
  onSearchOpenChange: (v: boolean) => void
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  fields: Record<FieldKey, boolean>
  onToggleField: (key: FieldKey) => void
  priorityFilter: Priority | null
  onPriorityChange: (p: Priority | null) => void
  addLabel?: string
  addButton?: ReactNode
  showViewToggle?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      {searchOpen ? (
        <InputGroup className="w-full max-w-md">
          <InputGroupAddon>
            <Search className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            autoFocus
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <button
              type="button"
              aria-label="Close search"
              onClick={() => {
                onSearchChange("")
                onSearchOpenChange(false)
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </InputGroupAddon>
        </InputGroup>
      ) : (
        <Button variant="outline" size="icon-sm" aria-label="Search" onClick={() => onSearchOpenChange(true)}>
          <Search />
        </Button>
      )}
      <FieldsMenu
        view={view}
        onViewChange={onViewChange}
        fields={fields}
        onToggleField={onToggleField}
        showViewToggle={showViewToggle}
      />
      <FilterMenu priorityFilter={priorityFilter} onPriorityChange={onPriorityChange} />
      {addButton ?? (
        <Button size="sm">
          <Plus data-icon="inline-start" />
          {addLabel}
        </Button>
      )}
    </div>
  )
}
