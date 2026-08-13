"use client"

import { Filter, Circle, BarChart3, Users, Calendar, Tag, User, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { PriorityBars } from "@/components/priority-indicator"
import { priorityMeta } from "@/lib/data"
import type { Priority } from "@/lib/types"

const priorities: Priority[] = ["none", "urgent", "high", "medium", "low"]

export function FilterMenu({
  priorityFilter,
  onPriorityChange,
}: {
  priorityFilter: Priority | null
  onPriorityChange: (p: Priority | null) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon-sm" aria-label="Filter">
            <Filter />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Circle className="size-4" />
            Status
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <BarChart3 className="size-4" />
              Priority
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-44">
              {priorities.map((p) => (
                <DropdownMenuItem
                  key={p}
                  onClick={() => onPriorityChange(priorityFilter === p ? null : p)}
                >
                  {p === "none" ? (
                    <PriorityBars priority="none" />
                  ) : (
                    <PriorityBars priority={p} />
                  )}
                  <span className={p === "none" ? "text-muted-foreground" : priorityMeta[p].color}>
                    {priorityMeta[p].label}
                  </span>
                  {priorityFilter === p ? <Check className="ml-auto size-4" /> : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Users className="size-4" />
            Members
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Calendar className="size-4" />
            Due Date
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Users className="size-4" />
            Teams
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Tag className="size-4" />
            Labels
          </DropdownMenuItem>
          <DropdownMenuItem>
            <User className="size-4" />
            Reporter
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
