import { Tag } from "lucide-react"
import { cn } from "@/lib/utils"

export function LabelChip({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground/80",
        className,
      )}
    >
      <Tag className="size-3 text-muted-foreground" />
      {label}
    </span>
  )
}
