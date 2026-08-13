import { Plus } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { getMember } from "@/lib/data"

export function MemberAvatars({
  memberIds,
  className,
}: {
  memberIds: string[]
  className?: string
}) {
  if (memberIds.length === 0) {
    return (
      <button
        type="button"
        onClick={() => toast.info("Add member coming soon")}
        className={cn(
          "flex size-6 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground transition-colors hover:bg-muted",
          className,
        )}
        aria-label="Add member"
      >
        <Plus className="size-3" />
      </button>
    )
  }

  return (
    <div className={cn("flex -space-x-1.5", className)}>
      {memberIds.map((id) => {
        const member = getMember(id)
        if (!member) return null
        return (
          <Avatar key={id} className="size-6 ring-2 ring-background">
            {member.avatar ? <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} /> : null}
            <AvatarFallback className="text-[10px]">{member.initials}</AvatarFallback>
          </Avatar>
        )
      })}
    </div>
  )
}
