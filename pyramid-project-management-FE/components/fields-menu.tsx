"use client"

import { Columns3, List, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { FieldKey, ViewMode } from "@/lib/types"

const fieldRows: { key: FieldKey; label: string }[] = [
  { key: "priority", label: "Priority" },
  { key: "members", label: "Members" },
  { key: "dueDate", label: "Due Date" },
  { key: "labels", label: "Labels" },
  { key: "status", label: "Status" },
  { key: "reporter", label: "Reporter" },
]

export function FieldsMenu({
  view,
  onViewChange,
  fields,
  onToggleField,
  showViewToggle = true,
}: {
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  fields: Record<FieldKey, boolean>
  onToggleField: (key: FieldKey) => void
  showViewToggle?: boolean
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm">
            <Columns3 data-icon="inline-start" />
            Fields
          </Button>
        }
      />
      <PopoverContent align="end" className="w-72 p-2">
        {showViewToggle ? (
          <div className="mb-2 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => onViewChange("list")}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors cursor-pointer",
                view === "list" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <List className="size-4" />
              List
            </button>
            <button
              type="button"
              onClick={() => onViewChange("board")}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors cursor-pointer",
                view === "board" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid className="size-4" />
              Board
            </button>
          </div>
        ) : null}
        <div className="flex flex-col">
          {fieldRows.map((row) => (
            <button
              key={row.key}
              type="button"
              onClick={() => onToggleField(row.key)}
              className="flex items-center justify-between rounded-md px-2 py-2 text-sm transition-colors hover:bg-muted cursor-pointer"
            >
              <span>{row.label}</span>
              <Checkbox checked={fields[row.key]} className="pointer-events-none" />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
