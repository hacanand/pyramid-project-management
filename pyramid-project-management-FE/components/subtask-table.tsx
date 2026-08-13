"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
import { PriorityLabel } from "@/components/priority-indicator"
import { MemberAvatars } from "@/components/member-avatars"
import { useTaskActions } from "@/lib/hooks"
import type { SubTask } from "@/lib/types"

export function SubtaskTable({ subtasks, taskId }: { subtasks: SubTask[]; taskId: string }) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const { addSubtask } = useTaskActions()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus()
    }
  }, [isAdding])

  const handleAdd = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!newTitle.trim()) {
      setIsAdding(false)
      return
    }
    
    await addSubtask(taskId, {
      title: newTitle.trim(),
      priority: "medium",
      memberIds: [],
      dueDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
    })
    
    setNewTitle("")
    setIsAdding(false)
    toast.success("Subtask added")
  }

  const handleBlur = (e: React.FocusEvent) => {
    if (!newTitle.trim()) {
      setIsAdding(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
            <th className="px-4 py-2.5 font-medium">Task</th>
            <th className="px-4 py-2.5 font-medium">Priority</th>
            <th className="px-4 py-2.5 font-medium">Members</th>
            <th className="px-4 py-2.5 font-medium">Due Date</th>
            <th className="px-4 py-2.5 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subtasks.map((st) => (
            <tr key={st.id} className="group border-b border-border last:border-0 hover:bg-muted/40">
              <td className="px-4 py-2.5 font-medium">{st.title}</td>
              <td className="px-4 py-2.5">
                <PriorityLabel priority={st.priority} />
              </td>
              <td className="px-4 py-2.5">
                <MemberAvatars memberIds={st.memberIds} />
              </td>
              <td className="px-4 py-2.5 whitespace-nowrap text-foreground/80">{st.dueDate}</td>
              <td className="px-4 py-2.5 text-right">
                <button
                  type="button"
                  onClick={() => toast.info("Subtask options coming soon")}
                  aria-label="Subtask actions"
                  className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </td>
            </tr>
          ))}
          {isAdding ? (
            <tr className="border-b border-border last:border-0 bg-muted/20">
              <td className="px-4 py-2.5" colSpan={5}>
                <form onSubmit={handleAdd} className="flex w-full items-center">
                  <input
                    ref={inputRef}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="Enter subtask title..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </form>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan={5} className="px-3 py-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-1.5 rounded-md px-1 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Plus className="size-4" />
                  Add Subtasks
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
