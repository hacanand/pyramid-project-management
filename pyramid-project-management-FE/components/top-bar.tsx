"use client"

import { Fragment, type ReactNode } from "react"
import { PanelLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useSidebar } from "@/components/sidebar-provider"

export function TopBar({
  crumbs,
  right,
}: {
  crumbs?: { label: string; href?: string }[]
  right?: ReactNode
}) {
  const { toggle } = useSidebar()
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      <button
        type="button"
        onClick={toggle}
        aria-label="Toggle sidebar"
        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <PanelLeft className="size-4" />
      </button>
      {crumbs && crumbs.length > 0 ? (
        <>
          <Separator orientation="vertical" className="mx-1 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {crumbs.map((c, i) => (
                <Fragment key={c.label}>
                  <BreadcrumbItem>
                    {i < crumbs.length - 1 ? (
                      <BreadcrumbLink href={c.href ?? "#"}>{c.label}</BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{c.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {i < crumbs.length - 1 && <BreadcrumbSeparator />}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </>
      ) : (
        <Separator orientation="vertical" className="mx-1 h-4" />
      )}
      {right ? <div className="ml-auto">{right}</div> : null}
    </header>
  )
}
