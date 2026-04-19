"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

type SiteHeaderProps = {
  currentAccountName: string
  incomingRequests: number
}

export function SiteHeader({
  currentAccountName,
  incomingRequests,
}: SiteHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b bg-background/80 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-3 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-1 data-[orientation=vertical]:h-4"
          />
          <div className="min-w-0">
            <h1 className="truncate text-base font-medium">{currentAccountName}</h1>
            <p className="hidden text-sm text-muted-foreground md:block">
              Antibiotic transfer workflow for partner pharmacies
            </p>
          </div>
        </div>

        <Badge variant="outline">
          {incomingRequests} incoming request{incomingRequests === 1 ? "" : "s"}
        </Badge>
      </div>
    </header>
  )
}
