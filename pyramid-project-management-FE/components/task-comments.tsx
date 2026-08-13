"use client"

import { useState } from "react"
import { SmilePlus, MoreHorizontal, Paperclip, SendHorizontal, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { currentUser } from "@/lib/data"
import { useTaskActions } from "@/lib/hooks"
import type { Comment } from "@/lib/types"

export function TaskComments({ comments, taskId }: { comments: Comment[], taskId: string }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold">Comments</h2>

      {comments.map((c) => (
        <div key={c.id} className="rounded-xl border border-border">
          <div className="flex items-start gap-2.5 p-3">
            <Avatar className="size-6">
              <AvatarImage src={c.author.avatar || "/placeholder.svg"} alt={c.author.name} />
              <AvatarFallback className="text-[10px]">{c.author.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{c.author.name}</span>
                <span className="text-xs text-muted-foreground">{c.timestamp}</span>
                <div className="ml-auto flex items-center gap-1 text-muted-foreground">
                  <button type="button" aria-label="React" onClick={() => toast.info("Reactions coming soon")} className="rounded-md p-1 hover:bg-muted">
                    <SmilePlus className="size-4" />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="rounded-md p-1 hover:bg-muted"
                      aria-label="Comment options"
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => toast.info("Edit comment coming soon")}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => toast.info("Delete comment coming soon")}>Delete</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <p className="mt-1 text-sm">{c.body}</p>
            </div>
          </div>
          <div className="border-t border-border p-2">
            <Composer placeholder="Leave a reply..." small taskId={taskId} />
          </div>
        </div>
      ))}

      <div className="rounded-xl border border-border p-2">
        <Composer placeholder="Add a comment..." taskId={taskId} />
      </div>
    </div>
  )
}

function Composer({ placeholder, small, taskId }: { placeholder: string; small?: boolean; taskId: string }) {
  const [text, setText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addComment } = useTaskActions()

  const handleSubmit = async () => {
    if (!text.trim() || isSubmitting) return
    setIsSubmitting(true)
    try {
      await addComment(taskId, { body: text })
      setText("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
      <Avatar className="size-6">
        <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
        <AvatarFallback className="text-[10px]">{currentUser.initials}</AvatarFallback>
      </Avatar>
      <input
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            handleSubmit()
          }
        }}
        disabled={isSubmitting}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
      />
      <button type="button" aria-label="Attach file" onClick={() => toast.info("File attachments coming soon")} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
        <Paperclip className="size-4" />
      </button>
      <button 
        type="button" 
        onClick={handleSubmit}
        disabled={isSubmitting || !text.trim()}
        aria-label="Send" 
        className="rounded-md p-1 text-muted-foreground hover:bg-muted disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <SendHorizontal className="size-4" />}
      </button>
    </div>
  )
}
