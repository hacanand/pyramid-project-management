"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronsUpDown, LayoutGrid, Archive, ChevronDown, Palette, Moon, Sun, Settings, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { currentUser } from "@/lib/data"
import { useTheme, accentColors, type AccentId } from "@/components/theme-provider"
import { useSidebar } from "@/components/sidebar-provider"

const nav = [
  { href: "/tasks", label: "Tasks", icon: LayoutGrid },
  { href: "/projects", label: "Projects", icon: Archive },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { mode, setMode, accent, setAccent } = useTheme()
  const { isOpen, setIsOpen } = useSidebar()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-border bg-sidebar transition-transform duration-200 ease-in-out md:static md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
      <div className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex w-full items-center gap-2 rounded-lg p-2 text-left transition-colors hover:bg-sidebar-accent"
            aria-label="Open workspace menu"
          >
            <Avatar className="size-8">
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
              <AvatarFallback>{currentUser.initials}</AvatarFallback>
            </Avatar>
            <span className="flex-1 truncate text-sm font-semibold">{currentUser.name}</span>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <div className="flex flex-col items-center gap-1 px-2 py-3">
              <Avatar className="size-14">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                <AvatarFallback>{currentUser.initials}</AvatarFallback>
              </Avatar>
              <span className="mt-1 text-sm font-medium">{currentUser.name}</span>
              <span className="text-xs text-muted-foreground">Dexter@gmail.com</span>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette className="size-4" />
                  Change Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {accentColors.map((c) => (
                    <DropdownMenuCheckboxItem
                      key={c.id}
                      checked={accent === c.id}
                      onClick={() => setAccent(c.id as AccentId)}
                    >
                      <span
                        className="size-3.5 rounded-full border border-border"
                        style={{ backgroundColor: c.value }}
                      />
                      {c.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {mode === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
                  Color Mode
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuCheckboxItem checked={mode === "light"} onClick={() => setMode("light")}>
                    <Sun className="size-4" />
                    Light
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={mode === "dark"} onClick={() => setMode("dark")}>
                    <Moon className="size-4" />
                    Dark
                  </DropdownMenuCheckboxItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem render={<Link href="/settings" />}>
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="flex flex-col gap-4 px-3">
        <button type="button" onClick={() => toast.info("Toggle workspace coming soon")} className="flex items-center justify-between px-2 text-sm font-medium hover:text-foreground text-muted-foreground transition-colors w-full">
          <span>Workspace</span>
          <ChevronDown className="size-4" />
        </button>
        <ul className="flex flex-col gap-0.5">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "text-foreground/80 hover:bg-sidebar-accent",
                  )}
                >
                  <Icon className="size-4 text-muted-foreground" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
    </>
  )
}
