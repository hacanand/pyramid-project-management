import { cn } from "@/lib/utils"
import { priorityMeta } from "@/lib/data"
import type { Priority } from "@/lib/types"

const levels: Record<Priority, number> = {
  urgent: 3,
  high: 3,
  medium: 2,
  low: 1,
  none: 0,
}

export function PriorityBars({ priority, className }: { priority: Priority; className?: string }) {
  const safePriority = priority || "none"
  const active = levels[safePriority]
  const meta = priorityMeta[safePriority]
  return (
    <span className={cn("inline-flex items-end gap-[2px]", className)} aria-hidden>
      {[1, 2, 3].map((bar) => (
        <span
          key={bar}
          className={cn(
            "w-[3px] rounded-[1px] bg-current",
            bar === 1 && "h-[6px]",
            bar === 2 && "h-[9px]",
            bar === 3 && "h-[12px]",
            bar <= active ? meta.color : "text-muted-foreground/30",
          )}
        />
      ))}
    </span>
  )
}

export function PriorityLabel({ priority }: { priority: Priority }) {
  const safePriority = priority || "none"
  const meta = priorityMeta[safePriority]
  if (safePriority === "none") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <PriorityBars priority={priority} />
        {meta.label}
      </span>
    )
  }
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm", meta.color)}>
      <PriorityBars priority={safePriority} />
      {meta.label}
    </span>
  )
}
